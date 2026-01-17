from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import stock, market

app = FastAPI(title="Trade Only API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(stock.router, prefix="/api/stock", tags=["stock"])
app.include_router(market.router, prefix="/api/market", tags=["market"])

@app.get("/")
async def root():
    return {"message": "Welcome to Trade Only API"}
