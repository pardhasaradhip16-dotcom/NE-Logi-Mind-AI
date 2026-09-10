import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  AlertOctagon, 
  Layers, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  MapPin,
  Compass,
  Truck,
  User
} from 'lucide-react';
import { NE_DRIVER_DIGITAL_TWINS } from '../data/mockData';
import { DRIVER_PROFILES } from '../data/driversData';
import { DigitalTwinMap } from '../components/map/DigitalTwinMap';

export const DigitalTwinPage = () => {
  const [selectedDriverId, setSelectedDriverId] = useState('DRV-001');
  const [selectedScenarioKey, setSelectedScenarioKey] = useState('Heavy Rainfall');
  const [intensity, setIntensity] = useState('High');
  const [isSimulating, setIsSimulating] = useState(false);
  const [dispatchAlert, setDispatchAlert] = useState(null);

  const currentTwin = NE_DRIVER_DIGITAL_TWINS[selectedDriverId] || NE_DRIVER_DIGITAL_TWINS['DRV-001'];
  const currentScenario = currentTwin.scenarios?.[selectedScenarioKey] || currentTwin.insights;
  const currentImpact = currentTwin.scenarioImpact;

  const handleRunSimulation = (e) => {
    e.preventDefault();
    setIsSimulating(true);
    setDispatchAlert(null);
    setTimeout(() => {
      setIsSimulating(false);
    }, 500);
  };

  const handleApplyReroute = () => {
    setDispatchAlert(`Autonomous bypass route transmitted live to ${currentTwin.driverName}'s cockpit (${currentTwin.carrier}).`);
    setTimeout(() => {
      setDispatchAlert(null);
    }, 6000);
  };

  return (
    <div className="page-container digital-twin-page">
      {/* Page Title & Mission */}
      <div className="page-header">
        <h1 className="page-title">Digital Twin Simulation</h1>
        <p className="page-subtitle">Stress-test logistics corridors against extreme weather, landslides, and infrastructure failure scenarios across North-East India.</p>
      </div>

      {/* Top Scenario Control Bar matching design reference */}
      <div className="card simulation-control-bar">
        <form onSubmit={handleRunSimulation} className="control-bar-form" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Driver & Corridor Selector */}
          <div className="control-group">
            <label className="control-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Truck size={14} className="text-primary" />
              <span>Target Fleet Corridor</span>
            </label>
            <select
              className="control-select"
              value={selectedDriverId}
              onChange={(e) => {
                setSelectedDriverId(e.target.value);
                setDispatchAlert(null);
              }}
              style={{ fontWeight: 700 }}
            >
              <option value="DRV-001">🚛 Biren Das: Guwahati → Gangtok (NH10)</option>
              <option value="DRV-003">🚛 Luwang Singh: Kohima → Imphal (NH2)</option>
              <option value="DRV-002">🚛 Wanphrang: Guwahati → Shillong (NH6)</option>
              <option value="DRV-004">🚛 Bikash: Agartala → Aizawl (NH108)</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">Hazard Scenario</label>
            <select
              className="control-select"
              value={selectedScenarioKey}
              onChange={(e) => setSelectedScenarioKey(e.target.value)}
            >
              <option value="Heavy Rainfall">Heavy Rainfall (Monsoon Cloudburst)</option>
              <option value="Landslide">Mountain Landslide & Road Collapse</option>
              <option value="Flash Floods">Flash Floods (River Swell)</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">Intensity</label>
            <select
              className="control-select"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
            >
              <option value="High">High (Level 3 Warning)</option>
              <option value="Medium">Medium (Level 2 Warning)</option>
              <option value="Low">Low (Advisory)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary simulate-trigger-btn" disabled={isSimulating} style={{ marginLeft: 'auto' }}>
            {isSimulating ? (
              <span className="spinner-sm"></span>
            ) : (
              <>
                <Play size={16} fill="#ffffff" />
                <span>Simulate</span>
              </>
            )}
          </button>
        </form>
      </div>

      {dispatchAlert && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #6ee7b7',
          color: '#065f46',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600,
          fontSize: '0.9rem',
          boxShadow: '0 2px 8px rgba(16,185,129,0.15)'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{dispatchAlert}</span>
        </div>
      )}

      {/* Main Grid: Left Map Visualization, Right Insights & Impact Cards */}
      <div className="digital-twin-grid">
        {/* Digital Twin Map Container */}
        <div className="card twin-map-panel">
          <div className="twin-panel-header">
            <div className="t-left">
              <span className="badge badge-danger">Hazard Simulation Active</span>
              <h3 className="t-title">{currentTwin.corridorName}</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                Simulating: <b>{selectedScenarioKey}</b> on {currentTwin.driverName}'s active route
              </p>
            </div>
            <div className="t-right">
              <span className="live-telemetry-badge">● Satellite Real-Time Link</span>
            </div>
          </div>

          {/* Interactive Topographic Satellite Map */}
          <DigitalTwinMap 
            driverId={selectedDriverId}
            scenarioName={selectedScenarioKey}
            driverTwinData={currentTwin}
            height="460px"
          />
        </div>

        {/* Right Column: Simulation Insights & Scenario Impact Cards matching design */}
        <div className="twin-sidebar-column">
          {/* Simulation Insights Card */}
          <div className="card simulation-insights-card">
            <div className="card-header">
              <h3 className="card-title">Simulation Insights</h3>
              <Sparkles size={17} className="text-primary" />
            </div>

            <div className="insight-block">
              <span className="insight-label">Expected Delay</span>
              <div className="insight-val-huge text-danger">
                {currentScenario.expectedDelay}
              </div>
            </div>

            <div className="insight-divider"></div>

            <div className="insight-block">
              <span className="insight-label">Affected Route Segment</span>
              <div className="insight-val-text font-bold">
                {currentScenario.affectedSegment}
              </div>
            </div>

            <div className="insight-block">
              <span className="insight-label">Recommended Action</span>
              <div className="recommended-action-box">
                <CheckCircle2 size={16} className="text-success" />
                <span>{currentScenario.recommendedAction}</span>
              </div>
            </div>

            <button 
              className="btn btn-outline w-full mt-2"
              onClick={handleApplyReroute}
            >
              Apply Autonomous Reroute
            </button>
          </div>

          {/* Scenario Impact Card matching design */}
          <div className="card scenario-impact-card">
            <h3 className="card-title">Scenario Impact</h3>
            <p className="card-subtitle-small">Variance vs nominal baseline corridor</p>

            <div className="impact-metrics-list">
              <div className="impact-item">
                <div className="impact-name">
                  <Clock size={16} className="text-warning" />
                  <span>Transit Time</span>
                </div>
                <span className="impact-badge badge-warning font-bold">
                  {currentScenario.time || currentImpact.time}
                </span>
              </div>

              <div className="impact-item">
                <div className="impact-name">
                  <DollarSign size={16} className="text-danger" />
                  <span>Logistics Cost</span>
                </div>
                <span className="impact-badge badge-danger font-bold">
                  {currentScenario.cost || currentImpact.cost}
                </span>
              </div>

              <div className="impact-item">
                <div className="impact-name">
                  <ShieldAlert size={16} className="text-danger" />
                  <span>Disruption Risk</span>
                </div>
                <span className="impact-badge badge-danger font-bold">
                  {currentScenario.risk || currentImpact.risk}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
