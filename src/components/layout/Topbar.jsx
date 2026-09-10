import React, { useState, useEffect } from 'react';
import { Search, Bell, Sun, Cloud, CloudRain, ChevronDown, LogOut, Navigation, ShieldCheck, Eye } from 'lucide-react';
import { INITIAL_USER } from '../../data/mockData';
import { DRIVER_PROFILES } from '../../data/driversData';

export const Topbar = ({ onSearch, onLogout, onSelectDriver, role = 'dispatcher', selectedDriverId = 'DRV-001' }) => {
  const [searchValue, setSearchValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [liveDateTime, setLiveDateTime] = useState('');
  const [liveWeather, setLiveWeather] = useState({ temp: 28, condition: 'Partly Cloudy', icon: <Sun size={16} /> });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      setLiveDateTime(now.toLocaleDateString('en-US', options).replace(',', ' |'));
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    
    // Simulate fetching live weather (in a real app, call OpenWeatherMap API here)
    const conditions = [
      { temp: 28, condition: 'Partly Cloudy', icon: <Sun size={16} /> },
      { temp: 24, condition: 'Light Rain', icon: <CloudRain size={16} /> },
      { temp: 26, condition: 'Overcast', icon: <Cloud size={16} /> }
    ];
    setLiveWeather(conditions[Math.floor(Math.random() * conditions.length)]);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // If not a driver, we need the google translate widget
    if (role !== 'driver') {
      const scriptId = 'google-translate-script';
      
      window.googleTranslateElementInit = () => {
        // Clear any existing widget first
        const widgetContainer = document.getElementById('google_translate_element');
        if (widgetContainer) {
          widgetContainer.innerHTML = '';
        }

        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,bn,te,mr,ta,ur,gu,kn,ml,pa,as,or',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      };

      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      } else {
        // If script is already there, just try to re-init
        if (window.google && window.google.translate) {
          window.googleTranslateElementInit();
        }
      }
    }
  }, [role]);

  const activeDriver = DRIVER_PROFILES.find(d => d.id === selectedDriverId) || DRIVER_PROFILES[0];

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header className="topbar">
      {/* If Driver Role, render In-Cab Cockpit Brand Banner */}
      {role === 'driver' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 12px rgba(16, 185, 129, 0.35)'
          }}>
            <Navigation size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              NE-Logi Mind AI
              <span style={{ 
                fontSize: '0.68rem', 
                padding: '0.15rem 0.5rem', 
                borderRadius: '12px', 
                background: 'rgba(16, 185, 129, 0.12)', 
                color: '#059669', 
                fontWeight: 700, 
                border: '1px solid rgba(16, 185, 129, 0.3)' 
              }}>
                ● IN-CAB COCKPIT
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              {activeDriver.name} • {activeDriver.vehicle.type} ({activeDriver.vehicle.regNumber})
            </div>
          </div>
        </div>
      ) : (
        /* Dispatcher Search Box */
        <div className="search-box">
          <Search size={17} className="text-muted" />
          <input
            type="text"
            placeholder="Search shipments, routes, or locations..."
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
      )}

      {/* Right Side Widgets */}
      <div className="topbar-right">
        {/* Weather Telemetry Widget */}
        <div className="weather-badge">
          {liveWeather.icon}
          <span>{liveDateTime} | {liveWeather.temp}°C {liveWeather.condition}</span>
        </div>

        {/* Accessibility Toggle Button */}
        <button 
          onClick={() => {
            document.body.classList.toggle('accessibility-mode');
            const isActive = document.body.classList.contains('accessibility-mode');
            localStorage.setItem('accessibility-mode', isActive);
          }}
          className="topbar-icon-btn" 
          title="Toggle Accessibility / High-Contrast Mode"
          style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)', marginRight: '8px' }}
        >
          <Eye size={18} />
        </button>

        {/* Notifications Button (for Dispatcher) */}
        {role !== 'driver' && (
          <div style={{ position: 'relative' }}>
            <button 
              className="topbar-icon-btn" 
              title="Notifications"
              onClick={() => setShowAlerts(!showAlerts)}
            >
              <Bell size={18} />
              <span className="notification-dot"></span>
            </button>

            {showAlerts && (
              <div className="topbar-dropdown notification-dropdown">
                <div className="dropdown-header">
                  <span className="dropdown-title">System Alerts</span>
                  <span className="badge badge-warning">3 New</span>
                </div>
                <div className="dropdown-body">
                  <div className="alert-item">
                    <span className="dot dot-red"></span>
                    <div>
                      <p className="alert-text">Landslide warning issued for Teesta Pass</p>
                      <span className="alert-time">10 mins ago</span>
                    </div>
                  </div>
                  <div className="alert-item">
                    <span className="dot dot-orange"></span>
                    <div>
                      <p className="alert-text">NE-SHP-001 delayed by 2.3 hrs near Siliguri</p>
                      <span className="alert-time">25 mins ago</span>
                    </div>
                  </div>
                  <div className="alert-item">
                    <span className="dot dot-green"></span>
                    <div>
                      <p className="alert-text">NE-SHP-002 reached Shillong hub on schedule</p>
                      <span className="alert-time">1 hr ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Profile Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {role !== 'driver' && (
            <div id="google_translate_element" style={{ transform: 'translateY(4px)' }}></div>
          )}
          
          <div style={{ position: 'relative' }}>
          <div 
            className="user-profile-badge" 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {role === 'driver' ? (
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: activeDriver.avatarColor,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                {activeDriver.name[0]}
              </div>
            ) : (
              <img 
                src={INITIAL_USER.avatar} 
                alt={INITIAL_USER.name} 
                className="user-avatar" 
              />
            )}
            <span className="user-name">
              {role === 'driver' ? activeDriver.name : INITIAL_USER.name}
            </span>
            <ChevronDown size={15} className="text-muted" />
          </div>

          {showDropdown && (
            <div className="topbar-dropdown profile-dropdown" style={{ minWidth: '240px' }}>
              <div className="profile-info-block">
                <strong>{role === 'driver' ? activeDriver.name : INITIAL_USER.name}</strong>
                <span>{role === 'driver' ? activeDriver.email : INITIAL_USER.email}</span>
                <div className="role-tag">
                  {role === 'driver' ? 'Active In-Cab Driver' : INITIAL_USER.role}
                </div>
              </div>
              <div className="dropdown-divider"></div>
              
              {/* Quick Driver Profile Switcher */}
              <div style={{ padding: '0.4rem 0.6rem 0.2rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Switch Driver Profile:
              </div>
              {DRIVER_PROFILES.map((d) => (
                <button 
                  key={d.id}
                  className="dropdown-action-btn"
                  style={{ 
                    fontSize: '0.8rem', 
                    padding: '0.35rem 0.6rem',
                    fontWeight: selectedDriverId === d.id ? 700 : 400,
                    color: selectedDriverId === d.id ? 'var(--primary)' : 'inherit'
                  }}
                  onClick={() => {
                    setShowDropdown(false);
                    if (onSelectDriver) onSelectDriver(d.id);
                  }}
                >
                  <span>🚚 {d.name} ({d.vehicle.type})</span>
                </button>
              ))}

              <div className="dropdown-divider"></div>
              <button className="dropdown-action-btn" onClick={onLogout}>
                <LogOut size={15} />
                <span>{role === 'driver' ? 'Exit Driver Cockpit' : 'Sign Out'}</span>
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </header>
  );
};

