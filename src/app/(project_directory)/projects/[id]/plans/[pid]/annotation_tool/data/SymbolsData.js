// Symbol categories and their data
export const SYMBOL_CATEGORIES = [
  { id: "recently_used", label: "Recently Used" },
  { id: "audiovisual", label: "Audiovisual" },
  { id: "electrical", label: "Electrical" },
  { id: "electrical_de", label: "Electrical DE (Germany)" },
  { id: "fire_suppression", label: "Fire Suppression" },
  { id: "geometric", label: "Geometric Symbols" },
  { id: "mechanical", label: "Mechanical" },
];

// Symbol library - Each category has multiple symbols
export const SYMBOL_LIBRARY = {
  recently_used: [], // Will be populated dynamically based on usage
  
  audiovisual: [
    { id: "speaker", name: "Speaker", icon: "🔊", path: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" },
    { id: "microphone", name: "Microphone", icon: "🎤", path: "M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" },
    { id: "camera", name: "Camera", icon: "📷", path: "M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" },
    { id: "display", name: "Display", icon: "🖥️", path: "M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z" },
    { id: "projector", name: "Projector", icon: "📽️", path: "M20 4v12H8V4h12m0-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7.5 1.5h3v1h-3v-1zM20 20H4v-2h16v2z" },
  ],
  
  electrical: [
    { id: "battery", name: "Battery", icon: "🔋", path: "M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" },
    { id: "plug", name: "Plug", icon: "🔌", path: "M16 7V3h-2v4h-4V3H8v4h-.01C6.89 7 6 7.89 6 8.98v5.52C6 15.65 7.35 17 8.5 17v3h7v-3c1.15 0 2.5-1.35 2.5-2.5V8.98C18 7.89 17.11 7 16 7z" },
    { id: "switch", name: "Switch", icon: "💡", path: "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" },
    { id: "resistor", name: "Resistor", icon: "⚡", path: "M2 12h2l3-6 4 12 4-6 3 6h2" },
    { id: "capacitor", name: "Capacitor", icon: "⚙️", path: "M6 2v20M18 2v20" },
    { id: "transformer", name: "Transformer", icon: "🔄", path: "M7 2v20M17 2v20M12 6v12" },
  ],
  
  electrical_de: [
    { id: "de_socket", name: "Socket (DE)", icon: "🔌", path: "M4 8h4v4H4V8zm8 0h4v4h-4V8z" },
    { id: "de_switch", name: "Switch (DE)", icon: "⚡", path: "M12 2L2 12h3v8h14v-8h3L12 2z" },
    { id: "de_breaker", name: "Circuit Breaker", icon: "⚠️", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" },
    { id: "de_fuse", name: "Fuse (DE)", icon: "🔥", path: "M2 12h20M12 2v20" },
  ],
  
  fire_suppression: [
    { id: "fire_extinguisher", name: "Fire Extinguisher", icon: "🧯", path: "M12 2C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V22h8v-7.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" },
    { id: "sprinkler", name: "Sprinkler", icon: "💧", path: "M12 2L4 10h3v10h10V10h3L12 2zm0 4l4 4h-3v8H11v-8H8l4-4z" },
    { id: "fire_alarm", name: "Fire Alarm", icon: "🔔", path: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" },
    { id: "smoke_detector", name: "Smoke Detector", icon: "🚨", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" },
    { id: "fire_hose", name: "Fire Hose", icon: "🚒", path: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z" },
  ],
  
  geometric: [
    { id: "circle", name: "Circle", icon: "⭕", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" },
    { id: "square", name: "Square", icon: "⬜", path: "M3 3h18v18H3V3z" },
    { id: "triangle", name: "Triangle", icon: "🔺", path: "M12 2L2 22h20L12 2z" },
    { id: "hexagon", name: "Hexagon", icon: "⬡", path: "M17.5 5L21 12l-3.5 7h-11L3 12l3.5-7h11z" },
    { id: "star", name: "Star", icon: "⭐", path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
    { id: "pentagon", name: "Pentagon", icon: "⬟", path: "M12 2l7.5 5.5-3 9.5H5.5l-3-9.5L12 2z" },
  ],
  
  mechanical: [
    { id: "gear", name: "Gear", icon: "⚙️", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" },
    { id: "valve", name: "Valve", icon: "🔧", path: "M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" },
    { id: "pump", name: "Pump", icon: "🌊", path: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 14H7v-4h4v4zm0-6H7V7h4v4zm6 6h-4v-4h4v4zm0-6h-4V7h4v4z" },
    { id: "motor", name: "Motor", icon: "⚡", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" },
    { id: "bearing", name: "Bearing", icon: "⊙", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" },
  ],
};

// Function to get recently used symbols
export const getRecentlyUsedSymbols = (usageHistory) => {
  return usageHistory.slice(0, 10); // Return last 10 used symbols
};

// Function to add symbol to recently used
export const addToRecentlyUsed = (symbol, usageHistory) => {
  const filtered = usageHistory.filter(s => s.id !== symbol.id);
  return [symbol, ...filtered];
};