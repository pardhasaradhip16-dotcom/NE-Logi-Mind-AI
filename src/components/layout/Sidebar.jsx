import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  TrendingUp, 
  Route, 
  Cpu, 
  FileText, 
  Settings, 
  Sparkles,
  Layers,
  Navigation
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tracking', label: 'Live Tracking', icon: MapPin },
  { id: 'driver', label: 'Driver Cockpit', icon: Navigation },
  { id: 'predictive', label: 'Predictive Analytics', icon: TrendingUp },
  { id: 'routes', label: 'Route Planner', icon: Route },
  { id: 'simulation', label: 'Digital Twin Simulation', icon: Cpu },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({ activeTab, onSelectTab }) => {
  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="brand-header" onClick={() => onSelectTab('dashboard')}>
        <div className="brand-icon">
          <Layers size={22} strokeWidth={2.4} />
        </div>
        <div className="brand-info">
          <div className="brand-text">NE-Logi Mind AI</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Promo AI Card matching design image */}
      <div className="sidebar-footer-card">
        <div className="ai-chip-icon">
          <Sparkles size={20} />
        </div>
        <div className="ai-footer-text">
          <h4>Smarter Logistics with AI</h4>
          <p>Real-time neural routing active</p>
        </div>
      </div>
    </aside>
  );
};
