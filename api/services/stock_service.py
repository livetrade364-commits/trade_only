import yfinance as yf
import pandas as pd
import asyncio
import requests

async def search_stocks(query: str):
    # Use Yahoo Finance auto-complete API
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
    # Run synchronous yfinance call in a separate thread
    ticker = await asyncio.to_thread(yf.Ticker, symbol)
    info = await asyncio.to_thread(lambda: ticker.info)
    
    # Extract relevant data (handling potential missing keys gracefully)
    return {
        "symbol": symbol,
        "name": info.get("shortName", symbol),
        "price": info.get("currentPrice", info.get("regularMarketPrice", 0)),
        "change": info.get("regularMarketChange", 0),
        "percent_change": info.get("regularMarketChangePercent", 0),
        "volume": info.get("volume", 0),
        "market_cap": info.get("marketCap", 0),
        "pe_ratio": info.get("trailingPE", None),
        "eps": info.get("trailingEps", None),
        "day_high": info.get("dayHigh", 0),
        "day_low": info.get("dayLow", 0),
        "open": info.get("open", 0),
        "previous_close": info.get("previousClose", 0),
    }

async def get_history(symbol: str, period: str, interval: str):
    ticker = await asyncio.to_thread(yf.Ticker, symbol)
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
