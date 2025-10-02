import React from "react";

// Final Home page for the app

function Card({ title, subtitle, hash }) {
  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl shadow border border-white/20 p-6 flex flex-col">
      <h3 className="text-xl font-semibold mb-1 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{subtitle}</p>
      <div className="mt-auto">
        <a
          href={hash}
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 inline-block"
        >
          Open
        </a>
      </div>
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
    },
    {
      title: "Forensic Ballistics Report",
      subtitle: "IBIS matches, multiple incidents, unmatched item auto-list.",
      hash: "#/ballistics",
    },
    {
      title: "DNA Analysis Report",
      subtitle: "CODIS-based matched/unmatched/deceased profiles.",
      hash: "#/dna",
    },
    {
      title: "Narcotics Analysis Report",
      subtitle: "Evidence with weights, DEPA guide, optional lab signature.",
      hash: "#/narcotics",
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
          <p className="text-sm text-white/80 mt-1">
            Choose a generator to create a forum-ready BBCode report.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {generators.map((g) => (
            <Card key={g.title} title={g.title} subtitle={g.subtitle} hash={g.hash} />
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-xs mt-10">
          Created and maintained for SSB forms.
        </p>
      </div>
    </div>
  );
}
