/**
 * NE-Logi Mind AI - Live Tracking Service Layer
 * 
 * Clean abstraction decoupling the UI from the underlying telemetry ingestion pipeline.
 * Designed for immediate mock data consumption and seamless transition to real-time
 * WebSocket / REST GPS streams (via VITE_WS_TELEMETRY_URL or /api/telemetry).
 */

import { getApiUrl, getWsUrl } from '../config/apiConfig';

export const SHIPMENT_STATUSES = {
  ON_TIME: 'On Time',
  DELAYED: 'Delayed',
  AT_RISK: 'At Risk',
  DELIVERED: 'Delivered',
};

export const RAW_SHIPMENTS = [
  {
    id: "SHP001",
    trackingNumber: "NLM-IND-2025-001A",
    origin: {
      name: "Delhi ICD Gateway",
      city: "Delhi",
      coords: [28.6139, 77.2090],
      departureTime: "10 Jun 2025, 06:00",
    },
    destination: {
      name: "JNPT Maritime Port Terminal",
      city: "Mumbai",
      coords: [19.0760, 72.8777],
      scheduledEta: "12 Jun 2025, 10:30",
    },
    currentLocation: {
      name: "Nagpur Outer Bypass (NH44)",
      coords: [21.1458, 79.0882],
      lastUpdated: "Just now (Live Telemetry)",
      speedKmH: 68,
      headingDeg: 215,
      isSimulated: true,
    },
    status: SHIPMENT_STATUSES.ON_TIME,
    eta: "12 Jun 10:30",
    distanceRemainingKm: 245,
    totalDistanceKm: 1410,
    progress: 82,
    delayInformation: {
      delayHours: 0,
      delayMinutes: 0,
      statusLabel: "Zero Delay",
      reason: "Smooth clearance on Greenfield Corridor NH48. No toll congestions.",
      severity: "none",
    },
    riskScore: 18,
    riskLevel: "Low",
    riskFactors: [
      "Favorable weather conditions throughout Maharashtra transit corridor",
      "Automated FASTag smart lane clearance: 0 min queue",
      "Dual commercial driver shift rotation active",
    ],
    vehicle: {
      model: "Volvo FH16 750 (Heavy Hauler)",
      regNumber: "NL-01-A-4421",
      carrier: "Express Cargo Logistics",
      fuelLevelPercent: 78,
      payloadKg: "24,500 kg",
      reeferTemp: "-18.2°C (Cold-Chain Verified)",
      healthScore: 98,
    },
    driver: {
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      licenseNumber: "DL-042018003921",
      experienceYears: 12,
      rating: 4.9,
    },
    routeWaypoints: [
      [28.6139, 77.2090], // Delhi
      [27.1767, 78.0081], // Agra
      [26.2183, 78.1828], // Gwalior
      [24.5854, 77.7277], // Guna
      [23.2599, 77.4126], // Bhopal
      [21.1458, 79.0882], // Nagpur (current)
      [20.5350, 77.5683], // Akola
      [19.9975, 73.7898], // Nashik
      [19.0760, 72.8777], // Mumbai
    ],
  },
  {
    id: "SHP002",
    trackingNumber: "NLM-IND-2025-002B",
    origin: {
      name: "Chennai Ennore Logistics Park",
      city: "Chennai",
      coords: [13.0827, 80.2707],
      departureTime: "11 Jun 2025, 08:30",
    },
    destination: {
      name: "Hyderabad Shamshabad Multi-Modal Hub",
      city: "Hyderabad",
      coords: [17.3850, 78.4867],
      scheduledEta: "12 Jun 2025, 18:45",
    },
    currentLocation: {
      name: "Pennar River Inundation Causeway, Nellore",
      coords: [14.4426, 79.9865],
      lastUpdated: "1 min ago (Live Telemetry)",
      speedKmH: 18,
      headingDeg: 345,
      isSimulated: true,
    },
    status: SHIPMENT_STATUSES.DELAYED,
    eta: "12 Jun 18:45",
    distanceRemainingKm: 380,
    totalDistanceKm: 630,
    progress: 58,
    delayInformation: {
      delayHours: 2.3,
      delayMinutes: 138,
      statusLabel: "Delayed (+2.3 hrs)",
      reason: "Flash flood backwater accumulation on NH16 causeway causing heavy single-lane crawling.",
      severity: "high",
    },
    riskScore: 84,
    riskLevel: "High",
    riskFactors: [
      "Heavy precipitation warning (>42mm/hr) in Pennar basin",
      "Water level 15cm over NH16 pavement diversion",
      "Alternative detour via Kavali bypass recommended by AI dispatch",
    ],
    vehicle: {
      model: "Tata Prima 4028 (Multi-Axle Container)",
      regNumber: "TN-09-BK-9182",
      carrier: "South Corridor Freights",
      fuelLevelPercent: 62,
      payloadKg: "28,200 kg",
      reeferTemp: "N/A (Dry Freight)",
      healthScore: 86,
    },
    driver: {
      name: "Senthil Nathan",
      phone: "+91 94441 55678",
      licenseNumber: "TN-092015002144",
      experienceYears: 9,
      rating: 4.7,
    },
    routeWaypoints: [
      [13.0827, 80.2707], // Chennai
      [13.5658, 80.0354], // Gummidipoondi
      [14.4426, 79.9865], // Nellore (current)
      [15.5057, 80.0499], // Ongole
      [16.3067, 80.4365], // Guntur
      [16.5062, 80.6480], // Vijayawada
      [17.3850, 78.4867], // Hyderabad
    ],
  },
  {
    id: "SHP003",
    trackingNumber: "NLM-IND-2025-003C",
    origin: {
      name: "Kolkata Port Trust Warehouses",
      city: "Kolkata",
      coords: [22.5726, 88.3639],
      departureTime: "11 Jun 2025, 03:00",
    },
    destination: {
      name: "Guwahati Inland Container Depot",
      city: "Guwahati",
      coords: [26.1445, 91.7362],
      scheduledEta: "13 Jun 2025, 06:20",
    },
    currentLocation: {
      name: "Siliguri Chicken's Neck Gateway (NH27)",
      coords: [26.7271, 88.3953],
      lastUpdated: "Just now (Live Telemetry)",
      speedKmH: 52,
      headingDeg: 80,
      isSimulated: true,
    },
    status: SHIPMENT_STATUSES.ON_TIME,
    eta: "13 Jun 06:20",
    distanceRemainingKm: 420,
    totalDistanceKm: 980,
    progress: 42,
    delayInformation: {
      delayHours: 0,
      delayMinutes: 0,
      statusLabel: "On Schedule",
      reason: "Clear transit across North Bengal national highway network.",
      severity: "none",
    },
    riskScore: 24,
    riskLevel: "Low",
    riskFactors: [
      "Moderate mountain mist in morning hours; headlights mandated",
      "Security checkpoints cleared at Bengal-Assam inter-state boundary",
    ],
    vehicle: {
      model: "BharatBenz 2823 (Rigid Freight)",
      regNumber: "WB-19-E-5510",
      carrier: "Eastern Gateway Express",
      fuelLevelPercent: 88,
      payloadKg: "18,400 kg",
      reeferTemp: "N/A (Electronic Sensors)",
      healthScore: 94,
    },
    driver: {
      name: "Subhash Roy",
      phone: "+91 98310 99881",
      licenseNumber: "WB-192017004419",
      experienceYears: 15,
      rating: 4.85,
    },
    routeWaypoints: [
      [22.5726, 88.3639], // Kolkata
      [24.1800, 88.2700], // Berhampore
      [25.0100, 88.1400], // Malda
      [26.7271, 88.3953], // Siliguri (current)
      [26.5400, 89.5300], // Alipurduar
      [26.1445, 91.7362], // Guwahati
    ],
  },
  {
    id: "SHP004",
    trackingNumber: "NLM-IND-2025-004D",
    origin: {
      name: "Bengaluru Peenya Industrial Estate",
      city: "Bengaluru",
      coords: [12.9716, 77.5946],
      departureTime: "11 Jun 2025, 14:00",
    },
    destination: {
      name: "Pune Chakan Automotive Corridor",
      city: "Pune",
      coords: [18.5204, 73.8567],
      scheduledEta: "12 Jun 2025, 15:10",
    },
    currentLocation: {
      name: "Kolhapur Ghat Section Overpass (NH48)",
      coords: [16.8524, 74.5815],
      lastUpdated: "3 mins ago (Live Telemetry)",
      speedKmH: 34,
      headingDeg: 330,
      isSimulated: true,
    },
    status: SHIPMENT_STATUSES.AT_RISK,
    eta: "12 Jun 15:10",
    distanceRemainingKm: 210,
    totalDistanceKm: 840,
    progress: 74,
    delayInformation: {
      delayHours: 1.1,
      delayMinutes: 66,
      statusLabel: "At Risk (+1.1 hrs estimated)",
      reason: "Dense ghat fog and road resurfacing work near Karad reducing average transit velocity.",
      severity: "medium",
    },
    riskScore: 68,
    riskLevel: "Medium",
    riskFactors: [
      "Visibility below 50m on high-elevation pass",
      "Lane restriction for 12 km stretch",
      "Heavy commercial tailback preceding Shirwal toll plaza",
    ],
    vehicle: {
      model: "Ashok Leyland 3520 (Twin Steer)",
      regNumber: "KA-04-F-3112",
      carrier: "Deccan Transit Solutions",
      fuelLevelPercent: 54,
      payloadKg: "22,000 kg",
      reeferTemp: "N/A (Aircraft Components)",
      healthScore: 91,
    },
    driver: {
      name: "Anand Verma",
      phone: "+91 99800 23456",
      licenseNumber: "KA-042016007812",
      experienceYears: 10,
      rating: 4.8,
    },
    routeWaypoints: [
      [12.9716, 77.5946], // Bengaluru
      [13.3400, 77.1000], // Tumakuru
      [14.4600, 75.9200], // Davanagere
      [15.3647, 75.1240], // Hubli
      [15.8497, 74.4977], // Belgaum
      [16.8524, 74.5815], // Kolhapur (current)
      [17.6800, 74.0000], // Satara
      [18.5204, 73.8567], // Pune
    ],
  },
  {
    id: "SHP005",
    trackingNumber: "NLM-IND-2025-005E",
    origin: {
      name: "Jaipur Sitapura Industrial Area",
      city: "Jaipur",
      coords: [26.9124, 75.7873],
      departureTime: "12 Jun 2025, 01:00",
    },
    destination: {
      name: "Ahmedabad Sanand Automotive Hub",
      city: "Ahmedabad",
      coords: [23.0225, 72.5714],
      scheduledEta: "13 Jun 2025, 09:50",
    },
    currentLocation: {
      name: "Udaipur Sukher Bypass (NH48)",
      coords: [24.5854, 73.7125],
      lastUpdated: "Just now (Live Telemetry)",
      speedKmH: 72,
      headingDeg: 195,
      isSimulated: true,
    },
    status: SHIPMENT_STATUSES.ON_TIME,
    eta: "13 Jun 09:50",
    distanceRemainingKm: 260,
    totalDistanceKm: 660,
    progress: 30,
    delayInformation: {
      delayHours: 0,
      delayMinutes: 0,
      statusLabel: "Optimal Passage",
      reason: "High-speed multi-lane access road with minimal impedance.",
      severity: "none",
    },
    riskScore: 15,
    riskLevel: "Low",
    riskFactors: [
      "Favorable dry arid conditions",
      "Corridor automated monitoring: 100% operational",
    ],
    vehicle: {
      model: "Eicher Pro 6035 (Six Wheeler)",
      regNumber: "RJ-14-GH-7019",
      carrier: "Western Dunes Haulage",
      fuelLevelPercent: 85,
      payloadKg: "16,500 kg",
      reeferTemp: "N/A (Solar Photovoltaics)",
      healthScore: 97,
    },
    driver: {
      name: "Vikram Singh",
      phone: "+91 94140 88776",
      licenseNumber: "RJ-142014005112",
      experienceYears: 14,
      rating: 4.92,
    },
    routeWaypoints: [
      [26.9124, 75.7873], // Jaipur
      [26.4500, 74.6400], // Ajmer
      [25.3500, 74.6300], // Bhilwara
      [24.5854, 73.7125], // Udaipur (current)
      [23.6000, 73.3300], // Himatnagar
      [23.0225, 72.5714], // Ahmedabad
    ],
  },
  {
    id: "SHP006",
    trackingNumber: "NLM-IND-2025-006F",
    origin: {
      name: "Hyderabad Cherlapally Rail Siding",
      city: "Hyderabad",
      coords: [17.3850, 78.4867],
      departureTime: "11 Jun 2025, 22:00",
    },
    destination: {
      name: "Visakhapatnam Deepwater Container Terminal",
      city: "Visakhapatnam",
      coords: [17.6868, 83.2185],
      scheduledEta: "12 Jun 2025, 21:15",
    },
    currentLocation: {
      name: "Vijayawada Kanaka Durga Flyover Chokepoint",
      coords: [16.5062, 80.6480],
      lastUpdated: "Just now (Live Telemetry)",
      speedKmH: 22,
      headingDeg: 75,
      isSimulated: true,
    },
    status: SHIPMENT_STATUSES.AT_RISK,
    eta: "12 Jun 21:15",
    distanceRemainingKm: 340,
    totalDistanceKm: 625,
    progress: 49,
    delayInformation: {
      delayHours: 4.2,
      delayMinutes: 252,
      statusLabel: "High Delay Risk (+4.2 hrs)",
      reason: "Severe tropical rain cell over Eastern Ghats causing rockfall warning between Rajahmundry & Tuni.",
      severity: "high",
    },
    riskScore: 78,
    riskLevel: "High",
    riskFactors: [
      "Landslide probability estimated at 78% on NH16 ghat passes",
      "Urban container bottleneck at Vijayawada river bridge",
      "Detour recommendation active: divert via Rajahmundry express bypass",
    ],
    vehicle: {
      model: "Tata Signa 4825 (Heavy Duty Bogie)",
      regNumber: "AP-28-TE-8899",
      carrier: "Coastal Highway Logistics",
      fuelLevelPercent: 68,
      payloadKg: "31,000 kg",
      reeferTemp: "N/A (Marine Cables)",
      healthScore: 89,
    },
    driver: {
      name: "Mahesh Reddy",
      phone: "+91 99490 12389",
      licenseNumber: "AP-282019001099",
      experienceYears: 8,
      rating: 4.75,
    },
    routeWaypoints: [
      [17.3850, 78.4867], // Hyderabad
      [17.1500, 79.6200], // Suryapet
      [16.5062, 80.6480], // Vijayawada (current)
      [16.9000, 81.3000], // Eluru
      [17.0005, 81.8040], // Rajahmundry
      [17.3500, 82.5500], // Tuni
      [17.6868, 83.2185], // Visakhapatnam
    ],
  },
  {
    id: "SHP007",
    trackingNumber: "NLM-IND-2025-007G",
    origin: {
      name: "Mumbai Bhiwandi Logistics Complex",
      city: "Mumbai",
      coords: [19.0760, 72.8777],
      departureTime: "09 Jun 2025, 11:00",
    },
    destination: {
      name: "Bengaluru Nelamangala Regional Hub",
      city: "Bengaluru",
      coords: [12.9716, 77.5946],
      scheduledEta: "11 Jun 2025, 18:00",
    },
    currentLocation: {
      name: "Nelamangala Gateway Docking Bay 4",
      coords: [12.9716, 77.5946],
      lastUpdated: "Delivered & Inspected",
      speedKmH: 0,
      headingDeg: 0,
      isSimulated: false,
    },
    status: SHIPMENT_STATUSES.DELIVERED,
    eta: "Delivered",
    distanceRemainingKm: 0,
    totalDistanceKm: 985,
    progress: 100,
    delayInformation: {
      delayHours: 0,
      delayMinutes: 0,
      statusLabel: "Completed On Time",
      reason: "Cargo received and electronic proof of delivery signed without discrepancy.",
      severity: "none",
    },
    riskScore: 8,
    riskLevel: "Low",
    riskFactors: [
      "Trip concluded successfully",
      "Consignment verified with zero damage seal",
    ],
    vehicle: {
      model: "Scania R500 (Clean Diesel)",
      regNumber: "MH-04-AZ-2020",
      carrier: "Western Dunes Haulage",
      fuelLevelPercent: 42,
      payloadKg: "21,800 kg",
      reeferTemp: "N/A (Consumer Goods)",
      healthScore: 99,
    },
    driver: {
      name: "Dharmendra Patil",
      phone: "+91 98200 44321",
      licenseNumber: "MH-042013009088",
      experienceYears: 16,
      rating: 4.95,
    },
    routeWaypoints: [
      [19.0760, 72.8777], // Mumbai
      [18.5204, 73.8567], // Pune
      [16.8524, 74.5815], // Kolhapur
      [15.3647, 75.1240], // Hubli
      [12.9716, 77.5946], // Bengaluru
    ],
  },
];

