import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Database, 
  Network, 
  Cpu, 
  ShieldAlert, 
  Scale, 
  Lock, 
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { ParticlesBackground } from './components/react-bits/ParticlesBackground';
import { DecryptedText } from './components/react-bits/DecryptedText';
import { TabsNav } from './components/tabs/TabsNav';
import { JudgeDemoBar } from './components/demo/JudgeDemoBar';

import { DataUploadView, DatasetStats } from './components/views/DataUploadView';
import { NetworkTopologyView } from './components/views/NetworkTopologyView';
import { FederatedTrainingView } from './components/views/FederatedTrainingView';
import { RiskScoringView } from './components/views/RiskScoringView';
import { ResponsibleAIView } from './components/views/ResponsibleAIView';

export function App() {
  const [activeMainTab, setActiveMainTab] = useState<string>('upload');
  const [currentDataset, setCurrentDataset] = useState<DatasetStats | null>(null);
  
  // 3-Minute Demo State
  const [demoStep, setDemoStep] = useState<number>(1);
  const [isRunningAutoDemo, setIsRunningAutoDemo] = useState<boolean>(false);

  const mainTabs = [
    { 
      id: 'upload', 
      label: 'Institution Data Silos', 
      icon: <Database className="w-4 h-4" />,
      badge: currentDataset ? `${currentDataset.rowCount.toLocaleString()} rows` : 'Upload Required'
    },
    { 
      id: 'network', 
      label: 'Federated Topology', 
      icon: <Network className="w-4 h-4" />,
      badge: '4 Nodes'
    },
    { 
      id: 'training', 
      label: 'Live FL & SecAgg', 
      icon: <Cpu className="w-4 h-4" />,
      badge: 'FedAvg'
    },
    { 
      id: 'scoring', 
      label: 'Risk Scoring & SHAP', 
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: 'The Showdown'
    },
    { 
      id: 'governance', 
      label: 'Responsible AI & Audit', 
      icon: <Scale className="w-4 h-4" />,
      badge: 'PRD §14'
    },
  ];

  const handleSelectDemoStep = (step: number) => {
    setDemoStep(step);
    if (step === 1) setActiveMainTab('upload');
    if (step === 2) setActiveMainTab('training');
    if (step === 3) setActiveMainTab('scoring');
  };

  const handleToggleAutoDemo = () => {
    if (isRunningAutoDemo) {
      setIsRunningAutoDemo(false);
      return;
    }

    setIsRunningAutoDemo(true);
    // Minute 1: Silos
    handleSelectDemoStep(1);

    setTimeout(() => {
      // Minute 2: Training
      handleSelectDemoStep(2);
    }, 4000);

    setTimeout(() => {
      // Minute 3: Risk Scoring Showdown
      handleSelectDemoStep(3);
      setIsRunningAutoDemo(false);
    }, 9000);
  };

  return (
    <div className="relative min-h-screen bg-[#070b14] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Background Particles Network */}
      <ParticlesBackground quantity={35} color="#06B6D4" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Top Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white">
                  Trust<span className="text-cyan-400">Fed</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60">
                  MVP v1.0
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  SecAgg Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Privacy-Preserving Federated Fraud Intelligence • PaySim Multi-Institution Network
              </p>
            </div>
          </div>

          {/* Quick System Telemetry */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-400">Raw Data Exchanged:</span>
              <span className="text-emerald-400 font-bold">0 records</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Privacy Budget:</span>
              <span className="text-amber-400 font-bold">ε = 2.45</span>
            </div>
          </div>
        </header>

        {/* PRD §15 3-Minute Hackathon Demo Bar */}
        <JudgeDemoBar
          currentStep={demoStep}
          onSelectStep={handleSelectDemoStep}
          isRunningAutoDemo={isRunningAutoDemo}
          onToggleAutoDemo={handleToggleAutoDemo}
        />

        {/* Main Tabs Navigation with Animated Indicator Pill */}
        <div className="overflow-x-auto pb-1">
          <TabsNav
            tabs={mainTabs}
            activeTab={activeMainTab}
            onChange={(id) => {
              setActiveMainTab(id);
              if (id === 'upload') setDemoStep(1);
              if (id === 'training') setDemoStep(2);
              if (id === 'scoring') setDemoStep(3);
            }}
            variant="main"
          />
        </div>

        {/* Main Tab Content View with Dynamic Slide & Fade Transitions */}
        <main className="min-h-[520px]">
          <AnimatePresence mode="wait">
            {activeMainTab === 'upload' && (
              <motion.div
                key="upload-view"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <DataUploadView
                  onDatasetLoaded={(stats) => setCurrentDataset(stats)}
                  currentDataset={currentDataset}
                />
              </motion.div>
            )}

            {activeMainTab === 'network' && (
              <motion.div
                key="network-view"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <NetworkTopologyView />
              </motion.div>
            )}

            {activeMainTab === 'training' && (
              <motion.div
                key="training-view"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <FederatedTrainingView />
              </motion.div>
            )}

            {activeMainTab === 'scoring' && (
              <motion.div
                key="scoring-view"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <RiskScoringView />
              </motion.div>
            )}

            {activeMainTab === 'governance' && (
              <motion.div
                key="governance-view"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <ResponsibleAIView />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer with Cryptographic Disclaimer from PRD §14 */}
        <footer className="pt-8 pb-4 border-t border-slate-800/60 text-center text-xs text-slate-500">
          <p>
            TrustFed Hackathon Prototype • Flower Federated Averaging • PyTorch MLP • Differential Privacy (Opacus/Rényi)
          </p>
          <p className="text-[11px] text-slate-600 mt-1">
            "Institutions collaborate on intelligence, not customer data." Designed for the ENIGMA Hackathon.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
