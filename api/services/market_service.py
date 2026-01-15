import yfinance as yf
import pandas as pd

class MarketService:
    @staticmethod
    def get_overview():
        # Using major indices as a proxy for market overview
        indices = ["^GSPC", "^DJI", "^IXIC", "^RUT"] # S&P 500, Dow Jones, Nasdaq, Russell 2000
        tickers = yf.Tickers(" ".join(indices))
        
        data = []
        for symbol in indices:
            ticker = tickers.tickers[symbol]
            info = ticker.info
            price = info.get('currentPrice') or info.get('regularMarketPrice')
            previous_close = info.get('previousClose') or info.get('regularMarketPreviousClose')
            
            change = 0
            change_percent = 0
            
            if price and previous_close:
                change = price - previous_close
                change_percent = (change / previous_close) * 100
                
            data.append({
                "symbol": symbol,
                "name": info.get('shortName'),
                "price": price,
                "change": round(change, 2),
                "changePercent": round(change_percent, 2)
            })
            
        return data

    @staticmethod
    def get_sectors():
        # yfinance allows fetching sector info via Ticker.info for individual stocks, 
        # but getting a list of all sectors performance is not directly supported by a simple call.
        # We can simulate this by tracking representative ETFs for sectors.
        sector_etfs = {
            "Technology": "XLK",
            "Healthcare": "XLV",
            "Financials": "XLF",
            "Consumer Discretionary": "XLY",
            "Consumer Staples": "XLP",
            "Energy": "XLE",
            "Utilities": "XLU",
            "Industrials": "XLI",
            "Materials": "XLB",
            "Real Estate": "XLRE",
            "Communication Services": "XLC"
        }
        
        tickers = yf.Tickers(" ".join(sector_etfs.values()))
        data = []
        
        for sector, symbol in sector_etfs.items():
            ticker = tickers.tickers[symbol]
            info = ticker.info
            price = info.get('currentPrice') or info.get('regularMarketPrice')
            previous_close = info.get('previousClose') or info.get('regularMarketPreviousClose')
            
            change_percent = 0
            if price and previous_close:
                change_percent = ((price - previous_close) / previous_close) * 100
                
            data.append({
                "name": sector,
                "symbol": symbol,
                "performance": round(change_percent, 2)
            })
            
        return data

    @staticmethod
    def get_top_gainers():
        # Getting real-time top gainers often requires a screener or a specific API endpoint.
        # Yahoo Finance has a screener, but yfinance doesn't expose a simple "get top gainers" method directly 
        # that is reliable without using the screener functionality which can be complex.
        # For this MVP, we will fetch a predefined list of popular volatile stocks and sort them by gain.
        # In a production app, we would use a dedicated market screener API.
        
        # List of popular tech and volatile stocks to check
        symbols = [
            "NVDA", "AMD", "TSLA", "AAPL", "MSFT", "AMZN", "GOOGL", "META", "NFLX", "INTC", 
            "PLTR", "COIN", "MARA", "RIOT", "DKNG", "HOOD", "UBER", "ABNB", "PYPL", "SQ", 
            "SHOP", "ZM", "DOCU", "TWLO", "ROKU", "SPOT", "SNAP", "PINS", "ETSY", "CRWD",
            "PANW", "ZS", "NET", "DDOG", "SNOW", "U", "RBLX", "AFRM", "UPST", "SOFI"
        ]
        tickers = yf.Tickers(" ".join(symbols))
        
        data = []
        for symbol in symbols:
            try:
                ticker = tickers.tickers[symbol]
                info = ticker.info
                price = info.get('currentPrice') or info.get('regularMarketPrice')
                previous_close = info.get('previousClose') or info.get('regularMarketPreviousClose')
                
                if price and previous_close:
                    change = price - previous_close
                    change_percent = (change / previous_close) * 100
                    
                    if change_percent > 0: # Only include gainers
                        data.append({
                            "symbol": symbol,
                            "name": info.get('shortName'),
                            "price": price,
                            "change": round(change, 2),
                            "changePercent": round(change_percent, 2),
                            "volume": info.get('volume'),
                            "website": info.get('website')
                        })
            except Exception:
                continue
                
        # Sort by percentage change descending
        data.sort(key=lambda x: x['changePercent'], reverse=True)
        return data[:10] # Return top 10 gainers

    @staticmethod
    def get_industries(sector: str = None):
        # Similar to sectors, getting industry data is hard without a specific target.
        # This might be a placeholder or require specific implementation if we want real data.
        # For now, we'll return a static list or a mock response as yfinance doesn't support broad industry query.
        # Alternatively, we could fetch top stocks in a sector if we had a list.
        return [{"message": "Industry data aggregation not supported by basic yfinance API without specific tickers."}]
