import { describe, it, expect, beforeEach } from 'vitest';
import { getMoodInfo, ACTIVITIES } from '../utils/buddyConstants';
import { renderHook, act } from '@testing-library/react';
import { useBuddyExciter } from '../hooks/useBuddyExciter';

describe('Buddy Constants & Mood Logic', () => {
  it('correctly maps Emotion Points to mood stages', () => {
    expect(getMoodInfo(0).stage).toBe('normal');
    expect(getMoodInfo(1).stage).toBe('normal');
    expect(getMoodInfo(2).stage).toBe('happy');
    expect(getMoodInfo(3).stage).toBe('happy');
    expect(getMoodInfo(4).stage).toBe('smile');
    expect(getMoodInfo(10).stage).toBe('smile');
    expect(getMoodInfo(11).stage).toBe('fun');
    expect(getMoodInfo(19).stage).toBe('fun');
    expect(getMoodInfo(20).stage).toBe('grin');
    expect(getMoodInfo(31).stage).toBe('grin');
    expect(getMoodInfo(32).stage).toBe('excited');
    expect(getMoodInfo(40).stage).toBe('excited');
  });

  it('contains the 4 core activities that total 8 EP per round', () => {
    const core = ACTIVITIES.filter((a) => a.isCore);
    expect(core.length).toBe(4);
    const totalCorePoints = core.reduce((sum, a) => sum + a.points, 0);
    expect(totalCorePoints).toBe(8);
  });
});

describe('useBuddyExciter Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with inactive state', () => {
    const { result } = renderHook(() => useBuddyExciter());
    expect(result.current.state.isActive).toBe(false);
    expect(result.current.state.totalEp).toBe(0);
    expect(result.current.state.isExcited).toBe(false);
  });

  it('starts session and allows toggling activities to accumulate EP', async () => {
    const { result } = renderHook(() => useBuddyExciter());

    await act(async () => {
      await result.current.startSession('Mewtwo', 'mewtwo', 20);
    });

    expect(result.current.state.isActive).toBe(true);
    expect(result.current.state.buddyName).toBe('Mewtwo');
    expect(result.current.state.currentRound).toBe(1);

    // Toggle Feed
    act(() => {
      result.current.toggleActivity('feed');
    });
    expect(result.current.state.totalEp).toBe(2);

    // Toggle Play
    act(() => {
      result.current.toggleActivity('pet');
    });
    expect(result.current.state.totalEp).toBe(4);

    // Untoggle Play
    act(() => {
      result.current.toggleActivity('pet');
    });
    expect(result.current.state.totalEp).toBe(2);
  });

  it('switches to Excited and Maintenance mode when 32 EP is achieved', async () => {
    const { result } = renderHook(() => useBuddyExciter());

    await act(async () => {
      await result.current.startSession('Lucario', 'lucario', 5);
    });

    // Add all 4 core actions
    act(() => {
      result.current.toggleActivity('feed'); // +2 (2)
      result.current.toggleActivity('pet'); // +2 (4)
      result.current.toggleActivity('snapshot'); // +2 (6)
      result.current.toggleActivity('battle_leader'); // +2 (8)
      result.current.toggleActivity('walk_2km'); // +3 (11)
      result.current.toggleActivity('battle_rocket'); // +2 (13)
      result.current.toggleActivity('battle_gym_raid'); // +2 (15)
      result.current.toggleActivity('route'); // +2 (17)
    });

    expect(result.current.state.totalEp).toBe(17);

    // Complete round and start next
    act(() => {
      result.current.completeRoundAndStartTimer();
    });
    expect(result.current.state.currentRound).toBe(2);
    expect(result.current.state.nextTimerEndsAt).not.toBeNull();

    // Fast-forward / skip timer
    act(() => {
      result.current.skipTimer();
    });
    expect(result.current.state.nextTimerEndsAt).toBeNull();

    // Add more points in round 2 to push over 32
    act(() => {
      result.current.toggleActivity('feed'); // +2 (19)
      result.current.toggleActivity('pet'); // +2 (21)
      result.current.toggleActivity('snapshot'); // +2 (23)
      result.current.toggleActivity('battle_leader'); // +2 (25)
      result.current.toggleActivity('walk_2km'); // +3 (28)
      result.current.toggleActivity('battle_rocket'); // +2 (30)
      result.current.toggleActivity('battle_gym_raid'); // +2 (32)
    });

    expect(result.current.state.totalEp).toBe(32);
    expect(result.current.state.isExcited).toBe(true);
    expect(result.current.state.maintenanceMode).toBe(true);
  });

  it('resets session properly', async () => {
    const { result } = renderHook(() => useBuddyExciter());

    await act(async () => {
      await result.current.startSession('Pikachu');
    });
    expect(result.current.state.isActive).toBe(true);

    act(() => {
      result.current.resetSession();
    });
    expect(result.current.state.isActive).toBe(false);
    expect(result.current.state.totalEp).toBe(0);
  });
});
