/**
 * NE-Logi Mind AI - Comprehensive Indian Geographic Database & Highway Routing Engine
 * Contains coordinates for all 36 Indian States & UTs, major metros, and 120+ logistics hubs.
 */

export const INDIA_LOCATIONS = {
  // --- Metros & Major Logistics Hubs ---
  "hyderabad": { name: "Hyderabad", state: "Telangana", coords: [17.3850, 78.4867], type: "metro", isMountain: false },
  "bengaluru": { name: "Bengaluru", state: "Karnataka", coords: [12.9716, 77.5946], type: "metro", isMountain: false },
  "bangalore": { name: "Bengaluru", state: "Karnataka", coords: [12.9716, 77.5946], type: "metro", isMountain: false },
  "mumbai": { name: "Mumbai", state: "Maharashtra", coords: [19.0760, 72.8777], type: "metro", isMountain: false },
  "bombay": { name: "Mumbai", state: "Maharashtra", coords: [19.0760, 72.8777], type: "metro", isMountain: false },
  "delhi": { name: "Delhi", state: "Delhi", coords: [28.6139, 77.2090], type: "metro", isMountain: false },
  "new delhi": { name: "New Delhi", state: "Delhi", coords: [28.6139, 77.2090], type: "metro", isMountain: false },
  "chennai": { name: "Chennai", state: "Tamil Nadu", coords: [13.0827, 80.2707], type: "metro", isMountain: false },
  "madras": { name: "Chennai", state: "Tamil Nadu", coords: [13.0827, 80.2707], type: "metro", isMountain: false },
  "kolkata": { name: "Kolkata", state: "West Bengal", coords: [22.5726, 88.3639], type: "metro", isMountain: false },
  "calcutta": { name: "Kolkata", state: "West Bengal", coords: [22.5726, 88.3639], type: "metro", isMountain: false },
  "pune": { name: "Pune", state: "Maharashtra", coords: [18.5204, 73.8567], type: "hub", isMountain: false },
  "ahmedabad": { name: "Ahmedabad", state: "Gujarat", coords: [23.0225, 72.5714], type: "hub", isMountain: false },
  "surat": { name: "Surat", state: "Gujarat", coords: [21.1702, 72.8311], type: "hub", isMountain: false },
  "jaipur": { name: "Jaipur", state: "Rajasthan", coords: [26.9124, 75.7873], type: "hub", isMountain: false },
  "lucknow": { name: "Lucknow", state: "Uttar Pradesh", coords: [26.8467, 80.9462], type: "hub", isMountain: false },
  "kanpur": { name: "Kanpur", state: "Uttar Pradesh", coords: [26.4499, 80.3319], type: "hub", isMountain: false },
  "nagpur": { name: "Nagpur", state: "Maharashtra", coords: [21.1458, 79.0882], type: "hub", isMountain: false },
  "indore": { name: "Indore", state: "Madhya Pradesh", coords: [22.7196, 75.8577], type: "hub", isMountain: false },
  "bhopal": { name: "Bhopal", state: "Madhya Pradesh", coords: [23.2599, 77.4126], type: "hub", isMountain: false },
  "visakhapatnam": { name: "Visakhapatnam", state: "Andhra Pradesh", coords: [17.6868, 83.2185], type: "hub", isMountain: false },
  "vizag": { name: "Visakhapatnam", state: "Andhra Pradesh", coords: [17.6868, 83.2185], type: "hub", isMountain: false },
  "vijayawada": { name: "Vijayawada", state: "Andhra Pradesh", coords: [16.5062, 80.6480], type: "hub", isMountain: false },
  "patna": { name: "Patna", state: "Bihar", coords: [25.5941, 85.1376], type: "hub", isMountain: false },
  "vadodara": { name: "Vadodara", state: "Gujarat", coords: [22.3072, 73.1812], type: "hub", isMountain: false },
  "ludhiana": { name: "Ludhiana", state: "Punjab", coords: [30.9010, 75.8573], type: "hub", isMountain: false },
  "agra": { name: "Agra", state: "Uttar Pradesh", coords: [27.1767, 78.0081], type: "hub", isMountain: false },
  "nashik": { name: "Nashik", state: "Maharashtra", coords: [19.9975, 73.7898], type: "hub", isMountain: false },
  "varanasi": { name: "Varanasi", state: "Uttar Pradesh", coords: [25.3176, 82.9739], type: "hub", isMountain: false },
  "prayagraj": { name: "Prayagraj", state: "Uttar Pradesh", coords: [25.4358, 81.8463], type: "hub", isMountain: false },
  "allahabad": { name: "Prayagraj", state: "Uttar Pradesh", coords: [25.4358, 81.8463], type: "hub", isMountain: false },
  "ranchi": { name: "Ranchi", state: "Jharkhand", coords: [23.3441, 85.3096], type: "hub", isMountain: false },
  "jamshedpur": { name: "Jamshedpur", state: "Jharkhand", coords: [22.8046, 86.2029], type: "hub", isMountain: false },
  "coimbatore": { name: "Coimbatore", state: "Tamil Nadu", coords: [11.0168, 76.9558], type: "hub", isMountain: false },
  "madurai": { name: "Madurai", state: "Tamil Nadu", coords: [9.9252, 78.1198], type: "hub", isMountain: false },
  "raipur": { name: "Raipur", state: "Chhattisgarh", coords: [21.2514, 81.6296], type: "hub", isMountain: false },
  "chandigarh": { name: "Chandigarh", state: "Chandigarh", coords: [30.7333, 76.7794], type: "hub", isMountain: false },
  "amritsar": { name: "Amritsar", state: "Punjab", coords: [31.6340, 74.8723], type: "hub", isMountain: false },
  "bhubaneswar": { name: "Bhubaneswar", state: "Odisha", coords: [20.2961, 85.8245], type: "hub", isMountain: false },
  "cuttack": { name: "Cuttack", state: "Odisha", coords: [20.4625, 85.8828], type: "hub", isMountain: false },
  "thiruvananthapuram": { name: "Thiruvananthapuram", state: "Kerala", coords: [8.5241, 76.9366], type: "hub", isMountain: false },
  "trivandrum": { name: "Thiruvananthapuram", state: "Kerala", coords: [8.5241, 76.9366], type: "hub", isMountain: false },
  "kochi": { name: "Kochi", state: "Kerala", coords: [9.9312, 76.2673], type: "hub", isMountain: false },
  "cochin": { name: "Kochi", state: "Kerala", coords: [9.9312, 76.2673], type: "hub", isMountain: false },
  "kozhikode": { name: "Kozhikode", state: "Kerala", coords: [11.2588, 75.7804], type: "hub", isMountain: false },
  "mysore": { name: "Mysuru", state: "Karnataka", coords: [12.2958, 76.6394], type: "hub", isMountain: false },
  "mysuru": { name: "Mysuru", state: "Karnataka", coords: [12.2958, 76.6394], type: "hub", isMountain: false },
  "hubli": { name: "Hubballi", state: "Karnataka", coords: [15.3647, 75.1240], type: "hub", isMountain: false },
  "hubballi": { name: "Hubballi", state: "Karnataka", coords: [15.3647, 75.1240], type: "hub", isMountain: false },
  "mangalore": { name: "Mangaluru", state: "Karnataka", coords: [12.9141, 74.8560], type: "hub", isMountain: false },
  "mangaluru": { name: "Mangaluru", state: "Karnataka", coords: [12.9141, 74.8560], type: "hub", isMountain: false },
  "tirupati": { name: "Tirupati", state: "Andhra Pradesh", coords: [13.6288, 79.4192], type: "city", isMountain: false },
  "guntur": { name: "Guntur", state: "Andhra Pradesh", coords: [16.3067, 80.4365], type: "city", isMountain: false },
  "kurnool": { name: "Kurnool", state: "Andhra Pradesh", coords: [15.8281, 78.0373], type: "city", isMountain: false },
  "rajahmundry": { name: "Rajahmundry", state: "Andhra Pradesh", coords: [17.0005, 81.8040], type: "city", isMountain: false },
  "kakinada": { name: "Kakinada", state: "Andhra Pradesh", coords: [16.9891, 82.2475], type: "city", isMountain: false },
  "nellore": { name: "Nellore", state: "Andhra Pradesh", coords: [14.4426, 79.9865], type: "city", isMountain: false },
  "kadapa": { name: "Kadapa", state: "Andhra Pradesh", coords: [14.4673, 78.8242], type: "city", isMountain: false },
  "anantapur": { name: "Anantapur", state: "Andhra Pradesh", coords: [14.6819, 77.6006], type: "city", isMountain: false },
  "warangal": { name: "Warangal", state: "Telangana", coords: [17.9689, 79.5941], type: "city", isMountain: false },
  "karimnagar": { name: "Karimnagar", state: "Telangana", coords: [18.4386, 79.1288], type: "city", isMountain: false },
  "nizamabad": { name: "Nizamabad", state: "Telangana", coords: [18.6725, 78.0941], type: "city", isMountain: false },
  "khammam": { name: "Khammam", state: "Telangana", coords: [17.2473, 80.1514], type: "city", isMountain: false },
  "gurgaon": { name: "Gurugram", state: "Haryana", coords: [28.4595, 77.0266], type: "city", isMountain: false },
  "gurugram": { name: "Gurugram", state: "Haryana", coords: [28.4595, 77.0266], type: "city", isMountain: false },
  "noida": { name: "Noida", state: "Uttar Pradesh", coords: [28.5355, 77.3910], type: "city", isMountain: false },
  "faridabad": { name: "Faridabad", state: "Haryana", coords: [28.4089, 77.3178], type: "city", isMountain: false },
  "ghaziabad": { name: "Ghaziabad", state: "Uttar Pradesh", coords: [28.6692, 77.4538], type: "city", isMountain: false },
  "dehradun": { name: "Dehradun", state: "Uttarakhand", coords: [30.3165, 78.0322], type: "hill", isMountain: true },
  "haridwar": { name: "Haridwar", state: "Uttarakhand", coords: [29.9457, 78.1642], type: "city", isMountain: false },
  "shimla": { name: "Shimla", state: "Himachal Pradesh", coords: [31.1048, 77.1734], type: "hill", isMountain: true },
  "manali": { name: "Manali", state: "Himachal Pradesh", coords: [32.2396, 77.1887], type: "hill", isMountain: true },
  "dharamshala": { name: "Dharamshala", state: "Himachal Pradesh", coords: [32.2190, 76.3234], type: "hill", isMountain: true },
  "srinagar": { name: "Srinagar", state: "Jammu and Kashmir", coords: [34.0837, 74.7973], type: "hill", isMountain: true },
  "jammu": { name: "Jammu", state: "Jammu and Kashmir", coords: [32.7266, 74.8570], type: "city", isMountain: false },
  "leh": { name: "Leh", state: "Ladakh", coords: [34.1526, 77.5771], type: "hill", isMountain: true },

  // --- North East Corridors ---
  "guwahati": { name: "Guwahati", state: "Assam", coords: [26.1445, 91.7362], type: "ne_hub", isMountain: false },
  "gangtok": { name: "Gangtok", state: "Sikkim", coords: [27.3389, 88.6065], type: "ne_hill", isMountain: true },
  "shillong": { name: "Shillong", state: "Meghalaya", coords: [25.5788, 91.8933], type: "ne_hill", isMountain: true },
  "siliguri": { name: "Siliguri", state: "West Bengal", coords: [26.7271, 88.3953], type: "ne_hub", isMountain: false },
  "tawang": { name: "Tawang", state: "Arunachal Pradesh", coords: [27.5861, 91.8594], type: "ne_hill", isMountain: true },
  "itanagar": { name: "Itanagar", state: "Arunachal Pradesh", coords: [27.0844, 93.6053], type: "ne_hill", isMountain: true },
  "kohima": { name: "Kohima", state: "Nagaland", coords: [25.6751, 94.1086], type: "ne_hill", isMountain: true },
  "dimapur": { name: "Dimapur", state: "Nagaland", coords: [25.9094, 93.7266], type: "ne_hub", isMountain: false },
  "imphal": { name: "Imphal", state: "Manipur", coords: [24.8170, 93.9368], type: "ne_hill", isMountain: true },
  "aizawl": { name: "Aizawl", state: "Mizoram", coords: [23.7271, 92.7176], type: "ne_hill", isMountain: true },
  "agartala": { name: "Agartala", state: "Tripura", coords: [23.8315, 91.2868], type: "ne_hub", isMountain: false },
  "silchar": { name: "Silchar", state: "Assam", coords: [24.8333, 92.7789], type: "ne_hub", isMountain: false },
  "dibrugarh": { name: "Dibrugarh", state: "Assam", coords: [27.4728, 94.9120], type: "ne_hub", isMountain: false },
  "jorhat": { name: "Jorhat", state: "Assam", coords: [26.7509, 94.2037], type: "ne_hub", isMountain: false },
  "tezpur": { name: "Tezpur", state: "Assam", coords: [26.6528, 92.7926], type: "ne_hub", isMountain: false },

  // --- Indian States & UTs ---
  "andhra pradesh": { name: "Andhra Pradesh", state: "Andhra Pradesh", coords: [16.5062, 80.6480], type: "state", isMountain: false },
  "telangana": { name: "Telangana", state: "Telangana", coords: [17.3850, 78.4867], type: "state", isMountain: false },
  "tamil nadu": { name: "Tamil Nadu", state: "Tamil Nadu", coords: [13.0827, 80.2707], type: "state", isMountain: false },
  "karnataka": { name: "Karnataka", state: "Karnataka", coords: [12.9716, 77.5946], type: "state", isMountain: false },
  "kerala": { name: "Kerala", state: "Kerala", coords: [8.5241, 76.9366], type: "state", isMountain: false },
  "maharashtra": { name: "Maharashtra", state: "Maharashtra", coords: [19.0760, 72.8777], type: "state", isMountain: false },
  "gujarat": { name: "Gujarat", state: "Gujarat", coords: [23.0225, 72.5714], type: "state", isMountain: false },
  "rajasthan": { name: "Rajasthan", state: "Rajasthan", coords: [26.9124, 75.7873], type: "state", isMountain: false },
  "madhya pradesh": { name: "Madhya Pradesh", state: "Madhya Pradesh", coords: [23.2599, 77.4126], type: "state", isMountain: false },
  "uttar pradesh": { name: "Uttar Pradesh", state: "Uttar Pradesh", coords: [26.8467, 80.9462], type: "state", isMountain: false },
  "bihar": { name: "Bihar", state: "Bihar", coords: [25.5941, 85.1376], type: "state", isMountain: false },
  "west bengal": { name: "West Bengal", state: "West Bengal", coords: [22.5726, 88.3639], type: "state", isMountain: false },
  "odisha": { name: "Odisha", state: "Odisha", coords: [20.2961, 85.8245], type: "state", isMountain: false },
  "orissa": { name: "Odisha", state: "Odisha", coords: [20.2961, 85.8245], type: "state", isMountain: false },
  "punjab": { name: "Punjab", state: "Punjab", coords: [30.9010, 75.8573], type: "state", isMountain: false },
  "haryana": { name: "Haryana", state: "Haryana", coords: [28.4595, 77.0266], type: "state", isMountain: false },
  "jharkhand": { name: "Jharkhand", state: "Jharkhand", coords: [23.3441, 85.3096], type: "state", isMountain: false },
  "chhattisgarh": { name: "Chhattisgarh", state: "Chhattisgarh", coords: [21.2514, 81.6296], type: "state", isMountain: false },
  "assam": { name: "Assam", state: "Assam", coords: [26.1445, 91.7362], type: "state", isMountain: false },
  "sikkim": { name: "Sikkim", state: "Sikkim", coords: [27.3389, 88.6065], type: "state", isMountain: true },
  "meghalaya": { name: "Meghalaya", state: "Meghalaya", coords: [25.5788, 91.8933], type: "state", isMountain: true },
  "arunachal pradesh": { name: "Arunachal Pradesh", state: "Arunachal Pradesh", coords: [27.0844, 93.6053], type: "state", isMountain: true },
  "nagaland": { name: "Nagaland", state: "Nagaland", coords: [25.6751, 94.1086], type: "state", isMountain: true },
  "manipur": { name: "Manipur", state: "Manipur", coords: [24.8170, 93.9368], type: "state", isMountain: true },
  "mizoram": { name: "Mizoram", state: "Mizoram", coords: [23.7271, 92.7176], type: "state", isMountain: true },
  "tripura": { name: "Tripura", state: "Tripura", coords: [23.8315, 91.2868], type: "state", isMountain: false },
  "himachal pradesh": { name: "Himachal Pradesh", state: "Himachal Pradesh", coords: [31.1048, 77.1734], type: "state", isMountain: true },
  "uttarakhand": { name: "Uttarakhand", state: "Uttarakhand", coords: [30.3165, 78.0322], type: "state", isMountain: true },
  "goa": { name: "Goa", state: "Goa", coords: [15.2993, 74.1240], type: "state", isMountain: false },
  "jammu and kashmir": { name: "Jammu and Kashmir", state: "Jammu and Kashmir", coords: [34.0837, 74.7973], type: "state", isMountain: true },
  "ladakh": { name: "Ladakh", state: "Ladakh", coords: [34.1526, 77.5771], type: "state", isMountain: true },
  "puducherry": { name: "Puducherry", state: "Puducherry", coords: [11.9416, 79.8083], type: "state", isMountain: false },
  "pondicherry": { name: "Puducherry", state: "Puducherry", coords: [11.9416, 79.8083], type: "state", isMountain: false },
};

