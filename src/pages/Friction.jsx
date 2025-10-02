import React, { useMemo, useState } from "react";

// Single-file React app that builds BBCode for the provided report template.
// Styling: Tailwind utility classes (no external deps needed in this environment).

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
      <div className="col-span-3">
        <TextInput
          label="Item Label"
          value={item.label}
          onChange={(v) => onChange({ ...item, label: v })}
          placeholder="e.g., Glock 19X"
        />
      </div>
      <div className="col-span-4">
        <TextInput
          label="Evidence ID (EV-####)"
          value={item.evId}
          onChange={(v) => onChange({ ...item, evId: v })}
          placeholder="e.g., EV-20250929-671"
        />
      </div>
      <div className="col-span-3">
        <label className="block">
          <span className="text-sm text-gray-700">No prints found on this item?</span>
          <input
            type="checkbox"
            className="mt-2 h-4 w-4 align-middle"
            checked={item.noPrints || false}
            onChange={(e) => onChange({ ...item, noPrints: e.target.checked })}
          />
        </label>
      </div>
      <div className="col-span-1 flex justify-end">
        <SmallBtn title="Remove" onClick={onRemove}>Remove</SmallBtn>
      </div>
    </div>
  );
}

function ProfileRow({ entry, onChange, onRemove, kind = "matched", itemCodeOptions = [] }) {
  return (
    <div className="grid grid-cols-12 gap-3 items-end">
      <div className="col-span-2">
        <label className="block">
          <span className="text-sm text-gray-700">Item Code</span>
          <select
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={entry.itemCode || ""}
            onChange={(e) => onChange({ ...entry, itemCode: e.target.value })}
          >
            <option value="">Select item…</option>
            {itemCodeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="col-span-5">
        <TextInput
          label="AFIS String"
          value={entry.afis}
          onChange={(v) => onChange({ ...entry, afis: v })}
          placeholder="e.g., AFIS-4D61726B..."
        />
      </div>
      <div className="col-span-4">
        <TextInput
          label={kind === "unmatched" ? "Display (usually UNKNOWN)" : "Name (as to display)"}
          value={entry.name}
          onChange={(v) => onChange({ ...entry, name: v })}
          placeholder={kind === "unmatched" ? "UNKNOWN" : "e.g., John Doe ((Marcus Albright))"}
        />
      </div>
      <div className="col-span-1 flex justify-end">
        <SmallBtn title="Remove" onClick={onRemove}>Remove</SmallBtn>
      </div>
    </div>
  );
}

export default function App() {
  const [investigator, setInvestigator] = useState("");
  const [unit, setUnit] = useState("");
  const [date, setDate] = useState(() => new Date().toLocaleDateString("en-US"));
  const [location, setLocation] = useState("Hall of Justice");

  const headerLeft = "Los Santos County Sheriff's Department";
  const headerRight = "Scientific Services Bureau";
  const headerImage = "https://i.imgur.com/i3x2zzd.png";

  const [evidence, setEvidence] = useState([{ label: "", evId: "", noPrints: false }]);
  const [matched, setMatched] = useState([]);
  const [unmatched, setUnmatched] = useState([]);
  const [deceased, setDeceased] = useState([]);
  const [submittedByName, setSubmittedByName] = useState("");
  const [submittedByPosition, setSubmittedByPosition] = useState("");

  const acevText = `The submitted samples were examined for latent prints and digitally imaged for further analysis. Friction ridge print examinations were conducted using the Analysis, Comparison, Evaluation, and Verification (ACE-V) process. The first step in the process is Analysis, which is conducted independently on first the latent than the known prints. During this step, each print is analyzed for both the quality and quantity of information present. The quality and quantity of information observed during the Analysis phase determine whether the print contains suitable information to conduct a comparison with another print.\n\nIn the Comparison phase of the ACE-V process, a side-by-side comparison of the latent print with suspect (latent or exemplary) prints was conducted. Both prints were examined for similarities and differences, assessing ridges sequentially for agreement or disagreement in all levels of detail. In the Evaluation phase of the ACE-V, all of the information gathered during Analysis and Comparison were considered to reach conclusions about the origin of the latent prints.\n\n[b]Note:[/b] Items of evidence submitted to the Scientific Services Bureau for examination may be examined visually, examined with various light sources, or processed with chemicals and powders to detect the presence of latent friction ridge prints. The specific sequence of examinations and processes depends upon the nature of the evidence.`;

  const preservationText = `The remaining portion(s) of the above evidence and all digitally imaged latent prints are being preserved in the Hall of Justice Crime Laboratory for any additional tests that may be requested in the future.\n\nAll fingerprint samples have been entered into SAAFIS.`;

  const noPrintsList = useMemo(() => evidence.map((e, i) => ({ code: `E${i + 1}`, has: !!e.noPrints })).filter(x => x.has).map(x => x.code), [evidence]);

  const evidenceListBB = useMemo(() => {
    const items = evidence.map((e, i) => `[*]E${i + 1} - ${e.label || "Item"} - [b]${e.evId || "EV-####"}[/b]`).join("\n");
    return `[list=1]\n${items}\n[/list]`;
  }, [evidence]);

  const profilesBlock = (titleBB, entries) => {
    if (!entries.length) return `${titleBB}\n`;
    const groups = entries.reduce((acc, e) => {
      const key = e.itemCode || "E#";
      (acc[key] = acc[key] || []).push(e);
      return acc;
    }, {});
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const na = parseInt(a.replace(/[^0-9]/g, ''), 10);
      const nb = parseInt(b.replace(/[^0-9]/g, ''), 10);
      if (isNaN(na) || isNaN(nb)) return a.localeCompare(b);
      return na - nb;
    });
    const blocks = sortedKeys.map((key) => {
      const lines = groups[key].map((e) => `${e.itemCode || "E#"} - [${e.afis || "AFIS-#STRING"}]  - [b]${e.name || (titleBB.includes("Unmatched") ? "UNKNOWN" : "John Doe")}[/b]`);
      return lines.join("\n");
    });
    return `${titleBB}\n${blocks.join("\n\n")}`;
  };

  const headerBB = useMemo(() => (
    `[transtable=Arial][tr][transtd][size=75]${headerLeft}[/size][/transtd]\n` +
    `[transtd][right][size=75]${headerRight}[/size][/right][/transtd][/tr][/transtable]\n` +
    `[center][img]${headerImage}[/img]\n\n` +
    `[size=115][b]${headerRight}[/b][/size]\n` +
    `[size=110][b][u]Friction Ridge Examination Report[/u][/b][/size][/center]`
  ), []);

  const itemCodeOptions = useMemo(() => evidence.map((e, i) => !e.noPrints ? `E${i + 1}` : null).filter(Boolean), [evidence]);

  const bbcode = useMemo(() => {
    const matchedBB = profilesBlock(`[divbox=lightgreen]
[b][u]Matched profiles[/u][/b]`, matched) + `
[/divbox]`;
    const unmatchedBB = profilesBlock(`[divbox=#FFBF40]
[b][u]Unmatched profiles[/u][/b]`, unmatched) + `
[/divbox]`;
    const deceasedBB = profilesBlock(`[divbox=#FF8080]
[b][u]Deceased[/u][/b]`, deceased) + `
[/divbox]`;
    const noPrintsLine = noPrintsList.length ? `[*] No fingerprints were found on items: ${noPrintsList.join(", ")}` : "";

    return (
      `${headerBB}

` +
      `[b][u]Synopsis[/u][/b]
` +
      `[b]Investigator:[/b] ${investigator}
` +
      `[b]Unit:[/b] ${unit}
` +
      `[b]Date:[/b] ${date}
` +
      `[b]Location:[/b] ${location}

` +
      `[b][u]Evidence Submitted for Friction Ridge Examination[/u][/b]
` +
      `${evidenceListBB}
` +
      `[b][u]Examination[/u][/b]
` +
      `${acevText}

` +
      `[b][u]Results of Verifications[/u][/b]
[list=1]
${noPrintsLine}
[/list]
` +
      `[font=consolas]
${matchedBB}

${unmatchedBB}

${deceasedBB}
[/font]
` +
      `[b][u]Preservation of Samples[/u][/b]
${preservationText}

` +
      `[b][u]Submitted by[/u][/b]
${submittedByName}, ${submittedByPosition}

[transtable=Arial][tr][transtd][size=75]${headerLeft}[/size][/transtd]
[transtd][right][size=75]${headerRight}[/size][/right][/transtd][/tr][/transtable]`
    );
  }, [headerBB, investigator, unit, date, location, evidenceListBB, acevText, noPrintsList, matched, unmatched, deceased, preservationText, submittedByName, submittedByPosition]);

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
    setInvestigator("");
    setUnit("");
    setDate(new Date().toLocaleDateString("en-US"));
    setLocation("Hall of Justice");
    setEvidence([{ label: "", evId: "", noPrints: false }]);
    setMatched([]);
    setUnmatched([]);
    setDeceased([]);
    setSubmittedByName("");
    setSubmittedByPosition("");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Friction Ridge Report Generator</h1>
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

        <Section title="Evidence Submitted" right={<SmallBtn onClick={() => {
          const last = evidence[evidence.length - 1];
          const prevEv = last?.evId || "";
          setEvidence([...evidence, { label: "", evId: prevEv, noPrints: false }]);
        }}>Add Item</SmallBtn>}>
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

        <Section title="Profiles — Matched" right={<SmallBtn onClick={() => setMatched([...matched, { itemCode: "", afis: "", name: "" }])}>Add Row</SmallBtn>}>
          <div className="space-y-4">
            {matched.map((en, i) => (
              <ProfileRow key={i} entry={en} onChange={(next) => setMatched(matched.map((x, idx) => (idx === i ? next : x)))} onRemove={() => setMatched(matched.filter((_, idx) => idx !== i))} kind="matched" itemCodeOptions={itemCodeOptions} />
            ))}
            {matched.length === 0 && <p className="text-sm text-gray-500">No matched profiles yet.</p>}
          </div>
        </Section>

        <Section title="Profiles — Unmatched" right={<SmallBtn onClick={() => setUnmatched([...unmatched, { itemCode: "", afis: "", name: "UNKNOWN" }])}>Add Row</SmallBtn>}>
          <div className="space-y-4">
            {unmatched.map((en, i) => (
              <ProfileRow
                key={i}
                entry={en}
                onChange={(next) => setUnmatched(unmatched.map((x, idx) => (idx === i ? next : x)))}
                onRemove={() => setUnmatched(unmatched.filter((_, idx) => idx !== i))}
                kind="unmatched"
                itemCodeOptions={itemCodeOptions}
              />
            ))}
            {unmatched.length === 0 && <p className="text-sm text-gray-500">No unmatched profiles.</p>}
          </div>
        </Section>

        <Section title="Profiles — Deceased" right={<SmallBtn onClick={() => setDeceased([...deceased, { itemCode: "", afis: "", name: "John Doe ((Name Surname))" }])}>Add Row</SmallBtn>}>
          <div className="space-y-4">
            {deceased.map((en, i) => (
              <ProfileRow
                key={i}
                entry={en}
                onChange={(next) => setDeceased(deceased.map((x, idx) => (idx === i ? next : x)))}
                onRemove={() => setDeceased(deceased.filter((_, idx) => idx !== i))}
                kind="deceased"
                itemCodeOptions={itemCodeOptions}
              />
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
          <TextArea label="Output" value={bbcode} onChange={() => {}} rows={20} />
          <p className="text-xs text-gray-500 mt-2">Tip: Paste this into your forum post composer. If your forum supports preview, you can confirm the formatting before posting.</p>
        </Section>

        <footer className="text-center text-xs text-gray-400 py-6">Built for fast BBCode authoring — no more manual formatting.</footer>
      </div>
    </div>
  );
}
