import yfinance as yf
import pandas as pd
import asyncio
import requests
import os
import random
import time
from datetime import datetime
from fake_useragent import UserAgent
from nselib import capital_market
from bs4 import BeautifulSoup

# Initialize UserAgent rotator
ua = UserAgent()

# Simple in-memory cache for quotes to prevent spamming
# Structure: {symbol: (data, timestamp)}
quote_cache = {}
CACHE_TTL = 60 # seconds

# Helper to get a random User-Agent
def get_random_headers():
    return {
        'User-Agent': ua.random,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }

async def search_stocks(query: str):
    # Use Yahoo Finance auto-complete API
    url = f"https://query2.finance.yahoo.com/v1/finance/search?q={query}&quotesCount=10&newsCount=0"
    headers = get_random_headers()
    
    try:
        response = await asyncio.to_thread(requests.get, url, headers=headers, timeout=5)
        data = response.json()
        
        results = []
        if 'quotes' in data:
            for quote in data['quotes']:
                # Filter for equity/etf mainly
                if quote.get('quoteType') in ['EQUITY', 'ETF', 'MUTUALFUND']:
                    results.append({
                        "symbol": quote.get('symbol'),
                        "name": quote.get('shortname') or quote.get('longname'),
                        "type": quote.get('quoteType'),
                        "exchange": quote.get('exchange')
                    })
        return results
    except Exception as e:
        print(f"Search error: {e}")
        return []

async def get_google_finance_quote(symbol: str):
    """Scrape quote from Google Finance as a strong fallback"""
    try:
        # Map symbol to Google Finance format
        # If it contains .NS, it's NSE. Else, try to guess.
        exchange = "NSE" if symbol.endswith(".NS") or symbol in ["RELIANCE", "TCS", "INFY"] else "NASDAQ"
        
        # If symbol has .NS, strip it for Google URL
        clean_symbol = symbol.replace(".NS", "")
        
        # URL format: https://www.google.com/finance/quote/SYMBOL:EXCHANGE
        # We might need to try multiple exchanges if unsure
        url = f"https://www.google.com/finance/quote/{clean_symbol}:{exchange}"
        
        headers = get_random_headers()
        response = await asyncio.to_thread(requests.get, url, headers=headers, timeout=5)
        
        if response.status_code != 200:
            # Try BSE if NSE failed (for Indian context)
            if exchange == "NSE":
                url = f"https://www.google.com/finance/quote/{clean_symbol}:BSE"
                response = await asyncio.to_thread(requests.get, url, headers=headers, timeout=5)
        
        if response.status_code != 200:
            return None

        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Selectors for Google Finance (class names change, but structure is somewhat stable)
        # We look for the main price element
        # Common class for price: "YMlKec fxKbKc"
        price_div = soup.find("div", class_="YMlKec fxKbKc")
        if not price_div:
             return None
             
        price_text = price_div.text.replace("₹", "").replace("$", "").replace(",", "")
        price = float(price_text)
        
        # Change is usually in a span next to it
        # We can try to calculate change if we can find previous close, or just scrape it
        # This is basic scraping, extracting name and price is prioritized
        name_h1 = soup.find("h1", class_="zzDege")
        name = name_h1.text if name_h1 else symbol
        
        return {
            "symbol": symbol,
            "name": name,
            "price": price,
            "change": 0, # Difficult to reliably scrape without fragile selectors
            "percent_change": 0,
            "volume": 0,
            "market_cap": 0,
            "pe_ratio": None,
            "eps": None,
            "day_high": price, # Placeholder
            "day_low": price, # Placeholder
            "open": price, # Placeholder
            "previous_close": price, # Placeholder
            "currency": "INR" if exchange in ["NSE", "BSE"] else "USD",
            "exchange": exchange,
            "timezone": "Asia/Kolkata" if exchange in ["NSE", "BSE"] else "UTC",
            "type": "EQUITY",
            "market_state": "REGULAR",
        }
    except Exception as e:
        print(f"Google Finance Scrape error for {symbol}: {e}")
        return None

async def get_nselib_quote(symbol: str):
    """Fetch quote from NSE website using nselib"""
    try:
        # nselib expects symbol without .NS extension
        clean_symbol = symbol.replace(".NS", "")
        
        # Use price_volume_and_delivery_position which is lighter than equity_list
        # Note: nselib can be slow as it scrapes the NSE site
        data = await asyncio.to_thread(capital_market.price_volume_and_delivery_position, mode='new', symbol=clean_symbol)
        
        if data is None or data.empty:
             return None

        # Extract latest row
        row = data.iloc[-1]
        
        # Parse numeric fields
        price = float(str(row['lastPrice']).replace(',', ''))
        prev_close = float(str(row['previousClose']).replace(',', ''))
        change = price - prev_close
        p_change = (change / prev_close) * 100
        
        return {
            "symbol": symbol,
            "name": clean_symbol, # NSE data often doesn't give full name in this view
            "price": price,
            "change": change,
            "percent_change": p_change,
            "volume": int(str(row['quantityTraded']).replace(',', '')),
            "market_cap": 0, # Not available in this view
            "pe_ratio": None,
            "eps": None,
            "day_high": float(str(row['dayHigh']).replace(',', '')),
            "day_low": float(str(row['dayLow']).replace(',', '')),
            "open": float(str(row['openPrice']).replace(',', '')),
            "previous_close": prev_close,
            "currency": "INR",
            "exchange": "NSE",
            "timezone": "Asia/Kolkata",
            "type": "EQUITY",
            "market_state": "REGULAR", # Assume regular if we got data
        }
    except Exception as e:
        print(f"NSE Lib error for {symbol}: {e}")
        return None

