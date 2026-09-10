// NE-Logi Mind AI - Mock Data & Telematics Engine

export const INITIAL_USER = {
  name: "Team Elites",
  role: "Logistics Commander",
  email: "admin@nelogi-mind.ai",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  organization: "Global Supply Corridors",
};

export const KPI_METRICS = {
  totalShipments: {
    value: 124,
    change: "+12%",
    period: "from last week",
    status: "positive",
  },
  onTimeDeliveries: {
    value: "92%",
    change: "+6%",
    period: "from last week",
    status: "positive",
  },
  avgDelayHours: {
    value: "2.4",
    unit: "hrs",
    change: "-32%",
    period: "from last week",
    status: "positive",
  },
  riskAlerts: {
    value: 3,
    subtext: "Requires attention",
    status: "warning",
  },
};

export const SHIPMENTS_DATA = [
  {
    id: "SHP001",
    from: "Delhi",
    to: "Mumbai",
    status: "On Time",
    eta: "12 Jun 10:30",
    driver: "Rajesh Kumar",
    vehicle: "Volvo FH16 (NL-01-A-4421)",
    carrier: "Express Cargo Logistics",
    progress: 82,
    originCoords: [28.6139, 77.2090],
    destCoords: [19.0760, 72.8777],
    currentCoords: [21.1458, 79.0882], // near Nagpur
    riskLevel: "Low",
    delayHours: 0,
    cargo: "Pharmaceuticals & Cold-Chain Vaccines",
  },
  {
    id: "SHP002",
    from: "Chennai",
    to: "Hyderabad",
    status: "Delayed",
    eta: "12 Jun 18:45",
    driver: "Senthil Nathan",
    vehicle: "Tata Prima 4028 (TN-09-BK-9182)",
    carrier: "South Corridor Freights",
    progress: 58,
    originCoords: [13.0827, 80.2707],
    destCoords: [17.3850, 78.4867],
    currentCoords: [14.4426, 79.9865], // Nellore
    riskLevel: "High",
    delayHours: 2.3,
    cargo: "Automobile High-Precision Components",
  },
  {
    id: "SHP003",
    from: "Kolkata",
    to: "Guwahati",
    status: "On Time",
    eta: "13 Jun 06:20",
    driver: "Subhash Roy",
    vehicle: "BharatBenz 2823 (WB-19-E-5510)",
    carrier: "Eastern Gateway Express",
    progress: 42,
    originCoords: [22.5726, 88.3639],
    destCoords: [26.1445, 91.7362],
    currentCoords: [24.8170, 93.9368],
    riskLevel: "Low",
    delayHours: 0,
    cargo: "Industrial Electronics & Sensors",
  },
  {
    id: "SHP004",
    from: "Bengaluru",
    to: "Pune",
    status: "At Risk",
    eta: "12 Jun 15:10",
    driver: "Anand Verma",
    vehicle: "Ashok Leyland 3520 (KA-04-F-3112)",
    carrier: "Deccan Transit Solutions",
    progress: 74,
    originCoords: [12.9716, 77.5946],
    destCoords: [18.5204, 73.8567],
    currentCoords: [16.8524, 74.5815], // Kolhapur
    riskLevel: "Medium",
    delayHours: 1.1,
    cargo: "Aerospace Composites & Assemblies",
  },
  {
    id: "SHP005",
    from: "Jaipur",
    to: "Ahmedabad",
    status: "On Time",
    eta: "13 Jun 09:50",
    driver: "Vikram Singh",
    vehicle: "Eicher Pro 6035 (RJ-14-GH-7019)",
    carrier: "Western Dunes Haulage",
    progress: 30,
    originCoords: [26.9124, 75.7873],
    destCoords: [23.0225, 72.5714],
    currentCoords: [24.5854, 73.7125], // Udaipur
    riskLevel: "Low",
    delayHours: 0,
    cargo: "Solar PV Modules & Inverters",
  },
  {
    id: "SHP006",
    from: "Hyderabad",
    to: "Visakhapatnam",
    status: "At Risk",
    eta: "12 Jun 21:15",
    driver: "Mahesh Reddy",
    vehicle: "Tata Signa 4825 (AP-28-TE-8899)",
    carrier: "Coastal Highway Logistics",
    progress: 49,
    originCoords: [17.3850, 78.4867],
    destCoords: [17.6868, 83.2185],
    currentCoords: [16.5062, 80.6480], // Vijayawada
    riskLevel: "High",
    delayHours: 4.2,
    cargo: "Maritime Marine Hardware & Cables",
  },
];

