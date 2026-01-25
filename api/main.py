import asyncio
import httpx
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import stock, market

# Keep-alive background task
async def keep_alive():
    """Ping the server every 13 minutes to prevent sleep."""
    while True:
        try:
            # Wait for 13 minutes (13 * 60 seconds)
            await asyncio.sleep(13 * 60)
            
            # Get the public URL from environment variable, default to localhost for dev
            # On Render, set APP_URL to your public URL (e.g., https://trade-only.onrender.com)
            app_url = os.getenv("APP_URL", "http://localhost:8000")
            
            async with httpx.AsyncClient() as client:
                print(f"Keeping server alive: Pinging {app_url}/")
                await client.get(f"{app_url}/")
        except Exception as e:
            print(f"Keep-alive ping failed: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start the keep-alive task
    task = asyncio.create_task(keep_alive())
    yield
    # Shutdown: Cancel the task (optional, as server is dying anyway)
    task.cancel()

app = FastAPI(title="Trade Only API", lifespan=lifespan)

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
