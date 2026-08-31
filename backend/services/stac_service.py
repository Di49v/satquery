from pystac_client import Client
from typing import Optional, Dict, Any
import datetime

class StacService:
    STAC_API_URL = "https://earth-search.aws.element84.com/v1"

    @staticmethod
    def fetch_recent_scene(lat: float, lon: float, collection: str = "sentinel-2-l2a", days_back: int = 30) -> Dict[str, Any]:
        """
        Queries AWS Earth Search STAC for the most recent intersecting scene within a rolling window.
        """
        try:
            client = Client.open(StacService.STAC_API_URL)
            point = {"type": "Point", "coordinates": [lon, lat]}
            
            # Calculate a rolling date window (e.g., last 30 days)
            end_date = datetime.datetime.now(datetime.timezone.utc)
            start_date = end_date - datetime.timedelta(days=days_back)
            time_window = f"{start_date.strftime('%Y-%m-%d')}/{end_date.strftime('%Y-%m-%d')}"
            
            search = client.search(
                collections=[collection],
                intersects=point,
                datetime=time_window,
                max_items=1
            )
            
            items = list(search.items())
            if not items:
                return {"error": "No scenes found for the given coordinates in the recent time window."}
                
            item = items[0]
            assets = item.assets
            
            # Fallback chain for image previews
            preview_url = None
            for key in ["thumbnail", "rendered_preview", "overview", "visual"]:
                if key in assets and assets[key].href:
                    preview_url = assets[key].href
                    break
                    
            return {
                "scene_id": item.id,
                "datetime": item.properties.get("datetime", "N/A"),
                "cloud_cover": item.properties.get("eo:cloud_cover", None),
                "collection": collection,
                "preview_url": preview_url
            }
            
        except Exception as e:
            return {"error": f"STAC Query Exception: {str(e)}"}