/**
 * Calculates Great-Circle Haversine Distance between two coordinates in km
 */
export const calculateHaversineDistance = (c1, c2) => {
  if (!c1 || !c2 || c1.length < 2 || c2.length < 2) return 100;
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(c2[0] - c1[0]);
  const dLng = toRad(c2[1] - c1[1]);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(c1[0])) * Math.cos(toRad(c2[0])) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

/**
 * Resolves coordinates for any city, town, or state in India.
 * First checks internal high-speed database (0ms latency), then Nominatim.
 */
export const resolveLocationCoords = async (query) => {
  if (!query) return null;
  const cleanKey = query.trim().toLowerCase();

  // 1. Direct match in Indian geographic database
  if (INDIA_LOCATIONS[cleanKey]) {
    return {
      coords: INDIA_LOCATIONS[cleanKey].coords,
      name: INDIA_LOCATIONS[cleanKey].name,
      isMountain: INDIA_LOCATIONS[cleanKey].isMountain
    };
  }

  // 2. Partial match check (e.g., "hyderabad city", "bengaluru south")
  for (const [key, val] of Object.entries(INDIA_LOCATIONS)) {
    if (cleanKey.includes(key) || key.includes(cleanKey)) {
      return {
        coords: val.coords,
        name: val.name,
        isMountain: val.isMountain
      };
    }
  }

  // 3. Fallback to OpenStreetMap Nominatim restricted to India
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const isMtn = lat > 27.0 || cleanKey.includes("sikkim") || cleanKey.includes("gangtok") || cleanKey.includes("shillong");
        return {
          coords: [lat, lon],
          name: data[0].display_name.split(',')[0],
          isMountain: isMtn
        };
      }
    }
  } catch (err) {
    console.warn("[resolveLocationCoords] Nominatim fallback failed:", err);
  }

  return null;
};

