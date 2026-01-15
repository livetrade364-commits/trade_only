from fastapi import APIRouter, HTTPException
from api.services.stock_service import StockService

router = APIRouter(prefix="/api/stock", tags=["Stock"])

@router.get("/quote/{symbol}")
async def get_quote(symbol: str):
    try:
        return StockService.get_quote(symbol)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{symbol}")
async def get_history(symbol: str, period: str = "1mo"):
    try:
        return StockService.get_history(symbol, period)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search")
async def search_stocks(q: str):
    try:
        return StockService.search(q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
