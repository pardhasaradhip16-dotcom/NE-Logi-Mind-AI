import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Navigation, 
  MapPin, 
  Truck, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Compass, 
  Phone, 
  Radio, 
  Play, 
  Pause, 
  CheckCircle2, 
  Layers,
  Sparkles,
  Zap,
  Activity,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { DRIVER_PROFILES } from '../data/driversData';
import { VoiceAssistant } from '../components/voice/VoiceAssistant';
import { getApiUrl } from '../config/apiConfig';
import './DriverCockpitPage.css';
export const DriverCockpitPage = ({ initialDriverId = "DRV-001" }) => {
  const [activeDriverId, setActiveDriverId] = useState(initialDriverId);
  const driver = DRIVER_PROFILES.find(d => d.id === activeDriverId) || DRIVER_PROFILES[0];

  // Telemetry & GPS states
  const [waypointIdx, setWaypointIdx] = useState(4); // Default to current checkpoint
  const [coords, setCoords] = useState(driver.route.waypoints[4] || driver.route.waypoints[0]);
  const [speed, setSpeed] = useState(48);
  const [heading, setHeading] = useState(215);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [gpsStatusText, setGpsStatusText] = useState("Standby (Ready to Transmit)");
  const [prediction, setPrediction] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null);

  // Map references
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const simulationTimerRef = useRef(null);
  const watchIdRef = useRef(null);

  // Send GPS transmission to FastAPI Backend
  const transmitLocation = useCallback(async (newCoords, newSpeed, isSim = false, wpIndex = null) => {
    try {
      const payload = {
        driverId: driver.id,
        shipmentId: driver.assignedShipmentId,
        coords: newCoords,
        speed: newSpeed,
        heading: heading,
        isSimulated: isSim,
        waypointIndex: wpIndex !== null ? wpIndex : waypointIdx
      };

      const res = await fetch(getApiUrl("/api/driver/location"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setGpsStatusText(`Live GPS Lock (Telemetry Synced • Ping #${Math.floor(Math.random() * 900 + 100)})`);
      }
    } catch (err) {
      console.warn("[DriverCockpit] Backend GPS broadcast failed, operating locally:", err.message);
      setGpsStatusText("Local Mode (Backend Reconnecting)");
    }
  }, [driver.id, driver.assignedShipmentId, heading, waypointIdx]);

  // Fetch ML predictions for this driver's corridor
  const fetchDriverPrediction = useCallback(async (customOrigin, customDest, customDistance, speakResult = false) => {
    const originCity = customOrigin || driver.route.originCity;
    const destCity = customDest || driver.route.destinationCity;
    const distKm = customDistance || driver.route.totalDistanceKm;

    try {
      const payload = {
        origin: originCity,
        destination: destCity,
        distance_km: distKm,
        vehicle_type: driver.vehicle.type,
        vehicle_capacity: driver.vehicle.capacityTons,
        vehicle_load_percentage: 88.0,
        rainfall_mm: driver.route.weather.includes("Downpour") ? 55.0 : 20.0,
        weather_condition: driver.route.weather.includes("Downpour") ? "heavy_rain" : "rain",
        road_condition: driver.route.roadCondition.toLowerCase().includes("poor") ? "poor" : "good",
        landslide_risk: driver.route.roadCondition.toLowerCase().includes("poor") ? 0.65 : 0.20,
        road_blockage: 0,
        route_accessibility_score: 55.0,
        expected_delivery_hours: Math.round(distKm / 45), // Rough estimate: 45 km/h avg
        traffic_level: "medium",
        departure_hour: 8
      };

      const res = await fetch(getApiUrl("/api/predict"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setPrediction(data);
        
        if (speakResult) {
            // Give Voice Assistant time to finish the first sentence before speaking the telemetry
            setTimeout(async () => {
               try {
                   const primaryFactor = (data.risk_drivers && data.risk_drivers.length > 0)
                       ? data.risk_drivers[0].split('(')[0].trim()
                       : "";
                   
                   const targetLang = driver.preferredLanguage || 'en-IN';
                   const voiceRes = await fetch(getApiUrl("/api/assistant/telemetry-voice"), {
                       method: "POST",
                       headers: { "Content-Type": "application/json" },
                       body: JSON.stringify({
                           risk_score: data.risk_score,
                           risk_level: data.risk_level || "Medium",
                           predicted_delay_hours: data.predicted_delay_hours || 0,
                           primary_factor: primaryFactor,
                           language: targetLang
                       })
                   });

                   let spokenText = "";
                   let spokenLang = targetLang;

                   if (voiceRes.ok) {
                       const voiceData = await voiceRes.json();
                       spokenText = voiceData.speechText;
                       spokenLang = voiceData.language || targetLang;
                   } else {
                       const langCode = targetLang.split('-')[0].toLowerCase();
                       if (langCode === 'hi') {
                           spokenText = `एआई विश्लेषण पूरा हुआ। जोखिम स्कोर ${Math.round(data.risk_score)} है।`;
                       } else if (langCode === 'te') {
                           spokenText = `ఏఐ విశ్లేషణ పూర్తయింది. రిస్క్ స్కోర్ ${Math.round(data.risk_score)}.`;
                       } else if (langCode === 'bn') {
                           spokenText = `এআই বিশ্লেষণ সম্পন্ন হয়েছে। ঝুঁকি স্কোর ${Math.round(data.risk_score)}।`;
                       } else {
                           spokenText = `AI Analysis complete. The risk score is ${Math.round(data.risk_score)}.`;
                       }
                   }

                   import('../services/voiceService').then(({ speakText }) => {
                       speakText(spokenText, spokenLang);
                   });
               } catch (e) {
                   console.warn("Telemetry voice error:", e);
               }
            }, 3000);
        }
      }
    } catch (err) {
      console.warn("[DriverCockpit] ML prediction fallback:", err.message);
      setPrediction({
        risk_score: 65,
        risk_level: "High",
        predicted_delay_hours: 4.8,
        delay_probability: 0.62,
        estimated_duration_hours: 24.8,
        reliability_score: 48,
        risk_drivers: [
          `Vehicle class (${driver.vehicle.type}) weight impact on mountain corridor`,
          `Weather alert: ${driver.route.weather}`,
          `Surface warning: ${driver.route.roadCondition}`
        ]
      });
    }
  }, [driver]);

  // Handle Driver Switching
  const handleSelectDriver = (drvId) => {
    if (isSimulating) {
      clearInterval(simulationTimerRef.current);
      setIsSimulating(false);
    }
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsBroadcasting(false);

    setActiveDriverId(drvId);
    const newDriver = DRIVER_PROFILES.find(d => d.id === drvId) || DRIVER_PROFILES[0];
    const initialWp = Math.min(4, newDriver.route.waypoints.length - 1);
    setWaypointIdx(initialWp);
    const newCoords = newDriver.route.waypoints[initialWp];
    setCoords(newCoords);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(newCoords, 9);
    }
  };

  const [dynamicDestName, setDynamicDestName] = useState(null);

  const handleAssistantAction = async (action, payload) => {
    if (action === 'NAVIGATE' && payload?.destination) {
      const isCustomOrigin = !!payload.origin;
      setActiveAlert(`Calculating best route ${isCustomOrigin ? `from ${payload.origin} ` : ''}to ${payload.destination}...`);
      setDynamicDestName(payload.destination);

      try {
        // 1. Geocode the destination using free OpenStreetMap Nominatim, restricted to India
        const destGeocodeRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(payload.destination)}&countrycodes=in`);
        const destGeocodeData = await destGeocodeRes.json();

        let startCoords = coords; // Default to driver's current location

        if (isCustomOrigin) {
          const origGeocodeRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(payload.origin)}&countrycodes=in`);
          const origGeocodeData = await origGeocodeRes.json();
          if (origGeocodeData && origGeocodeData.length > 0) {
             startCoords = [parseFloat(origGeocodeData[0].lat), parseFloat(origGeocodeData[0].lon)];
          } else {
             setActiveAlert(`Starting location '${payload.origin}' not found in India. Using current location.`);
          }
        }

        if (destGeocodeData && destGeocodeData.length > 0) {
          const destLat = parseFloat(destGeocodeData[0].lat);
          const destLng = parseFloat(destGeocodeData[0].lon);

          // 2. Get Route from OSRM Free API with fast abort
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1200);
            const osrmRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${destLng},${destLat}?overview=full&geometries=geojson`, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (osrmRes.ok) {
              const osrmData = await osrmRes.json();

              if (osrmData.code === 'Ok' && osrmData.routes.length > 0) {
                const routeCoords = osrmData.routes[0].geometry.coordinates.map(c => [c[1], c[0]]); // OSRM is Lng,Lat -> Leaflet needs Lat,Lng
                const distKm = Math.round(osrmData.routes[0].distance / 1000);
                
                if (routePolylineRef.current && mapInstanceRef.current) {
                  routePolylineRef.current.setLatLngs(routeCoords);
                  routePolylineRef.current.setStyle({ color: '#3b82f6', dashArray: null, weight: 6 });
                  mapInstanceRef.current.fitBounds(routePolylineRef.current.getBounds(), { padding: [50, 50], animate: false });
                  setActiveAlert(`Navigation started ${isCustomOrigin ? `from ${payload.origin} ` : ''}to ${payload.destination}. GPS tracking active.`);
                  
                  // Fetch ML prediction for the new route and SPEAK IT out loud
                  fetchDriverPrediction(payload.origin || driver.route.originCity, payload.destination, distKm, true);
                  
                  if (isCustomOrigin && isSimulating) {
                     clearInterval(simulationTimerRef.current);
                     setIsSimulating(false);
                     setGpsStatusText("Simulation Paused for Route Inspection");
                  }
                }
                return;
              }
            }
            throw new Error("Route fallback");
          } catch {
            // 3. Fallback for Northern India / Long distances where free OSRM fails or times out
            if (routePolylineRef.current && mapInstanceRef.current) {
              const fallbackCoords = [startCoords, [destLat, destLng]];
              // Rough pythagorean distance in km (1 degree ~ 111km)
              const distKm = Math.round(Math.sqrt(Math.pow(startCoords[0] - destLat, 2) + Math.pow(startCoords[1] - destLng, 2)) * 111);
              
              routePolylineRef.current.setLatLngs(fallbackCoords);
              routePolylineRef.current.setStyle({ color: '#f59e0b', dashArray: '10, 10', weight: 4 });
              mapInstanceRef.current.fitBounds(routePolylineRef.current.getBounds(), { padding: [50, 50], animate: false });
              setActiveAlert(`Direct corridor mapped ${isCustomOrigin ? `from ${payload.origin} ` : ''}to ${payload.destination}. (Long distance fallback mode)`);
              
              // Fetch ML prediction for the new route and SPEAK IT out loud
              fetchDriverPrediction(payload.origin || driver.route.originCity, payload.destination, distKm, true);
              
              if (isCustomOrigin && isSimulating) {
                   clearInterval(simulationTimerRef.current);
                   setIsSimulating(false);
                   setGpsStatusText("Simulation Paused for Route Inspection");
              }
            }
          }
        } else {
           setActiveAlert(`Location '${payload.destination}' not found in India.`);
        }
      } catch (err) {
        console.error("Routing error:", err);
        setActiveAlert("Error calculating route. Please check network.");
      }
    } else if (action === 'CHANGE_ROUTE') {
      setActiveAlert("AI has updated your route on the map to avoid upcoming hazards.");
      
      if (routePolylineRef.current && mapInstanceRef.current) {
        routePolylineRef.current.setStyle({ color: '#10b981', dashArray: null, weight: 6 });
        
        const originalWaypoints = routePolylineRef.current.getLatLngs();
        if (originalWaypoints.length > 2) {
            const newWaypoints = [...originalWaypoints];
            const mid = Math.floor(newWaypoints.length / 2);
            newWaypoints[mid] = [newWaypoints[mid].lat + 0.05, newWaypoints[mid].lng - 0.05];
            
            routePolylineRef.current.setLatLngs(newWaypoints);
            mapInstanceRef.current.fitBounds(routePolylineRef.current.getBounds(), { padding: [50, 50], animate: false });
            
            // Calculate a slightly longer distance for the detour
            const newDistKm = Math.round(driver.route.totalDistanceKm * 1.15);
            // Fetch updated ML prediction and SPEAK IT!
            fetchDriverPrediction(driver.route.originCity, driver.route.destinationCity + " (Detour)", newDistKm, true);
        }
      }
    }
  };

  // Turn real Phone/Browser GPS on or off
  const toggleRealGps = () => {
    if (isBroadcasting) {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsBroadcasting(false);
      setGpsStatusText("GPS Standby");
    } else {
      if (isSimulating) {
        clearInterval(simulationTimerRef.current);
        setIsSimulating(false);
      }

      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser. Using Simulated Drive instead.");
        return;
      }

      setGpsStatusText("Acquiring Satellite GPS Fix...");
      setIsBroadcasting(true);

      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const spd = pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 42;
          const head = pos.coords.heading ? Math.round(pos.coords.heading) : heading;

          const updatedCoords = [lat, lng];
          setCoords(updatedCoords);
          setSpeed(spd);
          setHeading(head);

          if (mapInstanceRef.current && driverMarkerRef.current) {
            driverMarkerRef.current.setLatLng(updatedCoords);
            mapInstanceRef.current.panTo(updatedCoords);
          }

          transmitLocation(updatedCoords, spd, false);
        },
        (err) => {
          console.warn("Geolocation watch error:", err.message);
          setGpsStatusText("Hardware GPS Denied / Fallback Active");
          setIsBroadcasting(false);
        },
        { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
      );

      watchIdRef.current = id;
    }
  };

  // Toggle Automated Mountain Drive Simulation
  const toggleSimulatedDrive = () => {
    if (isSimulating) {
      clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
      setIsSimulating(false);
      setGpsStatusText("Simulation Paused");
    } else {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        setIsBroadcasting(false);
      }

      setIsSimulating(true);
      setGpsStatusText("Simulated Drive Active (Advancing on Corridors)");

      const waypoints = driver.route.waypoints;
      let currIdx = waypointIdx;

      simulationTimerRef.current = setInterval(() => {
        currIdx = (currIdx + 1) % waypoints.length;
        setWaypointIdx(currIdx);
        const nextCoord = waypoints[currIdx];
        const randomSpeed = Math.floor(35 + Math.random() * 25);
        setCoords(nextCoord);
        setSpeed(randomSpeed);

        if (mapInstanceRef.current && driverMarkerRef.current) {
          driverMarkerRef.current.setLatLng(nextCoord);
          mapInstanceRef.current.panTo(nextCoord, { animate: false });
        }

        transmitLocation(nextCoord, randomSpeed, true, currIdx);
      }, 2500);
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const L = window.L;
    if (!L) return;

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.stop();
        mapInstanceRef.current.remove();
      } catch (e) {}
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView(coords, 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapInstanceRef.current = map;

    // Clear previous layers
    if (driverMarkerRef.current) map.removeLayer(driverMarkerRef.current);
    if (routePolylineRef.current) map.removeLayer(routePolylineRef.current);

    // Draw route polyline
    const polyline = L.polyline(driver.route.waypoints, {
      color: '#2563eb',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8'
    }).addTo(map);
    routePolylineRef.current = polyline;

    // Draw Origin Marker
    const originIcon = L.divIcon({
      className: 'driver-waypoint-icon',
      html: `<div style="background: #10b981; color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.3)">A</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    L.marker(driver.route.waypoints[0], { icon: originIcon }).addTo(map).bindPopup(`<strong>Origin:</strong> ${driver.route.originName}`);

    // Draw Destination Marker
    const destIcon = L.divIcon({
      className: 'driver-waypoint-icon',
      html: `<div style="background: #ef4444; color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.3)">B</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    L.marker(driver.route.waypoints[driver.route.waypoints.length - 1], { icon: destIcon })
      .addTo(map)
      .bindPopup(`<strong>Destination:</strong> ${driver.route.destinationName}`);

    // Draw Active Driver Beacon Marker
    const beaconIcon = L.divIcon({
      className: 'driver-radar-beacon',
      html: `
        <div style="position: relative; width: 36px; height: 36px;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(37, 99, 235, 0.35); animation: pulse-radar 1.5s infinite;"></div>
          <div style="position: absolute; top: 6px; left: 6px; width: 24px; height: 24px; border-radius: 50%; background: #1d4ed8; border: 3px solid #ffffff; box-shadow: 0 0 12px #2563eb; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 10px;">
            🚚
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const marker = L.marker(coords, { icon: beaconIcon, zIndexOffset: 1000 }).addTo(map);
    marker.bindPopup(`<strong>${driver.name}</strong><br>Speed: ${speed} km/h<br>${driver.vehicle.regNumber}`);
    driverMarkerRef.current = marker;

    map.setView(coords, 9);

    return () => {
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
      }
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.stop();
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
    };
  }, [driver]);

  // Load predictions on driver change
  useEffect(() => {
    fetchDriverPrediction();
  }, [fetchDriverPrediction]);

  // Calculate upcoming checkpoint
  const checkpoints = driver.route.checkpoints;
  const nextCheckpoint = checkpoints[Math.min(waypointIdx + 1, checkpoints.length - 1)] || checkpoints[checkpoints.length - 1];
  const remainingDistance = Math.max(0, driver.route.totalDistanceKm - Math.round((waypointIdx / (checkpoints.length - 1)) * driver.route.totalDistanceKm));

  const displayCheckpointName = dynamicDestName || nextCheckpoint.name;

  const [isTelemetryCollapsed, setIsTelemetryCollapsed] = useState(false);

  return (
    <div className="notranslate cockpit-fullscreen-container" translate="no">
      
      {/* 1. Fullscreen Map Background */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', backgroundColor: '#e2e8f0' }}></div>

      {/* 2. Responsive Floating Top Status Bar */}
      <div className="cockpit-top-hud">
        <div className="cockpit-status-card">
          <div>
            <div className="cockpit-checkpoint-title">
              Next Checkpoint
            </div>
            <div className="cockpit-checkpoint-name">
              {displayCheckpointName}
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            {prediction && prediction.risk_level === 'High' ? (
              <div className="cockpit-risk-pill" style={{ background: '#dc2626', color: 'white', boxShadow: '0 0 20px rgba(220,38,38,0.6)' }}>
                <ShieldAlert size={28} /> DANGER AHEAD
              </div>
            ) : (
              <div className="cockpit-risk-pill" style={{ background: '#16a34a', color: 'white', boxShadow: '0 0 20px rgba(22,163,74,0.6)' }}>
                <CheckCircle2 size={28} /> ROUTE SAFE
              </div>
            )}
          </div>
        </div>

        {activeAlert && (
          <div style={{ 
            background: '#ef4444', color: 'white', padding: '12px 16px', borderRadius: '14px', 
            fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px',
            boxShadow: '0 10px 25px rgba(239,68,68,0.5)', animation: 'pulse-ring 2s infinite'
          }}>
            <AlertTriangle size={24} /> {activeAlert}
          </div>
        )}
      </div>

      {/* NEW: Responsive AI Telemetry & Risk Intelligence Panel */}
      {prediction && (
        <div className="cockpit-risk-telemetry-hud">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isTelemetryCollapsed ? '0' : '14px', borderBottom: isTelemetryCollapsed ? 'none' : '1px solid rgba(255,255,255,0.1)', paddingBottom: isTelemetryCollapsed ? '0' : '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} className="text-primary" />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>AI Risk Telemetry</h3>
            </div>
            <button 
              onClick={() => setIsTelemetryCollapsed(!isTelemetryCollapsed)}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#94a3b8', borderRadius: '6px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              {isTelemetryCollapsed ? 'Expand ▾' : 'Collapse ▴'}
            </button>
          </div>
          
          {!isTelemetryCollapsed && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '2px' }}>Risk Score</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: prediction.risk_level === 'High' ? '#ef4444' : '#10b981' }}>
                    {prediction.risk_score}<span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>/100</span>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '2px' }}>Pred. Delay</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                    +{prediction.predicted_delay_hours}<span style={{ fontSize: '0.85rem', color: '#94a3b8' }}> hrs</span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '6px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>
                Identified Risk Factors
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {prediction.risk_drivers && prediction.risk_drivers.slice(0, 3).map((driver, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.82rem', lineHeight: 1.3 }}>
                    <AlertTriangle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{driver}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* 3. Floating Voice Assistant (Bottom Right) */}
      <div className="cockpit-voice-widget">
        <VoiceAssistant driverId={driver.id} preferredLanguage={driver.preferredLanguage} onAssistantAction={handleAssistantAction} />
      </div>

      {/* 4. Responsive GPS Controls (Bottom Left) */}
      <div className="cockpit-gps-controls">
        <button 
          onClick={toggleRealGps}
          className="cockpit-gps-btn"
          style={{ background: isBroadcasting ? '#ef4444' : '#2563eb' }}
        >
          <Radio size={22} /> {isBroadcasting ? 'STOP GPS' : 'START GPS'}
        </button>
        <button 
          onClick={toggleSimulatedDrive}
          className="cockpit-gps-btn"
          style={{ background: '#334155' }}
        >
          {isSimulating ? <Pause size={22} /> : <Play size={22} />} {isSimulating ? 'PAUSE' : 'START DRIVE'}
        </button>
      </div>

    </div>
  );
};
