# SatQuery Frontend UI

A Next.js App Router frontend utilizing Tailwind CSS, Zustand for global state, and React-Leaflet for spatial visualization.

## Directory Structure
- `src/app/`: Next.js page routing and global layouts.
- `src/components/`:
  - `layout/`: Core UI shells (Control Panel, Data Inspector, Navbars).
  - `map/`: Leaflet map components and sync wrappers.
  - `tools/`: Modals and floating widgets (GeoChat Comms, SQL DQI, Multispectral Compare).
- `src/lib/store/`: Zustand state slices (`useGeoStore`, `useModalStore`, `useGeoChatStore`, `useAuditStore`).

## Component Guidelines
- **Client vs Server Components:** Most map and tool components require browser APIs. Ensure files like `CompareModal.tsx` and `MapCanvas.tsx` are dynamically imported with `{ ssr: false }` in the layout files to prevent hydration mismatches and Node.js `window is not defined` crashes.
- **State Synchronization:** Leaflet maps do not react directly to coordinate changes post-mount. Use custom helper components (e.g., `<SyncView>`) containing `useMap().setView()` to bind the map container to the Zustand `useGeoStore`.