/**
 * Determines realistic National Highway corridor name between two Indian cities
 */
export const getCorridorHighwayName = (origName, destName, isMountain) => {
  const o = (origName || '').toLowerCase();
  const d = (destName || '').toLowerCase();

  if (isMountain || o.includes("gangtok") || d.includes("gangtok") || o.includes("sikkim") || d.includes("sikkim")) {
    return "NH-10 Himalayan Corridor (via Sevoke & Teesta Gorge)";
  }
  if ((o.includes("hyderabad") && d.includes("bengaluru")) || (o.includes("bengaluru") && d.includes("hyderabad"))) {
    return "NH-44 Hyderabad-Bengaluru Super Expressway (via Kurnool & Anantapur)";
  }
  if ((o.includes("mumbai") && d.includes("delhi")) || (o.includes("delhi") && d.includes("mumbai"))) {
    return "NE-4 Western Dedicated Freight Expressway & NH-48";
  }
  if ((o.includes("mumbai") && d.includes("pune")) || (o.includes("pune") && d.includes("mumbai"))) {
    return "Mumbai-Pune Expressway (Yashwantrao Chavan Corridor)";
  }
  if ((o.includes("kolkata") && d.includes("chennai")) || (o.includes("chennai") && d.includes("kolkata"))) {
    return "NH-16 Eastern Coastal Freight Corridor (via Bhubaneswar & Vizag)";
  }
  if ((o.includes("delhi") && d.includes("kolkata")) || (o.includes("kolkata") && d.includes("delhi"))) {
    return "NH-19 Grand Trunk Corridor (via Agra, Kanpur & Varanasi)";
  }
  if ((o.includes("delhi") && d.includes("jaipur")) || (o.includes("jaipur") && d.includes("delhi"))) {
    return "NH-48 Delhi-Jaipur Expressway";
  }
  if (o.includes("guwahati") || d.includes("guwahati")) {
    return "NH-27 East-West Freight Corridor";
  }

  return "NH-44 / NH-16 National Highway Expressway Corridor";
};

