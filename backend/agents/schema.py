# agents/schema.py
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class EvidenceSchema(BaseModel):
    type: str = Field(description="'mask', 'statistics', 'chart', or 'mixed'")
    imageUrl: Optional[str] = None
    stats: Optional[Dict[str, Any]] = None
    highlightChange: Optional[str] = None

class SatQueryResponse(BaseModel):
    text: str = Field(description="The conversational text answer for the user")
    evidence: Optional[EvidenceSchema] = Field(description="Structured evidence payload, if any")
    trace: List[str] = Field(description="List of execution steps and tools used")