from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv
from api.routers import stock, market

load_dotenv()

app = FastAPI(title="Trade Only API", description="Financial Market Data API", version="1.0.0")

# Configure CORS
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stock.router)
app.include_router(market.router)

@app.get("/")
async def root():
    return {"status": "ok", "message": "Trade Only API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Service is healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
