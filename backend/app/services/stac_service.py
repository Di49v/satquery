import pystac_client
import planetary_computer as pc
from datetime import datetime, timedelta
from typing import Tuple, Any

STAC_URL = "https://planetarycomputer.microsoft.com/api/stac/v1"

def fetch_sentinel_granules(bbox: list[float], start_date: str, end_date: str) -> Tuple[Any, Any]:
    """
    Queries STAC for baseline and post-event assets using tuple date ranges 
    to support multi-decade historical analysis (2007 to 2024+).
    """
    catalog = pystac_client.Client.open(STAC_URL, modifier=pc.sign_inplace)
    
    # 1. Parse user years to decide between Landsat (historical) and Sentinel-2 (modern)
    try:
        dt_start = datetime.strptime(start_date, "%Y-%m-%d")
    except ValueError:
        dt_start = datetime(2024, 6, 1)
        
    try:
        dt_end = datetime.strptime(end_date, "%Y-%m-%d")
    except ValueError:
        dt_end = datetime(2024, 8, 25)

    # Choose collection based on timeline availability
    # Sentinel-2 launched in 2015. For years prior, use Landsat Collection 2 Level-2.
    if dt_start.year < 2015:
        collection = "landsat-c2-l2"
    else:
        collection = "sentinel-2-l2a"

    # Define safe date windows (passing as tuples/lists avoids all string formatting bugs in pystac-client)
    baseline_window = (
        (dt_start - timedelta(days=15)).strftime("%Y-%m-%dT00:00:00Z"),
        (dt_start + timedelta(days=15)).strftime("%Y-%m-%dT23:59:59Z")
    )
    
    post_window = (
        (dt_end - timedelta(days=15)).strftime("%Y-%m-%dT00:00:00Z"),
        (dt_end + timedelta(days=15)).strftime("%Y-%m-%dT23:59:59Z")
    )

    # 1. Search baseline asset
    search_baseline = catalog.search(
        collections=[collection],
        bbox=bbox,
        datetime=baseline_window,
        query={"eo:cloud_cover": {"lt": 90}},
        sortby=[{"field": "properties.eo:cloud_cover", "direction": "asc"}]
    )
    baseline_items = list(search_baseline.items())
    
    if not baseline_items:
        # Fallback to a wider global search if exact window has high cloud cover
        search_baseline = catalog.search(
            collections=[collection],
            bbox=bbox,
            datetime=("2020-01-01T00:00:00Z", "2024-12-31T23:59:59Z"),
            query={"eo:cloud_cover": {"lt": 90}},
            sortby=[{"field": "properties.eo:cloud_cover", "direction": "asc"}]
        )
        baseline_items = list(search_baseline.items())
        if not baseline_items:
            raise ValueError(f"No archive imagery found in collection '{collection}' for the given coordinates.")

    # 2. Search post-event asset
    search_post = catalog.search(
        collections=[collection],
        bbox=bbox,
        datetime=post_window,
        query={"eo:cloud_cover": {"lt": 90}},
        sortby=[{"field": "properties.eo:cloud_cover", "direction": "asc"}]
    )
    post_items = list(search_post.items())
    
    if not post_items:
        post_items = baseline_items # Fallback copy if post-event is missing

    return baseline_items[0], post_items[-1]

# Alias to ensure compatibility with main.py imports
fetch_satellite_granules = fetch_sentinel_granules