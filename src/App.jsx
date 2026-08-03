import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import JobBaselineEditor from './components/JobBaselineEditor';
import ResumeScreenerLab from './components/ResumeScreenerLab';
import CandidateComparisonMatrix from './components/CandidateComparisonMatrix';
import HistoricalTrainingConsole from './components/HistoricalTrainingConsole';
import HITLReviewConsole from './components/HITLReviewConsole';
import FairnessAuditConsole from './components/FairnessAuditConsole';
import ComplianceGovernanceConsole from './components/ComplianceGovernanceConsole';
import DatabaseSyncConsole from './components/DatabaseSyncConsole';
import EasyBatchScreener from './components/EasyBatchScreener';
import PreflightDeploymentConsole from './components/PreflightDeploymentConsole';
import CreateJobModal from './components/CreateJobModal';
import ToastNotification from './components/ToastNotification';

import { INITIAL_JOB_REQUISITIONS } from './services/baselineTemplate';
import { SAMPLE_RESUMES } from './data/sampleResumes';
import { anonymizeResume } from './services/anonymizer';
import { scoreCandidateResume } from './services/scoringEngine';
import { generateInterrogationQuestions } from './services/interrogationEngine';
import { calculateWeightRecalibration, SAMPLE_HITL_REVIEWS } from './services/hitlFeedback';
import { executeFairnessAudit, ISOLATED_DEMOGRAPHIC_VAULT } from './services/fairnessAuditor';

