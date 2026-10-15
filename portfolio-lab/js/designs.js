/* =========================================================================
   Design options: every generated site is a combination of these.
   ========================================================================= */
const PALETTES = [
  { name: "Plasma",          dark: true,  bg: "#0e0b1f", surface: "#191536", text: "#f3f0ff", muted: "#a49dd0", line: "#2e2862", accent: "#ff5cd6", accent2: "#5ef0ff", onAccent: "#1a0717" },
  { name: "Sorbet",          dark: false, bg: "#fff4ea", surface: "#ffffff", text: "#1f1535", muted: "#6d6283", line: "#f0dccb", accent: "#e8431f", accent2: "#6b4dff", onAccent: "#ffffff" },
  { name: "Matcha Terminal", dark: true,  bg: "#0e1611", surface: "#16211a", text: "#e8f3e6", muted: "#93a996", line: "#24352a", accent: "#c2f56b", accent2: "#ffc857", onAccent: "#13200b" },
  { name: "Ultraviolet",     dark: false, bg: "#f2f0ff", surface: "#ffffff", text: "#17123c", muted: "#615a8c", line: "#dcd6fb", accent: "#5a3bff", accent2: "#ff8a1f", onAccent: "#ffffff" },
  { name: "Heatmap",         dark: true,  bg: "#150d0b", surface: "#21140f", text: "#fff1e5", muted: "#c09c88", line: "#3a251c", accent: "#ff7a1a", accent2: "#ffd23f", onAccent: "#200b00" },
  { name: "Bubblegum Lab",   dark: false, bg: "#ffeaf4", surface: "#fff8fb", text: "#2b1031", muted: "#7d5a80", line: "#f6cfe2", accent: "#e01a7d", accent2: "#009e91", onAccent: "#ffffff" },
  { name: "Deep Sea",        dark: true,  bg: "#061922", surface: "#0c2531", text: "#e2f5ff", muted: "#86a9b8", line: "#16394a", accent: "#2fe6c6", accent2: "#ff6b9b", onAccent: "#04201b" },
  { name: "Lemon Grid",      dark: false, bg: "#fbf9e4", surface: "#ffffff", text: "#17170f", muted: "#66664f", line: "#e7e3bd", accent: "#3434ff", accent2: "#ffcf00", onAccent: "#ffffff" },
];
const FONTS = [
  { name: "Unbounded + DM Sans",          display: "Unbounded",             body: "DM Sans",  mono: "JetBrains Mono", url: "Unbounded:wght@500;700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500", scale: .78, weight: 700 },
  { name: "Bricolage + Figtree",          display: "Bricolage Grotesque",   body: "Figtree",  mono: "Space Mono",     url: "Bricolage+Grotesque:wght@500;700;800&family=Figtree:wght@400;500;600&family=Space+Mono", scale: 1, weight: 800 },
  { name: "Syne + Manrope",               display: "Syne",                  body: "Manrope",  mono: "IBM Plex Mono",  url: "Syne:wght@600;700;800&family=Manrope:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500", scale: .95, weight: 800 },
  { name: "Fraunces + Outfit",            display: "Fraunces",              body: "Outfit",   mono: "Fira Code",      url: "Fraunces:wght@600;800&family=Outfit:wght@400;500;600&family=Fira+Code:wght@400;500", scale: .95, weight: 800 },
  { name: "Big Shoulders + Sora",         display: "Big Shoulders Display", body: "Sora",     mono: "JetBrains Mono", url: "Big+Shoulders+Display:wght@700;900&family=Sora:wght@400;500;600&family=JetBrains+Mono:wght@400;500", scale: 1.3, weight: 900 },
  { name: "Rubik Mono + Rubik",           display: "Rubik Mono One",        body: "Rubik",    mono: "Space Mono",     url: "Rubik+Mono+One&family=Rubik:wght@400;500;600&family=Space+Mono", scale: .7, weight: 400 },
  { name: "Archivo Black + Archivo",      display: "Archivo Black",         body: "Archivo",  mono: "IBM Plex Mono",  url: "Archivo+Black&family=Archivo:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500", scale: .92, weight: 400 },
];
const HEROES = [
  { id: "detect",    name: "Object detection", blurb: "big name, photo with a detection box" },
  { id: "terminal",  name: "Terminal",         blurb: "typed shell intro beside the photo" },
  { id: "poster",    name: "Poster",           blurb: "giant stacked name, spinning sticker" },
  { id: "dashboard", name: "Dashboard",        blurb: "hero built from KPI tiles" },
];
const MOTIFS = [
  { id: "scatter",   name: "Scatter clusters" },
  { id: "network",   name: "Neural network" },
  { id: "ridgeline", name: "Ridgeline plot" },
  { id: "rain",      name: "Data rain" },
  { id: "histogram", name: "Live histogram" },
];
const CARDS = [
  { id: "glass",   name: "Glass" },
  { id: "brutal",  name: "Hard shadow" },
  { id: "outline", name: "Spotlight outline" },
  { id: "sticker", name: "Stickers" },
];
const AXES = [
  ["palette", "Colours", PALETTES], ["fonts", "Fonts", FONTS], ["hero", "Hero", HEROES], ["motif", "Background", MOTIFS], ["cards", "Cards", CARDS],
];
