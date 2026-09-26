import React from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsNavProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'main' | 'sub';
  className?: string;
}

export const TabsNav: React.FC<TabsNavProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'main',
  className = '',
}) => {
  const isMain = variant === 'main';

  return (
    <div
      className={`relative flex items-center gap-1.5 p-1.5 rounded-2xl ${
        isMain
          ? 'bg-slate-900/80 border border-slate-800/80 backdrop-blur-md shadow-2xl'
          : 'bg-slate-950/60 border border-slate-800/50 p-1 rounded-xl'
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-colors duration-200 z-10 cursor-pointer ${
              isActive
                ? 'text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            {/* Animated Pill Background */}
            {isActive && (
              <motion.div
                layoutId={isMain ? 'activeMainTabPill' : 'activeSubTabPill'}
                className={`absolute inset-0 rounded-xl ${
                  isMain
                    ? 'bg-gradient-to-r from-cyan-950/80 via-slate-800 to-blue-950/80 border border-cyan-500/40 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-800/90 border border-slate-700/60'
                }`}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}

            {/* Icon */}
            {tab.icon && (
              <span className={`relative z-10 transition-transform duration-200 ${isActive ? 'scale-110 text-cyan-400' : 'opacity-70'}`}>
                {tab.icon}
              </span>
            )}

            {/* Label */}
            <span className="relative z-10">{tab.label}</span>

            {/* Badge */}
            {tab.badge !== undefined && (
              <span
                className={`relative z-10 ml-1 px-1.5 py-0.5 text-[10px] font-mono rounded-full ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
