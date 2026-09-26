import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, 
  Activity, 
  ShieldCheck, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Eye, 
  Lock,
  FileSpreadsheet
} from 'lucide-react';
import { SpotlightCard } from '../react-bits/SpotlightCard';
import { DecryptedText } from '../react-bits/DecryptedText';
import { CountUp } from '../react-bits/CountUp';
import { TabsNav } from '../tabs/TabsNav';

export const ResponsibleAIView: React.FC = () => {
  const [subTab, setSubTab] = useState<'fairness' | 'drift' | 'privacy' | 'audit'>('privacy');

  return (
    <div className="space-y-6">
      {/* Top Header and Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Scale className="w-5 h-5 text-cyan-400" />
            <DecryptedText text="Responsible AI, Privacy & Governance Centre (FR-9 to FR-12)" />
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            NIST-aligned trustworthy AI auditing: Differential privacy bounds, fairness parity, and data drift detection.
          </p>
        </div>

        <TabsNav
          tabs={[
            { id: 'privacy', label: '1. Privacy Scorecard (FR-12)', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
            { id: 'fairness', label: '2. Fairness Parity (FR-9)', icon: <Scale className="w-3.5 h-3.5" /> },
            { id: 'drift', label: '3. Drift Health (FR-10)', icon: <Activity className="w-3.5 h-3.5" /> },
            { id: 'audit', label: '4. Audit Logs (FR-11)', icon: <FileCheck className="w-3.5 h-3.5" /> },
          ]}
          activeTab={subTab}
          onChange={(id) => setSubTab(id as any)}
          variant="sub"
        />
      </div>

      <AnimatePresence mode="wait">
        {subTab === 'privacy' && (
          <motion.div
            key="privacy"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* PRD §12 Privacy Scorecard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <SpotlightCard className="p-5 border-emerald-500/30 bg-emerald-950/10" spotlightColor="rgba(16, 185, 129, 0.2)">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Raw Data Leakage</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold font-mono text-emerald-400 mt-2">
                  <CountUp to={0} duration={0.5} />
                </div>
                <p className="text-xs text-slate-300 mt-2 font-medium">
                  Zero raw records or transaction columns exchanged.
                </p>
                <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                  Verified via client network inspection
                </span>
              </SpotlightCard>

              <SpotlightCard className="p-5 border-cyan-500/30 bg-cyan-950/10" spotlightColor="rgba(6, 182, 212, 0.2)">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Secure Aggregation</span>
                  <Lock className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xl font-bold text-cyan-300 mt-2 flex items-center gap-1.5">
                  SecAgg+ Active
                </div>
                <p className="text-xs text-slate-300 mt-2 font-medium">
                  Coordinator cannot inspect individual client updates.
                </p>
                <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                  Minimum client threshold: 3 (Enforced)
                </span>
              </SpotlightCard>

              <SpotlightCard className="p-5 border-amber-500/30 bg-amber-950/10" spotlightColor="rgba(245, 158, 11, 0.2)">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Differential Privacy</span>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-2">
                  ε = 2.45, δ = 10⁻⁵
                </div>
                <p className="text-xs text-slate-300 mt-2 font-medium">
                  Rényi DP Accountant with Gaussian perturbation.
                </p>
                <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                  Clipping norm: 1.0 • Noise σ: 1.2
                </span>
              </SpotlightCard>
            </div>

            {/* Privacy Architecture Checklist */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Cryptographic Privacy Checklist (PRD FR-12)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Raw Records Quarantined</span>
                    <span className="text-slate-400 text-[11px]">Strict local client-side boundary enforced</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Coordinator Honest-But-Curious</span>
                    <span className="text-slate-400 text-[11px]">SecAgg masks prevent gradient reconstruction</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Quorum Auto-Abort</span>
                    <span className="text-slate-400 text-[11px]">Blocks round if &lt;3 institutions participate</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-200 block">DP Noise Injection</span>
                    <span className="text-slate-400 text-[11px]">Limits membership inference attacks</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {subTab === 'fairness' && (
          <motion.div
            key="fairness"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200">
                  Group Fairness & Equal Opportunity Monitoring (PRD FR-9)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verifying the global federated model does not unfairly penalize thin-file or newly onboarded users.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                Parity Delta: 0.024 (Within 0.05 Target)
              </span>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono">
                    <th className="pb-2.5 font-semibold">Evaluation Demographic Group</th>
                    <th className="pb-2.5 font-semibold">Sample Size</th>
                    <th className="pb-2.5 font-semibold">Recall (TPR)</th>
                    <th className="pb-2.5 font-semibold">False Positive Rate (FPR)</th>
                    <th className="pb-2.5 font-semibold">Equal Opportunity Δ</th>
                    <th className="pb-2.5 font-semibold">Compliance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-3 font-semibold text-slate-200">New Accounts (&lt; 30 Days)</td>
                    <td className="py-3 font-mono text-slate-400">14,210</td>
                    <td className="py-3 font-mono text-cyan-300 font-bold">88.4%</td>
                    <td className="py-3 font-mono text-slate-300">1.8%</td>
                    <td className="py-3 font-mono text-emerald-400">+0.018</td>
                    <td className="py-3"><span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">Compliant</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-200">Existing Accounts (&gt; 1 Year)</td>
                    <td className="py-3 font-mono text-slate-400">62,800</td>
                    <td className="py-3 font-mono text-cyan-300 font-bold">90.2%</td>
                    <td className="py-3 font-mono text-slate-300">1.2%</td>
                    <td className="py-3 font-mono text-emerald-400">Baseline</td>
                    <td className="py-3"><span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">Compliant</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-200">Thin-File Micro-Borrowers</td>
                    <td className="py-3 font-mono text-slate-400">8,950</td>
                    <td className="py-3 font-mono text-cyan-300 font-bold">86.7%</td>
                    <td className="py-3 font-mono text-slate-300">2.1%</td>
                    <td className="py-3 font-mono text-emerald-400">-0.024</td>
                    <td className="py-3"><span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">Compliant</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {subTab === 'drift' && (
          <motion.div
            key="drift"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200">
                  Feature & Prediction Drift Health (PRD FR-10)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Continuous distribution testing via Population Stability Index (PSI) and Kolmogorov-Smirnov.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-800">
                Overall Health: Stable
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                <span className="text-xs text-slate-400 font-mono">Amount Distribution PSI</span>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">0.042</div>
                <span className="text-[11px] text-slate-500 mt-1 block">PSI &lt; 0.1 (No significant drift)</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                <span className="text-xs text-slate-400 font-mono">Transaction Velocity KS-Test</span>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">p = 0.412</div>
                <span className="text-[11px] text-slate-500 mt-1 block">Distribution match confirmed</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                <span className="text-xs text-slate-400 font-mono">Prediction Drift Status</span>
                <div className="text-xl font-bold text-cyan-300 mt-1">In Bounds</div>
                <span className="text-[11px] text-slate-500 mt-1 block">Reference vs Current Week</span>
              </div>
            </div>
          </motion.div>
        )}

        {subTab === 'audit' && (
          <motion.div
            key="audit"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-200">
              Immutable Federated Audit Trail (PRD FR-11)
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Logs training round initiations, SecAgg quorum verifications, and transaction scoring requests.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2">Timestamp</th>
                    <th className="pb-2">Actor / Client</th>
                    <th className="pb-2">Action</th>
                    <th className="pb-2">Object</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-300">
                  <tr>
                    <td className="py-2.5 text-slate-400">2026-09-26 10:45:12</td>
                    <td className="py-2.5 text-cyan-400 font-semibold">Apex Tier-1 Bank</td>
                    <td className="py-2.5">REGISTER_SILO</td>
                    <td className="py-2.5">PaySim_Bank_Partition.csv (48.5k rows)</td>
                    <td className="py-2.5 text-emerald-400 font-bold">SUCCESS</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-slate-400">2026-09-26 10:46:00</td>
                    <td className="py-2.5 text-purple-400 font-semibold">Flower Coordinator</td>
                    <td className="py-2.5">INITIATE_ROUND</td>
                    <td className="py-2.5">Round 10/10 (SecAgg + DP Active)</td>
                    <td className="py-2.5 text-emerald-400 font-bold">SUCCESS</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-slate-400">2026-09-26 10:48:33</td>
                    <td className="py-2.5 text-blue-400 font-semibold">Risk Analyst</td>
                    <td className="py-2.5">SCORE_TRANSACTION</td>
                    <td className="py-2.5">TX_#9482 ($14,850 TRANSFER) &rarr; Manual Review</td>
                    <td className="py-2.5 text-emerald-400 font-bold">LOGGED</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
