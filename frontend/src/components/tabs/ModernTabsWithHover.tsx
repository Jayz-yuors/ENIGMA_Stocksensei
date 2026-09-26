import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Cpu, 
  ShieldAlert, 
  Building2, 
  FileSpreadsheet, 
  Network, 
  Play, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  Scale, 
  Activity, 
  ChevronDown 
} from 'lucide-react';

export interface SubTabDef {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  badge?: string;
}

export interface MainTabDef {
  id: string;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: string;
  subtabs: SubTabDef[];
}

export const MAIN_TABS: MainTabDef[] = [
  {
    id: 'silos',
    label: '1. Data Silos & Network',
    subtitle: 'Institutional silos, schema alignment & node topology',
    icon: <Database className="w-4 h-4 text-blue-500" />,
    badge: '3-4 Nodes',
    subtabs: [
      {
        id: 'upload',
        label: 'Institutional Silo Partitions',
        desc: 'Zero-knowledge isolated data partitions for Bank, Wallet, Lender, and Insurer silos.',
        icon: <Building2 className="w-4 h-4 text-blue-600" />,
        badge: 'FR-1',
      },
      {
        id: 'schema',
        label: 'Shared Schema Alignment',
        desc: 'Review mapped PaySim features and temporal train/test split rules.',
        icon: <FileSpreadsheet className="w-4 h-4 text-cyan-600" />,
        badge: 'PRD §9',
      },
      {
        id: 'topology',
        label: 'Federated Node Topology',
        desc: 'Interactive 4-node network map with live dropout simulation & quorum check.',
        icon: <Network className="w-4 h-4 text-emerald-600" />,
        badge: 'SecAgg',
      },
    ],
  },
  {
    id: 'engine',
    label: '2. Federated Engine',
    subtitle: 'Flower FedAvg, SecAgg+ & DP accountant',
    icon: <Cpu className="w-4 h-4 text-teal-500" />,
    badge: 'FedAvg + DP',
    subtabs: [
      {
        id: 'training',
        label: 'Live Training Cockpit',
        desc: 'Execute real-time Flower FedAvg rounds and view live convergence curves.',
        icon: <Play className="w-4 h-4 text-teal-600" />,
        badge: 'Rounds 1-10',
      },
      {
        id: 'secagg',
        label: 'SecAgg+ Cryptographic Masks',
        desc: 'Diffie-Hellman update masking ensuring individual client gradients are never exposed.',
        icon: <Lock className="w-4 h-4 text-cyan-600" />,
        badge: 'Zero-Knowledge',
      },
      {
        id: 'privacy',
        label: 'Differential Privacy Accountant',
        desc: 'Rényi DP budget tracking (ε = 2.45, δ = 10⁻⁵) with Gaussian noise & gradient clipping.',
        icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
        badge: 'NIST Safe',
      },
    ],
  },
  {
    id: 'intelligence',
    label: '3. Intelligence & Governance',
    subtitle: 'Risk showdown, SHAP explanations & fairness',
    icon: <ShieldAlert className="w-4 h-4 text-emerald-500" />,
    badge: 'PR-AUC 0.842',
    subtabs: [
      {
        id: 'showdown',
        label: 'The Fraud Showdown Studio',
        desc: 'Test transactions: Silo misses attacks (13/100) vs TrustFed catches them (87/100).',
        icon: <ShieldAlert className="w-4 h-4 text-emerald-600" />,
        badge: 'Showdown',
      },
      {
        id: 'shap',
        label: 'SHAP Explainability Waterfall',
        desc: 'Per-transaction local feature contribution breakdown and plain-language reason codes.',
        icon: <Sparkles className="w-4 h-4 text-teal-600" />,
        badge: 'FR-8',
      },
      {
        id: 'fairness',
        label: 'NIST Fairness & Parity',
        desc: 'Disparate impact & Equal Opportunity differences across customer cohorts.',
        icon: <Scale className="w-4 h-4 text-blue-600" />,
        badge: 'FR-9',
      },
      {
        id: 'audit',
        label: 'Drift Health & Audit Trail',
        desc: 'Population Stability Index (PSI) distribution checks & tamper-evident event logs.',
        icon: <Activity className="w-4 h-4 text-cyan-600" />,
        badge: 'FR-10/11',
      },
    ],
  },
];

interface ModernTabsWithHoverProps {
  activeMainTab: string;
  activeSubTab: string;
  onSelectTab: (mainTabId: string, subTabId?: string) => void;
}

