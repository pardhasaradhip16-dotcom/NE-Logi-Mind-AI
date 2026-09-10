import React from 'react';
import { Home, MapPin, Route, Navigation, MoreHorizontal } from 'lucide-react';

export const MobileNav = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'tracking', label: 'Track', icon: MapPin },
    { id: 'driver', label: 'Cockpit', icon: Navigation },
    { id: 'routes', label: 'Routes', icon: Route },
    { id: 'settings', label: 'More', icon: MoreHorizontal },
  ];

  return (
    <nav className="mobile-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(tab.id)}
          >
            <Icon size={20} strokeWidth={isActive ? 2.3 : 1.8} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