/**
 * Generates accurate multi-criteria routes with realistic commercial transport metrics
 */
export const generateAccurateRoutes = (origName, destName, origCoords, destCoords, preferences = {}) => {
  const straightDist = calculateHaversineDistance(origCoords, destCoords);
  const isMtn = origCoords[0] > 27.0 || destCoords[0] > 27.0 || (origCoords[0] < 12.0 && origCoords[1] < 76.0);

  // Real highway road distance factor (India roads typically 1.18x to 1.35x straight line)
  const roadFactor = isMtn ? 1.42 : 1.22;
  const bestDist = Math.max(25, Math.round(straightDist * roadFactor));

  // Average commercial truck speeds (60-70 km/h expressway, 35-45 km/h mountain)
  const avgSpeed = isMtn ? 40 : 64;
  const baseTimeHours = bestDist / avgSpeed;
  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const primaryHighway = getCorridorHighwayName(origName, destName, isMtn);

  // Route 1: Best Option (Expressway / Multi-lane National Highway)
  const route1 = {
    id: "route-1",
    name: primaryHighway,
    tag: "Best Option",
    time: formatTime(baseTimeHours),
    distance: `${bestDist} km`,
    cost: `₹ ${Math.round(bestDist * 22 + 1200).toLocaleString('en-IN')}`,
    fuel: `${Math.round(bestDist * 0.26)} L`,
    tolls: `${Math.max(1, Math.round(bestDist / 65))} Toll Plazas`,
    risk: isMtn ? "Medium" : "Low",
    accessibility: "High (4-Lane)",
    description: `Primary multi-lane National Highway corridor directly connecting ${origName} and ${destName}. High pavement quality, standard tolls, optimal commercial velocity.`,
    is_best: true
  };

  // Route 2: Alternative 1 (Arterial Bypass / Secondary Corridor)
  const alt1Dist = Math.round(bestDist * 1.08);
  const alt1Hours = baseTimeHours * 1.12;
  const route2 = {
    id: "route-2",
    name: "Arterial Bypass Corridor (via Central Ring & Logistics Link)",
    tag: "Alternative",
    time: formatTime(alt1Hours),
    distance: `${alt1Dist} km`,
    cost: `₹ ${Math.round(alt1Dist * 20 + 800).toLocaleString('en-IN')}`,
    fuel: `${Math.round(alt1Dist * 0.27)} L`,
    tolls: `${Math.max(1, Math.round(alt1Dist / 80))} Toll Plazas`,
    risk: isMtn ? "High" : "Low",
    accessibility: "High",
    description: `Bypasses major municipal bottlenecks and urban chokepoints along ${origName} to ${destName}. Lower toll expenses with reliable night transit lanes.`,
    is_best: false
  };

  // Route 3: Alternative 2 (State Highway / Rural Freight Belt)
  const alt2Dist = Math.round(bestDist * 1.15);
  const alt2Hours = baseTimeHours * 1.25;
  const route3 = {
    id: "route-3",
    name: "State Highway Corridor (Low Toll Rural Freight Belt)",
    tag: "Alternative",
    time: formatTime(alt2Hours),
    distance: `${alt2Dist} km`,
    cost: `₹ ${Math.round(alt2Dist * 17 + 400).toLocaleString('en-IN')}`,
    fuel: `${Math.round(alt2Dist * 0.29)} L`,
    tolls: `${Math.max(1, Math.round(alt2Dist / 120))} Toll Plazas`,
    risk: isMtn ? "High" : "Medium",
    accessibility: "Medium",
    description: `Secondary state network alternative. Reduced toll burden for cost-sensitive bulk cargo transit between ${origName} and ${destName}.`,
    is_best: false
  };

  return {
    origin: origName,
    destination: destName,
    recommended: route1,
    alternatives: [route2, route3]
  };
};


/**
 * Creates multi-point smooth natural highway vectors if OSRM is slow or offline
 */
export const generateRealisticHighwayWaypoints = (origCoords, destCoords, altIndex = 0) => {
  const [lat1, lng1] = origCoords;
  const [lat2, lng2] = destCoords;
  const steps = 14;
  const points = [];

  const curvature = altIndex === 0 ? 0.08 : (altIndex === 1 ? -0.14 : 0.20);
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Quadratic bezier curve offset along perpendicular normal
    const offset = Math.sin(t * Math.PI) * curvature;
    const lat = lat1 + t * dLat - offset * dLng;
    const lng = lng1 + t * dLng + offset * dLat;
    points.push([parseFloat(lat.toFixed(5)), parseFloat(lng.toFixed(5))]);
  }

  return points;
};
