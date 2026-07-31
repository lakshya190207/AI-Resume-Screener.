import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  EyeOff, 
  CheckCircle2, 
  XCircle, 
  Award, 
  HelpCircle, 
  Copy, 
  Check, 
  Zap, 
  Filter,
  UploadCloud,
  FileCheck,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { anonymizeResume } from '../services/anonymizer';
import { scoreCandidateResume } from '../services/scoringEngine';
import { generateInterrogationQuestions } from '../services/interrogationEngine';
import { parseUploadedResumeFile } from '../services/fileParser';
import { SAMPLE_RESUMES } from '../data/sampleResumes';

export default function ResumeScreenerLab({ jobReq, customWeights }) {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_RESUMES[0].id);
  const [rawResumeText, setRawResumeText] = useState(SAMPLE_RESUMES[0].rawText);
  const [anonymizedResult, setAnonymizedResult] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [copiedQuestionId, setCopiedQuestionId] = useState(null);

  // File Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Trigger evaluation pipeline
  const processPipeline = (textToProcess) => {
    const anonymized = anonymizeResume(textToProcess);
    setAnonymizedResult(anonymized);

    const evaluation = scoreCandidateResume(anonymized.anonymizedText, jobReq, customWeights);
    setEvaluationResult(evaluation);

    const generatedQuestions = generateInterrogationQuestions(evaluation, jobReq);
    setQuestions(generatedQuestions);
  };

  useEffect(() => {
    processPipeline(rawResumeText);
  }, [selectedSample, jobReq, customWeights]);

  const handleSampleChange = (sampleId) => {
    setSelectedSample(sampleId);
    setUploadedFileName('');
    setUploadError('');
    const sample = SAMPLE_RESUMES.find(s => s.id === sampleId);
    if (sample) {
      setRawResumeText(sample.rawText);
      processPipeline(sample.rawText);
    }
  };

  const handleCustomTextChange = (e) => {
    const newText = e.target.value;
    setRawResumeText(newText);
    processPipeline(newText);
  };

  const handleFileSelect = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setUploadError('');
    setUploadedFileName(file.name);

    try {
      const extractedText = await parseUploadedResumeFile(file);
      if (!extractedText.trim()) {
        throw new Error('Could not extract text from file. Please ensure it is a valid text or PDF file.');
      }
      setRawResumeText(extractedText);
      processPipeline(extractedText);
    } catch (err) {
      setUploadError(err.message || 'Error processing resume file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleCopyQuestion = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionId(id);
    setTimeout(() => setCopiedQuestionId(null), 2000);
  };

  const getTierBadgeClass = (category) => {
    switch (category) {
      case 'Top Tier':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Qualified':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    }
  };

  // Format anonymized text cleanly
  const formatAnonymizedHighlights = (text) => {
    if (!text) return '';
    return text.replace(
      /\[(EMAIL REDACTED|PHONE REDACTED|LINKEDIN REDACTED|GITHUB REDACTED|URL REDACTED|YEAR REDACTED|DATE RANGE REDACTED|PRONOUN REDACTED|DEMOGRAPHIC REDACTED|CANDIDATE NAME REDACTED)\]/g,
      '<span class="inline-block px-1 py-0.5 rounded bg-slate-800 text-sky-300 font-mono text-[11px] font-semibold border border-slate-700">$1</span>'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Preset Selector */}
      <div className="panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Candidate Resume Screening Lab</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Active Requisition: <span className="font-semibold text-slate-200">{jobReq?.title}</span>
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-md">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Test Candidate Preset:</span>
          <select
            value={selectedSample}
            onChange={(e) => handleSampleChange(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            {SAMPLE_RESUMES.map(s => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prominent File Upload Box */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`panel p-6 border-2 border-dashed transition-all cursor-pointer text-center space-y-3 ${
          isDragging 
            ? 'border-sky-500 bg-sky-500/10' 
            : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
          accept=".pdf,.txt,.md,.docx,.rtf"
          className="hidden"
        />

        <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/20 mx-auto flex items-center justify-center text-sky-400">
          {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-100">
            {uploadedFileName ? `Uploaded: ${uploadedFileName}` : 'Drag & Drop Candidate Resume File Here'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Supports <span className="text-slate-200 font-semibold">PDF, TXT, DOCX, MD</span> • Automatically extracts, anonymizes, scores, & generates custom interview questions
          </p>
        </div>

        {uploadError && (
          <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded font-medium inline-flex items-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 Cols: Resume Text Input & Redaction Diff */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Raw Input Panel */}
          <div className="panel space-y-3">
            <div className="panel-header flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center space-x-2">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                <span>Extracted / Raw Resume Text</span>
              </h3>
              <span className="text-[11px] text-slate-500">Editable for real-time testing</span>
            </div>

            <div className="p-4">
              <textarea
                value={rawResumeText}
                onChange={handleCustomTextChange}
                rows={9}
                className="w-full bg-slate-950 border border-slate-800 rounded-md p-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-sky-500 leading-relaxed"
                placeholder="Paste raw candidate resume text or drop file above..."
              />
            </div>
          </div>

          {/* Anonymized Output Diff Panel */}
          <div className="panel space-y-3">
            <div className="panel-header flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
                  <EyeOff className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Anonymized Resume Output</span>
                </h3>
                <p className="text-[11px] text-slate-400">PII, Gender/Age indicators & Graduation dates purged</p>
              </div>

              <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs">
                {anonymizedResult?.totalRedactions || 0} Redactions
              </span>
            </div>

            <div className="p-4 pt-0 space-y-3">
              {anonymizedResult?.redactionDetails?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {anonymizedResult.redactionDetails.map((det, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-[10px] text-slate-300 border border-slate-800">
                      <strong className="text-sky-400">{det.rule}:</strong> {det.count} x
                    </span>
                  ))}
                </div>
              )}

              <div 
                className="bg-slate-950 rounded-md p-3.5 text-xs font-mono text-slate-300 max-h-60 overflow-y-auto leading-relaxed border border-slate-800/80 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: formatAnonymizedHighlights(anonymizedResult?.anonymizedText || '') }}
              />
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Evaluation Scores, Tier & Questions */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Categorization & Score Panel */}
          <div className="panel p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Categorization</span>
                <div className={`mt-1 inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-bold ${getTierBadgeClass(evaluationResult?.category)}`}>
                  <Award className="w-3.5 h-3.5" />
                  <span>{evaluationResult?.category || 'Evaluating...'}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Weighted Score</span>
                <div className="text-2xl font-bold text-slate-100">
                  {evaluationResult?.scores?.overall || 0}<span className="text-xs font-normal text-slate-400">/100</span>
                </div>
              </div>
            </div>

            {/* Rationale Note */}
            <div className="p-3 rounded-md bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-sky-400">Rationale:</strong> {evaluationResult?.categoryReason}
            </div>

            {/* Score Breakdown Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Must-Haves Coverage</span>
                  <strong className="text-emerald-400">{evaluationResult?.scores?.mustHaves}%</strong>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${evaluationResult?.scores?.mustHaves}%` }} />
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Nice-To-Haves Bonus</span>
                  <strong className="text-sky-400">{evaluationResult?.scores?.niceToHaves}%</strong>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full" style={{ width: `${evaluationResult?.scores?.niceToHaves}%` }} />
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Experience Depth</span>
                  <strong className="text-amber-400">{evaluationResult?.scores?.experience}%</strong>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: `${evaluationResult?.scores?.experience}%` }} />
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Historical Trajectory</span>
                  <strong className="text-purple-400">{evaluationResult?.scores?.trajectory}%</strong>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: `${evaluationResult?.scores?.trajectory}%` }} />
                </div>
              </div>
            </div>

            {/* Skill Match Breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold uppercase text-slate-300 block">Must-Have Skill Mapping</span>
              <div className="flex flex-wrap gap-1.5">
                {evaluationResult?.skillMatch?.matchedMustHaves?.map((s, idx) => (
                  <span key={idx} className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-xs border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{s}</span>
                  </span>
                ))}
                {evaluationResult?.skillMatch?.missingMustHaves?.map((s, idx) => (
                  <span key={idx} className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-300 text-xs border border-rose-500/20">
                    <XCircle className="w-3 h-3 text-rose-400 shrink-0" />
                    <span>{s} (Missing)</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Interrogation Questions Panel */}
          <div className="panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4 text-sky-400" />
                  <span>Custom Interview Questions</span>
                </h3>
                <p className="text-[11px] text-slate-400">Tailored specifically to candidate background & skill gaps</p>
              </div>

              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold">
                {questions.length} Questions
              </span>
            </div>

            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-3.5 rounded-md bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      Q{idx + 1}: {q.type}
                    </span>
                    <button
                      onClick={() => handleCopyQuestion(q.id, q.question)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Copy Question"
                    >
                      {copiedQuestionId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    "{q.question}"
                  </p>

                  <div className="text-[11px] text-slate-500 italic">
                    Recruiter Intent: {q.intent}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
