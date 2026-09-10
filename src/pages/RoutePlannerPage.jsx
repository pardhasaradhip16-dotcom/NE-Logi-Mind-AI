import React, { useState, useEffect } from 'react';
import { 
  Route, 
  MapPin, 
  Clock, 
  DollarSign, 
  ShieldAlert, 
  Check, 
  ArrowRight,
  Sparkles, 
  Sliders, 
  ChevronRight, 
  Compass, 
  Info 
} from 'lucide-react';
import { ROUTE_RECOMMENDATION_DATA } from '../data/mockData';
import { CorridorMap } from '../components/map/CorridorMap';
import { getApiUrl } from '../config/apiConfig';

export const RoutePlannerPage = () => {
  const [fromCity, setFromCity] = useState("Guwahati");
  const [toCity, setToCity] = useState("Gangtok");
  
  const [preferences, setPreferences] = useState({
    minimizeTime: true,
    minimizeCost: false,
    avoidRisk: true,
    accessibilityFirst: false,
  });

  const [activeRouteId, setActiveRouteId] = useState('route-1');
  const [isSearching, setIsSearching] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const [routeData, setRouteData] = useState(null);
  const [mapData, setMapData] = useState({ corridors: null, cities: null });

  const togglePref = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const geocodeCity = async (cityName) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&countrycodes=in`);
      const data = await res.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (e) {
      console.warn("Geocode failed for", cityName);
    }
    return null;
  };

  const handleFindBestRoute = async (e) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    
    try {
      const payload = {
        origin: fromCity,
        destination: toCity,
        minimize_time: preferences.minimizeTime,
        minimize_cost: preferences.minimizeCost,
        avoid_risk: preferences.avoidRisk,
        accessibility_first: preferences.accessibilityFirst
      };

      const [res, originCoords, destCoords] = await Promise.all([
        fetch(getApiUrl("/api/route-planner"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }),
        geocodeCity(fromCity),
        geocodeCity(toCity)
      ]);
      
      const data = await res.json();
      setRouteData(data);
      setActiveRouteId(data.recommended.id);

      if (originCoords && destCoords) {
        const midLat = (originCoords[0] + destCoords[0]) / 2;
        const midLng = (originCoords[1] + destCoords[1]) / 2;
        const dLat = destCoords[0] - originCoords[0];
        const dLng = destCoords[1] - originCoords[1];

        // Smooth natural highway waypoint vectors
        let route1Points = [
          originCoords,
          [midLat + dLng * 0.12, midLng - dLat * 0.12],
          destCoords
        ];
        let route2Points = [
          originCoords,
          [midLat + dLng * 0.28 + 0.15, midLng - dLat * 0.28 - 0.15],
          destCoords
        ];
        let route3Points = [
          originCoords,
          [midLat - dLng * 0.25 - 0.15, midLng + dLat * 0.25 + 0.15],
          destCoords
        ];

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1200);
          const osrmRes = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${originCoords[1]},${originCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson&alternatives=3`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);
          if (osrmRes.ok) {
            const osrmData = await osrmRes.json();
            if (osrmData.code === 'Ok' && osrmData.routes.length > 0) {
              route1Points = osrmData.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
              if (osrmData.routes.length > 1) {
                route2Points = osrmData.routes[1].geometry.coordinates.map(c => [c[1], c[0]]);
              }
              if (osrmData.routes.length > 2) {
                route3Points = osrmData.routes[2].geometry.coordinates.map(c => [c[1], c[0]]);
              }
            }
          }
        } catch {
          // Graceful silent fallback to natural vector corridors without console noise
        }

        setMapData({
          cities: [
            { name: fromCity, coords: originCoords, color: '#3b82f6' },
            { name: toCity, coords: destCoords, color: '#10b981' }
          ],
          corridors: [
            { points: route1Points, color: '#3b82f6', dashArray: null, weight: 5 }, 
            { points: route2Points, color: '#f59e0b', dashArray: '6,6', weight: 4 }, 
            { points: route3Points, color: '#ef4444', dashArray: '6,6', weight: 4 } 
          ]
        });
      } else {
        setMapData({ corridors: null, cities: null });
      }

    } catch (err) {
      console.error("Failed to fetch routes", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Run on initial mount
  useEffect(() => {
    handleFindBestRoute();
  }, []);

  const selectedRoute = routeData ? (
    routeData.recommended.id === activeRouteId 
      ? routeData.recommended 
      : routeData.alternatives.find(r => r.id === activeRouteId) || routeData.recommended
  ) : ROUTE_RECOMMENDATION_DATA.recommended;

  return (
    <div className="page-container route-planner-page">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Smart Route Recommendation</h1>
        <p className="page-subtitle">Multi-criteria routing engine balancing time, toll costs, terrain accessibility, and real-time hazard avoidance.</p>
      </div>

      <div className="route-planner-grid">
        {/* Left Column: Route Form & Multi-Criteria Preferences */}
        <div className="card route-form-card">
          <div className="card-header">
            <h3 className="card-title">Routing Parameters</h3>
            <Sliders size={16} className="text-primary" />
          </div>

          <form onSubmit={handleFindBestRoute}>
            <div className="form-group">
              <label className="form-label">From</label>
              <div className="input-with-icon">
                <MapPin size={16} className="input-icon text-primary" />
                <input
                  type="text"
                  className="form-control"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  placeholder="Origin..."
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">To</label>
              <div className="input-with-icon">
                <MapPin size={16} className="input-icon text-danger" />
                <input
                  type="text"
                  className="form-control"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  placeholder="Destination..."
                />
              </div>
            </div>

            {/* Preferences Checkbox Group matching design reference */}
            <div className="preferences-block">
              <label className="pref-heading">Optimization Preferences</label>
              
              <label className="custom-checkbox-row">
                <input
                  type="checkbox"
                  checked={preferences.minimizeTime}
                  onChange={() => togglePref('minimizeTime')}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">Minimize Time</span>
              </label>

              <label className="custom-checkbox-row">
                <input
                  type="checkbox"
                  checked={preferences.minimizeCost}
                  onChange={() => togglePref('minimizeCost')}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">Minimize Cost</span>
              </label>

              <label className="custom-checkbox-row">
                <input
                  type="checkbox"
                  checked={preferences.avoidRisk}
                  onChange={() => togglePref('avoidRisk')}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">Avoid Risk</span>
              </label>

              <label className="custom-checkbox-row">
                <input
                  type="checkbox"
                  checked={preferences.accessibilityFirst}
                  onChange={() => togglePref('accessibilityFirst')}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">Accessibility First</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-3" disabled={isSearching}>
              {isSearching ? (
                <span className="spinner-sm"></span>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Find Best Route</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Presets matching design chips */}
          <div className="presets-row">
            <span className="presets-label">Presets:</span>
            <button className="chip-btn active" onClick={() => setPreferences({ minimizeTime: true, minimizeCost: false, avoidRisk: true, accessibilityFirst: false })}>Fastest Safe</button>
            <button className="chip-btn" onClick={() => setPreferences({ minimizeTime: false, minimizeCost: true, avoidRisk: false, accessibilityFirst: true })}>Low Toll</button>
            <button className="chip-btn" onClick={() => setPreferences({ minimizeTime: false, minimizeCost: false, avoidRisk: true, accessibilityFirst: true })}>Zero Risk</button>
          </div>
        </div>

        {/* Right Column: Interactive Map & Route Recommendations */}
        <div className="route-results-column">
          {/* Top: Interactive Corridor Map with Route Layers */}
          <div className="card route-map-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Corridor Multi-Path Analysis</h3>
                <span className="card-subtitle-small">Showing Recommended vs Alternative Corridors with Risk Buffer Zones</span>
              </div>
              <span className="badge badge-info">Multi-Path Active</span>
            </div>
            <CorridorMap 
              height="320px" 
              center={[17.2, 80.5]} 
              zoom={7} 
              customCorridors={mapData.corridors} 
              customCities={mapData.cities} 
            />
          </div>

          {/* Recommended Route Card matching design "Best Option" */}
          {routeData && (
            <div className={`card recommended-route-card ${activeRouteId === routeData.recommended.id ? 'selected-route-glow' : ''}`}>
              <div className="rec-card-header">
                <div className="rec-card-title-box">
                  <span className="badge badge-success">Best Option</span>
                  <h4>{routeData.recommended.name}</h4>
                </div>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowDetailModal(true)}
                >
                  View Details
                </button>
              </div>

              <div className="rec-metrics-grid">
                <div className="rec-metric-item">
                  <span className="rm-label">Time</span>
                  <span className="rm-val font-bold">{routeData.recommended.time}</span>
                </div>
                <div className="rec-metric-item">
                  <span className="rm-label">Cost</span>
                  <span className="rm-val font-bold">{routeData.recommended.cost}</span>
                </div>
                <div className="rec-metric-item">
                  <span className="rm-label">Risk</span>
                  <span className="rm-val text-success font-bold">{routeData.recommended.risk}</span>
                </div>
                <div className="rec-metric-item">
                  <span className="rm-label">Accessibility</span>
                  <span className="rm-val text-primary font-bold">{routeData.recommended.accessibility}</span>
                </div>
              </div>

              <p className="rec-desc">{routeData.recommended.description}</p>
            </div>
          )}

          {/* Alternative Routes Grid matching design reference */}
          {routeData && (
            <div className="alternatives-section">
              <h4 className="section-subtitle">Alternative Routes</h4>
              <div className="alternatives-grid">
                {routeData.alternatives.map((alt) => (
                  <div 
                    key={alt.id}
                    className={`card alt-route-card ${activeRouteId === alt.id ? 'active-alt-card' : ''}`}
                  >
                    <div className="alt-card-header">
                      <strong>{alt.name}</strong>
                      <button 
                        className="link-btn-alt"
                        onClick={() => setActiveRouteId(alt.id)}
                      >
                        View
                      </button>
                    </div>
                    <div className="alt-metrics-row">
                      <div className="alt-stat">
                        <span className="stat-name">Time</span>
                        <span className="stat-number">{alt.time}</span>
                      </div>
                      <div className="alt-stat">
                        <span className="stat-name">Cost</span>
                        <span className="stat-number">{alt.cost}</span>
                      </div>
                      <div className="alt-stat">
                        <span className="stat-name">Risk</span>
                        <span className={`stat-number ${
                          alt.risk === 'Low' ? 'text-success' : alt.risk === 'High' ? 'text-danger' : 'text-warning'
                        }`}>
                          {alt.risk}
                        </span>
                      </div>
                      <div className="alt-stat">
                        <span className="stat-name">Accessibility</span>
                      <span className={`stat-number ${
                        alt.accessibility === 'High' ? 'text-primary' : 'text-muted'
                      }`}>
                        {alt.accessibility}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailModal && (
        <div className="modal-backdrop" onClick={() => setShowDetailModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Corridor Alpha Telematics & Toll Breakdown</h3>
              <button className="modal-close-btn" onClick={() => setShowDetailModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-stats-grid">
                <div><strong>Distance:</strong> {selectedRoute?.distance || '394 km'}</div>
                <div><strong>Est. Fuel:</strong> {selectedRoute?.fuel || '48 Liters'}</div>
                <div><strong>Tolls:</strong> {selectedRoute?.cost || '₹4,500'}</div>
                <div><strong>Terrain Score:</strong> {selectedRoute?.accessibility || 'High'}</div>
              </div>
              <p style={{ marginTop: '1rem', color: '#475569', fontSize: '0.9rem' }}>
                This corridor incorporates smart ITS (Intelligent Transport Systems) with automated incident detection and dedicated emergency truck turnouts every 15 km.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDetailModal(false)}>Close</button>
              <button className="btn btn-primary" onClick={() => { alert("Dispatching dispatch plan to telemetry receivers."); setShowDetailModal(false); }}>
                Dispatch to Fleet Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
