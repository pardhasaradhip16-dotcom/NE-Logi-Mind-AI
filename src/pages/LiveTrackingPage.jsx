import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Truck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Phone, 
  Navigation, 
  ShieldAlert, 
  SlidersHorizontal,
  Layers,
  ChevronRight,
  Maximize2,
  RefreshCw,
  Info
} from 'lucide-react';
import { trackingService, SHIPMENT_STATUSES } from '../services/trackingService';
import { LiveTrackingMap } from '../components/map/LiveTrackingMap';
import { ShipmentDetailModal } from '../components/tracking/ShipmentDetailModal';
import './LiveTrackingPage.css';

export const LiveTrackingPage = ({ initialShipmentId = null }) => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [modalShipment, setModalShipment] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [mobileTab, setMobileTab] = useState('map'); // 'map' | 'list' on mobile viewports

  // Live Backend & ML Intelligence Status
  const [connStatus, setConnStatus] = useState(trackingService.getConnectionStatus());
  const [metrics, setMetrics] = useState(trackingService.getModelMetrics());

  // Load shipments via trackingService
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      const data = await trackingService.getShipments();
      if (isMounted) {
        setShipments(data);
        setConnStatus(trackingService.getConnectionStatus());
        setMetrics(trackingService.getModelMetrics());
        // Default select initial or first shipment
        const initial = initialShipmentId ? data.find(s => s.id === initialShipmentId) : data[0];
        setSelectedShipment(initial || data[0]);
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time telemetry stream
    const unsubscribe = trackingService.subscribe((event, updatedList) => {
      if (isMounted && updatedList) {
        setShipments([...updatedList]);
        setConnStatus(trackingService.getConnectionStatus());
        setMetrics(trackingService.getModelMetrics());
        // Update selected shipment if it was updated
        setSelectedShipment(prev => {
          if (!prev) return updatedList[0];
          const fresh = updatedList.find(s => s.id === prev.id);
          return fresh || prev;
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [initialShipmentId]);

  // Filtered shipments list
  const filteredShipments = useMemo(() => {
    return shipments.filter(shp => {
      const matchesStatus = statusFilter === 'All' || shp.status === statusFilter;
      const matchesRisk = riskFilter === 'All' || shp.riskLevel === riskFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        shp.id.toLowerCase().includes(q) ||
        shp.trackingNumber.toLowerCase().includes(q) ||
        shp.origin.city.toLowerCase().includes(q) ||
        shp.destination.city.toLowerCase().includes(q) ||
        shp.driver.name.toLowerCase().includes(q) ||
        shp.vehicle.regNumber.toLowerCase().includes(q) ||
        shp.vehicle.carrier.toLowerCase().includes(q);

      return matchesStatus && matchesRisk && matchesSearch;
    });
  }, [shipments, statusFilter, riskFilter, searchQuery]);

  const handleSelect = (shipment) => {
    setSelectedShipment(shipment);
  };

  const handleOpenModal = (shipment) => {
    setModalShipment(shipment || selectedShipment);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case SHIPMENT_STATUSES.ON_TIME:
        return <span className="badge badge-success">{status}</span>;
      case SHIPMENT_STATUSES.DELAYED:
        return <span className="badge badge-danger">{status}</span>;
      case SHIPMENT_STATUSES.AT_RISK:
        return <span className="badge badge-warning">{status}</span>;
      case SHIPMENT_STATUSES.DELIVERED:
        return <span className="badge badge-info">{status}</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="page-container live-tracking-page">
      {/* Page Header */}
      <div className="tracking-page-header">
        <div className="tracking-header-left">
          <h1 className="page-title">Live Shipment Tracking</h1>
          <p className="page-subtitle">
            Real-time fleet telemetry, active transit corridors, route progress, and predictive risk indicators.
          </p>
        </div>

        {/* Status KPI Chips */}
        <div className="tracking-kpi-strip">
          <button 
            className={`kpi-chip-btn ${statusFilter === 'All' ? 'active' : ''}`}
            onClick={() => setStatusFilter('All')}
          >
            <span>Total Fleet</span>
            <span className="kpi-chip-val kpi-val-all">{shipments.length}</span>
          </button>
          <button 
            className={`kpi-chip-btn ${statusFilter === SHIPMENT_STATUSES.ON_TIME ? 'active' : ''}`}
            onClick={() => setStatusFilter(SHIPMENT_STATUSES.ON_TIME)}
          >
            <span className="dot dot-green"></span>
            <span>On Time</span>
            <span className="kpi-chip-val kpi-val-ontime">
              {shipments.filter(s => s.status === SHIPMENT_STATUSES.ON_TIME).length}
            </span>
          </button>
          <button 
            className={`kpi-chip-btn ${statusFilter === SHIPMENT_STATUSES.DELAYED ? 'active' : ''}`}
            onClick={() => setStatusFilter(SHIPMENT_STATUSES.DELAYED)}
          >
            <span className="dot dot-red"></span>
            <span>Delayed</span>
            <span className="kpi-chip-val kpi-val-delayed">
              {shipments.filter(s => s.status === SHIPMENT_STATUSES.DELAYED).length}
            </span>
          </button>
          <button 
            className={`kpi-chip-btn ${statusFilter === SHIPMENT_STATUSES.AT_RISK ? 'active' : ''}`}
            onClick={() => setStatusFilter(SHIPMENT_STATUSES.AT_RISK)}
          >
            <span className="dot dot-orange"></span>
            <span>At Risk</span>
            <span className="kpi-chip-val kpi-val-atrisk">
              {shipments.filter(s => s.status === SHIPMENT_STATUSES.AT_RISK).length}
            </span>
          </button>
          <button 
            className={`kpi-chip-btn ${statusFilter === SHIPMENT_STATUSES.DELIVERED ? 'active' : ''}`}
            onClick={() => setStatusFilter(SHIPMENT_STATUSES.DELIVERED)}
          >
            <span className="dot" style={{ backgroundColor: '#64748b' }}></span>
            <span>Delivered</span>
            <span className="kpi-chip-val kpi-val-delivered">
              {shipments.filter(s => s.status === SHIPMENT_STATUSES.DELIVERED).length}
            </span>
          </button>
        </div>

        {/* Mobile View Switcher (Map vs List) */}
        <div className="mobile-view-toggle">
          <button 
            className={`btn-toggle ${mobileTab === 'map' ? 'active' : ''}`}
            onClick={() => setMobileTab('map')}
          >
            Map View
          </button>
          <button 
            className={`btn-toggle ${mobileTab === 'list' ? 'active' : ''}`}
            onClick={() => setMobileTab('list')}
          >
            Shipments ({filteredShipments.length})
          </button>
        </div>
      </div>

      {/* AI Model Intelligence & Realtime Telemetry Status Strip */}
      <div className="ai-model-status-strip">
        <div className="ai-status-left">
          <div className="ai-chip-pulsing">
            <span className="ai-live-dot"></span>
            <span>NE-Logi Mind ML Engine</span>
          </div>
          <span className="ai-stat-pill">Dataset: <strong>20,000</strong> NE Logistics Records</span>
          <span className="ai-stat-pill">Accuracy: <strong>{metrics?.classifier?.accuracy ? `${metrics.classifier.accuracy}%` : '83.25%'}</strong></span>
          <span className="ai-stat-pill">ROC-AUC: <strong>{metrics?.classifier?.roc_auc || '0.9045'}</strong></span>
          <span className="ai-stat-pill">Delay MAE: <strong>{metrics?.regressor?.mae_hours ? `${metrics.regressor.mae_hours}h` : '2.19h'}</strong></span>
        </div>
        <div className="ai-status-right">
          <span className={`telemetry-stream-pill ${connStatus.isRealWebSocket ? 'connected' : 'simulated'}`}>
            <span className="pulse-ping"></span>
            {connStatus.isRealWebSocket ? 'FastAPI Live Telemetry Stream (Port 8000)' : 'Simulated Offline Fallback'}
          </span>
        </div>
      </div>

      {/* Filter and Search Control Bar */}
      <div className="card tracking-control-panel">
        <div className="control-bar-row">
          {/* Search Box */}
          <div className="tracking-search-box">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Search by shipment ID, route, vehicle reg, driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          {/* Status Filters matching user requirements */}
          <div className="tracking-pills-group">
            <span className="pills-label">Status:</span>
            {['All', 'On Time', 'Delayed', 'At Risk', 'Delivered'].map((status) => (
              <button
                key={status}
                className={`filter-pill-btn ${statusFilter === status ? 'active' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Risk Filters */}
          <div className="tracking-pills-group">
            <span className="pills-label">Risk:</span>
            {['All', 'High', 'Medium', 'Low'].map((risk) => (
              <button
                key={risk}
                className={`filter-pill-btn ${riskFilter === risk ? 'active' : ''}`}
                onClick={() => setRiskFilter(risk)}
              >
                {risk === 'All' ? 'All Risks' : `${risk} Risk`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tracking Interface Grid */}
      <div className="tracking-main-layout">
        {/* Left Column: Shipment List */}
        <div className={`tracking-left-panel ${mobileTab === 'list' ? 'mobile-show' : 'mobile-hide'}`}>
          <div className="card fleet-list-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Active Fleet</h3>
                <span className="card-subtitle-small">Showing {filteredShipments.length} shipments</span>
              </div>
              <span className="live-telemetry-pill">
                <span className="pulsing-beacon"></span>
                LIVE
              </span>
            </div>

            {/* Scrollable Shipment Cards */}
            <div className="fleet-cards-scroll">
              {filteredShipments.length === 0 ? (
                <div className="empty-fleet-state">
                  <Truck size={36} className="text-muted" />
                  <p>No shipments match current filters.</p>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => { setStatusFilter('All'); setRiskFilter('All'); setSearchQuery(''); }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredShipments.map((shp) => {
                  const isSelected = selectedShipment?.id === shp.id;
                  return (
                    <div
                      key={shp.id}
                      className={`shipment-item-card ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => handleSelect(shp)}
                    >
                      <div className="shp-card-header">
                        <div className="shp-id-block">
                          <strong className="shp-id-text">{shp.id}</strong>
                          <span className="shp-track-no">{shp.trackingNumber}</span>
                        </div>
                        <div className="shp-badges-block">
                          {getStatusBadge(shp.status)}
                        </div>
                      </div>

                      {/* Route Path Indicator */}
                      <div className="shp-corridor-row">
                        <div className="corridor-city-badge">
                          <span className="city-point dot-green"></span>
                          <span>{shp.origin.city}</span>
                        </div>
                        <div className="corridor-connector-line">
                          <span className="arrow-head">→</span>
                        </div>
                        <div className="corridor-city-badge">
                          <span className="city-point dot-red"></span>
                          <span>{shp.destination.city}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="shp-progress-box">
                        <div className="progress-labels">
                          <span>Progress</span>
                          <span className="progress-pct font-bold">{shp.progress}%</span>
                        </div>
                        <div className="progress-track-bg">
                          <div 
                            className="progress-fill-bar"
                            style={{ 
                              width: `${shp.progress}%`,
                              backgroundColor: shp.status === 'On Time' ? '#10b981' : shp.status === 'Delayed' ? '#ef4444' : '#f59e0b'
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Meta stats footer */}
                      <div className="shp-card-footer">
                        <div className="shp-meta-col">
                          <span className="meta-label">ETA</span>
                          <span className="meta-val">{shp.eta}</span>
                        </div>
                        <div className="shp-meta-col">
                          <span className="meta-label">Remaining</span>
                          <span className="meta-val">{shp.distanceRemainingKm} km</span>
                        </div>
                        <div className="shp-meta-col">
                          <span className="meta-label">Risk</span>
                          <span className={`meta-val font-bold ${
                            shp.riskLevel === 'High' ? 'text-danger' : 
                            shp.riskLevel === 'Medium' ? 'text-warning' : 'text-success'
                          }`}>
                            {shp.riskScore}/100
                          </span>
                        </div>
                        <button 
                          className="btn-inspect-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(shp);
                          }}
                          title="Inspect full details"
                        >
                          Details →
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Center: Full Interactive Map */}
        <div className={`tracking-center-panel ${mobileTab === 'map' ? 'mobile-show' : 'mobile-hide'}`}>
          <div className="card map-container-card">
            <LiveTrackingMap
              shipments={filteredShipments}
              selectedShipment={selectedShipment}
              onSelectShipment={handleSelect}
              onOpenDetailModal={handleOpenModal}
              height="580px"
            />
          </div>
        </div>

        {/* Right Column: Live Telematics Overview Panel */}
        {selectedShipment && (
          <div className="tracking-right-panel">
            <div className="card telematics-snapshot-card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Live Telematics</h3>
                  <span className="card-subtitle-small">{selectedShipment.id} • {selectedShipment.vehicle.carrier}</span>
                </div>
                {getStatusBadge(selectedShipment.status)}
              </div>

              {/* Corridor Visual Connector */}
              <div className="snapshot-corridor-card">
                <div className="sc-point">
                  <div className="sc-dot bg-success"></div>
                  <div>
                    <strong>{selectedShipment.origin.city}</strong>
                    <span>{selectedShipment.origin.name}</span>
                  </div>
                </div>
                <div className="sc-track-vertical"></div>
                <div className="sc-point">
                  <div className="sc-dot bg-danger"></div>
                  <div>
                    <strong>{selectedShipment.destination.city}</strong>
                    <span>{selectedShipment.destination.name}</span>
                  </div>
                </div>
              </div>

              {/* Telemetry Metrics */}
              <div className="snapshot-metrics-grid">
                <div className="sm-item">
                  <span className="sm-label">Speed</span>
                  <span className="sm-val">{selectedShipment.currentLocation.speedKmH} km/h</span>
                </div>
                <div className="sm-item">
                  <span className="sm-label">Remaining</span>
                  <span className="sm-val">{selectedShipment.distanceRemainingKm} km</span>
                </div>
                <div className="sm-item">
                  <span className="sm-label">Risk Score</span>
                  <span className={`sm-val font-bold ${
                    selectedShipment.riskScore >= 70 ? 'text-danger' : 
                    selectedShipment.riskScore >= 40 ? 'text-warning' : 'text-success'
                  }`}>
                    {selectedShipment.riskScore}/100
                  </span>
                </div>
                <div className="sm-item">
                  <span className="sm-label">ETA</span>
                  <span className="sm-val text-primary font-bold">{selectedShipment.eta}</span>
                </div>
              </div>

              {/* Current Location Pill */}
              <div className="snapshot-location-box">
                <div className="sl-header">
                  <MapPin size={15} className="text-primary" />
                  <span className="sl-label">Current Telemetry Fix</span>
                </div>
                <div className="sl-address">{selectedShipment.currentLocation.name}</div>
                <div className="sl-time">{selectedShipment.currentLocation.lastUpdated}</div>
              </div>

              {/* Delay Warning Notice */}
              {selectedShipment.delayInformation.delayHours > 0 && (
                <div className="snapshot-delay-alert">
                  <AlertTriangle size={15} className="text-danger flex-shrink-0" />
                  <div>
                    <strong>Delay: +{selectedShipment.delayInformation.delayHours} hrs</strong>
                    <p>{selectedShipment.delayInformation.reason}</p>
                  </div>
                </div>
              )}

              {/* Vehicle & Driver Quick Card */}
              <div className="snapshot-vehicle-card">
                <div className="svc-row">
                  <Truck size={15} className="text-muted" />
                  <span className="svc-val">{selectedShipment.vehicle.model} ({selectedShipment.vehicle.regNumber})</span>
                </div>
                <div className="svc-row">
                  <Clock size={15} className="text-muted" />
                  <span className="svc-val">Fuel: {selectedShipment.vehicle.fuelLevelPercent}% • Payload: {selectedShipment.vehicle.payloadKg}</span>
                </div>
              </div>

              {/* Primary Action Button */}
              <button 
                className="btn btn-primary w-full mt-3"
                onClick={() => handleOpenModal(selectedShipment)}
              >
                <span>Inspect Full Telematics</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal / Detailed Panel */}
      {modalShipment && (
        <ShipmentDetailModal
          shipment={modalShipment}
          onClose={() => setModalShipment(null)}
        />
      )}
    </div>
  );
};
