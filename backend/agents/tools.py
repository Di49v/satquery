import json
from langchain_core.tools import tool
from services.stac_service import StacService
from services.vlm_service import VLMService

@tool
def fetch_stac_metadata(lat: float, lon: float) -> str:
    """
    Fetches the most recent AWS STAC satellite scene metadata and preview image URL for a given latitude and longitude.
    ALWAYS use this tool first when analyzing a geographic point to get the scene ID and preview URL.
    """
    result = StacService.fetch_recent_scene(lat=lat, lon=lon)
    return json.dumps(result)

@tool
def run_geochat_inference(image_url: str, query: str, lat: float, lon: float) -> str:
    """
    Executes the GeoChat-7B vision-language model for optical image analysis, spatial grounding, and scene VQA.
    Requires an image_url obtained from fetch_stac_metadata.
    """
    result = VLMService.run_geochat(image_url=image_url, query=query, lat=lat, lon=lon)
    return json.dumps(result)

@tool
def run_earthdial_inference(query: str, modality: str = "Optical/MS") -> str:
    """
    Executes EarthDial-4B for multispectral analysis or general single-image remote sensing queries.
    """
    result = VLMService.run_earthdial(query=query, modality=modality)
    return json.dumps(result)

@tool
def run_temporal_change_inference(query: str) -> str:
    """
    Executes TEOChat and DeltaVLM in parallel for bi-temporal change detection and epoch land-cover shift analysis.
    """
    teochat_res = VLMService.run_teochat(query)
    deltavlm_res = VLMService.run_deltavlm(query)
    return json.dumps({
        "teochat": teochat_res,
        "deltavlm": deltavlm_res
    })

@tool
def run_optical_sar_segmentation(query: str) -> str:
    """
    Executes MM-OVSeg for paired Optical and SAR (Sentinel-1) multimodal segmentation.
    """
    result = VLMService.run_mmovseg(query=query)
    return json.dumps(result)

# Master tool registry for the LangGraph workflow
registry_tools = [
    fetch_stac_metadata,
    run_geochat_inference,
    run_earthdial_inference,
    run_temporal_change_inference,
    run_optical_sar_segmentation
]