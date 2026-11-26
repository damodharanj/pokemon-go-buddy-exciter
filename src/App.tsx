import { useState } from 'react';
import { Header } from './components/Header';
import { MoodHero } from './components/MoodHero';
import { TimerCard } from './components/TimerCard';
import { Checklist } from './components/Checklist';
import { ActivityHistory } from './components/ActivityHistory';
import { GuideModal } from './components/GuideModal';
import { SettingsModal } from './components/SettingsModal';
import { useBuddyExciter } from './hooks/useBuddyExciter';

export function App() {
  const {
    state,
    settings,
    setSettings,
    secondsRemaining,
    notificationPermission,
    moodInfo,
    startSession,
    stopSession,
    resetSession,
    toggleActivity,
    completeRoundAndStartTimer,
    skipTimer,
    addFiveMinutes,
    sendTestNotification,
    requestPermission,
  } = useBuddyExciter();

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Header
        state={state}
        settings={settings}
        notificationPermission={notificationPermission}
        onToggleSound={() =>
          setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        onRequestPermission={requestPermission}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-5 space-y-4 pb-12">
        {/* Mood & Status Hero */}
        <MoodHero
          state={state}
          settings={settings}
          moodInfo={moodInfo}
          onUpdateBuddy={(name, species, km) => {
            startSession(name, species, km);
          }}
        />

        {/* Timer & Session Control Card */}
        <TimerCard
          state={state}
          settings={settings}
          secondsRemaining={secondsRemaining}
          onStartSession={() => startSession()}
          onStopSession={stopSession}
          onResetSession={resetSession}
          onSkipTimer={skipTimer}
          onAddFiveMinutes={addFiveMinutes}
          onCompleteRound={() => completeRoundAndStartTimer()}
        />

        {/* Action Checklist (when session is active) */}
        {state.isActive && (
          <Checklist
            state={state}
            onToggleActivity={toggleActivity}
          />
        )}

        {/* Activity Log */}
        {state.isActive && (
          <ActivityHistory history={state.history} />
        )}

        {/* Quick Footer Info */}
        <footer className="text-center pt-4 text-xs text-slate-500">
          <p>
            Pokémon GO Buddy Exciter • 100% Free & No Poffin Required
          </p>
          <button
            onClick={() => setIsGuideOpen(true)}
            className="text-emerald-400 hover:underline mt-1 inline-block"
          >
            How does the 30-min loop work?
          </button>
        </footer>
      </main>

      {/* Modals */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onSendTestNotification={sendTestNotification}
        onResetSession={resetSession}
        notificationPermission={notificationPermission}
      />
    </div>
  );
}

export default App;
