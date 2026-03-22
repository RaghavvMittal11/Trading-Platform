from fastapi import APIRouter
from app.api.v1.routes import backtest

api_router = APIRouter()
api_router.include_router(backtest.router)
