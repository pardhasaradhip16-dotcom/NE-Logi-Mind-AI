import React, { useEffect, useRef } from 'react';
import { NE_DRIVER_DIGITAL_TWINS } from '../../data/mockData';

export const DigitalTwinMap = ({
  scenarioName = "Heavy Rainfall",
  driverId = "DRV-001",
  driverTwinData = null,
  height = "460px",
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const twin = driverTwinData || NE_DRIVER_DIGITAL_TWINS[driverId] || NE_DRIVER_DIGITAL_TWINS["DRV-001"];

  useEffect(() => {
    if (!mapContainerRef.current || !window.L) return;

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.stop();
        mapInstanceRef.current.remove();
      } catch (e) {}
      mapInstanceRef.current = null;
    }

    // Centered on specific North East Driver's mountain corridor
    const map = window.L.map(mapContainerRef.current, {
      center: twin.mapCenter || [26.95, 88.52],
      zoom: twin.mapZoom || 9,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // High-contrast imagery tiles
    window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 17,
    }).addTo(map);

    // Add topographic contour/label overlay with verified subdomains
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      subdomains: 'abc',
    }).addTo(map);

    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);

    // Hazard Area Buffer (Active Hazard Zone)
    if (twin.hazardCoords) {
      window.L.circle(twin.hazardCoords, {
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.25,
        radius: twin.hazardRadius || 14000,
        weight: 2,
        dashArray: '6, 6',
      }).addTo(map);
    }

    // Flood / Mud inundation polygon
    if (twin.floodPolygon && Array.isArray(twin.floodPolygon)) {
      window.L.polygon(twin.floodPolygon, {
        color: '#06b6d4',
        fillColor: '#06b6d4',
        fillOpacity: 0.35,
        weight: 2,
      }).addTo(map);
    }

    // Segment 1: Open Highway approaching pass (Road Open - Green)
    if (twin.openSegment && twin.openSegment.length > 1) {
      window.L.polyline(twin.openSegment, {
        color: '#10b981',
        weight: 5,
        opacity: 0.9,
      }).addTo(map);
    }

    // Segment 2: Hazard Sector Chokepoint (At Risk / Blocked - Red with glow)
    if (twin.blockedSegment && twin.blockedSegment.length > 1) {
      // Glow underlayer
      window.L.polyline(twin.blockedSegment, {
        color: '#ef4444',
        weight: 10,
        opacity: 0.3,
      }).addTo(map);

      // Dashed core
      window.L.polyline(twin.blockedSegment, {
        color: '#ef4444',
        weight: 5,
        opacity: 1,
        dashArray: '8, 6',
      }).addTo(map);
    }

    // Segment 3: Alternate Recommended Autonomous Detour Route (Blue solid with pulse)
    if (twin.detourSegment && twin.detourSegment.length > 1) {
      window.L.polyline(twin.detourSegment, {
        color: '#3b82f6',
        weight: 5,
        opacity: 0.95,
      }).addTo(map);
    }

    // Segment 4: Destination Approach (Orange)
    if (twin.destSegment && twin.destSegment.length > 1) {
      window.L.polyline(twin.destSegment, {
        color: '#f59e0b',
        weight: 4,
        opacity: 0.85,
      }).addTo(map);
    }

    // Hazard Callout Popup Marker right over the mountain hotspot
    const currentScenario = twin.scenarios?.[scenarioName] || twin.insights;
    const probabilityVal = currentScenario.probability || twin.hazardProbability || "84%";

    const hazardIcon = window.L.divIcon({
      className: 'hazard-callout-marker',
      html: `
        <div class="hazard-callout-card" style="
          background: rgba(15, 23, 42, 0.95);
          border: 2px solid #ef4444;
          border-radius: 8px;
          padding: 6px 10px;
          color: white;
          box-shadow: 0 4px 14px rgba(239,68,68,0.4);
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          white-space: nowrap;
        ">
          <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#ef4444; box-shadow:0 0 8px #ef4444; animation: pulseBeacon 1.5s infinite;"></span>
          <div>
            <div style="font-size: 11px; font-weight: 800; color: #ef4444; text-transform: uppercase;">
              ⚠️ ${twin.hazardName || 'Landslide Warning'}
            </div>
            <div style="font-size: 10px; color: #94a3b8;">Probability: <b style="color:white;">${probabilityVal}</b></div>
          </div>
        </div>
      `,
      iconSize: [180, 48],
      iconAnchor: [90, 52],
    });

    if (twin.hazardCoords) {
      window.L.marker(twin.hazardCoords, { icon: hazardIcon, zIndexOffset: 2000 }).addTo(map);
    }

    // Live Vehicle Marker (Driver's Truck on the corridor)
    if (twin.vehicleLocation) {
      const vehicleIcon = window.L.divIcon({
        className: 'twin-vehicle-marker',
        html: `
          <div style="
            background: #0f172a;
            color: #ffffff;
            padding: 4px 10px;
            border-radius: 20px;
            border: 2px solid #10b981;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            font-size: 11px;
            font-weight: 800;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 5px;
          ">
            <span>🚛</span>
            <span>${twin.vehicleLabel || twin.driverName}</span>
          </div>
        `,
        iconSize: [140, 26],
        iconAnchor: [70, 13],
      });

      window.L.marker(twin.vehicleLocation, { icon: vehicleIcon, zIndexOffset: 1500 }).addTo(map);
    }

    // City / Corridor Node Labels
    const addCity = (name, coords) => {
      window.L.circleMarker(coords, {
        radius: 6,
        fillColor: '#ffffff',
        color: '#0f172a',
        weight: 2.5,
        fillOpacity: 1,
      }).addTo(map).bindTooltip(name, { 
        permanent: true, 
        direction: 'top', 
        className: 'twin-city-tooltip',
        offset: [0, -6] 
      });
    };

    if (twin.cities && Array.isArray(twin.cities)) {
      twin.cities.forEach(city => {
        if (city.coords) addCity(city.name, city.coords);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.stop();
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
    };
  }, [driverId, scenarioName, driverTwinData, twin]);

  return (
    <div className="digital-twin-map-container" style={{ position: 'relative', width: '100%', height, borderRadius: '14px', overflow: 'hidden' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Satellite Mode Banner Tag */}
      <div className="satellite-tag">
        <span className="live-beacon"></span>
        Digital Twin Corridor Live Telemetry • 1m Resolution
      </div>

      {/* Digital Twin Status Legend */}
      <div className="digital-twin-legend">
        <div className="twin-legend-item">
          <span className="twin-dot" style={{ backgroundColor: '#10b981' }}></span>
          <span>Road Open</span>
        </div>
        <div className="twin-legend-item">
          <span className="twin-dot" style={{ backgroundColor: '#f59e0b' }}></span>
          <span>At Risk</span>
        </div>
        <div className="twin-legend-item">
          <span className="twin-dot" style={{ backgroundColor: '#ef4444' }}></span>
          <span>Blocked</span>
        </div>
        <div className="twin-legend-item">
          <span className="twin-dot" style={{ backgroundColor: '#06b6d4' }}></span>
          <span>Flood Area</span>
        </div>
      </div>
    </div>
  );
};
