import React, { useEffect, useState } from "react";

// Clean single-file App for GitHub Pages
// - Hash routes: #/, #/friction, #/ballistics, #/dna, #/narcotics
// - Minimal shell with green background and centered crest
// - Import your page components from ./pages/* (see instructions below)

import Home from "./pages/Home";
import Friction from "./pages/Friction";
import Ballistics from "./pages/Ballistics";
import DNA from "./pages/DNA";
import Narcotics from "./pages/Narcotics";

const BRAND_BG = "#2e411a";
const HEADER_IMG = "https://i.imgur.com/i3x2zzd.png";
const HEADER_TITLE = "Scientific Services Bureau";

function Nav({ active }) {
  const links = [
    { href: "#/", label: "Home" },
    { href: "#/friction", label: "Friction Ridge" },
    { href: "#/ballistics", label: "Ballistics" },
    { href: "#/dna", label: "DNA" },
    { href: "#/narcotics", label: "Narcotics" },
  ];
  return (
    <nav className="flex flex-wrap gap-2 mt-2">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className={`rounded-full px-3 py-1 text-sm border text-white/90 hover:bg-white/10 ${active === l.href ? "bg-white/10" : ""}`}
        >
          {l.label}
        </a>
      ))}
    </nav>
  );
}

export default function App() {
  const [hash, setHash] = useState(window.location.hash || "#/");
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const route = (hash.split("?")[0] || "#/").toLowerCase();
  let Page;
  if (route.startsWith("#/friction")) Page = Friction;
  else if (route.startsWith("#/ballistics")) Page = Ballistics;
  else if (route.startsWith("#/dna")) Page = DNA;
  else if (route.startsWith("#/narcotics")) Page = Narcotics;
  else Page = Home;

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_BG }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-3 mb-6">
          <img src={HEADER_IMG} alt="Agency crest" className="h-28 w-auto" />
          <h1 className="text-white text-3xl font-bold">{HEADER_TITLE}</h1>
          <p className="text-white/80 text-sm">BBCode Report Generators</p>
          <Nav active={route} />
        </div>
        <div className="bg-white rounded-2xl shadow p-6 md:p-8 border border-gray-200">
          <Page />
        </div>
        <p className="text-center text-white/60 text-xs mt-8">Created and Maintained by Jar. DM on Discord with bugs or suggestions.</p>
      </div>
    </div>
  );
}

/*
How to use in your GitHub repo

1) Place this file at: src/App.jsx
2) Create these files under src/pages/ and paste your existing components:
   - src/pages/Home.jsx             -> export default function Home() { ... }  (use your "Forensics Report Generators — Home" canvas)
   - src/pages/Friction.jsx         -> export default function Friction() { ... }  (from "Bbcode Report Builder – Friction Ridge Examination")
   - src/pages/Ballistics.jsx       -> export default function Ballistics() { ... } (from "Forensic Ballistics Report Generator")
   - src/pages/DNA.jsx              -> export default function DNA() { ... }       (from your DNA generator canvas)
   - src/pages/Narcotics.jsx        -> export default function Narcotics() { ... } (from either narcotics canvas)
3) Ensure src/main.jsx mounts <App />:
   import React from "react";
   import ReactDOM from "react-dom/client";
   import "./index.css";
   import App from "./App";
   ReactDOM.createRoot(document.getElementById("root")).render(<App />);
4) Vite config for GitHub Pages:
   // vite.config.js
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";
   export default defineConfig({
     plugins: [react()],
     base: "/<your-repo-name>/",
   });
*/

