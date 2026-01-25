import yfinance as yf
import pandas as pd
import asyncio
import requests
import os
import random
from datetime import datetime
from fake_useragent import UserAgent

# Initialize UserAgent rotator
ua = UserAgent()

# Helper to get a random User-Agent
def get_random_headers():
    return {
        'User-Agent': ua.random,
        'Accept': 'application/json',
        'Origin': 'https://finance.yahoo.com',
        'Referer': 'https://finance.yahoo.com/'
    }

async def search_stocks(query: str):
    # Use Yahoo Finance auto-complete API
    url = f"https://query2.finance.yahoo.com/v1/finance/search?q={query}&quotesCount=10&newsCount=0"
    headers = get_random_headers()
    
    try:
        response = await asyncio.to_thread(requests.get, url, headers=headers)
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

async def get_quote(symbol: str):
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
    
    try:
        # Run synchronous yfinance call in a separate thread
        ticker = await asyncio.to_thread(yf.Ticker, yfinance_symbol)
        
        # yfinance 0.2.x+ handles headers internally and tries to mimic a browser.
        # Since we cannot easily inject a custom session into yfinance 0.2.x without breaking it (it expects curl_cffi),
        # we rely on its internal improvements. 
        # However, to help avoid IP bans, we can add a small random delay before the call if needed, 
        # but yfinance itself is the black box here.
        
        # We can try to access fast_info first as it's lighter
        try:
            fast_info = await asyncio.to_thread(lambda: ticker.fast_info)
            price = fast_info.last_price
            
            # If fast_info worked, we still need metadata.
            # We'll try to get full info but fallback gracefully
            try:
                 info = await asyncio.to_thread(lambda: ticker.info)
            except:
                 # Construct minimal info from fast_info if full info fails
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
             # If fast_info fails, try regular info directly
             info = await asyncio.to_thread(lambda: ticker.info)

        # Extract relevant data (handling potential missing keys gracefully)
        return {
            "symbol": symbol, # Return original requested symbol name for UI consistency
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
    except Exception as e:
        print(f"Quote error for {symbol}: {e}")
        # Return a partial object or re-raise depending on needs. 
        # For now, let's return a basic error structure or just None
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
