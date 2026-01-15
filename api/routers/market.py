from fastapi import APIRouter, HTTPException
from api.services.market_service import MarketService

router = APIRouter(prefix="/api/market", tags=["Market"])

@router.get("/overview")
async def get_market_overview():
    try:
        return MarketService.get_overview()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sectors")
async def get_sector_performance():
    try:
        return MarketService.get_sectors()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/gainers")
async def get_top_gainers():
    try:
        return MarketService.get_top_gainers()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/industries")
async def get_industry_data(sector: str = None):
    try:
        return MarketService.get_industries(sector)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
