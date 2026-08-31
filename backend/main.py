from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as api_router

app = FastAPI(
    title="GovRS Observation Portal API",
    description="Backend routing and multi-agent pipeline for spatial telemetry.",
    version="1.0.0"
)

# Configure CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# Mount the API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"status": "GovRS Kernel Online", "version": "1.0.0"}