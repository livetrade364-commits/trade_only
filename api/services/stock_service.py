import yfinance as yf
import pandas as pd
import asyncio
import requests
import os
import finnhub
from datetime import datetime

# Initialize Finnhub client
# Users should provide FINNHUB_API_KEY in environment variables
finnhub_client = None
api_key = os.getenv("FINNHUB_API_KEY")
if api_key:
    finnhub_client = finnhub.Client(api_key=api_key)

async def search_stocks(query: str):
    # Try Finnhub first if available
    if finnhub_client:
        try:
            # Finnhub symbol search
            result = await asyncio.to_thread(finnhub_client.symbol_lookup, query)
            if result and 'result' in result:
                return [
                    {
                        "symbol": item.get('symbol'),
                        "name": item.get('description'),
                        "type": item.get('type'),
                        "exchange": item.get('displaySymbol').split(':')[-1] if ':' in item.get('displaySymbol', '') else 'UNKNOWN'
                    }
                    for item in result['result']
                    if item.get('type') in ['Common Stock', 'ETP']  # Filter relevant types
                ]
        except Exception as e:
            print(f"Finnhub search error: {e}")
            # Fallback to Yahoo

    # Use Yahoo Finance auto-complete API (Fallback)
    url = f"https://query2.finance.yahoo.com/v1/finance/search?q={query}&quotesCount=10&newsCount=0"
    headers = {'User-Agent': 'Mozilla/5.0'}
    
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
    
    # Try Finnhub first if available and not an index (Finnhub free tier has limited index support)
    if finnhub_client and not symbol.startswith('^') and "NIFTY" not in symbol:
        try:
            quote = await asyncio.to_thread(finnhub_client.quote, symbol)
            profile = await asyncio.to_thread(finnhub_client.company_profile2, symbol=symbol)
            
            if quote and quote['c'] != 0: # Check if valid data returned
                return {
                    "symbol": symbol,
                    "name": profile.get('name', symbol) if profile else symbol,
                    "price": quote['c'],
                    "change": quote['d'],
                    "percent_change": quote['dp'],
                    "volume": 0, # Finnhub quote doesn't return volume in basic call
                    "market_cap": profile.get('marketCapitalization', 0) * 1000000 if profile else 0,
                    "pe_ratio": None,
                    "eps": None,
                    "day_high": quote['h'],
                    "day_low": quote['l'],
                    "open": quote['o'],
                    "previous_close": quote['pc'],
                    "currency": profile.get('currency', 'USD') if profile else 'USD',
                    "exchange": profile.get('exchange', 'UNKNOWN') if profile else 'UNKNOWN',
                    "timezone": "America/New_York", # Default assumption for Finnhub US stocks
                    "type": "EQUITY",
                    "market_state": "REGULAR", # Simplified
                }
        except Exception as e:
            print(f"Finnhub quote error for {symbol}: {e}")
            # Fallback to yfinance

    # Run synchronous yfinance call in a separate thread
    ticker = await asyncio.to_thread(yf.Ticker, yfinance_symbol)
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

    # Try Finnhub for history if available (candles)
    # Finnhub uses unix timestamps. Mapping 'period' to timestamps is needed.
    # For now, let's stick to yfinance for history as it handles '1mo', '1y' strings conveniently
    # Unless yfinance fails completely.
    
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
