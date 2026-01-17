from fastapi import APIRouter, HTTPException
from api.services import market_service

router = APIRouter()

@router.get("/overview")
async def get_market_overview():
    try:
        return await market_service.get_overview()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/movers")
async def get_market_movers(type: str = "gainers"):
    try:
        return await market_service.get_movers(type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sector/{sector_name}")
async def get_sector_data(sector_name: str):
    try:
        return await market_service.get_sector_data(sector_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
