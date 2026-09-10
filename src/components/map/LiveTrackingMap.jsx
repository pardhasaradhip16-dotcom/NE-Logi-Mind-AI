import React, { useEffect, useRef } from 'react';
import { Locate, Maximize2, ShieldAlert, Layers } from 'lucide-react';

export const LiveTrackingMap = ({
  shipments = [],
  selectedShipment = null,
  onSelectShipment = null,
  onOpenDetailModal = null,
  height = "560px",
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayerGroupRef = useRef(null);
  const markersLayerGroupRef = useRef(null);

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current || !window.L) return;

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.stop();
        mapInstanceRef.current.remove();
      } catch (e) {}
      mapInstanceRef.current = null;
    }

    const map = window.L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629], // Center of India
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // CartoDB Voyager Tile Layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: 'abc',
    }).addTo(map);

    routeLayerGroupRef.current = window.L.layerGroup().addTo(map);
    markersLayerGroupRef.current = window.L.layerGroup().addTo(map);

    // Ensure map tiles load properly by invalidating size
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.stop();
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Layers when shipments or selectedShipment changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.L || !markersLayerGroupRef.current || !routeLayerGroupRef.current) return;

    const markersGroup = markersLayerGroupRef.current;
    const routeGroup = routeLayerGroupRef.current;

    markersGroup.clearLayers();
    routeGroup.clearLayers();

    // Helper: color by status
    const getStatusColor = (status) => {
      switch (status) {
        case 'On Time': return '#10b981';
        case 'Delayed': return '#ef4444';
        case 'At Risk': return '#f59e0b';
        case 'Delivered': return '#64748b';
        default: return '#3b82f6';
      }
    };

    // Render active shipment vehicle markers
    shipments.forEach((shipment) => {
      const isSelected = selectedShipment?.id === shipment.id;
      const statusColor = getStatusColor(shipment.status);
      const coords = shipment.currentLocation.coords;

      // Custom Vehicle DivIcon
      const vehicleIcon = window.L.divIcon({
        className: 'vehicle-leaflet-marker',
        html: `
          <div class="map-vehicle-pill ${isSelected ? 'selected-pulse' : ''}" style="border-color: ${statusColor};">
            <span class="vehicle-dot" style="background-color: ${statusColor};"></span>
            <span class="vehicle-tag">${shipment.id}</span>
            ${isSelected ? `<span class="vehicle-pulse-ring" style="border-color: ${statusColor};"></span>` : ''}
          </div>
        `,
        iconSize: [64, 26],
        iconAnchor: [32, 13],
      });

      const marker = window.L.marker(coords, { icon: vehicleIcon }).addTo(markersGroup);

      // Popup Content
      const popupHtml = `
        <div class="tracking-marker-popup" style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 190px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <strong style="font-size: 13px; color: #0f172a;">${shipment.id}</strong>
            <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 9999px; background: ${statusColor}18; color: ${statusColor};">
              ${shipment.status}
            </span>
          </div>
          <div style="font-size: 11px; font-weight: 600; color: #334155; margin-bottom: 3px;">
            ${shipment.origin.city} → ${shipment.destination.city}
          </div>
          <div style="font-size: 11px; color: #64748b;">Speed: <b>${shipment.currentLocation.speedKmH} km/h</b></div>
          <div style="font-size: 11px; color: #64748b;">ETA: <b>${shipment.eta}</b></div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">Risk Score: <b style="color: ${statusColor}">${shipment.riskScore}/100</b></div>
          <button id="btn-popup-inspect-${shipment.id}" style="
            width: 100%;
            background: #2563eb;
            color: #ffffff;
            border: none;
            padding: 5px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
          ">
            View Full Telematics →
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-popup-inspect-${shipment.id}`);
        if (btn && onOpenDetailModal) {
          btn.onclick = () => onOpenDetailModal(shipment);
        }
      });

      marker.on('click', () => {
        if (onSelectShipment) onSelectShipment(shipment);
      });
    });

    // If a shipment is selected, render its complete route polyline and endpoints
    if (selectedShipment && selectedShipment.routeWaypoints && selectedShipment.routeWaypoints.length > 0) {
      const waypoints = selectedShipment.routeWaypoints;
      const statusColor = getStatusColor(selectedShipment.status);

      // Route Glow Halo Line
      window.L.polyline(waypoints, {
        color: statusColor,
        weight: 8,
        opacity: 0.25,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(routeGroup);

      // Solid Route Line
      const routeLine = window.L.polyline(waypoints, {
        color: statusColor,
        weight: 4,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: selectedShipment.status === 'Delivered' ? '6, 6' : null,
      }).addTo(routeGroup);

      // Origin Pin
      const originIcon = window.L.divIcon({
        className: 'origin-marker-icon',
        html: `
          <div style="display:flex; align-items:center; gap:4px;">
            <div style="width:14px; height:14px; border-radius:50%; background:#10b981; border:2.5px solid #ffffff; box-shadow:0 0 10px rgba(16,185,129,0.7);"></div>
            <span style="font-size:10px; font-weight:700; color:#065f46; background:rgba(255,255,255,0.95); padding:1px 6px; border-radius:4px; border:1px solid #a7f3d0; box-shadow:0 1px 3px rgba(0,0,0,0.1); white-space:nowrap;">
              ${selectedShipment.origin.city} (Origin)
            </span>
          </div>
        `,
        iconSize: [120, 20],
        iconAnchor: [7, 10],
      });
      window.L.marker(selectedShipment.origin.coords, { icon: originIcon }).addTo(routeGroup);

      // Destination Pin
      const destIcon = window.L.divIcon({
        className: 'dest-marker-icon',
        html: `
          <div style="display:flex; align-items:center; gap:4px;">
            <div style="width:14px; height:14px; border-radius:50%; background:#ef4444; border:2.5px solid #ffffff; box-shadow:0 0 10px rgba(239,68,68,0.7);"></div>
            <span style="font-size:10px; font-weight:700; color:#991b1b; background:rgba(255,255,255,0.95); padding:1px 6px; border-radius:4px; border:1px solid #fecaca; box-shadow:0 1px 3px rgba(0,0,0,0.1); white-space:nowrap;">
              ${selectedShipment.destination.city} (Dest)
            </span>
          </div>
        `,
        iconSize: [120, 20],
        iconAnchor: [7, 10],
      });
      window.L.marker(selectedShipment.destination.coords, { icon: destIcon }).addTo(routeGroup);

      // Zoom & fit bounds of the active route
      try {
        map.fitBounds(routeLine.getBounds(), {
          padding: [50, 50],
          maxZoom: 9,
          animate: false,
        });
      } catch (err) {
        // Fallback center if bounds are degenerate
        map.setView(selectedShipment.currentLocation.coords, 7);
      }
    }
  }, [shipments, selectedShipment]);

  // Recenter helper
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (selectedShipment) {
      map.setView(selectedShipment.currentLocation.coords, 8, { animate: false });
    } else {
      map.setView([20.5937, 78.9629], 5, { animate: false });
    }
  };

  const handleFitAll = () => {
    const map = mapInstanceRef.current;
    if (!map || shipments.length === 0) return;
    const coords = shipments.map(s => s.currentLocation.coords);
    const bounds = window.L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [60, 60], animate: false });
  };

  return (
    <div className="live-tracking-map-wrapper" style={{ position: 'relative', width: '100%', height, borderRadius: '14px', overflow: 'hidden' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Map Controls */}
      <div className="map-floating-controls">
        <button 
          className="map-control-btn" 
          title="Recenter on Active Shipment"
          onClick={handleRecenter}
        >
          <Locate size={16} />
          <span>Recenter</span>
        </button>
        <button 
          className="map-control-btn" 
          title="Fit All Fleet"
          onClick={handleFitAll}
        >
          <Maximize2 size={16} />
          <span>Fit Fleet</span>
        </button>
      </div>

      {/* Telemetry Indicator Tag */}
      <div className="map-telemetry-indicator">
        <span className="telemetry-live-beacon"></span>
        <span>Simulated GPS Stream • 8s Sync Active</span>
      </div>

      {/* Bottom Status Legend matching design reference */}
      <div className="map-tracking-legend">
        <div className="tracking-legend-item">
          <span className="dot dot-green"></span>
          <span>On Time</span>
        </div>
        <div className="tracking-legend-item">
          <span className="dot dot-red"></span>
          <span>Delayed</span>
        </div>
        <div className="tracking-legend-item">
          <span className="dot dot-orange"></span>
          <span>At Risk</span>
        </div>
        <div className="tracking-legend-item">
          <span className="dot" style={{ backgroundColor: '#64748b' }}></span>
          <span>Delivered</span>
        </div>
        {selectedShipment && (
          <div className="tracking-legend-item active-route-tag">
            <span className="dash-blue" style={{ backgroundColor: '#2563eb' }}></span>
            <span>Active Corridor ({selectedShipment.id})</span>
          </div>
        )}
      </div>
    </div>
  );
};