async def get_quote(symbol: str):
    # Check cache first
    if symbol in quote_cache:
        data, timestamp = quote_cache[symbol]
        if time.time() - timestamp < CACHE_TTL:
            return data

    # Handle NIFTY indices mapping
    yfinance_symbol = symbol
    if symbol == "NIFTY 50":
        yfinance_symbol = "^NSEI"
    elif symbol == "NIFTY BANK":
        yfinance_symbol = "^NSEBANK"
    elif symbol == "NIFTY IT":
        yfinance_symbol = "^CNXIT"
    elif symbol == "NIFTY NEXT 50":
        yfinance_symbol = "^NSMIDCP"
    
    # Strategy 1: Try nselib first for Indian stocks
    is_indian = symbol.endswith('.NS') or symbol in ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "HINDUNILVR", "ITC", "SBIN", "BHARTIARTL", "APOLLOHOSP"]
    
    if is_indian:
        nse_symbol = symbol.replace('.NS', '')
        try:
            # Wrap nselib call with timeout since it can hang
            quote = await asyncio.wait_for(get_nselib_quote(nse_symbol), timeout=5.0)
            if quote:
                quote_cache[symbol] = (quote, time.time())
                return quote
        except asyncio.TimeoutError:
            print(f"NSE Lib timeout for {symbol}")
        except Exception as e:
            print(f"NSE Lib error for {symbol}: {e}")
            
        if not symbol.endswith('.NS') and not symbol.startswith('^'):
             yfinance_symbol = f"{symbol}.NS"

    # Strategy 2: Try yfinance
    try:
        ticker = await asyncio.to_thread(yf.Ticker, yfinance_symbol)
        
        # Try fast_info first
        try:
            fast_info = await asyncio.to_thread(lambda: ticker.fast_info)
            price = fast_info.last_price
            
            try:
                 info = await asyncio.to_thread(lambda: ticker.info)
            except:
                 info = {
                     "shortName": symbol,
                     "currentPrice": price,
                     "regularMarketChange": price - fast_info.previous_close,
                     "regularMarketChangePercent": (price - fast_info.previous_close) / fast_info.previous_close,
                     "volume": fast_info.last_volume,
                     "dayHigh": fast_info.day_high,
                     "dayLow": fast_info.day_low,
                     "open": fast_info.open,
                     "previousClose": fast_info.previous_close,
                     "currency": fast_info.currency,
                     "exchange": fast_info.exchange,
                     "quoteType": fast_info.quote_type,
                 }
        except:
             info = await asyncio.to_thread(lambda: ticker.info)

        data = {
            "symbol": symbol,
            "name": info.get("shortName", symbol),
            "price": info.get("currentPrice", info.get("regularMarketPrice", 0)),
            "change": info.get("regularMarketChange", 0),
            "percent_change": info.get("regularMarketChangePercent", 0) * 100,
            "volume": info.get("volume", 0),
            "market_cap": info.get("marketCap", 0),
            "pe_ratio": info.get("trailingPE", None),
            "eps": info.get("trailingEps", None),
            "day_high": info.get("dayHigh", 0),
            "day_low": info.get("dayLow", 0),
            "open": info.get("open", 0),
            "previous_close": info.get("previousClose", 0),
            "currency": info.get("currency", "USD"),
            "exchange": info.get("exchange", "UNKNOWN"),
            "timezone": info.get("exchangeTimezoneName", "UTC"),
            "type": info.get("quoteType", "EQUITY"),
            "market_state": info.get("marketState", "CLOSED"),
        }
        
        quote_cache[symbol] = (data, time.time())
        return data
        
    except Exception as e:
        print(f"YFinance error for {symbol}: {e}")
        
        # Strategy 3: Try Google Finance Scraping (Strong Fallback)
        print(f"Attempting Google Finance fallback for {symbol}")
        google_quote = await get_google_finance_quote(symbol)
        if google_quote:
            quote_cache[symbol] = (google_quote, time.time())
            return google_quote

        # Strategy 4: Serve Stale Cache
        if symbol in quote_cache:
            print(f"Serving stale cache for {symbol} due to error")
            return quote_cache[symbol][0]
            
        raise e

async def get_history(symbol: str, period: str, interval: str):
    # Handle NIFTY indices mapping
    yfinance_symbol = symbol
    if symbol == "NIFTY 50":
        yfinance_symbol = "^NSEI"
    elif symbol == "NIFTY BANK":
        yfinance_symbol = "^NSEBANK"
    elif symbol == "NIFTY IT":
        yfinance_symbol = "^CNXIT"
    elif symbol == "NIFTY NEXT 50":
        yfinance_symbol = "^NSMIDCP"
    elif symbol == "SENSEX":
        yfinance_symbol = "^BSESN"

    try:
        ticker = await asyncio.to_thread(yf.Ticker, yfinance_symbol)
        history = await asyncio.to_thread(ticker.history, period=period, interval=interval)
        
        # Convert dataframe to list of dicts
        history.reset_index(inplace=True)
        
        # Format date/time
        data = []
        for _, row in history.iterrows():
            # Handle Date or Datetime index
            date_val = row["Date"]
            
            entry = {
                "date": date_val.isoformat(),
                "open": row["Open"],
                "high": row["High"],
                "low": row["Low"],
                "close": row["Close"],
                "volume": row["Volume"]
            }
            data.append(entry)
            
        return data
    except Exception as e:
        print(f"YFinance history error: {e}")
        return []
