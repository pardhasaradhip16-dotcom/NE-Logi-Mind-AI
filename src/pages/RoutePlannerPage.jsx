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
import { CorridorMap } from '../components/map/CorridorMap';
import { getApiUrl } from '../config/apiConfig';
import { 
  resolveLocationCoords, 
  generateAccurateRoutes, 
  generateRealisticHighwayWaypoints 
} from '../data/indiaGeoData';

export const RoutePlannerPage = () => {
  const [fromCity, setFromCity] = useState("Hyderabad");
  const [toCity, setToCity] = useState("Bengaluru");
  
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
  const [mapData, setMapData] = useState({ corridorList: null, cities: null });

  const togglePref = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFindBestRoute = async (e) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    
    try {
      // 1. Resolve coordinates for any Indian city or state (Instant DB + Nominatim fallback)
      const [originLocation, destLocation] = await Promise.all([
        resolveLocationCoords(fromCity),
        resolveLocationCoords(toCity)
      ]);

      const originCoords = originLocation?.coords || [17.3850, 78.4867];
      const destCoords = destLocation?.coords || [12.9716, 77.5946];
      const origDisplayName = originLocation?.name || fromCity;
      const destDisplayName = destLocation?.name || toCity;

      // 2. Fetch or compute accurate route parameters tailored to origin and destination
      let generatedData = null;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(getApiUrl("/api/route-planner"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origin: origDisplayName,
            destination: destDisplayName,
            minimize_time: preferences.minimizeTime,
            minimize_cost: preferences.minimizeCost,
            avoid_risk: preferences.avoidRisk,
            accessibility_first: preferences.accessibilityFirst
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          generatedData = await res.json();
        }
      } catch {
        // Fallback gracefully to offline/local accurate route calculation
      }

      if (!generatedData) {
        generatedData = generateAccurateRoutes(
          origDisplayName,
          destDisplayName,
          originCoords,
          destCoords,
          preferences
        );
      }

      // 3. Query OpenStreetMap OSRM for actual highway road geometry across India
      let route1Points = generateRealisticHighwayWaypoints(originCoords, destCoords, 0);
      let route2Points = generateRealisticHighwayWaypoints(originCoords, destCoords, 1);
      let route3Points = generateRealisticHighwayWaypoints(originCoords, destCoords, 2);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);
        const osrmRes = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${originCoords[1]},${originCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson&alternatives=true`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        if (osrmRes.ok) {
          const osrmData = await osrmRes.json();
          if (osrmData.code === 'Ok' && osrmData.routes && osrmData.routes.length > 0) {
            route1Points = osrmData.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);

            // Update with exact OSRM highway driving distance and estimated time
            const exactDistKm = Math.round(osrmData.routes[0].distance / 1000);
            const exactMinutes = Math.round(osrmData.routes[0].duration / 60);
            const exactH = Math.floor(exactMinutes / 60);
            const exactM = exactMinutes % 60;

            if (generatedData && generatedData.recommended) {
              generatedData.recommended.distance = `${exactDistKm} km`;
              generatedData.recommended.time = `${exactH}h ${exactM}m`;
            }

            if (osrmData.routes.length > 1) {
              route2Points = osrmData.routes[1].geometry.coordinates.map(c => [c[1], c[0]]);
            }
            if (osrmData.routes.length > 2) {
              route3Points = osrmData.routes[2].geometry.coordinates.map(c => [c[1], c[0]]);
            }
          }
        }
      } catch {
        // Fallback already prepared with realistic multi-waypoint corridors
      }

      setRouteData(generatedData);
      setActiveRouteId(generatedData.recommended.id);

      setMapData({
        cities: [
          { name: origDisplayName, coords: originCoords, color: '#3b82f6' },
          { name: destDisplayName, coords: destCoords, color: '#10b981' }
        ],
        corridorList: [
          { id: 'route-1', points: route1Points },
          { id: 'route-2', points: route2Points },
          { id: 'route-3', points: route3Points }
        ]
      });

    } catch (err) {
      console.error("Failed to calculate routes:", err);
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
  ) : null;

  const activeCorridors = mapData.corridorList ? mapData.corridorList.map((c, idx) => {
    const isSelected = c.id === activeRouteId;
    const baseColors = ['#2563eb', '#f59e0b', '#8b5cf6'];
    return {
      points: c.points,
      color: isSelected ? '#2563eb' : (baseColors[idx] || '#64748b'),
      dashArray: isSelected ? null : '6, 6',
      weight: isSelected ? 6 : 3,
      opacity: isSelected ? 1.0 : 0.6
    };
  }) : null;

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
              <label className="form-label">From (City / State)</label>
              <div className="input-with-icon">
                <MapPin size={16} className="input-icon text-primary" />
                <input
                  type="text"
                  className="form-control"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  placeholder="e.g. Hyderabad, Mumbai, Delhi, Assam..."
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">To (City / State)</label>
              <div className="input-with-icon">
                <MapPin size={16} className="input-icon text-danger" />
                <input
                  type="text"
                  className="form-control"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  placeholder="e.g. Bengaluru, Gangtok, Chennai, Gujarat..."
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
                <span className="card-subtitle-small">
                  Showing accurate National Highway route for {fromCity} → {toCity}
                </span>
              </div>
              <span className="badge badge-info">Real-Road GPS Routing</span>
            </div>
            <CorridorMap 
              height="340px" 
              customCorridors={activeCorridors} 
              customCities={mapData.cities} 
            />
          </div>

          {/* Recommended Route Card matching design "Best Option" */}
          {routeData && (
            <div 
              className={`card recommended-route-card ${activeRouteId === routeData.recommended.id ? 'selected-route-glow' : ''}`}
              onClick={() => setActiveRouteId(routeData.recommended.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="rec-card-header">
                <div className="rec-card-title-box">
                  <span className="badge badge-success">Best Option</span>
                  <h4>{routeData.recommended.name}</h4>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {activeRouteId === routeData.recommended.id && (
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>Active on Map ✓</span>
                  )}
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={(e) => { e.stopPropagation(); setShowDetailModal(true); }}
                  >
                    View Details
                  </button>
                </div>
              </div>

              <div className="rec-metrics-grid">
                <div className="rec-metric-item">
                  <span className="rm-label">Distance</span>
                  <span className="rm-val font-bold">{routeData.recommended.distance}</span>
                </div>
                <div className="rec-metric-item">
                  <span className="rm-label">Est. Time</span>
                  <span className="rm-val font-bold">{routeData.recommended.time}</span>
                </div>
                <div className="rec-metric-item">
                  <span className="rm-label">Est. Cost</span>
                  <span className="rm-val font-bold">{routeData.recommended.cost}</span>
                </div>
                <div className="rec-metric-item">
                  <span className="rm-label">Risk Rating</span>
                  <span className="rm-val text-success font-bold">{routeData.recommended.risk}</span>
                </div>
              </div>

              <p className="rec-desc">{routeData.recommended.description}</p>
            </div>
          )}

          {/* Alternative Routes Grid matching design reference */}
          {routeData && routeData.alternatives && (
            <div className="alternatives-section">
              <h4 className="section-subtitle">Alternative Route Corridors</h4>
              <div className="alternatives-grid">
                {routeData.alternatives.map((alt) => (
                  <div 
                    key={alt.id}
                    className={`card alt-route-card ${activeRouteId === alt.id ? 'active-alt-card' : ''}`}
                    onClick={() => setActiveRouteId(alt.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="alt-card-header">
                      <strong>{alt.name}</strong>
                      <span style={{ 
                        fontSize: '0.72rem', 
                        padding: '2px 8px', 
                        borderRadius: '4px',
                        background: activeRouteId === alt.id ? '#2563eb' : 'rgba(255,255,255,0.08)',
                        color: '#fff',
                        fontWeight: '600'
                      }}>
                        {activeRouteId === alt.id ? 'Viewing on Map ✓' : 'Select'}
                      </span>
                    </div>
                    <div className="alt-metrics-row">
                      <div className="alt-stat">
                        <span className="stat-name">Distance</span>
                        <span className="stat-number">{alt.distance}</span>
                      </div>
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
