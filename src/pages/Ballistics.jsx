import React, { useMemo, useState } from "react";

// Forensic Ballistics Report Generator — single-file React app
// Tailwind utilities for styling (no external CSS needed).

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

function TextArea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <textarea
        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
        rows={rows}
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
          placeholder="e.g., 9mm Luger casing"
        />
      </div>
      <div className="col-span-5">
        <TextInput
          label="Evidence ID (EV-####)"
          value={item.evId}
          onChange={(v) => onChange({ ...item, evId: v })}
          placeholder="e.g., EV-20250929-671"
        />
      </div>
      <div className="col-span-2 flex justify-end">
        <SmallBtn title="Remove" onClick={onRemove}>Remove</SmallBtn>
      </div>
    </div>
  );
}

function MatchCard({ idx, match, itemCodes, onToggleItem, onChangeField, onRemove }) {
  return (
    <div className="rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">IBIS Match #{idx + 1}</h3>
        <SmallBtn title="Remove match" onClick={onRemove}>Remove</SmallBtn>
      </div>
      <div className="mb-3">
        <span className="text-sm text-gray-700">Select matched item(s)</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {itemCodes.map((code) => (
            <label key={code} className={`px-3 py-1 rounded-full border text-sm cursor-pointer ${match.items.includes(code) ? 'bg-gray-100 border-gray-400' : 'border-gray-300'}`}>
              <input
                type="checkbox"
                className="mr-2"
                checked={match.items.includes(code)}
                onChange={() => onToggleItem(code)}
              />
              {code}
            </label>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TextInput label="Incident name" value={match.incidentName} onChange={(v) => onChangeField('incidentName', v)} placeholder="e.g., 4x Homicide - Meteor St (Parking lot) - 02:13" />
        <TextInput label="Incident date/time" value={match.incidentDate} onChange={(v) => onChangeField('incidentDate', v)} placeholder="e.g., 28/09/25" />
        <TextInput label="Signed by" value={match.signedBy} onChange={(v) => onChangeField('signedBy', v)} placeholder="e.g., Esther Castellon" />
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

  // Results logic
  const [hasMatch, setHasMatch] = useState(false);
  const [matches, setMatches] = useState([]); // { items: string[], incidentName, incidentDate, signedBy }

  // Submitted by
  const [submittedByName, setSubmittedByName] = useState("");
  const [submittedByPosition, setSubmittedByPosition] = useState("");

  // Add evidence row (auto-copies last EV ID)
  function addEvidence() {
    const last = evidence[evidence.length - 1];
    const prevEv = last?.evId || "";
    setEvidence([...evidence, { label: "", evId: prevEv }]);
  }

  // Matches helpers
  function addMatch() {
    setMatches((prev) => [...prev, { items: [], incidentName: "", incidentDate: "", signedBy: "" }]);
  }
  function removeMatch(i) {
    setMatches((prev) => prev.filter((_, idx) => idx !== i));
  }
  function toggleMatchItem(i, code) {
    setMatches((prev) => prev.map((m, idx) => {
      if (idx !== i) return m;
      const items = m.items.includes(code) ? m.items.filter((c) => c !== code) : [...m.items, code];
      return { ...m, items };
    }));
  }
  function setMatchField(i, key, value) {
    setMatches((prev) => prev.map((m, idx) => (idx === i ? { ...m, [key]: value } : m)));
  }

  const evidenceListBB = useMemo(() => {
    const items = evidence
      .map((e, i) => `[*]E${i + 1} - ${e.label || "Item"} - [b]${e.evId || "EV-####"}[/b]`)
      .join("\n");
    return `[list=1]\n${items}\n[/list]`;
  }, [evidence]);

  const headerBB = useMemo(() => (
    `[transtable=Arial][tr][transtd][size=75]${headerLeft}[/size][/transtd]\n` +
    `[transtd][right][size=75]${headerRight}[/size][/right][/transtd][/tr][/transtable]\n` +
    `[center][img]${headerImage}[/img]\n\n` +
    `[size=115][b]${headerRight}[/b][/size]\n` +
    `[size=110][b][u]Forensic Ballistics Report[/u][/b][/size][/center]`
  ), []);

  const itemCodes = useMemo(() => evidence.map((_, i) => `E${i + 1}`), [evidence]);

  const resultsBB = useMemo(() => {
    if (!hasMatch) {
      return (
        `[b][u]Results of Examination and Conclusion[/u][/b]
` +
        `[list=1][*] No match was identified for the submitted weapon(s)/casings.
[/list]`
      );
    }
    if (!matches.length) {
      return (
        `[b][u]Results of Examination and Conclusion[/u][/b]
` +
        `[list=1][*] IBIS matches recorded, but none added.
[/list]`
      );
    }

    const matchBullets = matches.map((m) => {
      const itemsLabel = m.items && m.items.length ? `Item ${m.items.join(", ")}` : `Item E#`;
      const incident = `${m.incidentName || "Incident"} - ${m.incidentDate || "Date/Time"} - Signed by ${m.signedBy || "Name"}`;
      return `[*]${itemsLabel} has produced the following IBIS match:
[list][*]${incident}[/list]`;
    });

    const matchedSet = new Set();
    matches.forEach((m) => (m.items || []).forEach((c) => matchedSet.add(c)));
    const unmatched = itemCodes.filter((c) => !matchedSet.has(c));
    if (unmatched.length) {
      matchBullets.push(`[*]Item ${unmatched.join(", ")} has produced no IBIS matches.`);
    }

    return (
      `[b][u]Results of Examination and Conclusion[/u][/b]
` +
      `[list=1]
${matchBullets.join("\n")}
[/list]`
    );
  }, [hasMatch, matches, itemCodes]);

  const preservationText = `The remaining portion(s) of the above evidence and any evidence relevant to this analysis are being preserved in the Hall of Justice Crime Laboratory for any additional tests that may be requested in the future.\n\nAll samples have been entered into IBIS.`;

  const footerBB = `[transtable=Arial][tr][transtd][size=75]${headerLeft}[/size][/transtd]\n[transtd][right][size=75]${headerRight}[/size][/right][/transtd][/tr][/transtable]`;

  const bbcode = useMemo(() => {
    return (
      `${headerBB}\n\n` +
      `[b][u]Synopsis[/u][/b]\n` +
      `[b]Investigator:[/b] ${investigator}\n` +
      `[b]Unit:[/b] ${unit}\n` +
      `[b]Date:[/b] ${date}\n` +
      `[b]Location:[/b] ${location}\n\n` +
      `[b][u]Evidence Submitted for Forensic Examination[/u][/b]\n` +
      `${evidenceListBB}\n` +
      `${resultsBB}\n` +
      `[b][u]Preservation of Evidence[/u][/b]\n${preservationText}\n\n` +
      `[b][u]Submitted by[/u][/b]\n${submittedByName}, ${submittedByPosition}\n\n` +
      `${footerBB}`
    );
  }, [headerBB, evidenceListBB, resultsBB, preservationText, investigator, unit, date, location, submittedByName, submittedByPosition, footerBB]);

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
    setHasMatch(false); setMatches([]);
    setSubmittedByName(""); setSubmittedByPosition("");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Forensic Ballistics Report Generator</h1>
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

        <Section title="Results" right={hasMatch ? <SmallBtn onClick={addMatch}>Add IBIS Match</SmallBtn> : null}>
          <div className="grid grid-cols-1 gap-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4" checked={hasMatch} onChange={(e) => {
                setHasMatch(e.target.checked);
                if (e.target.checked && matches.length === 0) addMatch();
              }} />
              <span className="text-sm text-gray-700">IBIS match(es) found</span>
            </label>

            {hasMatch ? (
              <div className="space-y-4">
                {matches.map((m, i) => (
                  <MatchCard
                    key={i}
                    idx={i}
                    match={m}
                    itemCodes={itemCodes}
                    onToggleItem={(code) => toggleMatchItem(i, code)}
                    onChangeField={(key, value) => setMatchField(i, key, value)}
                    onRemove={() => removeMatch(i)}
                  />
                ))}
                {matches.length === 0 && (
                  <p className="text-sm text-gray-500">No IBIS matches added yet. Click "Add IBIS Match".</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No weapon/casing match. Toggle the checkbox above to record IBIS matches.</p>
            )}
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
          <TextArea label="Output" value={bbcode} onChange={() => {}} rows={20} />
          <p className="text-xs text-gray-500 mt-2">Tip: Paste this into your forum post composer. If your forum supports preview, you can confirm the formatting before posting.</p>
        </Section>

        <footer className="text-center text-xs text-gray-400 py-6">Built for fast BBCode authoring — Ballistics edition.</footer>
      </div>
    </div>
  );
}
