import yfinance as yf
import asyncio
from nselib import capital_market
from functools import lru_cache
from datetime import datetime, timedelta
import time
import os

# Simple in-memory cache with TTL
class AsyncCache:
    def __init__(self, ttl_seconds=60):
        self.cache = {}
        self.ttl = ttl_seconds

    async def get(self, key):
        if key in self.cache:
            data, timestamp = self.cache[key]
            if time.time() - timestamp < self.ttl:
                return data
            else:
                del self.cache[key]
        return None

    async def set(self, key, value):
        self.cache[key] = (value, time.time())

# Initialize caches
market_cache = AsyncCache(ttl_seconds=300) # 5 minutes cache

# Global variable to track last NSE request time
last_nse_request_time = 0
NSE_REQUEST_DELAY = 60 # 60 seconds delay

async def get_overview():
    cache_key = "global_overview"
    cached_data = await market_cache.get(cache_key)
    if cached_data:
        return cached_data

    # Common indices
    indices = ["^GSPC", "^DJI", "^IXIC", "^RUT"]
    data = []
    
    for symbol in indices:
        try:
            ticker = await asyncio.to_thread(yf.Ticker, symbol)
            info = await asyncio.to_thread(lambda: ticker.info)
            data.append({
                "symbol": symbol,
                "name": info.get("shortName", symbol),
                "price": info.get("regularMarketPrice", 0),
                "change": info.get("regularMarketChange", 0),
                "percent_change": info.get("regularMarketChangePercent", 0)
            })
        except Exception:
            continue
            
    await market_cache.set(cache_key, data)
    return data

async def get_indian_overview():
    cache_key = "indian_overview"
    cached_data = await market_cache.get(cache_key)
    if cached_data:
        return cached_data

    # Check for rate limiting
    global last_nse_request_time
    current_time = time.time()
    if current_time - last_nse_request_time < NSE_REQUEST_DELAY:
        print("Rate limit: Serving fallback or cached data for Indian Overview")
        # If cache missed but rate limited, try to get stale cache or fallback
        # Since we don't have stale cache logic, go to fallback
        return await get_indian_overview_fallback()

    # Indian indices using nselib
    try:
        last_nse_request_time = time.time()
        # Fetch indices data using nselib
        df = await asyncio.to_thread(capital_market.market_watch_all_indices)
        
        # Target indices to display
        target_indices = ["NIFTY 50", "NIFTY BANK", "NIFTY IT", "NIFTY NEXT 50", "SENSEX"]
        results = []
        
        # Iterate through dataframe rows
        for index, row in df.iterrows():
            # The column name is 'indexSymbol'
            if row['indexSymbol'] in target_indices:
                results.append({
                    "symbol": row['indexSymbol'],
                    "name": row['indexSymbol'], # Use symbol as name to match frontend expectation
                    "price": float(str(row['last']).replace(',', '')),
                    "change": float(str(row['variation']).replace(',', '')),
                    "percent_change": float(str(row['percentChange']).replace(',', '')),
                    "currency": "INR"
                })
        
        # Explicitly fetch Sensex if not found in nselib (nselib mainly covers NSE)
        # SENSEX is BSE, so we use fallback/yfinance for it
        if not any(r['symbol'] == 'SENSEX' for r in results):
             try:
                ticker = await asyncio.to_thread(yf.Ticker, "^BSESN")
                info = await asyncio.to_thread(lambda: ticker.info)
                results.append({
                    "symbol": "SENSEX",
                    "name": "S&P BSE SENSEX",
                    "price": info.get("currentPrice", info.get("regularMarketPrice", 0)),
                    "change": info.get("regularMarketChange", 0),
                    "percent_change": info.get("regularMarketChangePercent", 0),
                    "currency": "INR"
                })
             except Exception:
                 pass

        await market_cache.set(cache_key, results)
        return results
    except Exception as e:
        print(f"NSE Indices Error: {e}")
        # Fallback to yfinance if nselib fails
        return await get_indian_overview_fallback()

async def get_indian_overview_fallback():
    # Fallback to yfinance
    indices = ["^NSEI", "^NSEBANK", "^CNXIT", "^BSESN"]
    data = []
    for symbol in indices:
        try:
            ticker = await asyncio.to_thread(yf.Ticker, symbol)
            info = await asyncio.to_thread(lambda: ticker.info)
            data.append({
                "symbol": "SENSEX" if symbol == "^BSESN" else symbol, # Normalize Sensex name
                "name": info.get("shortName", symbol),
                "price": info.get("regularMarketPrice", 0),
                "change": info.get("regularMarketChange", 0),
                "percent_change": info.get("regularMarketChangePercent", 0),
                "currency": "INR"
            })
        except Exception:
            continue
    return data

