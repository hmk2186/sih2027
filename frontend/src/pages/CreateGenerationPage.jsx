import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  ShieldAlert, 
  Share2, 
  Hash, 
  Layout, 
  Presentation, 
  Video, 
  Check, 
  AlertCircle, 
  ArrowRight,
  Sliders,
  Database,
  Bookmark
} from 'lucide-react';
import { api } from '../api';

export default function CreateGenerationPage({ onToast }) {
  const navigate = useNavigate();

  // Step state
  const [sourceMode, setSourceMode] = useState('PRESET'); // 'PRESET', 'TEXT', 'UPLOAD'
  const [presets, setPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState('');

  // Source Fields
  const [title, setTitle] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [sourceType, setSourceType] = useState('DOCUMENT');

  // Format selection
  const allFormats = [
    { id: 'SECURITY_ADVISORY', label: 'Security Advisory', desc: 'CERT/NTRO format with CVEs, IOCs, TTPs & Mitigations', icon: ShieldAlert, color: 'text-rose-400' },
    { id: 'EXECUTIVE_SUMMARY', label: 'Executive Summary', desc: 'BLUF format, Strategic Risk Matrix & Decision Items', icon: FileText, color: 'text-blue-400' },
    { id: 'LINKEDIN_POST', label: 'LinkedIn Post', desc: 'Leadership analysis, key takeaways, hashtags & CTA', icon: Share2, color: 'text-sky-400' },
    { id: 'TWITTER_THREAD', label: 'X / Twitter Thread', desc: '5-part punchy thread with threat alert & actions', icon: Hash, color: 'text-cyan-400' },
    { id: 'INFOGRAPHIC', label: 'Infographic Blueprint', desc: 'Visual wireframe layout, 4 metric cards & flow chart', icon: Layout, color: 'text-amber-400' },
    { id: 'PRESENTATION', label: 'Presentation Deck', desc: '5-slide deck outline with visuals & speaker notes', icon: Presentation, color: 'text-purple-400' },
    { id: 'VIDEO_PACKAGE', label: 'Video Package', desc: '4-scene script, storyboard, narration & subtitles', icon: Video, color: 'text-emerald-400' },
  ];

  const [selectedFormats, setSelectedFormats] = useState([
    'SECURITY_ADVISORY', 
    'EXECUTIVE_SUMMARY', 
    'LINKEDIN_POST', 
    'TWITTER_THREAD',
    'INFOGRAPHIC',
    'PRESENTATION',
    'VIDEO_PACKAGE'
  ]);

  // Generation Settings
  const [targetAudience, setTargetAudience] = useState('Technical CERT / Defense');
  const [tone, setTone] = useState('Urgent & Authoritative');
  const [language, setLanguage] = useState('English');
  const [detailLevel, setDetailLevel] = useState('Detailed Technical');
  const [objective, setObjective] = useState('Threat Mitigation & Rapid Containment');
  const [contentStyle, setContentStyle] = useState('NTRO Standard Directive');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load Presets
  useEffect(() => {
    async function loadPresets() {
      try {
        const data = await api.getSourcePresets();
        setPresets(data);
        if (data.length > 0) {
          applyPreset(data[0]);
        }
      } catch (e) {
        console.error("Failed to load presets", e);
      }
    }
    loadPresets();
  }, []);

  const applyPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setTitle(preset.title);
    setRawContent(preset.content);
    setSourceType(preset.source_type);
  };

  const toggleFormat = (id) => {
    if (selectedFormats.includes(id)) {
      if (selectedFormats.length === 1) return; // Must have at least 1
      setSelectedFormats(selectedFormats.filter((f) => f !== id));
    } else {
      setSelectedFormats([...selectedFormats, id]);
    }
  };

  const handleSelectAll = () => {
    setSelectedFormats(allFormats.map(f => f.id));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTitle(file.name.replace(/\.[^/.]+$/, ""));
    const reader = new FileReader();
    reader.onload = (event) => {
      setRawContent(event.target?.result || "");
      onToast?.({ type: 'success', title: 'File Read', message: `Ingested ${file.name} successfully.` });
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rawContent.trim()) {
      setError('Please provide source intelligence content before initiating generation.');
      return;
    }
    if (selectedFormats.length === 0) {
      setError('Please select at least one target output deliverable format.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const jobData = {
        title: title || 'Strategic Intelligence Transformation',
        raw_content: rawContent,
        source_type: sourceType,
        target_audience: targetAudience,
        tone: tone,
        language: language,
        detail_level: detailLevel,
        objective: objective,
        content_style: contentStyle,
        requested_formats: selectedFormats
      };

      const job = await api.createGenerationJob(jobData);
      onToast?.({
        type: 'success',
        title: 'Pipeline Dispatched',
        message: `Synthesizing ${selectedFormats.length} operational deliverables.`
      });
      // Navigate to pipeline visualizer
      navigate(`/pipeline/${job.id}`);
    } catch (err) {
      setError('Generation failed: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono bg-tactical-cyan/15 text-tactical-cyan px-2.5 py-0.5 rounded border border-tactical-cyan/30">
            AI WORKFLOW ENGINE
          </span>
          <span className="text-xs font-mono text-slate-400">NTRO PS 26154</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Create New Intelligence Transformation
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Provide raw intelligence, select target communication formats, and configure tactical delivery parameters.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* STEP 1: SOURCE INGESTION */}
        <section className="bg-defense-900 border border-defense-800 rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-defense-800 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-tactical-cyan/15 text-tactical-cyan border border-tactical-cyan/30 flex items-center justify-center text-xs font-mono font-bold">
                1
              </div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Source Intelligence Ingestion
              </h2>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-defense-950 p-1 rounded-lg border border-defense-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setSourceMode('PRESET')}
                className={`px-3 py-1 rounded-md transition ${
                  sourceMode === 'PRESET' ? 'bg-defense-800 text-tactical-cyan font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                1-Click Presets
              </button>
              <button
                type="button"
                onClick={() => setSourceMode('TEXT')}
                className={`px-3 py-1 rounded-md transition ${
                  sourceMode === 'TEXT' ? 'bg-defense-800 text-tactical-cyan font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Raw Text / Prompt
              </button>
              <button
                type="button"
                onClick={() => setSourceMode('UPLOAD')}
                className={`px-3 py-1 rounded-md transition ${
                  sourceMode === 'UPLOAD' ? 'bg-defense-800 text-tactical-cyan font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Document Upload
              </button>
            </div>
          </div>

          {/* Preset Selector */}
          {sourceMode === 'PRESET' && (
            <div className="space-y-4 mb-6">
              <label className="block text-xs font-medium text-slate-300 font-mono">
                Select Intelligence Scenario Preset:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {presets.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => applyPreset(p)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      selectedPresetId === p.id
                        ? 'bg-tactical-cyan/10 border-tactical-cyan text-white shadow-lg shadow-tactical-cyan/5'
                        : 'bg-defense-950 border-defense-800 text-slate-300 hover:border-defense-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono bg-defense-900 text-tactical-cyan px-2 py-0.5 rounded border border-defense-800">
                        {p.category}
                      </span>
                      {selectedPresetId === p.id && <Check className="w-3.5 h-3.5 text-tactical-cyan" />}
                    </div>
                    <div className="text-xs font-bold leading-snug line-clamp-2">{p.title}</div>
                    <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {p.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Upload Mode */}
          {sourceMode === 'UPLOAD' && (
            <div className="mb-6">
              <label className="block text-xs font-medium text-slate-300 mb-2 font-mono">
                Upload Threat Document / Advisory (PDF, DOCX, TXT, JSON):
              </label>
              <label className="border-2 border-dashed border-defense-700 hover:border-tactical-cyan/60 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-defense-950/60">
                <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                <span className="text-xs text-slate-200 font-semibold">Click to browse file or drag and drop</span>
                <span className="text-[10px] text-slate-500 font-mono mt-1">UTF-8 plain text, markdown, or intelligence JSON</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".txt,.md,.json,.csv,.pdf,.doc"
                />
              </label>
            </div>
          )}

          {/* Title & Raw Content textarea */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">
                Intelligence Title / Subject
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Critical Zero-Day Advisory in SCADA Infrastructure"
                className="w-full bg-defense-950 border border-defense-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-tactical-cyan font-mono"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300 font-mono">
                  Source Content / Technical Telemetry
                </label>
                <span className="text-[10px] font-mono text-slate-500">
                  {rawContent.length} characters | {rawContent.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={7}
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                placeholder="Paste threat telemetry, incident report, policy brief, or intelligence prompt here..."
                className="w-full bg-defense-950 border border-defense-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-tactical-cyan font-mono leading-relaxed"
                required
              />
            </div>
          </div>
        </section>

        {/* STEP 2: OUTPUT FORMAT SELECTION */}
        <section className="bg-defense-900 border border-defense-800 rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-defense-800 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-tactical-cyan/15 text-tactical-cyan border border-tactical-cyan/30 flex items-center justify-center text-xs font-mono font-bold">
                2
              </div>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Target Output Formats
                </h2>
                <p className="text-[11px] text-slate-400">
                  Select one or more deliverables to generate simultaneously from the common source.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs font-mono text-tactical-cyan hover:underline bg-defense-950 border border-defense-800 px-3 py-1 rounded"
            >
              Select All (7)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allFormats.map((fmt) => {
              const Icon = fmt.icon;
              const isSelected = selectedFormats.includes(fmt.id);
              return (
                <div
                  key={fmt.id}
                  onClick={() => toggleFormat(fmt.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-tactical-cyan/10 border-tactical-cyan/80 text-white'
                      : 'bg-defense-950 border-defense-800 text-slate-400 hover:border-defense-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${fmt.color}`} />
                        <span className="text-xs font-bold text-white">{fmt.label}</span>
                      </div>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                        isSelected ? 'bg-tactical-cyan border-tactical-cyan text-defense-950' : 'border-defense-700'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 font-bold" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {fmt.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* STEP 3: GENERATION SETTINGS */}
        <section className="bg-defense-900 border border-defense-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 pb-4 border-b border-defense-800 mb-6">
            <div className="w-7 h-7 rounded-lg bg-tactical-cyan/15 text-tactical-cyan border border-tactical-cyan/30 flex items-center justify-center text-xs font-mono font-bold">
              3
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Contextual Transformation Settings
              </h2>
              <p className="text-[11px] text-slate-400">
                Calibrate audience, tone, detail level, and strategic objective.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Target Audience */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-defense-950 border border-defense-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tactical-cyan font-mono"
              >
                <option value="Technical CERT / Defense">Technical CERT / Defense Operators</option>
                <option value="Executive Leadership & CISOs">Executive Leadership & Strategic CISOs</option>
                <option value="Critical Sector Operators (SCADA/Energy)">Critical Sector Operators (SCADA / Energy)</option>
                <option value="General Public & Enterprise Tech">General Public & Enterprise Tech</option>
                <option value="Inter-Agency Intelligence Taskforce">Inter-Agency Intelligence Taskforce</option>
              </select>
            </div>

            {/* Tone */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Tone of Delivery
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-defense-950 border border-defense-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tactical-cyan font-mono"
              >
                <option value="Urgent & Authoritative">Urgent & Authoritative</option>
                <option value="Formal & Diplomatic">Formal & Diplomatic</option>
                <option value="Strategic & Forward-Looking">Strategic & Forward-Looking</option>
                <option value="Educational & Actionable">Educational & Actionable</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Output Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-defense-950 border border-defense-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tactical-cyan font-mono"
              >
                <option value="English">English (Standard GovNet)</option>
                <option value="Hindi">Hindi (राजभाषा)</option>
                <option value="Bilingual Eng/Hindi">Bilingual (English + Hindi)</option>
              </select>
            </div>

            {/* Detail Level */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Level of Detail
              </label>
              <select
                value={detailLevel}
                onChange={(e) => setDetailLevel(e.target.value)}
                className="w-full bg-defense-950 border border-defense-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tactical-cyan font-mono"
              >
                <option value="Detailed Technical">Detailed Technical (All IOCs & Steps)</option>
                <option value="Executive Briefing">Executive Briefing (BLUF & Strategic)</option>
                <option value="High-Level Summary">High-Level Summary (Public Digest)</option>
              </select>
            </div>

            {/* Objective */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Communication Objective
              </label>
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="e.g. Threat Mitigation & Rapid Containment"
                className="w-full bg-defense-950 border border-defense-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tactical-cyan font-mono"
              />
            </div>

            {/* Style */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Content Style Directive
              </label>
              <input
                type="text"
                value={contentStyle}
                onChange={(e) => setContentStyle(e.target.value)}
                placeholder="e.g. NTRO Standard Directive"
                className="w-full bg-defense-950 border border-defense-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tactical-cyan font-mono"
              />
            </div>
          </div>
        </section>

        {/* Submit Bar */}
        <div className="flex items-center justify-between p-4 bg-defense-900 border border-defense-800 rounded-2xl">
          <div className="text-xs font-mono text-slate-400">
            Generating <span className="text-tactical-cyan font-bold">{selectedFormats.length} deliverables</span> with automated verification
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-tactical-cyan hover:bg-cyan-400 text-defense-950 font-black px-6 py-3 rounded-xl text-xs font-mono flex items-center gap-2.5 transition shadow-xl shadow-tactical-cyan/20 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-defense-950 border-t-transparent rounded-full animate-spin"></div>
                <span>DISPATCHING AI PIPELINE...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>GENERATE DELIVERABLES</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