export const PREDICTIVE_DEFAULT_DATA = {
  from: "Hyderabad",
  to: "Visakhapatnam",
  mode: "Truck",
  date: "12 Jun 2025",
  predictionResult: {
    riskTag: "High Risk",
    estimatedDelay: "4.2 hours",
    estimatedDuration: "16.5 hours",
    reliabilityScore: 72,
  },
  keyFactors: [
    { label: "Heavy Rainfall", percentage: 45, icon: "CloudRain", color: "#ef4444" },
    { label: "Traffic Congestion", percentage: 30, icon: "Car", color: "#f59e0b" },
    { label: "Road Blockage Risk", percentage: 15, icon: "AlertTriangle", color: "#f97316" },
    { label: "Other Variables", percentage: 10, icon: "HelpCircle", color: "#64748b" },
  ],
  delayProbabilityCurve: [
    { hour: "0h", probability: 12 },
    { hour: "4h", probability: 28 },
    { hour: "8h", probability: 42 },
    { hour: "12h", probability: 68 }, // peak
    { hour: "16h", probability: 54 },
    { hour: "20h", probability: 36 },
    { hour: "24h", probability: 22 },
  ],
  weatherForecast: {
    condition: "Heavy Rainfall",
    interval: "12 Jun, 10:00 AM - 6:00 PM",
    temperature: "28°C",
    precipitation: "42mm/hr",
    windSpeed: "34 km/h",
  },
};

export const ROUTE_RECOMMENDATION_DATA = {
  from: "Hyderabad",
  to: "Visakhapatnam",
  recommended: {
    id: "route-rec",
    name: "Corridor Alpha (Via Rajahmundry Express Bypass)",
    tag: "Best Option",
    time: "13.8 hrs",
    cost: "₹ 42,000",
    risk: "Low",
    accessibility: "High",
    distance: "625 km",
    fuelConsumption: "148 L",
    tolls: "6 Toll Plazas",
    description: "Multi-lane elevated highway with active drainage and smart incident dispatch.",
    waypoints: [
      [17.3850, 78.4867], // Hyderabad
      [17.0005, 81.8040], // Rajahmundry
      [17.6868, 83.2185], // Visakhapatnam
    ],
  },
  alternatives: [
    {
      id: "route-alt-1",
      name: "Route 2 (Via Vijayawada Arterial)",
      time: "15.2 hrs",
      cost: "₹ 38,500",
      risk: "Medium",
      accessibility: "High",
      distance: "660 km",
      waypoints: [
        [17.3850, 78.4867],
        [16.5062, 80.6480], // Vijayawada
        [17.6868, 83.2185],
      ],
    },
    {
      id: "route-alt-2",
      name: "Route 3 (Via Khammam Rural Belt)",
      time: "14.7 hrs",
      cost: "₹ 39,000",
      risk: "High",
      accessibility: "Medium",
      distance: "610 km",
      waypoints: [
        [17.3850, 78.4867],
        [17.2473, 80.1514], // Khammam
        [17.6868, 83.2185],
      ],
    },
    {
      id: "route-alt-3",
      name: "Route 4 (Via Coastal State Highway)",
      time: "16.1 hrs",
      cost: "₹ 36,000",
      risk: "Low",
      accessibility: "Low",
      distance: "680 km",
      waypoints: [
        [17.3850, 78.4867],
        [15.8281, 80.3541], // Guntur/Bapatla
        [17.6868, 83.2185],
      ],
    },
  ],
  riskZones: [
    {
      coords: [16.8000, 81.5000],
      radius: 35000,
      name: "Godavari Flood Warning Zone",
      level: "High",
    },
    {
      coords: [17.2000, 82.2000],
      radius: 25000,
      name: "Tuni Ghat Fog & Mudslide Zone",
      level: "Medium",
    },
  ],
};

