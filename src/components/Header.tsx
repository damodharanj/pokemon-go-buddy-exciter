import React from 'react';
import { Volume2, VolumeX, Bell, BellOff, HelpCircle, Settings } from 'lucide-react';
import { BuddySessionState, BuddySettings } from '../types/buddy';

interface HeaderProps {
  state: BuddySessionState;
  settings: BuddySettings;
  notificationPermission: NotificationPermission;
  onToggleSound: () => void;
  onRequestPermission: () => void;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  settings,
  notificationPermission,
  onToggleSound,
  onRequestPermission,
  onOpenGuide,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 flex-shrink-0">
            <img src="/pokeball.svg" alt="Pokeball" className="w-full h-full drop-shadow" />
            {state.isActive && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900 animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white leading-none">
                Buddy Exciter
              </h1>
              {state.isExcited ? (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                  Excited ✨
                </span>
              ) : state.isActive ? (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  R{state.currentRound}
                </span>
              ) : (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  Off
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">Pokémon GO Mood Guide</p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-1.5">
          {/* Notification Permission button */}
          <button
            onClick={onRequestPermission}
            title={
              notificationPermission === 'granted'
                ? 'Notifications enabled'
                : 'Click to enable notifications'
            }
            className={`p-2 rounded-lg transition-colors text-xs flex items-center gap-1 ${
              notificationPermission === 'granted'
                ? 'text-emerald-400 hover:bg-slate-800'
                : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
            }`}
          >
            {notificationPermission === 'granted' ? (
              <Bell className="w-4 h-4" />
            ) : (
              <>
                <BellOff className="w-4 h-4" />
                <span className="text-[10px] font-semibold hidden sm:inline">Enable</span>
              </>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={settings.soundEnabled ? 'Mute sound' : 'Unmute sound'}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Guide Modal Trigger */}
          <button
            onClick={onOpenGuide}
            title="Read Guide & Mechanics"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
