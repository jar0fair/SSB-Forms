import React, { useMemo, useState } from "react";

// Narcotics Analysis Report Generator — with optional/undetermined Lab Signature
// Single-file React app using Tailwind classes

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

function TextInput({ label, value, onChange, placeholder, className = "", disabled = false }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm text-gray-700">{label}</span>
      <input
        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-100 disabled:text-gray-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
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
          placeholder="e.g., Unidentified tablets"
        />
      </div>
      <div className="col-span-4">
        <TextInput
          label="Evidence ID (EV-####)"
          value={item.evId}
          onChange={(v) => onChange({ ...item, evId: v })}
          placeholder="e.g., EV-20250928-578"
        />
      </div>
      <div className="col-span-2">
        <TextInput
          label="Weight (g)"
          value={item.weight}
          onChange={(v) => onChange({ ...item, weight: v })}
          placeholder="e.g., 170"
        />
      </div>
      <div className="col-span-1 flex justify-end">
        <SmallBtn title="Remove" onClick={onRemove}>Remove</SmallBtn>
      </div>
    </div>
  );
}

function ResultRow({ idx, result, onChange }) {
  return (
    <div className="grid grid-cols-12 gap-3 items-end">
      <div className="col-span-1 text-gray-600 text-sm">E{idx + 1}</div>

      <div className="col-span-5">
        <TextInput
          label="Identified Drug Name"
          value={result.drugName}
          onChange={(v) => onChange({ ...result, drugName: v })}
          placeholder="e.g., Codeine"
        />
      </div>

      <div className="col-span-3">
        <label className="block">
          <span className="text-sm text-gray-700">Drug Quality</span>
          <select
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={result.quality || ""}
            onChange={(e) => onChange({ ...result, quality: e.target.value })}
          >
            <option value="">Select…</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </label>
      </div>

      <div className="col-span-3">
        <label className="flex items-center gap-2 mt-1 mb-1">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={!!result.hasSignature}
            onChange={(e) => onChange({ ...result, hasSignature: e.target.checked })}
          />
          <span className="text-sm text-gray-700">Provide Lab Signature</span>
        </label>
        <TextInput
          label="Laboratory Signature"
          value={result.signature}
          onChange={(v) => onChange({ ...result, signature: v })}
          placeholder={result.hasSignature ? "e.g., LAB-0042E4-RX" : "Disabled — set checkbox to provide"}
          disabled={!result.hasSignature}
        />
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

  // Evidence & Results
  const [evidence, setEvidence] = useState([{ label: "Unidentified substance", evId: "", weight: "#" }]);
  const [results, setResults] = useState([{ drugName: "DRUG NAME", quality: "", signature: "", hasSignature: false }]);

  // Submitted by
  const [submittedByName, setSubmittedByName] = useState("");
  const [submittedByPosition, setSubmittedByPosition] = useState("");

  function addEvidence() {
    const last = evidence[evidence.length - 1];
    const prevEv = last?.evId || "";
    setEvidence([...evidence, { label: last?.label || "Unidentified substance", evId: prevEv, weight: last?.weight || "#" }]);
    const lastResult = results[results.length - 1] || {};
    setResults([...results, { drugName: "DRUG NAME", quality: lastResult.quality || "", signature: lastResult.signature || "", hasSignature: !!lastResult.hasSignature }]);
  }

  function removeEvidence(i) {
    setEvidence((prev) => prev.filter((_, idx) => idx !== i));
    setResults((prev) => prev.filter((_, idx) => idx !== i));
  }

  const evidenceBB = useMemo(() => {
    // Each item inside its own [list] ... [/list]
    return evidence
      .map((e, i) => `
[list][*][b]E${i + 1}[/b] -  ${e.label || "Unidentified substance"} - [b]${e.evId || "EV-####"}[/b]- Evidential weight - ${e.weight || "#"}g

[/list]`)
      .join("\n");
  }, [evidence]);

  const headerBB = useMemo(
    () =>
      `[transtable=Arial][tr][transtd][size=75]${headerLeft}[/size][/transtd]\n` +
      `[transtd][right][size=75]${headerRight}[/size][/right][/transtd][/tr][/transtable]\n` +
      `[center][img]${headerImage}[/img]\n\n` +
      `[size=115][b]Scientific Services Bureau[/b][/size]\n` +
      `[size=110][b][u]Narcotics Analysis Report[/u][/b][/size][/center]`,
    []
  );

  const examinationText = `[justify]Examination started by separating the different types of substances, weighting them and proceeding to sampling and sample preparation, following lab protocols. Samples were extracted for qualitative analysis. \n[list][*][b]Presumptive:[/b]\n[list][*][b]Infrared Spectrography [/b] was performed in order to get an initial identification of the different functional groups found on the unknown substances. The spectra obtained were matched against the database in order to obtain an initial identification. \n[*]The spectra were analyzed to identify the substance. \n\n[/list]\n\n[*][b]Confirmatory:[/b]\n[list][*][b] Gas chromatography-flame ionization detection (GC-FID)[/b] was performed. ATS standard and sample solutions were prepared and identification was accomplished by comparing the retention time of the analyte with that of a reference standard after GC analysis.[/list][/list] \n[/justify]`;

  const depaGuide = `[i][b][u]DEPA Category Guide:[/u][/b][/i]\n[list]\n[*] Category A - (Crack) Cocaine, Heroin, Opium/Opioids (Vicodin), Ecstasy (MDMA), Phencyclidine (PCP), Psilocybin ("Magic Mushrooms"), Lysergic acid diethylamide (LSD)\n[*] Category B - Methamphetamine, Amphetamines (Adderall), Fentanyl, Oxycodone, Morphine.\n[*] Category C - Ketamine, Testosterone, Benzphetamine, Nalorphine\n[*] Category D - Cannabis (Marijuana), Diazepam, Lorazepam, Xanax, \n[*] Category T - Ganaxolone, Lomotil, Motofen, Parepectolin, Lyrica\n[/list]`;

  const resultsBB = useMemo(() => {
    const lines = results.map(
      (r, i) =>
        `[*][b]E${i + 1}[/b] - The substance was conclusively identified as [b]${r.drugName || "DRUG NAME"}[/b] \n[list]\n[*][b]Drug Quality[/b]: ${r.quality || ""}\n[*][b]Laboratory Signature[/b]: ${r.hasSignature && r.signature ? r.signature : "Could not be determined"}\n[/list]`
    );
    return `[list]\n${lines.join("\n")}\n\n[/list]`;
  }, [results]);

  const footerBB = `[transtable=Arial][tr][transtd][size=75]${headerLeft}[/size][/transtd]\n[transtd][right][size=75]${headerRight}[/size][/right][/transtd][/tr][/transtable]`;

  const disclaimer = `[size=80][i](*) The suggested category is a categorization made by the scientific team and does not consitute legal advice and/or evidence. It's the investigator's responsibility to check whether it is appropriate.[/i][/size]`;

  const bbcode = useMemo(() => {
    return (
      `${headerBB}\n\n` +
      `[b][u]Synopsis[/u][/b]\n` +
      `[b]Investigator:[/b] ${investigator}\n` +
      `[b]Unit:[/b] ${unit}\n` +
      `[b]Date:[/b] ${date}\n` +
      `[b]Location:[/b] ${location}\n\n` +
      `[b][u]Evidence Submitted for Forensic Examination[/u][/b]\n` +
      `${evidenceBB}\n` +
      `[b][u]Examination[/u][/b]\n` +
      `${examinationText}\n` +
      `[b][u]Results of Examination and Conclusion[/u][/b]\n` +
      `${depaGuide}\n` +
      `${resultsBB}\n` +
      `[b][u]Preservation of Evidence[/u][/b]\n` +
      `[justify]The remaining portion(s) of the above evidence are being preserved in the Hall of Justice Crime Laboratory for any additional tests that may be requested in the future.[/justify]\n\n` +
      `[b][u]Submitted by[/u][/b]\n${submittedByName}, ${submittedByPosition}\nScientific Services Bureau\n\n` +
      `${disclaimer}\n` +
      `${footerBB}`
    );
  }, [headerBB, investigator, unit, date, location, evidenceBB, examinationText, depaGuide, resultsBB, submittedByName, submittedByPosition, evidence, disclaimer, footerBB]);

  function copyToClipboard() {
    navigator.clipboard
      .writeText(bbcode)
      .then(() => alert("BBCode copied to clipboard ✔"))
      .catch(() => {
        const ta = document.createElement("textarea");
        ta.value = bbcode; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); alert("BBCode copied to clipboard ✔"); } catch {}
        document.body.removeChild(ta);
      });
  }

  function resetAll() {
    if (!confirm("Clear all fields?")) return;
    setInvestigator(""); setUnit(""); setDate(new Date().toLocaleDateString("en-US")); setLocation("Hall of Justice");
    setEvidence([{ label: "Unidentified substance", evId: "", weight: "#" }]);
    setResults([{ drugName: "DRUG NAME", quality: "", signature: "", hasSignature: false }]);
    setSubmittedByName(""); setSubmittedByPosition("");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Narcotics Analysis Report Generator</h1>
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

        <Section title="Evidence Submitted" right={<SmallBtn onClick={addEvidence}>Add Item</SmallBtn>}>
          <div className="space-y-4">
            {evidence.map((it, i) => (
              <EvidenceRow
                key={i}
                idx={i}
                item={it}
                onChange={(next) => setEvidence(evidence.map((x, idx) => (idx === i ? next : x)))}
                onRemove={() => removeEvidence(i)}
              />
            ))}
          </div>
        </Section>

        <Section title="Results per Item">
          <div className="space-y-4">
            {results.map((r, i) => (
              <ResultRow
                key={i}
                idx={i}
                result={r}
                onChange={(next) => setResults(results.map((x, idx) => (idx === i ? next : x)))}
              />
            ))}
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

        <footer className="text-center text-xs text-gray-400 py-6">Built for fast BBCode authoring — Narcotics edition.</footer>
      </div>
    </div>
  );
}
