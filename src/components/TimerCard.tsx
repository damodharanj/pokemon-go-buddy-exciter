import React from 'react';
import { Play, Square, SkipForward, Plus, RotateCcw, Clock, AlertCircle } from 'lucide-react';
import { BuddySessionState, BuddySettings } from '../types/buddy';

interface TimerCardProps {
  state: BuddySessionState;
  settings: BuddySettings;
  secondsRemaining: number;
  onStartSession: () => void;
  onStopSession: () => void;
  onResetSession: () => void;
  onSkipTimer: () => void;
  onAddFiveMinutes: () => void;
  onCompleteRound: () => void;
}

export const TimerCard: React.FC<TimerCardProps> = ({
  state,
  settings,
  secondsRemaining,
  onStartSession,
  onStopSession,
  onResetSession,
  onSkipTimer,
  onAddFiveMinutes,
  onCompleteRound,
}) => {
  // Format seconds to MM:SS
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isTimerRunning = state.isActive && state.nextTimerEndsAt && secondsRemaining > 0;
  const isReadyForInteractions = state.isActive && (!state.nextTimerEndsAt || secondsRemaining === 0);
  const isMaintenance = state.isExcited || state.maintenanceMode;

  const totalCycleSeconds = (isMaintenance ? settings.maintenanceMinutes : settings.cooldownMinutes) * 60;
  const timerPercent = totalCycleSeconds > 0
    ? Math.max(0, Math.min(100, Math.round(((totalCycleSeconds - secondsRemaining) / totalCycleSeconds) * 100)))
    : 100;

  // Not yet turned on
  if (!state.isActive) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-lg">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Play className="w-7 h-7 translate-x-0.5" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Ready to Excite Your Buddy?</h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto mb-5">
          Turn on the tracker to start Round 1. We will notify you every 30 minutes when cooldowns reset so you reach Excited status in ~90 minutes without a Poffin.
        </p>

        <button
          onClick={onStartSession}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-950/60 transition-all transform active:scale-95 flex items-center justify-center gap-2 mx-auto cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Turn On & Start Session</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border transition-all p-5 shadow-lg ${
      isReadyForInteractions
        ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/50'
        : 'bg-slate-900 border-slate-800'
    }`}>
      {/* Top Banner Status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${isReadyForInteractions ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className="text-xs uppercase font-bold tracking-wider text-slate-300">
            {isMaintenance ? 'Maintenance Timer' : `Round ${state.currentRound} Cooldown`}
          </span>
        </div>
        {isMaintenance && (
          <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
            Prevent Decay Mode
          </span>
        )}
      </div>

      {/* Main Countdown Display */}
      {isTimerRunning ? (
        <div className="text-center py-2">
          <div className="font-mono text-5xl font-extrabold tracking-tight text-white mb-1 tabular-nums">
            {timeFormatted}
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Cooldown active. Next interaction window opens at {new Date(state.nextTimerEndsAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
          </p>

          {/* Progress Bar of current cooldown */}
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mb-4">
            <div
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${timerPercent}%` }}
            />
          </div>

          {/* Controls while timer runs */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={onSkipTimer}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Fast-forward timer (e.g. if cooldown already elapsed)"
            >
              <SkipForward className="w-3.5 h-3.5 text-slate-400" />
              <span>Ready Now</span>
            </button>
            <button
              onClick={onAddFiveMinutes}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              title="Add 5 more minutes"
            >
              <Plus className="w-3.5 h-3.5 text-slate-400" />
              <span>+5 min</span>
            </button>
            <button
              onClick={onStopSession}
              className="px-3 py-1.5 bg-slate-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 text-xs font-semibold rounded-lg border border-slate-700/80 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          </div>
        </div>
      ) : (
        /* Interaction window is ready */
        <div className="text-center py-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold mb-2 animate-pulse">
            <AlertCircle className="w-4 h-4" />
            <span>Interaction Window Open!</span>
          </div>
          <h4 className="text-xl font-bold text-white mb-1">
            {isMaintenance ? 'Time for Quick Top-Up!' : `Time to Interact (Round ${state.currentRound})`}
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            {isMaintenance
              ? `Pet or take a photo of ${state.buddyName} in Pokémon GO to keep mood points at 32+.`
              : `Feed, pet, snapshot, and battle Team Leader in Pokémon GO, then click below to start the next cooldown timer.`}
          </p>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={onCompleteRound}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-950/60 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>
                {isMaintenance
                  ? `Logged Interaction (Start ${settings.maintenanceMinutes}m Timer)`
                  : `Start ${settings.cooldownMinutes}m Cooldown Timer`}
              </span>
            </button>

            <button
              onClick={onResetSession}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-xl transition-colors cursor-pointer"
              title="Reset session"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
