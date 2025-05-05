from fastapi import FastAPI
from .routers import owner_router # ← 점(.)을 붙이면 backend 내부에서 상대경로로 작동
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 허용 (React → FastAPI 연동)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 중에는 * 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록 👇 반드시 필요!
app.include_router(owner_router.router)
