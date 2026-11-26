import { useState, useEffect, useCallback, useRef } from 'react';
import {
  BuddyActivityId,
  BuddySessionState,
  BuddySettings,
  ActivityLogEntry,
} from '../types/buddy';
import { ACTIVITIES, getMoodInfo } from '../utils/buddyConstants';
import { soundSynth } from '../utils/audio';
import {
  triggerNotification,
  requestNotificationPermission,
  getNotificationPermission,
} from '../utils/notifications';
import confetti from 'canvas-confetti';

const STORAGE_KEY_STATE = 'pokemon_go_buddy_exciter_state_v1';
const STORAGE_KEY_SETTINGS = 'pokemon_go_buddy_exciter_settings_v1';

const DEFAULT_SETTINGS: BuddySettings = {
  soundEnabled: true,
  browserNotificationsEnabled: true,
  cooldownMinutes: 30,
  maintenanceMinutes: 20,
  candyDistanceKm: 20,
};

const INITIAL_STATE: BuddySessionState = {
  isActive: false,
  buddyName: 'Lucario',
  pokemonSpecies: 'lucario',
  startedAt: null,
  lastInteractionAt: null,
  nextTimerEndsAt: null,
  totalEp: 0,
  currentRound: 1,
  completedActivities: {},
  history: [],
  isExcited: false,
  maintenanceMode: false,
};