export const NE_DRIVER_DIGITAL_TWINS = {
  "DRV-001": {
    driverId: "DRV-001",
    driverName: "Biren Das",
    carrier: "Tata Prima 4028 (Container)",
    corridorName: "Guwahati → Gangtok (NH10 Mountain Sector)",
    originCity: "Guwahati",
    destCity: "Gangtok",
    mapCenter: [26.95, 88.52],
    mapZoom: 9,
    hazardName: "Landslide Risk (Teesta Gorge)",
    hazardType: "Mountain Landslide & Pavement Shear",
    hazardProbability: "84%",
    hazardCoords: [27.1300, 88.5000],
    hazardRadius: 14000,
    floodPolygon: [
      [27.09, 88.46],
      [27.16, 88.48],
      [27.15, 88.54],
      [27.08, 88.52]
    ],
    openSegment: [
      [26.7271, 88.3953], // Siliguri Junction
      [26.8833, 88.4333], // Sevoke Coronation Bridge
    ],
    blockedSegment: [
      [26.8833, 88.4333], // Sevoke
      [27.1300, 88.5000], // Teesta Bazaar Gorge
      [27.1770, 88.5140], // Rangpo Border
    ],
    detourSegment: [
      [26.8833, 88.4333], // Sevoke Bridge
      [26.9500, 88.6800], // Damdim
      [27.0800, 88.6600], // Lava Forest Pass (NH717A)
      [27.2340, 88.5000], // Singtam Crossing
      [27.3389, 88.6065], // Gangtok Hub
    ],
    destSegment: [
      [27.1770, 88.5140],
      [27.2340, 88.5000],
      [27.3389, 88.6065],
    ],
    vehicleLocation: [26.8833, 88.4333],
    vehicleLabel: "Biren Das (Tata Prima)",
    cities: [
      { name: "Siliguri Hub", coords: [26.7271, 88.3953] },
      { name: "Sevoke Bridge", coords: [26.8833, 88.4333] },
      { name: "Teesta Gorge (Blocked)", coords: [27.1300, 88.5000] },
      { name: "Lava Detour (Open)", coords: [27.0800, 88.6600] },
      { name: "Gangtok Terminal", coords: [27.3389, 88.6065] },
    ],
    insights: {
      expectedDelay: "7.4 hours",
      affectedSegment: "Sevoke - Teesta Bazaar Gorge (38 km)",
      recommendedAction: "Autonomous reroute via Damdim - Lava Forest Arterial (NH717A)",
    },
    scenarioImpact: {
      time: "+52%",
      cost: "+35%",
      risk: "+78%",
    },
    scenarios: {
      "Heavy Rainfall": {
        expectedDelay: "7.4 hours",
        affectedSegment: "Sevoke - Teesta Bazaar Gorge (38 km)",
        recommendedAction: "Autonomous reroute via Damdim - Lava Forest Arterial (NH717A)",
        probability: "84%",
        time: "+52%",
        cost: "+35%",
        risk: "+78%",
      },
      "Landslide": {
        expectedDelay: "11.2 hours",
        affectedSegment: "NH10 Mile 29 Rockfall & Mud Barrier",
        recommendedAction: "Full corridor closure. Divert via Reshi-Rongli Himalayan Corridor",
        probability: "94%",
        time: "+80%",
        cost: "+60%",
        risk: "+95%",
      },
      "Flash Floods": {
        expectedDelay: "5.8 hours",
        affectedSegment: "Teesta River High Water Swell (NH10)",
        recommendedAction: "Stage heavy vehicles at Sevoke Military Yard; single-lane pilot escort",
        probability: "72%",
        time: "+40%",
        cost: "+25%",
        risk: "+65%",
      }
    }
  },
  "DRV-003": {
    driverId: "DRV-003",
    driverName: "Luwang Singh",
    carrier: "BharatBenz 2823R (Heavy Duty)",
    corridorName: "Kohima → Imphal (NH2 Mountain Ridge)",
    originCity: "Kohima",
    destCity: "Imphal",
    mapCenter: [25.28, 94.02],
    mapZoom: 9,
    hazardName: "Mudslide & Highway Blockage",
    hazardType: "Major Mountain Highway Mudslide",
    hazardProbability: "92%",
    hazardCoords: [25.1500, 93.9800],
    hazardRadius: 15000,
    floodPolygon: [
      [25.12, 93.94],
      [25.18, 93.96],
      [25.17, 94.02],
      [25.10, 93.99]
    ],
    openSegment: [
      [25.6751, 94.1086], // Kohima
      [25.5500, 94.0500], // Zubza
      [25.3200, 94.0200], // Maram
    ],
    blockedSegment: [
      [25.3200, 94.0200], // Maram
      [25.1500, 93.9800], // Senapati Bottleneck
      [24.9800, 93.9500], // Kangpokpi
    ],
    detourSegment: [
      [25.5500, 94.0500], // Zubza
      [25.3500, 93.7500], // Peren Ridge Pass
      [25.0200, 93.6500], // Tamenglong Road
      [24.8170, 93.9368], // Imphal Freight Depot
    ],
    destSegment: [
      [24.9800, 93.9500],
      [24.8170, 93.9368],
    ],
    vehicleLocation: [25.1500, 93.9800],
    vehicleLabel: "Luwang Singh (BharatBenz)",
    cities: [
      { name: "Kohima Staging", coords: [25.6751, 94.1086] },
      { name: "Maram Ridge", coords: [25.3200, 94.0200] },
      { name: "Senapati (Blocked)", coords: [25.1500, 93.9800] },
      { name: "Peren Detour Link", coords: [25.3500, 93.7500] },
      { name: "Imphal Depot", coords: [24.8170, 93.9368] },
    ],
    insights: {
      expectedDelay: "8.6 hours",
      affectedSegment: "Maram - Senapati Valley Sector (26 km)",
      recommendedAction: "Autonomous diversion via Peren - Tamenglong Mountain Link",
    },
    scenarioImpact: {
      time: "+65%",
      cost: "+45%",
      risk: "+88%",
    },
    scenarios: {
      "Heavy Rainfall": {
        expectedDelay: "8.6 hours",
        affectedSegment: "Maram - Senapati Valley Sector (26 km)",
        recommendedAction: "Autonomous diversion via Peren - Tamenglong Mountain Link",
        probability: "92%",
        time: "+65%",
        cost: "+45%",
        risk: "+88%",
      },
      "Landslide": {
        expectedDelay: "14.5 hours",
        affectedSegment: "NH2 Complete Slope Collapse (Senapati Pass)",
        recommendedAction: "Emergency halt at Zubza Logistics Park. Dispatch heavy earthmovers.",
        probability: "98%",
        time: "+110%",
        cost: "+75%",
        risk: "+96%",
      },
      "Flash Floods": {
        expectedDelay: "6.2 hours",
        affectedSegment: "Barak River Headwaters Causeway (NH2)",
        recommendedAction: "High-clearance vehicles only; single-file convoy protocol",
        probability: "75%",
        time: "+42%",
        cost: "+28%",
        risk: "+70%",
      }
    }
  },
  "DRV-002": {
    driverId: "DRV-002",
    driverName: "Wanphrang Nongrum",
    carrier: "Eicher Pro 2049 (Reefer)",
    corridorName: "Guwahati → Shillong (NH6 Meghalaya Arterial)",
    originCity: "Guwahati",
    destCity: "Shillong",
    mapCenter: [25.85, 91.85],
    mapZoom: 10,
    hazardName: "Flash Flood & Slope Slip",
    hazardType: "Umiam Lake Basin Flash Flood",
    hazardProbability: "68%",
    hazardCoords: [25.6880, 91.9050],
    hazardRadius: 10000,
    floodPolygon: [
      [25.66, 91.88],
      [25.72, 91.89],
      [25.70, 91.93],
      [25.65, 91.92]
    ],
    openSegment: [
      [26.1445, 91.7362], // Guwahati
      [26.0680, 91.8150], // Jorabat
      [25.9030, 91.8790], // Nongpoh
    ],
    blockedSegment: [
      [25.9030, 91.8790], // Nongpoh
      [25.6880, 91.9050], // Barapani Umiam
    ],
    detourSegment: [
      [25.9030, 91.8790], // Nongpoh
      [25.8200, 91.9600], // Umden Scenic Pass
      [25.6500, 91.9500], // NEIGRIHMS Bypass
      [25.5788, 91.8933], // Shillong
    ],
    destSegment: [
      [25.6880, 91.9050],
      [25.5788, 91.8933],
    ],
    vehicleLocation: [25.9030, 91.8790],
    vehicleLabel: "Wanphrang (Eicher Reefer)",
    cities: [
      { name: "Guwahati Hub", coords: [26.1445, 91.7362] },
      { name: "Jorabat Toll", coords: [26.0680, 91.8150] },
      { name: "Nongpoh (Staged)", coords: [25.9030, 91.8790] },
      { name: "Barapani (Inundated)", coords: [25.6880, 91.9050] },
      { name: "Shillong Peak Terminal", coords: [25.5788, 91.8933] },
    ],
    insights: {
      expectedDelay: "3.6 hours",
      affectedSegment: "Nongpoh - Barapani Basin (34 km)",
      recommendedAction: "Reroute sensitive vaccine cargo via Umden-Mawlyndep Bypass",
    },
    scenarioImpact: {
      time: "+28%",
      cost: "+18%",
      risk: "+45%",
    },
    scenarios: {
      "Heavy Rainfall": {
        expectedDelay: "3.6 hours",
        affectedSegment: "Nongpoh - Barapani Basin (34 km)",
        recommendedAction: "Reroute sensitive vaccine cargo via Umden-Mawlyndep Bypass",
        probability: "68%",
        time: "+28%",
        cost: "+18%",
        risk: "+45%",
      },
      "Landslide": {
        expectedDelay: "6.5 hours",
        affectedSegment: "NH6 4-Lane Hill Cut Collapse (Jorabat Gateway)",
        recommendedAction: "Divert via Byrnihat Rural Arterial with police pilot",
        probability: "82%",
        time: "+48%",
        cost: "+30%",
        risk: "+68%",
      },
      "Flash Floods": {
        expectedDelay: "4.8 hours",
        affectedSegment: "Umiam Lake Overflow & Submerged Causeways",
        recommendedAction: "Stage temperature-controlled reefers at Nongpoh cold park",
        probability: "75%",
        time: "+35%",
        cost: "+22%",
        risk: "+55%",
      }
    }
  },
  "DRV-004": {
    driverId: "DRV-004",
    driverName: "Bikash Debbarma",
    carrier: "Mahindra Furio 11 (Light)",
    corridorName: "Agartala → Aizawl (NH8 / NH208)",
    originCity: "Agartala",
    destCity: "Aizawl",
    mapCenter: [23.95, 92.05],
    mapZoom: 9,
    hazardName: "Mountain Ridge Slip & Cloudburst",
    hazardType: "Jampui Hills Mountain Ridge Slip",
    hazardProbability: "74%",
    hazardCoords: [24.1200, 92.4200],
    hazardRadius: 16000,
    floodPolygon: [
      [24.08, 92.38],
      [24.16, 92.40],
      [24.14, 92.46],
      [24.07, 92.44]
    ],
    openSegment: [
      [23.8315, 91.2868], // Agartala
      [23.9400, 91.6800], // Teliamura
      [24.1800, 92.0200], // Kumarghat
    ],
    blockedSegment: [
      [24.1800, 92.0200], // Kumarghat
      [24.1200, 92.4200], // Kanchanpur Jampui Ridge
    ],
    detourSegment: [
      [24.1800, 92.0200], // Kumarghat
      [24.3800, 92.1500], // Dharmanagar
      [24.1500, 92.6500], // Vairengte Inter-State Link
      [23.7271, 92.7176], // Aizawl
    ],
    destSegment: [
      [24.1200, 92.4200],
      [23.8900, 92.5600],
      [23.7271, 92.7176],
    ],
    vehicleLocation: [24.1800, 92.0200],
    vehicleLabel: "Bikash (Mahindra Furio)",
    cities: [
      { name: "Agartala Zone", coords: [23.8315, 91.2868] },
      { name: "Kumarghat Bypass", coords: [24.1800, 92.0200] },
      { name: "Jampui Ridge (Blocked)", coords: [24.1200, 92.4200] },
      { name: "Dharmanagar Byway", coords: [24.3800, 92.1500] },
      { name: "Aizawl Terminal", coords: [23.7271, 92.7176] },
    ],
    insights: {
      expectedDelay: "6.2 hours",
      affectedSegment: "Kumarghat - Kanchanpur Sector (44 km)",
      recommendedAction: "Take alternate northern interstate byway via Dharmanagar",
    },
    scenarioImpact: {
      time: "+42%",
      cost: "+28%",
      risk: "+65%",
    },
    scenarios: {
      "Heavy Rainfall": {
        expectedDelay: "6.2 hours",
        affectedSegment: "Kumarghat - Kanchanpur Sector (44 km)",
        recommendedAction: "Take alternate northern interstate byway via Dharmanagar",
        probability: "74%",
        time: "+42%",
        cost: "+28%",
        risk: "+65%",
      },
      "Landslide": {
        expectedDelay: "10.8 hours",
        affectedSegment: "Jampui Pass Major Earth Slip",
        recommendedAction: "Divert via Silchar-Kolasib Corridor (NH306)",
        probability: "89%",
        time: "+70%",
        cost: "+50%",
        risk: "+85%",
      },
      "Flash Floods": {
        expectedDelay: "5.1 hours",
        affectedSegment: "Manu River Inundation & Culvert Washout",
        recommendedAction: "Halt at Bodhjungnagar Logistics Depot until water recedes",
        probability: "68%",
        time: "+32%",
        cost: "+20%",
        risk: "+52%",
      }
    }
  }
};

