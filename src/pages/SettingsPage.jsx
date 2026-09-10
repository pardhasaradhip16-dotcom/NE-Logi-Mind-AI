import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Sliders, 
  Map, 
  Key, 
  Check, 
  Save,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { INITIAL_USER } from '../data/mockData';

export const SettingsPage = () => {
  const [userName, setUserName] = useState(INITIAL_USER.name);
  const [userEmail, setUserEmail] = useState(INITIAL_USER.email);
  const [delayThreshold, setDelayThreshold] = useState('1.5');
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [autoRerouteApproval, setAutoRerouteApproval] = useState(false);
  const [mapTheme, setMapTheme] = useState('light');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="page-container settings-page">
      <div className="page-header">
        <h1 className="page-title">Platform Settings</h1>
        <p className="page-subtitle">Configure AI model sensitivity, notification triggers, and autonomous routing policies.</p>
      </div>

      <form onSubmit={handleSave} className="settings-grid">
        {/* Profile Card */}
        <div className="card settings-section-card">
          <div className="card-header">
            <h3 className="card-title">User & Organization Profile</h3>
            <Shield size={16} className="text-primary" />
          </div>

          <div className="form-group">
            <label className="form-label">Commander Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={userName} 
              onChange={e => setUserName(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              value={userEmail} 
              onChange={e => setUserEmail(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Organization Tier</label>
            <input 
              type="text" 
              className="form-control" 
              disabled 
              value="Enterprise Logistics Command (India Corridors)" 
            />
          </div>
        </div>

        {/* AI & Alert Policies */}
        <div className="card settings-section-card">
          <div className="card-header">
            <h3 className="card-title">AI Delay Thresholds & Telemetry</h3>
            <Sliders size={16} className="text-primary" />
          </div>

          <div className="form-group">
            <label className="form-label">Delay Warning Threshold (Hours)</label>
            <select 
              className="form-control" 
              value={delayThreshold} 
              onChange={e => setDelayThreshold(e.target.value)}
            >
              <option value="0.5">30 minutes</option>
              <option value="1.0">1.0 hour</option>
              <option value="1.5">1.5 hours (Recommended)</option>
              <option value="2.0">2.0 hours</option>
              <option value="3.0">3.0 hours</option>
            </select>
            <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              Triggers proactive notification to logistics managers when predicted delay exceeds this margin.
            </span>
          </div>

          <div className="toggle-setting-row">
            <div>
              <strong>IMD Weather Warning Ingress</strong>
              <p>Stream real-time cloudburst, cyclone, and flood warnings</p>
            </div>
            <input 
              type="checkbox" 
              checked={weatherAlerts} 
              onChange={e => setWeatherAlerts(e.target.checked)} 
              className="toggle-checkbox"
            />
          </div>

          <div className="toggle-setting-row">
            <div>
              <strong>Autonomous Detour Dispatch</strong>
              <p>Automatically push recommended alternate routes to drivers</p>
            </div>
            <input 
              type="checkbox" 
              checked={autoRerouteApproval} 
              onChange={e => setAutoRerouteApproval(e.target.checked)} 
              className="toggle-checkbox"
            />
          </div>
        </div>

        {/* Map & Visual Settings */}
        <div className="card settings-section-card">
          <div className="card-header">
            <h3 className="card-title">Cartography & Satellite Layer</h3>
            <Map size={16} className="text-primary" />
          </div>

          <div className="form-group">
            <label className="form-label">Corridor Map Style</label>
            <select 
              className="form-control" 
              value={mapTheme} 
              onChange={e => setMapTheme(e.target.value)}
            >
              <option value="light">CartoDB Voyager (High Clarity)</option>
              <option value="satellite">ESRI World Satellite (Digital Twin)</option>
              <option value="dark">CartoDB Dark Matter (Tactical Night)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Routing Engine Provider</label>
            <input 
              type="text" 
              className="form-control" 
              disabled 
              value="NE-Logi Neural Routing Engine (OpenStreetMap Base)" 
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="settings-submit-bar">
          {savedSuccess && (
            <div className="save-toast-banner">
              <Check size={16} />
              <span>Platform preferences updated successfully!</span>
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            <Save size={16} />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
