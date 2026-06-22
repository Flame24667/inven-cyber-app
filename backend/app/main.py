from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import ensure_indexes
from app.routes import auth, items, loans


settings = get_settings()

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(items.router, prefix="/api")
app.include_router(loans.router, prefix="/api")


@app.on_event("startup")
def on_startup() -> None:
    ensure_indexes()


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "service": settings.app_name}
