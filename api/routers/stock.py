from fastapi import APIRouter, HTTPException
from api.services import stock_service

router = APIRouter()

@router.get("/search")
async def search_stocks(q: str):
    try:
        return await stock_service.search_stocks(q)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{symbol}")
async def get_stock_quote(symbol: str):
    try:
        return await stock_service.get_quote(symbol)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{symbol}/history")
async def get_stock_history(symbol: str, period: str = "1mo", interval: str = "1d"):
    try:
        return await stock_service.get_history(symbol, period, interval)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