class TrackingService {
  constructor() {
    this.shipments = [...RAW_SHIPMENTS];
    this.listeners = new Map();
    this.activeWs = null;
    this.isUsingRealWebSocket = false;
    this.isBackendConnected = false;
    this.modelMetrics = null;
    this.simulationTimer = null;
    this.reconnectTimer = null;
    
    // Load initial shipments from backend API if available
    this.loadFromBackend();

    // Check if real telemetry WebSocket environment variable is set
    const wsUrl = import.meta.env?.VITE_WS_TELEMETRY_URL || getWsUrl('/ws/telemetry');
    this.initWebSocket(wsUrl);
  }

  async loadFromBackend() {
    const apiUrl = import.meta.env?.VITE_API_URL || getApiUrl('/api');
    try {
      const [shipmentsRes, metricsRes] = await Promise.all([
        fetch(`${apiUrl}/shipments`),
        fetch(`${apiUrl}/model/metrics`)
      ]);

      if (shipmentsRes.ok) {
        const data = await shipmentsRes.json();
        if (Array.isArray(data) && data.length > 0) {
          this.shipments = data;
          this.isBackendConnected = true;
          this.notifyListeners({ type: 'BACKEND_INITIALIZED', count: data.length });
        }
      }

      if (metricsRes.ok) {
        this.modelMetrics = await metricsRes.json();
        this.notifyListeners({ type: 'METRICS_LOADED', metrics: this.modelMetrics });
      }
    } catch (err) {
      console.warn('[TrackingService] Backend API not reachable, falling back to local dataset defaults:', err.message);
    }
  }