export const DIGITAL_TWIN_SCENARIOS = {
  "Heavy Rainfall": {
    intensity: "High",
    hazardCallout: {
      title: "Landslide Risk",
      probability: "84%",
      location: "Teesta Bazaar Gorge (NH10)",
      coords: [27.1300, 88.5000],
    },
    insights: {
      expectedDelay: "7.4 hours",
      affectedSegment: "Sevoke - Teesta Bazaar Gorge (38 km)",
      recommendedAction: "Autonomous reroute via Damdim - Lava Forest Arterial (NH717A)",
    },
    scenarioImpact: {
      time: "+52%",
      cost: "+35%",
      risk: "+78%",
    },
    roadSegments: [
      { name: "Segment A (Open)", status: "Road Open", color: "#10b981" },
      { name: "Segment B (At Risk)", status: "At Risk", color: "#f59e0b" },
      { name: "Segment C (Blocked)", status: "Blocked", color: "#ef4444" },
      { name: "Segment D (Flood Area)", status: "Flood Area", color: "#06b6d4" },
    ],
  },
  "Landslide": {
    intensity: "Severe",
    hazardCallout: {
      title: "Mountain Landslide & Rockfall",
      probability: "94%",
      location: "NH10 Mile 29 Rockfall Barrier",
      coords: [27.1300, 88.5000],
    },
    insights: {
      expectedDelay: "11.2 hours",
      affectedSegment: "NH10 Mile 29 Rockfall & Mud Barrier",
      recommendedAction: "Full corridor closure. Divert via Reshi-Rongli Himalayan Corridor",
    },
    scenarioImpact: {
      time: "+80%",
      cost: "+60%",
      risk: "+95%",
    },
    roadSegments: [
      { name: "Segment A (Open)", status: "Road Open", color: "#10b981" },
      { name: "Segment B (At Risk)", status: "At Risk", color: "#f59e0b" },
      { name: "Segment C (Blocked)", status: "Blocked", color: "#ef4444" },
      { name: "Segment D (Flood Area)", status: "Flood Area", color: "#06b6d4" },
    ],
  },
  "Flash Floods": {
    intensity: "Medium",
    hazardCallout: {
      title: "Flash Flood & Slope Erosion",
      probability: "72%",
      location: "Teesta River High Water Swell (NH10)",
      coords: [27.1300, 88.5000],
    },
    insights: {
      expectedDelay: "5.8 hours",
      affectedSegment: "Teesta River High Water Swell (NH10)",
      recommendedAction: "Stage heavy vehicles at Sevoke Military Yard; single-lane pilot escort",
    },
    scenarioImpact: {
      time: "+40%",
      cost: "+25%",
      risk: "+65%",
    },
    roadSegments: [
      { name: "Segment A (Open)", status: "Road Open", color: "#10b981" },
      { name: "Segment B (At Risk)", status: "At Risk", color: "#f59e0b" },
      { name: "Segment C (Blocked)", status: "Blocked", color: "#ef4444" },
      { name: "Segment D (Flood Area)", status: "Flood Area", color: "#06b6d4" },
    ],
  },
};