export const ModernTabsWithHover: React.FC<ModernTabsWithHoverProps> = ({
  activeMainTab,
  activeSubTab,
  onSelectTab,
}) => {
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);

  return (
    <div className="relative z-30">
      {/* 3 Main Tabs Container: Luminous Frosted Glass */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-2.5 rounded-2xl bg-white/90 border-2 border-blue-200/90 backdrop-blur-2xl shadow-2xl shadow-emerald-500/15">
        {MAIN_TABS.map((tab) => {
          const isActive = activeMainTab === tab.id;
          const isHovered = hoveredTabId === tab.id;

          // Tab-specific Blue & Green color schemes
          const activeGradient = 
            tab.id === 'silos' 
              ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 text-white shadow-[0_4px_0_#1d4ed8,0_12px_24px_-2px_rgba(37,99,235,0.45)] border-cyan-300/60'
              : tab.id === 'engine'
              ? 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-white shadow-[0_4px_0_#0f766e,0_12px_24px_-2px_rgba(13,148,136,0.45)] border-emerald-300/60'
              : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500 text-white shadow-[0_4px_0_#047857,0_12px_24px_-2px_rgba(16,185,129,0.45)] border-green-300/60';

          const inactiveStyle = 
            tab.id === 'silos'
              ? 'bg-gradient-to-r from-blue-50/90 via-white to-sky-50/60 border-2 border-blue-200/90 text-blue-950 hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/10'
              : tab.id === 'engine'
              ? 'bg-gradient-to-r from-teal-50/90 via-white to-cyan-50/60 border-2 border-teal-200/90 text-teal-950 hover:border-teal-400 hover:shadow-md hover:shadow-teal-500/10'
              : 'bg-gradient-to-r from-emerald-50/90 via-white to-green-50/60 border-2 border-emerald-200/90 text-emerald-950 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-500/10';

          const iconColor = 
            tab.id === 'silos' ? 'text-blue-600' : tab.id === 'engine' ? 'text-teal-600' : 'text-emerald-600';

          const badgeStyle = 
            tab.id === 'silos' ? 'bg-blue-100 text-blue-800 border-blue-200' : tab.id === 'engine' ? 'bg-teal-100 text-teal-800 border-teal-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200';

          return (
            <div
              key={tab.id}
              className="relative"
              onMouseEnter={() => setHoveredTabId(tab.id)}
              onMouseLeave={() => setHoveredTabId(null)}
            >
              {/* Tab Header Button */}
              <button
                onClick={() => onSelectTab(tab.id, tab.subtabs[0].id)}
                className={`w-full relative flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 text-left cursor-pointer group border ${
                  isActive
                    ? `${activeGradient} -translate-y-0.5`
                    : `${inactiveStyle}`
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                      isActive
                        ? 'bg-white/20 text-white shadow-inner backdrop-blur-sm'
                        : `bg-white border border-slate-200/80 ${iconColor} shadow-sm`
                    }`}
                  >
                    {tab.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {tab.label}
                      </span>
                    </div>
                    <span className={`text-[11px] block truncate max-w-[200px] mt-0.5 ${isActive ? 'text-white/90' : 'text-slate-600'}`}>
                      {tab.subtitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {tab.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                        isActive
                          ? 'bg-white/25 text-white border-white/40 backdrop-blur-sm'
                          : badgeStyle
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isActive ? 'text-white/90' : 'text-slate-500'
                    } ${isHovered ? 'rotate-180 text-white' : ''}`}
                  />
                </div>
              </button>

              {/* Hover Mega-Dropdown Previewing Subtabs */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute top-full left-0 right-0 mt-2 p-3.5 rounded-3xl bg-white/95 border-2 border-blue-200/90 backdrop-blur-3xl shadow-2xl shadow-emerald-900/15 z-50 space-y-2 min-w-[340px]"
                  >
                    <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 flex items-center justify-between border-b border-blue-100 pb-2">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        Available Sub-Modules ({tab.subtabs.length})
                      </span>
                      <span className="text-slate-400 font-medium">Click to navigate</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {tab.subtabs.map((sub) => {
                        const isSubActive = isActive && activeSubTab === sub.id;

                        return (
                          <div
                            key={sub.id}
                            onClick={() => {
                              onSelectTab(tab.id, sub.id);
                              setHoveredTabId(null);
                            }}
                            className={`p-2.5 rounded-2xl transition-all duration-200 cursor-pointer flex items-start gap-3 text-left ${
                              isSubActive
                                ? 'bg-gradient-to-r from-blue-100/90 to-emerald-100/90 border-2 border-emerald-300 shadow-md'
                                : 'hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-emerald-50/60 border border-transparent hover:border-blue-200'
                            }`}
                          >
                            <div className="p-2 rounded-xl bg-white border border-blue-100 shadow-sm shrink-0 mt-0.5">
                              {sub.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-bold ${isSubActive ? 'text-indigo-950 font-black' : 'text-slate-900'}`}>
                                  {sub.label}
                                </span>
                                {sub.badge && (
                                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                    {sub.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 leading-snug mt-0.5 line-clamp-2">
                                {sub.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