  initWebSocket(url) {
    if (this.activeWs && (this.activeWs.readyState === WebSocket.OPEN || this.activeWs.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.activeWs = new WebSocket(url);

      this.activeWs.onopen = () => {
        console.info('[TrackingService] Connected to Real Telemetry WebSocket stream:', url);
        this.isUsingRealWebSocket = true;
        this.isBackendConnected = true;
        if (this.simulationTimer) {
          clearInterval(this.simulationTimer);
          this.simulationTimer = null;
        }
        this.notifyListeners({ type: 'WS_CONNECTED', url });
      };

      this.activeWs.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          this.handleInboundTelemetry(payload);
        } catch (err) {
          console.error('[TrackingService] Error parsing WebSocket message:', err);
        }
      };

      this.activeWs.onclose = () => {
        console.warn('[TrackingService] WebSocket disconnected. Retrying in 4 seconds...');
        this.isUsingRealWebSocket = false;
        this.retryWebSocket(url);
      };

      this.activeWs.onerror = (err) => {
        console.warn('[TrackingService] WebSocket error, fallback to simulated stream:', err);
        this.isUsingRealWebSocket = false;
        this.initSimulatedTelemetry();
      };
    } catch (e) {
      console.warn('[TrackingService] Failed to initialize WebSocket:', e);
      this.initSimulatedTelemetry();
      this.retryWebSocket(url);
    }
  }

  retryWebSocket(url) {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.initWebSocket(url);
    }, 4000);
  }

  initSimulatedTelemetry() {
    if (this.simulationTimer) return;

    // Simulated heartbeat update every 8 seconds for in-transit shipments
    this.simulationTimer = setInterval(() => {
      this.shipments = this.shipments.map(s => {
        if (s.status === SHIPMENT_STATUSES.DELIVERED) return s;

        // Micro-update heading or speed slightly to reflect dynamic real-time tracking
        const speedJitter = Math.floor((Math.random() - 0.5) * 4);
        const newSpeed = Math.max(15, Math.min(85, s.currentLocation.speedKmH + speedJitter));

        return {
          ...s,
          currentLocation: {
            ...s.currentLocation,
            speedKmH: newSpeed,
            lastUpdated: "Telemetry synced (Simulated)",
            isSimulated: true,
          }
        };
      });

      this.notifyListeners({ type: 'TELEMETRY_PULSE', timestamp: new Date().toISOString() });
    }, 8000);
  }

  handleInboundTelemetry(update) {
    if (!update || !update.shipmentId) return;

    this.shipments = this.shipments.map(s => {
      if (s.id === update.shipmentId) {
        return {
          ...s,
          ...update,
          currentLocation: {
            ...s.currentLocation,
            ...update.currentLocation,
            isSimulated: false,
          }
        };
      }
      return s;
    });

    this.notifyListeners({ type: 'LIVE_UPDATE', shipmentId: update.shipmentId });
  }

  notifyListeners(data) {
    this.listeners.forEach((callback) => {
      try {
        callback(data, this.shipments);
      } catch (err) {
        console.error('[TrackingService] Listener execution error:', err);
      }
    });
  }

  /**
   * Fetch all shipments with optional client-side filters
   */
  async getShipments(filters = {}) {
    // Return a shallow copy wrapped in Promise for realistic asynchronous contract
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...this.shipments];

        if (filters.status && filters.status !== 'All') {
          results = results.filter(s => s.status === filters.status);
        }

        if (filters.riskLevel && filters.riskLevel !== 'All') {
          results = results.filter(s => s.riskLevel === filters.riskLevel);
        }

        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          results = results.filter(s =>
            s.id.toLowerCase().includes(q) ||
            s.trackingNumber.toLowerCase().includes(q) ||
            s.origin.city.toLowerCase().includes(q) ||
            s.destination.city.toLowerCase().includes(q) ||
            s.driver.name.toLowerCase().includes(q) ||
            s.vehicle.regNumber.toLowerCase().includes(q)
          );
        }

        resolve(results);
      }, 50);
    });
  }

  /**
   * Fetch a single shipment by its ID
   */
  async getShipmentById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = this.shipments.find(s => s.id === id);
        if (found) {
          resolve({ ...found });
        } else {
          reject(new Error(`Shipment with ID ${id} not found`));
        }
      }, 40);
    });
  }

  /**
   * Subscribe to real-time telemetry updates
   */
  subscribe(callback) {
    const id = Symbol('listenerId');
    this.listeners.set(id, callback);
    return () => this.listeners.delete(id);
  }

  /**
   * Get trained dataset model metrics
   */
  getModelMetrics() {
    return this.modelMetrics;
  }

  /**
   * Get current backend and stream status
   */
  getConnectionStatus() {
    return {
      isRealWebSocket: this.isUsingRealWebSocket,
      isBackendConnected: this.isBackendConnected,
      hasModelMetrics: Boolean(this.modelMetrics),
    };
  }
}

// Singleton Service Export
export const trackingService = new TrackingService();