export const REPORTS_DATA = {
  accessibilityScore: {
    score: 78,
    maxScore: 100,
    statusText: "Good Accessibility",
    subtext: "Most routes are accessible, with minor risk in 2 regions.",
  },
  riskDistribution: {
    low: { percentage: 68, label: "Low Risk", color: "#10b981" },
    medium: { percentage: 22, label: "Medium Risk", color: "#f59e0b" },
    high: { percentage: 10, label: "High Risk", color: "#ef4444" },
  },
  shipmentPerformance: [
    { label: "On Time", percentage: 92, color: "#10b981" },
    { label: "Delayed", percentage: 6, color: "#ef4444" },
    { label: "Cancelled", percentage: 2, color: "#64748b" },
  ],
  topRiskLocations: [
    {
      location: "Tirupati",
      riskLevel: "High",
      reason: "Landslide + Heavy Rainfall",
      affectedCorridor: "NH71 / Ghat Section",
    },
    {
      location: "Nellore",
      riskLevel: "Medium",
      reason: "Flood Risk",
      affectedCorridor: "Pennar River Inundation",
    },
    {
      location: "Vijayawada",
      riskLevel: "Medium",
      reason: "Traffic Congestion",
      affectedCorridor: "NH16 Junction Chokepoint",
    },
    {
      location: "Vizag Port Road",
      riskLevel: "Low",
      reason: "Heavy Container Queue",
      affectedCorridor: "Port Gate 3 Ingress",
    },
  ],
  recentAlerts: [
    {
      id: "alt-1",
      title: "Heavy rainfall alert for Tirupati region",
      timestamp: "12 Jun, 09:20",
      severity: "high",
    },
    {
      id: "alt-2",
      title: "Road blockage on NH16",
      timestamp: "12 Jun, 08:15",
      severity: "medium",
    },
    {
      id: "alt-3",
      title: "Delay predicted for SHP003",
      timestamp: "12 Jun, 07:30",
      severity: "warning",
    },
    {
      id: "alt-4",
      title: "Weather change detected (Kolkata)",
      timestamp: "11 Jun, 23:45",
      severity: "info",
    },
  ],
};
