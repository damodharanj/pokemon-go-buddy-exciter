import React, { useState } from 'react';
import {
  Apple,
  Sparkles,
  Camera,
  Swords,
  Skull,
  ShieldAlert,
  Footprints,
  Compass,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';
import { BuddyActivityId, BuddySessionState } from '../types/buddy';
import { ACTIVITIES } from '../utils/buddyConstants';

interface ChecklistProps {
  state: BuddySessionState;
  onToggleActivity: (id: BuddyActivityId) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Apple: <Apple className="w-5 h-5 text-rose-400" />,
  Sparkles: <Sparkles className="w-5 h-5 text-amber-400" />,
  Camera: <Camera className="w-5 h-5 text-sky-400" />,
  Swords: <Swords className="w-5 h-5 text-indigo-400" />,
  Skull: <Skull className="w-5 h-5 text-purple-400" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5 text-orange-400" />,
  Footprints: <Footprints className="w-5 h-5 text-emerald-400" />,
  Compass: <Compass className="w-5 h-5 text-teal-400" />,
};

export const Checklist: React.FC<ChecklistProps> = ({ state, onToggleActivity }) => {
  const [showBonus, setShowBonus] = useState(false);
  const [activeTip, setActiveTip] = useState<string | null>(null);

  const coreActivities = ACTIVITIES.filter((a) => a.isCore);
  const bonusActivities = ACTIVITIES.filter((a) => !a.isCore);

  const completedCoreCount = coreActivities.filter((a) => Boolean(state.completedActivities[a.id])).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Round {state.currentRound} Checklist</span>
            {completedCoreCount === 4 && (
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All Core Done!
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400">
            Tap an action after completing it in Pokémon GO to record EP.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-300">
            {completedCoreCount} / {coreActivities.length}
          </span>
          <span className="text-[10px] text-slate-500 block">Core Tasks</span>
        </div>
      </div>

      {/* Core Activities List */}
      <div className="space-y-2.5">
        {coreActivities.map((activity) => {
          const isDone = Boolean(state.completedActivities[activity.id]);

          return (
            <div
              key={activity.id}
              className={`group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
              onClick={() => onToggleActivity(activity.id)}
            >
              {/* Checkbox */}
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors border ${
                  isDone
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                    : 'border-slate-700 bg-slate-900 group-hover:border-slate-500'
                }`}
              >
                {isDone && <CheckCircle2 className="w-4 h-4" />}
              </div>

              {/* Icon */}
              <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center flex-shrink-0 border border-slate-700/50">
                {ICON_MAP[activity.icon]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-sm font-semibold tracking-tight ${
                      isDone ? 'line-through text-slate-400' : 'text-slate-100'
                    }`}
                  >
                    {activity.title}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex-shrink-0">
                    +{activity.points} EP
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  {activity.id === 'feed' && state.currentRound > 1
                    ? 'Give 1 berry if hungry'
                    : activity.subtitle}
                </p>

                {/* Inline tip toggle */}
                {activity.tip && (
                  <div className="mt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTip(activeTip === activity.id ? null : activity.id);
                      }}
                      className="text-[11px] text-slate-500 hover:text-slate-300 inline-flex items-center gap-1 transition-colors"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>{activeTip === activity.id ? 'Hide tip' : 'Quick tip'}</span>
                    </button>
                    {activeTip === activity.id && (
                      <p className="text-[11px] text-emerald-400/90 bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/20 mt-1">
                        💡 {activity.tip}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bonus Activities Collapsible */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <button
          onClick={() => setShowBonus(!showBonus)}
          className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 font-semibold py-1 transition-colors cursor-pointer"
        >
          <span>Bonus Points (Rocket, Gym, Routes, Walking)</span>
          {showBonus ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showBonus && (
          <div className="space-y-2 mt-2 pt-1">
            {bonusActivities.map((activity) => {
              const isDone = Boolean(state.completedActivities[activity.id]);

              return (
                <div
                  key={activity.id}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700'
                  }`}
                  onClick={() => onToggleActivity(activity.id)}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>

                  <div className="w-7 h-7 rounded-md bg-slate-800/80 flex items-center justify-center flex-shrink-0">
                    {ICON_MAP[activity.icon]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                        {activity.title}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        +{activity.points} EP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{activity.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
