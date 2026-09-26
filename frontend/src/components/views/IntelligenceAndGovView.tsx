import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Scale, 
  Activity, 
  Sparkles, 
  CreditCard 
} from 'lucide-react';

import { TiltedCard } from '../react-bits/TiltedCard';
import { CountUp } from '../react-bits/CountUp';
import { DecryptedText } from '../react-bits/DecryptedText';
import { BorderBeam } from '../react-bits/BorderBeam';
import { TabsNav } from '../tabs/TabsNav';

interface IntelligenceAndGovViewProps {
  activeSubTab?: string;
  onSubTabChange?: (id: string) => void;
}

export const IntelligenceAndGovView: React.FC<IntelligenceAndGovViewProps> = ({
  activeSubTab = 'showdown',
  onSubTabChange,
}) => {
  const [internalSubTab, setInternalSubTab] = useState<string>(activeSubTab);

  const [tx, setTx] = useState({
    amount: 14850,
    type: 'TRANSFER',
    newRecipient: true,
    deviceSeenBefore: false,
    transfersLast90s: 4,
    originBalance: 15200,
  });

  useEffect(() => {
    if (activeSubTab) {
      setInternalSubTab(activeSubTab);
    }
  }, [activeSubTab]);

  const handleSubTabSwitch = (id: string) => {
    setInternalSubTab(id);
    onSubTabChange?.(id);
  };

  const calculateScores = () => {
    let globalRisk = 12;
    let siloRisk = 10;

    if (tx.amount > 10000) {
      globalRisk += 28;
      siloRisk += 14;
    }
    if (tx.newRecipient) {
      globalRisk += 22;
    }
    if (!tx.deviceSeenBefore) {
      globalRisk += 18;
    }
    if (tx.transfersLast90s >= 3) {
      globalRisk += 19;
    }

    globalRisk = Math.min(Math.max(globalRisk, 5), 96);
    siloRisk = Math.min(Math.max(siloRisk, 5), 35);

    return {
      globalScore: globalRisk,
      globalAction: globalRisk >= 70 ? 'Manual Review' : globalRisk >= 40 ? 'Additional Verification' : 'Approve',
      siloScore: siloRisk,
      siloAction: siloRisk >= 70 ? 'Manual Review' : siloRisk >= 40 ? 'Additional Verification' : 'Approve',
    };
  };

  const results = calculateScores();

  const loadPreset = (preset: 'attack' | 'normal') => {
    if (preset === 'attack') {
      setTx({
        amount: 18500,
        type: 'TRANSFER',
        newRecipient: true,
        deviceSeenBefore: false,
        transfersLast90s: 5,
        originBalance: 19000,
      });
    } else {
      setTx({
        amount: 450,
        type: 'PAYMENT',
        newRecipient: false,
        deviceSeenBefore: true,
        transfersLast90s: 0,
        originBalance: 8200,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Subtab Navigation Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-600" />
            <span>Intelligence, Showdown & NIST Governance</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Test transaction scoring showdown, inspect SHAP reason factors, and audit fairness parity across cohorts.
          </p>
        </div>

        <TabsNav
          tabs={[
            { id: 'showdown', label: '1. The Fraud Showdown', icon: <ShieldAlert className="w-3.5 h-3.5" />, badge: 'Showdown' },
            { id: 'shap', label: '2. SHAP Explainability', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'fairness', label: '3. Fairness Parity', icon: <Scale className="w-3.5 h-3.5" /> },
            { id: 'audit', label: '4. Drift & Audit Trail', icon: <Activity className="w-3.5 h-3.5" /> },
          ]}
          activeTab={internalSubTab}
          onChange={handleSubTabSwitch}
          variant="sub"
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {/* SUBTAB 1: THE FRAUD SHOWDOWN */}
        {internalSubTab === 'showdown' && (
          <motion.div
            key="subtab-showdown"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Quick Preset Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl border-2 border-blue-200/90 bg-gradient-to-r from-blue-50/95 via-teal-50/90 to-emerald-50/95 shadow-xl shadow-emerald-500/10">
              <div>
                <span className="text-xs font-mono uppercase text-blue-900 font-black tracking-wider block">Scenario Presets:</span>
                <span className="text-xs text-slate-600 font-medium">Simulate suspicious cross-institutional transactions</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => loadPreset('attack')}
                  className="btn-3d-danger px-4 py-2 rounded-full text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-lg shadow-rose-500/20"
                >
                  <span>⚡ Cross-Border Attack</span>
                </button>
                <button
                  onClick={() => loadPreset('normal')}
                  className="btn-3d-success px-4 py-2 rounded-full text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <span>✓ Routine Salary Payment</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Transaction Input Form (5 cols) */}
              <div className="lg:col-span-5 rounded-3xl border-2 border-blue-200/90 bg-white/95 p-6 space-y-4 shadow-2xl shadow-blue-500/10">
                <h3 className="text-sm font-bold text-slate-900 border-b border-blue-100 pb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  Transaction Sandbox Inputs
                </h3>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Transfer Amount:</span>
                    <span className="font-mono text-blue-700 font-bold">${tx.amount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="50000"
                    step="250"
                    value={tx.amount}
                    onChange={(e) => setTx(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-medium block mb-1">Transaction Type</label>
                  <div className="grid grid-cols-3 gap-2.5 text-xs">
                    {['TRANSFER', 'CASH_OUT', 'PAYMENT'].map(type => (
                      <button
                        key={type}
                        onClick={() => setTx(prev => ({ ...prev, type }))}
                        className={`py-2.5 rounded-xl font-mono text-[11px] font-bold cursor-pointer ${
                          tx.type === type
                            ? 'btn-3d-primary'
                            : 'btn-3d-glass'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl border-2 border-blue-100 bg-gradient-to-br from-blue-50/60 to-emerald-50/40">
                    <span className="text-[11px] text-slate-600 block mb-2 font-medium">Recipient Status</span>
                    <button
                      onClick={() => setTx(prev => ({ ...prev, newRecipient: !prev.newRecipient }))}
                      className={`w-full py-2 px-2 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 ${
                        tx.newRecipient
                          ? 'btn-3d-danger'
                          : 'btn-3d-glass'
                      }`}
                    >
                      {tx.newRecipient ? '⚠️ New Recipient' : '✓ Known'}
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl border-2 border-blue-100 bg-gradient-to-br from-blue-50/60 to-emerald-50/40">
                    <span className="text-[11px] text-slate-600 block mb-2 font-medium">Device Fingerprint</span>
                    <button
                      onClick={() => setTx(prev => ({ ...prev, deviceSeenBefore: !prev.deviceSeenBefore }))}
                      className={`w-full py-2 px-2 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 ${
                        !tx.deviceSeenBefore
                          ? 'btn-3d-danger'
                          : 'btn-3d-glass'
                      }`}
                    >
                      {!tx.deviceSeenBefore ? '🚫 Unseen Device' : '✓ Familiar'}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Velocity (past 90s):</span>
                    <span className="font-mono text-amber-600 font-bold">{tx.transfersLast90s} txs</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    value={tx.transfersLast90s}
                    onChange={(e) => setTx(prev => ({ ...prev, transfersLast90s: Number(e.target.value) }))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Right Column: 3D Side-by-Side Showdown (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Isolated Silo Model */}
                  <TiltedCard maxTilt={8} className="p-6 border-2 border-amber-300 bg-gradient-to-b from-white to-amber-50/40 shadow-xl shadow-amber-500/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-slate-600 font-bold">Isolated Bank Silo Model</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-100 text-amber-800 font-bold border border-amber-200">
                        No Cross-Signals
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                      <div className="text-4xl font-extrabold font-mono text-emerald-600">
                        <CountUp to={results.siloScore} duration={0.8} />
                      </div>
                      <span className="text-xs text-slate-400 font-mono font-medium">/ 100</span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Decision:</span>
                      <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {results.siloAction}
                      </span>
                    </div>
                    <div className="mt-3 text-[11px] text-rose-600 font-mono flex items-center gap-1 font-bold">
                      ⚠️ False Negative (Blind to mobile device & velocity)
                    </div>
                  </TiltedCard>

                  {/* TrustFed Global Federated Model */}
                  <TiltedCard 
                    maxTilt={8} 
                    className="p-6 border-2 border-emerald-400 bg-gradient-to-b from-white to-emerald-50/40 shadow-2xl shadow-emerald-500/20"
                    glowColor="rgba(16, 185, 129, 0.35)"
                  >
                    <BorderBeam duration={5} colorFrom="#0284C7" colorTo="#10B981" />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-emerald-900">TrustFed Federated Global</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                        SecAgg + DP (v10)
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                      <div className={`text-4xl font-extrabold font-mono ${
                        results.globalScore >= 70 ? 'text-rose-600' : results.globalScore >= 40 ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        <CountUp to={results.globalScore} duration={0.8} />
                      </div>
                      <span className="text-xs text-slate-400 font-mono font-medium">/ 100</span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Recommended Action:</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                        results.globalScore >= 70 
                          ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                          : results.globalScore >= 40 
                          ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {results.globalAction}
                      </span>
                    </div>
                    <div className="mt-3 text-[11px] text-emerald-700 font-mono flex items-center gap-1 font-bold">
                      ✓ Caught via collaborative cross-silo intelligence
                    </div>
                  </TiltedCard>
                </div>

                {/* Quick Hint Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-100/90 to-emerald-100/90 border-2 border-blue-200/90 text-xs text-slate-800 flex items-center justify-between shadow-md">
                  <span className="font-semibold text-blue-950">Want to see how individual features contributed to this score?</span>
                  <button
                    onClick={() => handleSubTabSwitch('shap')}
                    className="text-blue-700 hover:text-emerald-700 font-bold cursor-pointer underline ml-2"
                  >
                    View SHAP Explainer &rarr;
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SUBTAB 2: SHAP EXPLAINABILITY */}
        {internalSubTab === 'shap' && (
          <motion.div
            key="subtab-shap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    SHAP Local Waterfall Explainability (PRD FR-8)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Decomposition of transaction risk factors into directional feature contributions:
                  </p>
                </div>
                <span className="text-xs font-mono text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 font-bold">
                  global_v10 Checkpoint
                </span>
              </div>

              <div className="space-y-3.5 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-800 font-semibold">Amount substantially exceeds origin customer baseline ($14,850)</span>
                    <span className="font-mono text-rose-600 font-bold">+38% (SHAP: +0.38)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full" style={{ width: '76%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-800 font-semibold">Unseen mobile device ID (Learned from FlashPay Wallet silo)</span>
                    <span className="font-mono text-rose-600 font-bold">+24% (SHAP: +0.24)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full" style={{ width: '48%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-800 font-semibold">New first-time destination account recipient</span>
                    <span className="font-mono text-amber-600 font-bold">+18% (SHAP: +0.18)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '36%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-800 font-semibold">Burst transfer velocity (4 transactions / 90 sec)</span>
                    <span className="font-mono text-amber-600 font-bold">+12% (SHAP: +0.12)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '24%' }} />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed font-medium">
                <span className="font-bold text-slate-900">NIST Trustworthy AI Rule:</span> High-risk transactions are routed to a human fraud analyst rather than automatically denied (PRD §6 & FR-7).
              </div>
            </div>
          </motion.div>
        )}

        {/* SUBTAB 3: FAIRNESS PARITY */}
        {internalSubTab === 'fairness' && (
          <motion.div
            key="subtab-fairness"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Group Fairness & Equal Opportunity Monitoring (PRD FR-9)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Verifying the global federated model does not unfairly penalize thin-file or newly onboarded users.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                Parity Delta: 0.024 (Target: &lt; 0.05)
              </span>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-mono">
                    <th className="pb-3 font-semibold">Evaluation Demographic Group</th>
                    <th className="pb-3 font-semibold">Sample Size</th>
                    <th className="pb-3 font-semibold">Recall (TPR)</th>
                    <th className="pb-3 font-semibold">False Positive Rate (FPR)</th>
                    <th className="pb-3 font-semibold">Equal Opportunity Δ</th>
                    <th className="pb-3 font-semibold">Compliance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-3 font-bold text-slate-900">New Accounts (&lt; 30 Days)</td>
                    <td className="py-3 font-mono text-slate-500">14,210</td>
                    <td className="py-3 font-mono text-blue-700 font-bold">88.4%</td>
                    <td className="py-3 font-mono text-slate-600">1.8%</td>
                    <td className="py-3 font-mono text-emerald-700 font-bold">+0.018</td>
                    <td className="py-3"><span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">Compliant</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-slate-900">Existing Accounts (&gt; 1 Year)</td>
                    <td className="py-3 font-mono text-slate-500">62,800</td>
                    <td className="py-3 font-mono text-blue-700 font-bold">90.2%</td>
                    <td className="py-3 font-mono text-slate-600">1.2%</td>
                    <td className="py-3 font-mono text-emerald-700 font-bold">Baseline</td>
                    <td className="py-3"><span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">Compliant</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-slate-900">Thin-File Micro-Borrowers</td>
                    <td className="py-3 font-mono text-slate-500">8,950</td>
                    <td className="py-3 font-mono text-blue-700 font-bold">86.7%</td>
                    <td className="py-3 font-mono text-slate-600">2.1%</td>
                    <td className="py-3 font-mono text-emerald-700 font-bold">-0.024</td>
                    <td className="py-3"><span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">Compliant</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* SUBTAB 4: DRIFT & AUDIT TRAIL */}
        {internalSubTab === 'audit' && (
          <motion.div
            key="subtab-audit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TiltedCard maxTilt={8} className="p-5">
                <span className="text-xs text-slate-500 font-mono font-bold">Amount Distribution PSI</span>
                <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">0.042</div>
                <span className="text-[11px] text-slate-500 mt-1 block font-medium">PSI &lt; 0.1 (No significant drift)</span>
              </TiltedCard>

              <TiltedCard maxTilt={8} className="p-5">
                <span className="text-xs text-slate-500 font-mono font-bold">Velocity KS-Test</span>
                <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">p = 0.412</div>
                <span className="text-[11px] text-slate-500 mt-1 block font-medium">Feature distribution match confirmed</span>
              </TiltedCard>

              <TiltedCard maxTilt={8} className="p-5">
                <span className="text-xs text-slate-500 font-mono font-bold">Prediction Drift Status</span>
                <div className="text-2xl font-bold text-blue-700 mt-1">In Bounds</div>
                <span className="text-[11px] text-slate-500 mt-1 block font-medium">Reference vs Current Week</span>
              </TiltedCard>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xl space-y-3">
              <h4 className="text-xs font-mono uppercase text-slate-800 font-bold">
                Immutable Federated Audit Trail (PRD FR-11)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-3">Timestamp</th>
                      <th className="pb-3">Actor / Client</th>
                      <th className="pb-3">Action</th>
                      <th className="pb-3">Object</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-3 text-slate-500">2026-09-26 10:45:12</td>
                      <td className="py-3 text-blue-700 font-bold">Apex Tier-1 Bank</td>
                      <td className="py-3">REGISTER_SILO</td>
                      <td className="py-3">PaySim_Bank_Partition.csv (48.5k rows)</td>
                      <td className="py-3 text-emerald-700 font-bold">SUCCESS</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-500">2026-09-26 10:46:00</td>
                      <td className="py-3 text-emerald-700 font-bold">Flower Coordinator</td>
                      <td className="py-3">INITIATE_ROUND</td>
                      <td className="py-3">Round 10/10 (SecAgg + DP Active)</td>
                      <td className="py-3 text-emerald-700 font-bold">SUCCESS</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-500">2026-09-26 10:48:33</td>
                      <td className="py-3 text-blue-700 font-bold">Risk Analyst</td>
                      <td className="py-3">SCORE_TRANSACTION</td>
                      <td className="py-3">TX_#9482 ($14,850 TRANSFER) &rarr; Manual Review</td>
                      <td className="py-3 text-emerald-700 font-bold">LOGGED</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
