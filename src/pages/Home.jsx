import React from "react";

// Home page for all report generators
// Theme: Background #2e411a, centered image at the top
// Cards link via hash routes for deployments, and also provide a quick "Copy Canvas Name" helper

function Card({ title, subtitle, hash, canvasName }) {
  function openHash() {
    window.location.hash = hash;
  }
  function copyCanvasName() {
    const text = canvasName;
    navigator.clipboard.writeText(text)
      .then(() => alert(`Canvas name copied: ${text}`))
      .catch(() => {
        const ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); alert(`Canvas name copied: ${text}`); } catch {}
        document.body.removeChild(ta);
      });
  }
  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl shadow border border-white/20 p-6 flex flex-col">
      <h3 className="text-xl font-semibold mb-1 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{subtitle}</p>
      <div className="mt-auto flex gap-2">
        <button onClick={openHash} className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">Open</button>
        <button onClick={copyCanvasName} className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">Copy Canvas Name</button>
      </div>
      <p className="text-[11px] text-gray-500 mt-2">Tip: In this workspace, use the copied canvas name to switch documents. For a real deployment, map this card to the route <span className="font-mono">{hash}</span>.</p>
    </div>
  );
}

export default function Home() {
  const brand = {
    bg: "#2e411a",
    img: "https://i.imgur.com/i3x2zzd.png",
  };

  const generators = [
    {
      title: "Friction Ridge Report",
      subtitle: "Build BBCode for latent print/ACE-V reports.",
      hash: "#/friction",
      canvasName: "Bbcode Report Builder – Friction Ridge Examination",
    },
    {
      title: "Forensic Ballistics Report",
      subtitle: "IBIS matches, multiple incidents, unmatched item auto-list.",
      hash: "#/ballistics",
      canvasName: "Forensic Ballistics Report Generator",
    },
    {
      title: "DNA Analysis Report",
      subtitle: "CODIS-based matched/unmatched/deceased profiles.",
      hash: "#/dna",
      canvasName: "DNA Analysis Report Generator",
    },
    {
      title: "Narcotics Analysis Report",
      subtitle: "Evidence with weights, DEPA guide, optional lab signature.",
      hash: "#/narcotics",
      canvasName: "Narcotics Analysis Report Generator — Signature Toggle",
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: brand.bg }}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header image */}
        <div className="flex justify-center mb-8">
          <img src={brand.img} alt="Agency Crest" className="h-28 w-auto" />
        </div>

        {/* Title */}
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl font-bold">Scientific Services Bureau</h1>
          <p className="text-sm text-white/80 mt-1">Choose a generator to create a forum-ready BBCode report.</p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {generators.map((g) => (
            <Card key={g.title} title={g.title} subtitle={g.subtitle} hash={g.hash} canvasName={g.canvasName} />
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-xs mt-10">Created and maintained by Jar. DM with any bugs or suggestions.</p>
      </div>
    </div>
  );
}
