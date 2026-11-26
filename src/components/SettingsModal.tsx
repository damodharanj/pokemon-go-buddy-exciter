import React from 'react';
import { X, Bell, Volume2, Clock, Trash2, CheckCircle2 } from 'lucide-react';
import { BuddySettings } from '../types/buddy';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BuddySettings;
  onUpdateSettings: (newSettings: BuddySettings) => void;
  onSendTestNotification: () => void;
  onResetSession: () => void;
  notificationPermission: NotificationPermission;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onSendTestNotification,
  onResetSession,
  notificationPermission,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-4">Settings & Preferences</h3>

        <div className="space-y-5 text-sm">
          {/* Notifications Setting */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="font-semibold text-slate-200">Browser Notifications</div>
                <div className="text-xs text-slate-400">
                  Status: <span className="font-semibold">{notificationPermission}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onSendTestNotification}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Test Alert
            </button>
          </div>

          {/* Sound Alerts */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-5 h-5 text-amber-400" />
              <div>
                <div className="font-semibold text-slate-200">Sound Chimes</div>
                <div className="text-xs text-slate-400">Play Pokémon audio alert on cooldown end</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) =>
                onUpdateSettings({ ...settings, soundEnabled: e.target.checked })
              }
              className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Cooldown Duration */}
          <div className="pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <span className="font-semibold text-slate-200">Cycle Cooldown</span>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-xs">
                {settings.cooldownMinutes} minutes
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="45"
              step="5"
              value={settings.cooldownMinutes}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  cooldownMinutes: parseInt(e.target.value, 10),
                })
              }
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>15 min</span>
              <span>30 min (Default)</span>
              <span>45 min</span>
            </div>
          </div>

          {/* Maintenance Duration */}
          <div className="pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" />
                <span className="font-semibold text-slate-200">Maintenance Reminder</span>
              </div>
              <span className="font-mono font-bold text-rose-400 text-xs">
                {settings.maintenanceMinutes} minutes
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="30"
              step="5"
              value={settings.maintenanceMinutes}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  maintenanceMinutes: parseInt(e.target.value, 10),
                })
              }
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>10 min</span>
              <span>20 min (Default)</span>
              <span>30 min</span>
            </div>
          </div>

          {/* Default Candy Distance */}
          <div className="pb-3 border-b border-slate-800">
            <div className="font-semibold text-slate-200 mb-2">Buddy Candy Distance</div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 3, 5, 20].map((km) => (
                <button
                  key={km}
                  onClick={() => onUpdateSettings({ ...settings, candyDistanceKm: km })}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    settings.candyDistanceKm === km
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {km} km
                </button>
              ))}
            </div>
          </div>

          {/* Reset Action */}
          <div>
            <button
              onClick={() => {
                if (window.confirm('Reset all session progress and start fresh?')) {
                  onResetSession();
                  onClose();
                }
              }}
              className="w-full py-2.5 bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset Session & Clear Storage</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
