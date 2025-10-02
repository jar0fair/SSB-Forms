import React from "react";

function Card({ title, subtitle, hash }) {
  return (
    <div className="bg-white/95 rounded-2xl shadow border border-white/20 p-6 flex flex-col">
      <h3 className="text-xl font-semibold mb-1 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{subtitle}</p>
      <div className="mt-auto">
        <a href={hash} className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 inline-block">
          Open
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  const generators = [
    { title: "Friction Ridge Report", subtitle: "Build BBCode for latent print/ACE-V reports.", hash: "#/friction" },
    { title: "Forensic Ballistics Report", subtitle: "IBIS matches and unmatched item auto-list.", hash: "#/ballistics" },
    { title: "DNA Analysis Report", subtitle: "CODIS-based matched/unmatched/deceased profiles.", hash: "#/dna" },
    { title: "Narcotics Analysis Report", subtitle: "Evidence with weights, DEPA guide, optional lab signature.", hash: "#/narcotics" },
  ];

  return (
    <div>
      {/* small page intro, no crest/title here */}
     <center> <div className="mb-6">
        <h2 className="text-2xl font-semibold">Choose a generator</h2>
        <p className="text-sm text-gray-600">Create forum-ready BBCode reports.</p>
      </div></center>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {generators.map(g => (
          <Card key={g.title} title={g.title} subtitle={g.subtitle} hash={g.hash} />
        ))}
      </div>
    </div>
  );
}
