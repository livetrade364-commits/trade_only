import yfinance as yf
from datetime import datetime

class StockService:
    @staticmethod
    def get_quote(symbol: str):
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        # Handling potential missing data safely
        price = info.get('currentPrice') or info.get('regularMarketPrice')
        previous_close = info.get('previousClose') or info.get('regularMarketPreviousClose')
        
        change = 0
        change_percent = 0
        
        if price and previous_close:
            change = price - previous_close
            change_percent = (change / previous_close) * 100
            
        return {
            "symbol": symbol.upper(),
            "name": info.get('shortName') or info.get('longName'),
            "price": price,
            "change": round(change, 2),
            "changePercent": round(change_percent, 2),
            "volume": info.get('volume') or info.get('regularMarketVolume'),
            "marketCap": info.get('marketCap'),
            "peRatio": info.get('trailingPE'),
            "eps": info.get('trailingEps'),
            "website": info.get('website'),
            "timestamp": datetime.now().isoformat()
        }

    @staticmethod
    def get_history(symbol: str, period: str = "1mo"):
        ticker = yf.Ticker(symbol)
        # Valid periods: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
        history = ticker.history(period=period)
        
        data = []
        for date, row in history.iterrows():
            data.append({
                "date": date.isoformat(),
                "open": row['Open'],
                "high": row['High'],
                "low": row['Low'],
                "close": row['Close'],
                "volume": row['Volume']
            })
            
        return {
            "symbol": symbol.upper(),
            "period": period,
            "data": data
        }

    @staticmethod
    def search(query: str):
        # yfinance doesn't have a direct search method that returns a list of tickers easily without external libraries or scraping.
        # However, for this MVP, we might rely on the frontend to provide valid symbols or use a basic lookup if available.
        # A workaround is to use the Ticker object to check if it's valid, but that's not a search.
        # For a real search, we might need to use Yahoo Finance's auto-complete API directly or a different library.
        # Here we will implement a mock search or use a known list if possible, but yfinance has a 'Ticker' object.
        # Let's try to fetch news or metadata which sometimes works as a validation.
        # A better approach for search in yfinance context is often limited. 
        # We will try to use the `yf.Search` if available in newer versions or fallback to a simple implementation.
        # NOTE: yfinance recently added some search capabilities via `yf.Search` class? No, it's not standard.
        # We will implement a direct call to Yahoo's autocomplete API for search functionality.
        
        import requests
        url = f"https://query2.finance.yahoo.com/v1/finance/search?q={query}"
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers)
        data = response.json()
        
        results = []
        if 'quotes' in data:
            for item in data['quotes']:
                results.append({
                    "symbol": item.get('symbol'),
                    "name": item.get('shortname') or item.get('longname'),
                    "exchange": item.get('exchange'),
                    "type": item.get('quoteType')
                })
        return results
