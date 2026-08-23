from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.core.config import settings
from app.core import model_loader
from app.routers import predict

app = FastAPI(
    title="MediSense ML Service",
    description="AI inference service for skin condition screening, severity estimation, and hydration analysis.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/api", tags=["prediction"])


@app.on_event("startup")
async def startup_event():
    model_loader.load_model()


@app.get("/")
async def root():
    return {
        "service": "MediSense ML Service",
        "status": "running",
        "mockMode": model_loader.is_mock_mode(),
        "docs": "/docs",
    }


if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=True)