export function useBuddyExciter() {
  const [settings, setSettings] = useState<BuddySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [state, setState] = useState<BuddySessionState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATE);
      return saved ? { ...INITIAL_STATE, ...JSON.parse(saved) } : INITIAL_STATE;
    } catch {
      return INITIAL_STATE;
    }
  });

  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() =>
    getNotificationPermission()
  );
  const notificationFiredRef = useRef<boolean>(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save state to localStorage:', e);
    }
  }, [state]);

  // Sync settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not save settings to localStorage:', e);
    }
  }, [settings]);

  // Check notification permission on mount
  useEffect(() => {
    setNotificationPermission(getNotificationPermission());
  }, []);

  // Request browser permission helper
  const requestPermission = useCallback(async () => {
    const perm = await requestNotificationPermission();
    setNotificationPermission(perm);
    return perm;
  }, []);

  // High precision wall-clock timer loop
  useEffect(() => {
    if (!state.isActive || !state.nextTimerEndsAt) {
      setSecondsRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((state.nextTimerEndsAt! - now) / 1000));
      setSecondsRemaining(diff);

      if (diff === 0 && !notificationFiredRef.current) {
        notificationFiredRef.current = true;

        const isMaintenance = state.maintenanceMode || state.isExcited;
        const title = isMaintenance
          ? `💖 Keep ${state.buddyName} Excited!`
          : `⚡ Time to interact with ${state.buddyName}!`;

        const body = isMaintenance
          ? `Your 20-min maintenance window is open. Pet or take a snapshot of ${state.buddyName} to prevent mood decay!`
          : `Cooldown has expired! Pet, feed, snapshot, and battle with ${state.buddyName} to boost Emotion Points!`;

        if (settings.browserNotificationsEnabled) {
          triggerNotification({
            title,
            body,
            playAudio: settings.soundEnabled,
          });
        } else if (settings.soundEnabled) {
          soundSynth.playNotificationChime();
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [state.isActive, state.nextTimerEndsAt, state.maintenanceMode, state.isExcited, state.buddyName, settings]);

  // Reset notification flag whenever a new timer starts
  useEffect(() => {
    notificationFiredRef.current = false;
  }, [state.nextTimerEndsAt]);

  // Start a new session / Turn on
  const startSession = useCallback(
    async (buddyName?: string, species?: string, candyKm?: number) => {
      if (settings.browserNotificationsEnabled && notificationPermission === 'default') {
        await requestPermission();
      }

      if (settings.soundEnabled) {
        soundSynth.playCheck();
      }

      const now = Date.now();
      const chosenName = buddyName || state.buddyName || 'Lucario';
      const chosenSpecies = species || state.pokemonSpecies || 'lucario';
      if (candyKm) {
        setSettings((prev) => ({ ...prev, candyDistanceKm: candyKm }));
      }

      setState({
        isActive: true,
        buddyName: chosenName,
        pokemonSpecies: chosenSpecies,
        startedAt: now,
        lastInteractionAt: now,
        nextTimerEndsAt: null, // First round is immediate!
        totalEp: 0,
        currentRound: 1,
        completedActivities: {},
        history: [
          {
            id: 'start-' + now,
            timestamp: now,
            title: `Started excitation session with ${chosenName}`,
            epChange: 0,
            round: 1,
          },
        ],
        isExcited: false,
        maintenanceMode: false,
      });
    },
    [settings, notificationPermission, requestPermission, state.buddyName, state.pokemonSpecies]
  );

  // Stop session
  const stopSession = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isActive: false,
      nextTimerEndsAt: null,
    }));
  }, []);

  // Reset session completely
  const resetSession = useCallback(() => {
    setState(INITIAL_STATE);
    setSecondsRemaining(0);
  }, []);

  // Fire celebratory confetti and sound when excited
  const triggerExcitedCelebration = useCallback(() => {
    if (settings.soundEnabled) {
      soundSynth.playExcitedFanfare();
    }
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#fcd34d'],
      });
    } catch {
      // Confetti error fallback
    }
  }, [settings.soundEnabled]);

  // Toggle activity checkbox
  const toggleActivity = useCallback(
    (activityId: BuddyActivityId) => {
      const activity = ACTIVITIES.find((a) => a.id === activityId);
      if (!activity) return;

      const now = Date.now();
      const isCurrentlyCompleted = Boolean(state.completedActivities[activityId]);

      if (settings.soundEnabled) {
        soundSynth.playCheck();
      }

      setState((prev) => {
        const nextCompleted = { ...prev.completedActivities };
        let newEp = prev.totalEp;
        let newHistory = [...prev.history];

        if (isCurrentlyCompleted) {
          delete nextCompleted[activityId];
          newEp = Math.max(0, newEp - activity.points);
          newHistory = newHistory.filter(
            (entry) => !(entry.round === prev.currentRound && entry.title === activity.title)
          );
        } else {
          nextCompleted[activityId] = now;
          newEp = Math.min(32, newEp + activity.points);
          const newEntry: ActivityLogEntry = {
            id: `act-${now}-${activityId}`,
            timestamp: now,
            title: activity.title,
            epChange: activity.points,
            round: prev.currentRound,
          };
          newHistory.unshift(newEntry);
        }

        const reachedExcited = newEp >= 32;
        if (reachedExcited && !prev.isExcited) {
          setTimeout(triggerExcitedCelebration, 50);
        }

        return {
          ...prev,
          completedActivities: nextCompleted,
          totalEp: newEp,
          lastInteractionAt: now,
          isExcited: reachedExcited,
          maintenanceMode: reachedExcited,
          history: newHistory,
        };
      });
    },
    [state.completedActivities, settings.soundEnabled, triggerExcitedCelebration]
  );

  // Complete round / Start cooldown timer
  const completeRoundAndStartTimer = useCallback(
    (customMinutes?: number) => {
      const now = Date.now();
      const isMaintenance = state.isExcited || state.maintenanceMode;
      const durationMinutes =
        customMinutes !== undefined
          ? customMinutes
          : isMaintenance
          ? settings.maintenanceMinutes
          : settings.cooldownMinutes;

      const timerDurationMs = durationMinutes * 60 * 1000;
      const nextEndsAt = now + timerDurationMs;

      if (settings.soundEnabled) {
        soundSynth.playCheck();
      }

      setState((prev) => ({
        ...prev,
        nextTimerEndsAt: nextEndsAt,
        currentRound: prev.currentRound + 1,
        // Reset checklist for new round
        completedActivities: {},
        history: [
          {
            id: `round-done-${now}`,
            timestamp: now,
            title: `Completed Round ${prev.currentRound} - Started ${durationMinutes}m ${
              isMaintenance ? 'Maintenance' : 'Cooldown'
            } timer`,
            epChange: 0,
            round: prev.currentRound,
          },
          ...prev.history,
        ],
      }));
    },
    [state.isExcited, state.maintenanceMode, settings.maintenanceMinutes, settings.cooldownMinutes, settings.soundEnabled]
  );

  // Skip timer (useful for quick testing or if user finished early)
  const skipTimer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      nextTimerEndsAt: null,
    }));
    setSecondsRemaining(0);
  }, []);

  // Add 5 minutes to timer
  const addFiveMinutes = useCallback(() => {
    setState((prev) => {
      if (!prev.nextTimerEndsAt) return prev;
      return {
        ...prev,
        nextTimerEndsAt: prev.nextTimerEndsAt + 5 * 60 * 1000,
      };
    });
  }, []);

  // Test notification button
  const sendTestNotification = useCallback(async () => {
    let perm = notificationPermission;
    if (perm !== 'granted') {
      perm = await requestPermission();
    }
    await triggerNotification({
      title: `⚡ Pokémon GO Buddy Alert: ${state.buddyName}`,
      body: 'Notifications are working! Your buddy is ready for interactions.',
      playAudio: settings.soundEnabled,
    });
  }, [notificationPermission, requestPermission, state.buddyName, settings.soundEnabled]);

  const moodInfo = getMoodInfo(state.totalEp);

  return {
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
  };
}
