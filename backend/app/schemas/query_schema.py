from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class AOIModel(BaseModel):
    bbox: List[float] = Field(..., description="[min_lon, min_lat, max_lon, max_lat]")

class QueryRequest(BaseModel):
    prompt: str
    aoi: AOIModel
    start_date: Optional[str] = "2024-06-01"
    end_date: Optional[str] = "2024-08-30"
    sensor: Optional[str] = "Sentinel-2"

class DetectionItem(BaseModel):
    id: str
    type: str
    lat: float
    lon: float
    area_km2: float
    confidence: float

class QueryResponse(BaseModel):
    baseline_water_km2: float
    post_water_km2: float
    net_change_km2: float
    pct_change: float
    confidence: float
    geojson: Dict[str, Any]
    ai_narrative: str
    detections: List[DetectionItem]
    audit_trace: List[str]