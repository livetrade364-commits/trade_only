import yfinance as yf
import asyncio

async def get_overview():
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
            
    return data

async def get_movers(mover_type: str = "gainers"):
    # Simulated list of active stocks to filter from
    symbols = [
        "NVDA", "TSLA", "AAPL", "MSFT", "AMD", "AMZN", "GOOGL", "META", "NFLX", "INTC",
        "PLTR", "COIN", "MARA", "RIOT", "DKNG", "UBER", "ABNB", "HOOD", "PYPL", "SQ",
        "PFE", "MRNA", "JNJ", "LLY", "UNH", "XOM", "CVX", "JPM", "BAC", "WFC"
    ]
    
    movers = []
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
        
    return filtered[:5] # Return top 5

async def get_sector_data(sector: str):
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
            
    return results
