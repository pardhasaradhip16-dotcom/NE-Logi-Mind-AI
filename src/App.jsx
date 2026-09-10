import React, { useState, useEffect } from 'react';
import './App.css';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { MobileNav } from './components/layout/MobileNav';
import { supabase } from './lib/supabase';

// Pages
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveTrackingPage } from './pages/LiveTrackingPage';
import { DriverCockpitPage } from './pages/DriverCockpitPage';
import { PredictiveAnalyticsPage } from './pages/PredictiveAnalyticsPage';
import { RoutePlannerPage } from './pages/RoutePlannerPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('dispatcher'); // 'dispatcher' | 'driver'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedShipmentId, setSelectedShipmentId] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState('DRV-001');

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        // We could parse role from session.user.user_metadata, but we'll stick to dispatcher default for now
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Switch to login screen if unauthenticated
  if (!isAuthenticated) {
    return (
      <AuthPage 
        onLoginSuccess={(authPayload = null) => {
          setIsAuthenticated(true);
          if (authPayload && typeof authPayload === 'object' && authPayload.role === 'driver') {
            setUserRole('driver');
            setSelectedDriverId(authPayload.driverId || 'DRV-001');
            setActiveTab('driver');
          } else if (typeof authPayload === 'string') {
            setUserRole('driver');
            setSelectedDriverId(authPayload);
            setActiveTab('driver');
          } else {
            setUserRole('dispatcher');
            setActiveTab('dashboard');
          }
        }} 
      />
    );
  }

  const handleSelectShipment = (shipment) => {
    setSelectedShipmentId(shipment.id);
  };

  const handleNavigateTab = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDriverSelect = (driverId) => {
    setSelectedDriverId(driverId);
    setActiveTab('driver');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDriverMode = userRole === 'driver';

  return (
    <div className={`app-layout ${isDriverMode ? 'app-layout-driver-mode' : ''}`}>
      {/* Desktop Sidebar Navigation: ONLY shown for central dispatcher */}
      {!isDriverMode && (
        <Sidebar 
          activeTab={activeTab} 
          onSelectTab={handleNavigateTab} 
        />
      )}

      {/* Main Content Area */}
      <div className={`main-wrapper ${isDriverMode ? 'main-wrapper-driver' : ''}`}>
        {/* Global Topbar with search (dispatcher) or in-cab header (driver) */}
        <Topbar 
          role={userRole}
          selectedDriverId={selectedDriverId}
          onLogout={() => {
            setIsAuthenticated(false);
            setUserRole('dispatcher');
          }}
          onSelectDriver={handleDriverSelect}
          onSearch={(query) => {
            if (query && activeTab !== 'tracking') {
              setActiveTab('tracking');
            }
          }}
        />

        {/* Dynamic Route/Tab Views */}
        <main className="content-area">
          {isDriverMode ? (
            /* DRIVER LOGIN: ONLY DRIVER COCKPIT IS RENDERED */
            <DriverCockpitPage 
              key={selectedDriverId}
              initialDriverId={selectedDriverId} 
            />
          ) : (
            /* DISPATCHER PORTAL: FULL SUITE OF LOGISTICS TOOLS */
            <>
              {activeTab === 'dashboard' && (
                <DashboardPage 
                  onNavigateTab={handleNavigateTab} 
                  onSelectShipment={handleSelectShipment}
                />
              )}

              {activeTab === 'tracking' && (
                <LiveTrackingPage 
                  initialShipmentId={selectedShipmentId} 
                />
              )}

              {activeTab === 'driver' && (
                <DriverCockpitPage 
                  key={selectedDriverId}
                  initialDriverId={selectedDriverId} 
                />
              )}

              {activeTab === 'predictive' && (
                <PredictiveAnalyticsPage />
              )}

              {activeTab === 'routes' && (
                <RoutePlannerPage />
              )}

              {activeTab === 'simulation' && (
                <DigitalTwinPage />
              )}

              {activeTab === 'reports' && (
                <ReportsPage />
              )}

              {activeTab === 'settings' && (
                <SettingsPage />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation: ONLY shown for dispatcher */}
      {!isDriverMode && (
        <MobileNav 
          activeTab={activeTab} 
          onSelectTab={handleNavigateTab} 
        />
      )}
    </div>
  );
}

export default App;
