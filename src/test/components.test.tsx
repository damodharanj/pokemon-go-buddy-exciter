import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MoodHero } from '../components/MoodHero';
import { TimerCard } from '../components/TimerCard';
import { Checklist } from '../components/Checklist';
import { getMoodInfo } from '../utils/buddyConstants';
import { BuddySessionState, BuddySettings } from '../types/buddy';

const mockSettings: BuddySettings = {
  soundEnabled: true,
  browserNotificationsEnabled: true,
  cooldownMinutes: 30,
  maintenanceMinutes: 20,
  candyDistanceKm: 20,
};

const mockInitialState: BuddySessionState = {
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

describe('MoodHero Component', () => {
  it('displays buddy name and emotion points', () => {
    const moodInfo = getMoodInfo(16);
    render(
      <MoodHero
        state={{ ...mockInitialState, totalEp: 16 }}
        settings={mockSettings}
        moodInfo={moodInfo}
        onUpdateBuddy={vi.fn()}
      />
    );

    expect(screen.getByText('Lucario')).toBeInTheDocument();
    expect(screen.getByText('16')).toBeInTheDocument();
    expect(screen.getByText('/ 32 EP')).toBeInTheDocument();
  });

  it('displays halved candy distance', () => {
    const moodInfo = getMoodInfo(32);
    render(
      <MoodHero
        state={{ ...mockInitialState, totalEp: 32, isExcited: true }}
        settings={mockSettings}
        moodInfo={moodInfo}
        onUpdateBuddy={vi.fn()}
      />
    );

    // 20 km halved is 10 km
    expect(screen.getByText(/10 km/)).toBeInTheDocument();
    expect(screen.getByText(/2× Double Hearts Active/)).toBeInTheDocument();
  });
});

describe('TimerCard Component', () => {
  it('renders start button when session is inactive', () => {
    const onStart = vi.fn();
    render(
      <TimerCard
        state={mockInitialState}
        settings={mockSettings}
        secondsRemaining={0}
        onStartSession={onStart}
        onStopSession={vi.fn()}
        onResetSession={vi.fn()}
        onSkipTimer={vi.fn()}
        onAddFiveMinutes={vi.fn()}
        onCompleteRound={vi.fn()}
      />
    );

    const startBtn = screen.getByText(/Turn On & Start Session/i);
    expect(startBtn).toBeInTheDocument();
    fireEvent.click(startBtn);
    expect(onStart).toHaveBeenCalled();
  });

  it('renders countdown when cooldown timer is active', () => {
    const state: BuddySessionState = {
      ...mockInitialState,
      isActive: true,
      nextTimerEndsAt: Date.now() + 1800000,
    };
    render(
      <TimerCard
        state={state}
        settings={mockSettings}
        secondsRemaining={1800}
        onStartSession={vi.fn()}
        onStopSession={vi.fn()}
        onResetSession={vi.fn()}
        onSkipTimer={vi.fn()}
        onAddFiveMinutes={vi.fn()}
        onCompleteRound={vi.fn()}
      />
    );

    expect(screen.getByText('30:00')).toBeInTheDocument();
    expect(screen.getByText(/Ready Now/i)).toBeInTheDocument();
  });
});

describe('Checklist Component', () => {
  it('renders core 4 activities', () => {
    const onToggle = vi.fn();
    render(
      <Checklist
        state={{ ...mockInitialState, isActive: true }}
        onToggleActivity={onToggle}
      />
    );

    expect(screen.getByText('Feed Buddy')).toBeInTheDocument();
    expect(screen.getByText('Play / Pet Buddy')).toBeInTheDocument();
    expect(screen.getByText('Take Snapshot')).toBeInTheDocument();
    expect(screen.getByText('Battle Team Leader')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Feed Buddy'));
    expect(onToggle).toHaveBeenCalledWith('feed');
  });
});