async def get_movers(mover_type: str = "gainers"):
    cache_key = f"global_movers_{mover_type}"
    cached_data = await market_cache.get(cache_key)
    if cached_data:
        return cached_data

    # Simulated list of active stocks to filter from
    symbols = [
        "NVDA", "TSLA", "AAPL", "MSFT", "AMD", "AMZN", "GOOGL", "META", "NFLX", "INTC",
        "PLTR", "COIN", "MARA", "RIOT", "DKNG", "UBER", "ABNB", "HOOD", "PYPL", "SQ",
        "PFE", "MRNA", "JNJ", "LLY", "UNH", "XOM", "CVX", "JPM", "BAC", "WFC"
    ]
    
    movers = []
    
    # Fallback to Yahoo
    for symbol in symbols:
        try:
            ticker = await asyncio.to_thread(yf.Ticker, symbol)
            info = await asyncio.to_thread(lambda: ticker.info)
            change_percent = info.get("regularMarketChangePercent", 0) * 100
            
            movers.append({
                "symbol": symbol,
                "name": info.get("shortName", symbol),
                "price": info.get("currentPrice", 0),
                "change": info.get("regularMarketChange", 0),
                "percent_change": change_percent
            })
        except Exception:
            continue
    
    # Filter and sort based on type
    if mover_type == "gainers":
        filtered = [m for m in movers if m["percent_change"] > 0]
        filtered.sort(key=lambda x: x["percent_change"], reverse=True)
    else: # losers
        filtered = [m for m in movers if m["percent_change"] < 0]
        filtered.sort(key=lambda x: x["percent_change"]) # Most negative first
        
    result = filtered[:5] # Return top 5
    await market_cache.set(cache_key, result)
    return result

async def get_indian_movers(mover_type: str = "gainers"):
    cache_key = f"indian_movers_{mover_type}"
    cached_data = await market_cache.get(cache_key)
    if cached_data:
        return cached_data

    # Check for rate limiting
    global last_nse_request_time
    current_time = time.time()
    if current_time - last_nse_request_time < NSE_REQUEST_DELAY:
        print(f"Rate limit: Serving fallback data for Indian Movers ({mover_type})")
        return await get_indian_movers_fallback(mover_type)

    try:
        last_nse_request_time = time.time()
        # Using nselib for top gainers/losers
        # 'to_get' parameter accepts 'gainers' or 'loosers' (note the spelling in nselib)
        nselib_type = "loosers" if mover_type == "losers" else "gainers"
        
        df = await asyncio.to_thread(capital_market.top_gainers_or_losers, to_get=nselib_type)
        
        results = []
        # Columns: symbol, series, open_price, high_price, low_price, ltp, prev_price, net_price, trade_quantity, turnover, market_type, ca_ex_dt, ca_purpose, perChange, legend
        
        for index, row in df.iterrows():
            results.append({
                "symbol": f"{row['symbol']}.NS", # Append .NS for compatibility with yfinance details
                "name": row['symbol'], # Use symbol as name if full name not available in this view
                "price": float(str(row['ltp']).replace(',', '')),
                "change": float(str(row['ltp']).replace(',', '')) - float(str(row['prev_price']).replace(',', '')), # approximate if net_price is missing or use net_price if cleaner
                "percent_change": float(str(row['perChange']).replace(',', '')),
                "currency": "INR"
            })
            
        if not results:
             # Trigger fallback if nselib returns empty list but no exception
             return await get_indian_movers_fallback(mover_type)

        result = results[:5] # Return top 5
        await market_cache.set(cache_key, result)
        return result
    except Exception as e:
        print(f"NSE Movers Error: {e}")
        return await get_indian_movers_fallback(mover_type)

