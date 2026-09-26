import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';
import { DecryptedText } from '../react-bits/DecryptedText';

interface JudgeDemoBarProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  isRunningAutoDemo: boolean;
  onToggleAutoDemo: () => void;
}

export const JudgeDemoBar: React.FC<JudgeDemoBarProps> = ({
  currentStep,
  onSelectStep,
  isRunningAutoDemo,
  onToggleAutoDemo,
}) => {
  const steps = [
    {
      num: 1,
      time: 'Min 1',
      title: 'Data Silos & Isolation',
      desc: 'Show 3 institutions with private PaySim data (Zero raw sharing)',
      tabId: 'upload',
    },
    {
      num: 2,
      time: 'Min 2',
      title: 'Federated SecAgg + DP',
      desc: 'Flower FedAvg rounds, encrypted weights & ε-differential privacy',
      tabId: 'training',
    },
    {
      num: 3,
      time: 'Min 3',
      title: 'The Fraud Showdown',
      desc: 'Silo misses attack (24/100) vs TrustFed catches it (87/100 + SHAP)',
      tabId: 'scoring',
    },
  ];

  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 border border-cyan-500/20 p-3.5 shadow-xl backdrop-blur-md mb-6 overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Badge & Description */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                PRD §15 Hackathon Demo Flow
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                3-Minute Script
              </span>
            </div>
            <p className="text-xs text-slate-300">
              <DecryptedText text="Institutions collaborate on intelligence, never on customer records." />
            </p>
          </div>
        </div>

        {/* Middle: 3 Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 max-w-2xl">
          {steps.map((s) => {
            const isCurrent = currentStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => onSelectStep(s.num)}
                className={`relative flex items-center gap-2.5 p-2 rounded-xl text-left transition-all duration-300 cursor-pointer ${
                  isCurrent
                    ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-200 shadow-md'
                    : 'bg-slate-800/40 border border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-mono font-bold ${
                    isCurrent
                      ? 'bg-cyan-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {s.num}
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold truncate">{s.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {s.time} • {s.desc.slice(0, 32)}...
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Quick Action Button */}
        <button
          onClick={onToggleAutoDemo}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer shrink-0 ${
            isRunningAutoDemo
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02]'
          }`}
        >
          {isRunningAutoDemo ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Auto Playing Demo...
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              Start 3-Min Pitch
            </>
          )}
        </button>
      </div>
    </div>
  );
};
