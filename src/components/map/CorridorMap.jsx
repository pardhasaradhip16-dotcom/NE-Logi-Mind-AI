import React, { useEffect, useRef } from 'react';

export const CorridorMap = ({
  shipments = [],
  height = "380px",
  center = [17.5, 79.5],
  zoom = 6,
  interactive = true,
  selectedShipmentId = null,
  onSelectShipment = null,
  customCorridors = null,
  customCities = null,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

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
      center: center,
      zoom: zoom,
      zoomControl: interactive,
      dragging: interactive,
      scrollWheelZoom: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: 'abc',
    }).addTo(map);

    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);

    const createPin = (color, label = '') => {
      return window.L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background: ${color};
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 0 8px ${color}cc, 0 2px 4px rgba(0,0,0,0.3);
            position: relative;
          ">
            ${label ? `<span style="position:absolute; left:16px; top:-6px; white-space:nowrap; font-size:11px; font-weight:700; color:#0f172a; background:rgba(255,255,255,0.95); padding:2px 6px; border-radius:4px; border:1px solid #cbd5e1; box-shadow:0 2px 5px rgba(0,0,0,0.15);">${label}</span>` : ''}
          </div>
        `,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });
    };

    const createVehicleIcon = (color, carrier = '', status = '') => {
      return window.L.divIcon({
        className: 'custom-vehicle-pin',
        html: `
          <div style="
            display: flex;
            align-items: center;
            gap: 4px;
            background: #0f172a;
            color: #ffffff;
            padding: 4px 8px;
            border-radius: 20px;
            border: 2px solid ${color};
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            white-space: nowrap;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 11px;
            font-weight: 700;
          ">
            <span style="
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: ${color};
              box-shadow: 0 0 6px ${color};
            "></span>
            <span>🚛 ${carrier}</span>
          </div>
        `,
        iconSize: [100, 24],
        iconAnchor: [50, 12],
      });
    };

    const corridors = (customCorridors && customCorridors.length > 0) ? customCorridors : [
      {
        points: [[26.1445, 91.7362], [26.5400, 90.5500], [26.5000, 89.5400], [26.7271, 88.3953], [27.3389, 88.6065]],
        color: '#10b981', dashArray: null, status: 'On Time',
      },
      {
        points: [[26.1445, 91.7362], [26.0680, 91.8150], [25.9030, 91.8790], [25.5788, 91.8933]],
        color: '#10b981', dashArray: null, status: 'On Time',
      },
      {
        points: [[25.6751, 94.1086], [25.5500, 94.0500], [25.3200, 94.0200], [24.8170, 93.9368]],
        color: '#f59e0b', dashArray: '6, 6', status: 'Delayed',
      },
      {
        points: [[23.8315, 91.2868], [23.7271, 92.7176]],
        color: '#10b981', dashArray: null, status: 'On Time',
      },
    ];

    const bounds = window.L.latLngBounds();

    corridors.forEach(c => {
      if (!c.points || !Array.isArray(c.points) || c.points.length === 0) return;
      
      // Outer subtle casing for glowing corridor effect
      window.L.polyline(c.points, {
        color: c.color,
        weight: 8,
        opacity: 0.25,
      }).addTo(map);

      // Main corridor route line
      window.L.polyline(c.points, {
        color: c.color,
        weight: 4,
        opacity: 0.95,
        dashArray: c.dashArray,
      }).addTo(map);
      
      c.points.forEach(p => {
        if (p && Array.isArray(p) && p.length === 2) {
          bounds.extend(p);
        }
      });
    });

    const cities = (customCities && customCities.length > 0) ? customCities : [
      { name: 'Guwahati', coords: [26.1445, 91.7362], color: '#10b981' },
      { name: 'Gangtok', coords: [27.3389, 88.6065], color: '#10b981' },
      { name: 'Shillong', coords: [25.5788, 91.8933], color: '#10b981' },
      { name: 'Kohima', coords: [25.6751, 94.1086], color: '#f59e0b' },
      { name: 'Imphal', coords: [24.8170, 93.9368], color: '#f59e0b' },
      { name: 'Agartala', coords: [23.8315, 91.2868], color: '#10b981' },
      { name: 'Aizawl', coords: [23.7271, 92.7176], color: '#10b981' },
    ];

    // Render unique city hubs
    const seenCityCoords = new Set();
    cities.forEach(city => {
      if (!city.coords || !Array.isArray(city.coords)) return;
      const key = `${city.coords[0].toFixed(3)},${city.coords[1].toFixed(3)}`;
      if (seenCityCoords.has(key)) return;
      seenCityCoords.add(key);

      window.L.marker(city.coords, {
        icon: createPin(city.color || '#3b82f6', city.name),
      }).addTo(map);
      bounds.extend(city.coords);
    });

    // Auto fit to bounds without animating transition to prevent leaflet_pos unmount races
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 10, animate: false });
    }

    // Render active shipments as moving vehicle markers
    shipments.forEach(shipment => {
      if (shipment.currentCoords && Array.isArray(shipment.currentCoords)) {
        const markerColor = shipment.status === 'On Time' ? '#10b981' : shipment.status === 'Delayed' ? '#f59e0b' : '#ef4444';
        
        const vehicleMarker = window.L.marker(shipment.currentCoords, {
          icon: createVehicleIcon(markerColor, shipment.carrier || shipment.id, shipment.status),
          zIndexOffset: 1000
        }).addTo(map);

        vehicleMarker.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; min-width: 180px;">
            <div style="font-weight:800; font-size:13px; color:#0f172a; margin-bottom:4px;">${shipment.id}</div>
            <div style="font-size:12px; color:#334155; font-weight:600;">${shipment.from} → ${shipment.to}</div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">Driver: <b>${shipment.carrier}</b></div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">ETA: <b>${shipment.eta}</b></div>
            <div style="margin-top:8px; display:inline-block; padding:3px 8px; border-radius:6px; font-size:11px; font-weight:700; background:${markerColor}18; color:${markerColor}; border:1px solid ${markerColor}40;">
              ● ${shipment.status}
            </div>
          </div>
        `);

        if (onSelectShipment) {
          vehicleMarker.on('click', () => onSelectShipment(shipment));
        }
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.stop();
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
    };
  }, [shipments, selectedShipmentId, customCorridors, customCities]);

  return (
    <div className="map-wrapper-card" style={{ position: 'relative', width: '100%', height, borderRadius: '12px', overflow: 'hidden' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      {/* Visual Status Legend matching design image */}
      <div className="map-legend-overlay">
        <div className="legend-entry">
          <span className="dot dot-green"></span>
          <span>On Time</span>
        </div>
        <div className="legend-entry">
          <span className="dot dot-orange"></span>
          <span>Delayed</span>
        </div>
        <div className="legend-entry">
          <span className="dot dot-red"></span>
          <span>High-Risk</span>
        </div>
        <div className="legend-entry">
          <span className="dash-blue"></span>
          <span>Planned Route</span>
        </div>
      </div>
    </div>
  );
};
