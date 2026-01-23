from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import stock, market

app = FastAPI(title="Trade Only API")

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://lozzbytech.onrender.com",
    "https://trade-only.onrender.com",
    "https://trade-x-vsv0.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(stock.router, prefix="/api/stock", tags=["stock"])
app.include_router(market.router, prefix="/api/market", tags=["market"])

@app.get("/")
async def root():
    return {"message": "Welcome to Tradex API"}