export default function App() {
  const [activeTab, setActiveTab] = useState('batch_screener');
  const [jobReqs, setJobReqs] = useState(INITIAL_JOB_REQUISITIONS);
  const [activeJobId, setActiveJobId] = useState(INITIAL_JOB_REQUISITIONS[0].id);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Central raw candidate store
  const [rawCandidates, setRawCandidates] = useState(() => {
    return SAMPLE_RESUMES.map(sample => ({
      id: sample.id,
      name: sample.name,
      fileName: `${sample.name.split('/')[0].trim().replace(/\s+/g, '_')}_Resume.pdf`,
      rawText: sample.rawText,
      label: sample.label
    }));
  });

  const activeJobReq = jobReqs.find(j => j.id === activeJobId) || jobReqs[0];

  // Dynamically re-evaluate ALL candidates whenever active job req or weights change
  const evaluatedCandidates = useMemo(() => {
    return rawCandidates.map(c => {
      const anonymized = anonymizeResume(c.rawText);
      const evaluation = scoreCandidateResume(anonymized.anonymizedText, activeJobReq, activeJobReq.defaultWeights);
      const questions = generateInterrogationQuestions(evaluation, activeJobReq);
      return {
        ...c,
        anonymized,
        evaluation,
        questions,
        category: evaluation.category,
        scores: evaluation.scores,
        skillMatch: evaluation.skillMatch,
        candidateFeatures: evaluation.candidateFeatures,
        trajectoryAnalysis: evaluation.trajectoryAnalysis
      };
    }).sort((a, b) => b.evaluation.scores.overall - a.evaluation.scores.overall);
  }, [rawCandidates, activeJobReq]);

  const fairnessReport = executeFairnessAudit(ISOLATED_DEMOGRAPHIC_VAULT);
  const hitlSummary = calculateWeightRecalibration(SAMPLE_HITL_REVIEWS, activeJobReq.defaultWeights);

  const addToast = (candidateName, score, category) => {
    const newToast = {
      id: `toast-${Date.now()}-${Math.random()}`,
      candidateName,
      score,
      category
    };
    setToasts(prev => [newToast, ...prev].slice(0, 4));

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4000);
  };

  const handleDismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleAddCandidate = (newCand) => {
    setRawCandidates(prev => [newCand, ...prev]);

    // Calculate score for notification
    const anonymized = anonymizeResume(newCand.rawText);
    const evaluation = scoreCandidateResume(anonymized.anonymizedText, activeJobReq, activeJobReq.defaultWeights);
    
    // Trigger animated toast notification!
    addToast(newCand.name || newCand.fileName, evaluation.scores.overall, evaluation.category);
  };

  const handleSaveJobReq = (updatedJobReq) => {
    setJobReqs(prev => prev.map(j => j.id === updatedJobReq.id ? updatedJobReq : j));
  };

  const handleCreateJob = (newJobReq) => {
    setJobReqs(prev => [newJobReq, ...prev]);
    setActiveJobId(newJobReq.id);
  };

  const handleResetWeights = (jobId) => {
    const defaultJob = INITIAL_JOB_REQUISITIONS.find(j => j.id === jobId);
    if (defaultJob) {
      setJobReqs(prev => prev.map(j => j.id === jobId ? { ...j, defaultWeights: { ...defaultJob.defaultWeights } } : j));
    }
  };

  const handleApplyRecalibratedWeights = (newWeights) => {
    setJobReqs(prev => prev.map(j => j.id === activeJobId ? { ...j, defaultWeights: newWeights } : j));
    setActiveTab('baseline');
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 font-sans selection:bg-sky-500 selection:text-slate-950 flex flex-col relative">
      {/* Floating Animated Toast Notifications */}
      <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        jobReqs={jobReqs}
        activeJobId={activeJobId}
        setActiveJobId={setActiveJobId}
        fairnessStatus={fairnessReport}
        onOpenCreateJobModal={() => setIsCreateModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'batch_screener' && (
          <EasyBatchScreener
            jobReq={activeJobReq}
            customWeights={activeJobReq.defaultWeights}
            evaluatedCandidates={evaluatedCandidates}
            onAddCandidate={handleAddCandidate}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            jobReq={activeJobReq}
            fairnessReport={fairnessReport}
            hitlSummary={hitlSummary}
            onNavigateTo={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'database_sync' && (
          <DatabaseSyncConsole
            jobReq={activeJobReq}
            customWeights={activeJobReq.defaultWeights}
            onAddCandidate={handleAddCandidate}
          />
        )}

        {activeTab === 'baseline' && (
          <JobBaselineEditor
            jobReq={activeJobReq}
            onSaveJobReq={handleSaveJobReq}
            onResetWeights={handleResetWeights}
          />
        )}

        {activeTab === 'screener' && (
          <ResumeScreenerLab
            jobReq={activeJobReq}
            customWeights={activeJobReq.defaultWeights}
            onAddCandidate={handleAddCandidate}
          />
        )}

        {activeTab === 'comparison' && (
          <CandidateComparisonMatrix
            jobReq={activeJobReq}
            customWeights={activeJobReq.defaultWeights}
            candidatesList={evaluatedCandidates}
          />
        )}

        {activeTab === 'historical' && (
          <HistoricalTrainingConsole
            jobReq={activeJobReq}
          />
        )}

        {activeTab === 'hitl' && (
          <HITLReviewConsole
            currentWeights={activeJobReq.defaultWeights}
            onApplyRecalibratedWeights={handleApplyRecalibratedWeights}
          />
        )}

        {activeTab === 'fairness' && (
          <FairnessAuditConsole
            onTriggerWeightReview={() => setActiveTab('baseline')}
          />
        )}

        {activeTab === 'compliance' && (
          <ComplianceGovernanceConsole
            jobReq={activeJobReq}
            customWeights={activeJobReq.defaultWeights}
          />
        )}

        {activeTab === 'preflight' && (
          <PreflightDeploymentConsole
            jobReq={activeJobReq}
            customWeights={activeJobReq.defaultWeights}
          />
        )}
      </main>

      {/* Create Job Requisition Modal */}
      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateJob={handleCreateJob}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#0b0e14] py-4 text-center text-xs text-slate-500">
        <p>TalentMatrix AI Resume Screening Agent • Enterprise Production-Grade Architecture</p>
      </footer>
    </div>
  );
}
