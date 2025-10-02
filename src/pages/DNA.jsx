import React, { useMemo, useState } from "react";

// DNA Analysis Report Generator — single-file React app (Tailwind utility classes)

function Section({ title, children, right }) {
  return (
    <div className="mb-6">
      <div className="flex items-end justify-between mb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        {right}
      </div>
      <div className="bg-white rounded-2xl shadow p-4 border border-gray-200">{children}</div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm text-gray-700">{label}</span>
      <input
        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function SmallBtn({ children, onClick, title }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="rounded-xl border px-3 py-1 text-sm hover:bg-gray-50 active:scale-[.98]"
      type="button"
    >
      {children}
    </button>
  );
}

function EvidenceRow({ idx, item, onChange, onRemove }) {
  const code = `E${idx + 1}`;
  return (
    <div className="grid grid-cols-12 gap-3 items-end">
      <div className="col-span-1 text-gray-600 text-sm">{code}</div>
      <div className="col-span-4">
        <TextInput
          label="Item Label"
          value={item.label}
          onChange={(v) => onChange({ ...item, label: v })}
          placeholder="e.g., Blood samples"
        />
      </div>
      <div className="col-span-5">
        <TextInput
          label="Evidence ID (EV-####)"
          value={item.evId}
          onChange={(v) => onChange({ ...item, evId: v })}
          placeholder="e.g., EV-20251002-001"
        />
      </div>
      <div className="col-span-2 flex justify-end">
        <SmallBtn title="Remove" onClick={onRemove}>Remove</SmallBtn>
      </div>
    </div>
  );
}

function ProfileRow({ kind, entry, onChange, onRemove }) {
  const isUnmatched = kind === "unmatched";
  const isDeceased = kind === "deceased";
  return (
    <div className="grid grid-cols-12 gap-3 items-end">
      <div className="col-span-4">
        <TextInput
          label="CODIS String"
          value={entry.codis}
          onChange={(v) => onChange({ ...entry, codis: v })}
          placeholder="e.g., CODIS-4F4E6-56743-..."
        />
      </div>
      <div className="col-span-6">
        <TextInput
          label={isUnmatched ? "Display (usually UNKNOWN)" : "Name (as to display)"}
          value={entry.name}
          onChange={(v) => onChange({ ...entry, name: v })}
          placeholder={isUnmatched ? "UNKNOWN" : isDeceased ? "John Doe ((Name Surname))" : "John Doe"}
        />
      </div>
      {isDeceased && (
        <div className="col-span-1">
          <label className="block">
            <span className="text-sm text-gray-700">Type</span>
            <select
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={entry.type || ""}
              onChange={(e) => onChange({ ...entry, type: e.target.value })}
            >
              <option value="">None</option>
              <option value="PK">PK</option>
              <option value="CK">CK</option>
            </select>
          </label>
        </div>
      )}
      <div className="col-span-1 flex justify-end">
        <SmallBtn title="Remove" onClick={onRemove}>Remove</SmallBtn>
      </div>
    </div>
  );
}

export default function App() {
  // Synopsis
  const [investigator, setInvestigator] = useState("");
  const [unit, setUnit] = useState("");
  const [date, setDate] = useState(() => new Date().toLocaleDateString("en-US"));
  const [location, setLocation] = useState("Hall of Justice");

  // Header (fixed)
  const headerLeft = "Los Santos County Sheriff's Department";
  const headerRight = "Scientific Services Bureau";
  const headerImage = "https://i.imgur.com/i3x2zzd.png";

  // Evidence
  const [evidence, setEvidence] = useState([{ label: "", evId: "" }]);

  // Profiles
  const [matched, setMatched] = useState([]);      // { codis, name }
  const [unmatched, setUnmatched] = useState([]);  // { codis, name }
  const [deceased, setDeceased] = useState([]);    // { codis, name, type: 'PK'|'CK'|'' }

  // Submitted by
  const [submittedByName, setSubmittedByName] = useState("");
  const [submittedByPosition, setSubmittedByPosition] = useState("");

  // Add evidence row (auto-copies last EV ID)
  function addEvidence() {
    const last = evidence[evidence.length - 1];
    const prevEv = last?.evId || "";
    setEvidence([...evidence, { label: "", evId: prevEv }]);
  }

  const evidenceListBB = useMemo(() => {
    const items = evidence
      .map((e, i) => `[*]E${i + 1} - ${e.label || "[Blood samples / Other forms of DNA]"}`)
      .join("\n");
    return `[list=1]\n${items}\n[/list]`;
  }, [evidence]);

  const headerBB = useMemo(() => (
    `[transtable=Arial][tr][transtd][size=75]${headerLeft}[/size][/transtd]\n` +
    `[transtd][right][size=75]${headerRight}[/size][/right][/transtd][/tr][/transtable]\n` +
    `[center][img]${headerImage}[/img]\n\n` +
    `[size=115][b]Scientific Services Bureau[/b][/size]\n` +
    `[size=110][b][u]DNA Profiling Report[/u][/b][/size][/center]`
  ), []);

  const examinationText = `Amplification of extracted DNA from the above evidence was performed using the Polymerase Chain Reaction (PCR) and profiled at the following STR loci (locus abbreviations used in this report are noted in parenthesis): D3S11358 (D3), vWA, D16S539 (D16), CSF1PO (CSF), TPOX, D8S1179 (D8), D21S11 (D21), D18S51 (D18), D2S441, D19S433 (D19), TH01, FGA, D22S1045 (D22), D5S818 (D5), D13S317 (D13), D7S820 (D7), SE33, D10S1248 (D10), D1S1656 (D1), D12S391 (D12), D2S1338, Y indel (a Y insertion/deletion locus), and the sex-determining marker, Amelogenin.`;

  function profilesBlock(titleBB, entries, options = {}) {
    if (!entries.length) return `${titleBB}\n`;
    const lines = entries.map((e) => {
      const base = `[${e.codis || "CODIS-#STRING"}]  - [b]${(e.name && e.name.trim()) || (titleBB.includes("Unmatched") ? "UNKNOWN" : "John Doe")}[/b]`;
      if (options.deceased) {
        const suffix = e.type ? ` - If ${e.type}` : "";
        return `${base}${suffix}`;
      }
      return base;
    });
    return `${titleBB}\n${lines.join("\n")}`;
  }

  const footerBB = `[transtable=Arial][tr][transtd][size=75]${headerLeft}[/size][/transtd]\n[transtd][right][size=75]${headerRight}[/size][/right][/transtd][/tr][/transtable]`;

  const bbcode = useMemo(() => {
    const matchedBB = profilesBlock(`[divbox=lightgreen]\n[b][u]Matched profiles[/u][/b]`, matched) + `\n[/divbox]`;
    const unmatchedBB = profilesBlock(`[divbox=#FFBF40]\n[b][u]Unmatched profiles[/u][/b]`, unmatched) + `\n[/divbox]`;
    const deceasedBB = profilesBlock(`[divbox=#FF8080]\n[b][u]Deceased[/u][/b]`, deceased, { deceased: true }) + `\n[/divbox]`;

    return (
      `${headerBB}\n\n` +
      `[b][u]Synopsis[/u][/b]\n` +
      `[b]Investigator:[/b] ${investigator}\n` +
      `[b]Unit:[/b] ${unit}\n` +
      `[b]Date:[/b] ${date}\n` +
      `[b]Location:[/b] ${location}\n\n` +
      `[b][u]Evidence Submitted for DNA Analysis[/u][/b]\n` +
      `${evidenceListBB}` +
      `[b][u]Examination[/u][/b]\n` +
      `${examinationText}\n\n` +
      `[b][u]Results of Profiling and Conclusion[/u][/b]\n` +
      `[font=consolas]\n${matchedBB}\n\n${unmatchedBB}\n\n${deceasedBB}\n[/font]\n\n` +
      `[b][u]Preservation of Samples[/u][/b]\n` +
      `The remaining portion(s) of the above evidence and a portion of any remaining extracted DNA that may still exist are being preserved in the Hall of Justice Crime Laboratory for any additional tests that may be requested in the future.\n\nAll DNA samples have been entered into CODIS.\n\n` +
      `[b][u]Submitted by[/u][/b]\n${submittedByName}, ${submittedByPosition}\nScientific Services Bureau\n\n` +
      `${footerBB}`
    );
  }, [headerBB, evidenceListBB, examinationText, investigator, unit, date, location, matched, unmatched, deceased, submittedByName, submittedByPosition, footerBB]);

  function copyToClipboard() {
    navigator.clipboard.writeText(bbcode).then(() => alert("BBCode copied to clipboard ✔")).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = bbcode; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); alert("BBCode copied to clipboard ✔"); } catch {}
      document.body.removeChild(ta);
    });
  }

  function resetAll() {
    if (!confirm("Clear all fields?")) return;
    setInvestigator(""); setUnit(""); setDate(new Date().toLocaleDateString("en-US")); setLocation("Hall of Justice");
    setEvidence([{ label: "", evId: "" }]);
    setMatched([]); setUnmatched([]); setDeceased([]);
    setSubmittedByName(""); setSubmittedByPosition("");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">DNA Analysis Report Generator</h1>
          <p className="text-gray-600">Fill out the form and click “Copy BBCode”. Paste into your forum post.</p>
        </header>

        <Section title="Synopsis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Investigator" value={investigator} onChange={setInvestigator} />
            <TextInput label="Unit" value={unit} onChange={setUnit} />
            <TextInput label="Date" value={date} onChange={setDate} placeholder="MM/DD/YYYY" />
            <TextInput label="Location" value={location} onChange={setLocation} />
          </div>
        </Section>

        <Section
          title="Evidence Submitted"
          right={<SmallBtn onClick={addEvidence}>Add Item</SmallBtn>}
        >
          <div className="space-y-4">
            {evidence.map((it, i) => (
              <EvidenceRow
                key={i}
                idx={i}
                item={it}
                onChange={(next) => setEvidence(evidence.map((x, idx) => (idx === i ? next : x)))}
                onRemove={() => setEvidence(evidence.filter((_, idx) => idx !== i))}
              />
            ))}
          </div>
        </Section>

        <Section title="Results — Matched" right={<SmallBtn onClick={() => setMatched([...matched, { codis: "", name: "" }])}>Add Row</SmallBtn>}>
          <div className="space-y-4">
            {matched.map((en, i) => (
              <ProfileRow key={i} kind="matched" entry={en} onChange={(next) => setMatched(matched.map((x, idx) => (idx === i ? next : x)))} onRemove={() => setMatched(matched.filter((_, idx) => idx !== i))} />
            ))}
            {matched.length === 0 && <p className="text-sm text-gray-500">No matched profiles yet.</p>}
          </div>
        </Section>

        <Section title="Results — Unmatched" right={<SmallBtn onClick={() => setUnmatched([...unmatched, { codis: "", name: "UNKNOWN" }])}>Add Row</SmallBtn>}>
          <div className="space-y-4">
            {unmatched.map((en, i) => (
              <ProfileRow key={i} kind="unmatched" entry={en} onChange={(next) => setUnmatched(unmatched.map((x, idx) => (idx === i ? next : x)))} onRemove={() => setUnmatched(unmatched.filter((_, idx) => idx !== i))} />
            ))}
            {unmatched.length === 0 && <p className="text-sm text-gray-500">No unmatched profiles.</p>}
          </div>
        </Section>

        <Section title="Results — Deceased" right={<SmallBtn onClick={() => setDeceased([...deceased, { codis: "", name: "John Doe ((Name Surname))", type: "" }])}>Add Row</SmallBtn>}>
          <div className="space-y-4">
            {deceased.map((en, i) => (
              <ProfileRow key={i} kind="deceased" entry={en} onChange={(next) => setDeceased(deceased.map((x, idx) => (idx === i ? next : x)))} onRemove={() => setDeceased(deceased.filter((_, idx) => idx !== i))} />
            ))}
            {deceased.length === 0 && <p className="text-sm text-gray-500">No deceased entries.</p>}
          </div>
        </Section>

        <Section title="Submitted By">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Name" value={submittedByName} onChange={setSubmittedByName} />
            <TextInput label="Position" value={submittedByPosition} onChange={setSubmittedByPosition} />
          </div>
        </Section>

        <Section title="Generated BBCode">
          <div className="flex gap-2 mb-3">
            <SmallBtn onClick={copyToClipboard}>Copy BBCode</SmallBtn>
            <SmallBtn onClick={resetAll}>Reset</SmallBtn>
          </div>
          <textarea className="w-full rounded-xl border border-gray-300 p-3" rows={20} value={bbcode} onChange={() => {}} />
          <p className="text-xs text-gray-500 mt-2">Tip: Paste this into your forum post composer. If your forum supports preview, you can confirm the formatting before posting.</p>
        </Section>

        <footer className="text-center text-xs text-gray-400 py-6">Built for fast BBCode authoring — DNA edition.</footer>
      </div>
    </div>
  );
}