async def get_indian_movers_fallback(mover_type: str = "gainers"):
    # Fallback using a predefined list of popular Indian stocks (Nifty 50 components)
    symbols = [
        "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "ICICIBANK.NS", "INFY.NS", 
        "HINDUNILVR.NS", "ITC.NS", "SBIN.NS", "BHARTIARTL.NS", "KOTAKBANK.NS",
        "LT.NS", "AXISBANK.NS", "TATAMOTORS.NS", "MARUTI.NS", "SUNPHARMA.NS",
        "BAJFINANCE.NS", "ASIANPAINT.NS", "HCLTECH.NS", "TITAN.NS", "M&M.NS"
    ]
    
    movers = []
    
    for symbol in symbols:
        try:
            ticker = await asyncio.to_thread(yf.Ticker, symbol)
            # Use fast_info if available, it's generally more robust and lighter than .info
            # fast_info provides: last_price, previous_close, etc.
            try:
                fast_info = await asyncio.to_thread(lambda: ticker.fast_info)
                price = fast_info.last_price
                prev_close = fast_info.previous_close
                change = price - prev_close
                percent_change = (change / prev_close) * 100
                
                # Fetch name from info if possible, otherwise use symbol
                # We do this in a separate try/except so if info fails we still have price data
                name = symbol
                try:
                    info = await asyncio.to_thread(lambda: ticker.info)
                    name = info.get("shortName", symbol)
                except:
                    pass

                movers.append({
                    "symbol": symbol,
                    "name": name,
                    "price": price,
                    "change": change,
                    "percent_change": percent_change,
                    "currency": "INR"
                })
            except Exception:
                # If fast_info fails, try regular info
                info = await asyncio.to_thread(lambda: ticker.info)
                change_percent = info.get("regularMarketChangePercent", 0) * 100
                
                movers.append({
                    "symbol": symbol,
                    "name": info.get("shortName", symbol),
                    "price": info.get("currentPrice", 0),
                    "change": info.get("regularMarketChange", 0),
                    "percent_change": change_percent,
                    "currency": "INR"
                })

        except Exception as e:
            # print(f"Fallback error for {symbol}: {e}")
            continue
    
    # Filter and sort based on type
    if mover_type == "gainers":
        filtered = [m for m in movers if m["percent_change"] > 0]
        filtered.sort(key=lambda x: x["percent_change"], reverse=True)
    else: # losers
        filtered = [m for m in movers if m["percent_change"] < 0]
        filtered.sort(key=lambda x: x["percent_change"]) # Most negative first
        
    return filtered[:5]

async def get_sector_data(sector: str):
    cache_key = f"sector_{sector}"
    cached_data = await market_cache.get(cache_key)
    if cached_data:
        return cached_data

    # Predefined lists for requested sectors
    sectors = {
        "tech": ["AAPL", "MSFT", "NVDA", "ORCL", "ADBE"],
        "health": ["UNH", "JNJ", "LLY", "MRK", "ABBV"],
        "pharma": ["PFE", "BMY", "GILD", "AMGN", "BIIB"]
    }
    
    symbols = sectors.get(sector, [])
    results = []
    
    for symbol in symbols:
        try:
            ticker = await asyncio.to_thread(yf.Ticker, symbol)
            info = await asyncio.to_thread(lambda: ticker.info)
            results.append({
                "symbol": symbol,
                "name": info.get("shortName", symbol),
                "price": info.get("currentPrice", 0),
                "change": info.get("regularMarketChange", 0),
                "percent_change": info.get("regularMarketChangePercent", 0) * 100
            })
        except Exception:
            continue
            
    await market_cache.set(cache_key, results)
    return results

async def get_indian_sector_data(sector: str):
    cache_key = f"indian_sector_{sector}"
    cached_data = await market_cache.get(cache_key)
    if cached_data:
        return cached_data

    # Predefined lists for Indian sectors
    sectors = {
        "tech": ["INFY.NS", "TCS.NS", "HCLTECH.NS", "TECHM.NS", "WIPRO.NS"],
        "health": ["APOLLOHOSP.NS", "MAXHEALTH.NS", "LALPATHLAB.NS", "SYNGENE.NS", "METROPOLIS.NS"],
        "pharma": ["SUNPHARMA.NS", "DRREDDY.NS", "CIPLA.NS", "DIVISLAB.NS", "LUPIN.NS"]
    }
    
    symbols = sectors.get(sector, [])
    results = []
    
    for symbol in symbols:
        try:
            ticker = await asyncio.to_thread(yf.Ticker, symbol)
            info = await asyncio.to_thread(lambda: ticker.info)
            results.append({
                "symbol": symbol,
                "name": info.get("shortName", symbol),
                "price": info.get("currentPrice", 0),
                "change": info.get("regularMarketChange", 0),
                "percent_change": info.get("regularMarketChangePercent", 0) * 100,
                "currency": "INR"
            })
        except Exception:
            continue
            
    await market_cache.set(cache_key, results)
    return results
