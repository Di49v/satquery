import { create } from 'zustand';

interface GeoState {
  lat: number;
  lng: number;
  zoom: number;
  activeLayers: string[];
  setCoordinates: (lat: number, lng: number) => void;
  setZoom: (zoom: number) => void;
  toggleLayer: (layerId: string) => void;
}

export const useGeoStore = create<GeoState>((set) => ({
  lat: 31.6340, // Default to Amritsar
  lng: 74.8723,
  zoom: 12,
  activeLayers: ['optical'], // Default to Esri High-Res
  
  setCoordinates: (lat, lng) => set({ lat, lng }),
  setZoom: (zoom) => set({ zoom }),
  
  toggleLayer: (layerId) => set((state) => {
    // If it's a base map (osm or optical), ensure they mutually exclude each other
    if (layerId === 'osm') {
      return { activeLayers: [...state.activeLayers.filter(l => l !== 'optical'), 'osm'] };
    }
    if (layerId === 'optical') {
      return { activeLayers: [...state.activeLayers.filter(l => l !== 'osm'), 'optical'] };
    }
    
    // For overlays (like NDVI or Night Lights), just toggle them
    const isTargetActive = state.activeLayers.includes(layerId);
    return {
      activeLayers: isTargetActive
        ? state.activeLayers.filter((id) => id !== layerId)
        : [...state.activeLayers, layerId]
    };
  }),
}));