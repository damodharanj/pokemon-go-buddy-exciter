// Web Notification API manager with fallback support
import { soundSynth } from './audio';

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  playAudio?: boolean;
}

export async function triggerNotification({
  title,
  body,
  icon = '/pokeball.svg',
  tag = 'buddy-exciter-alert',
  playAudio = true,
}: NotificationPayload): Promise<boolean> {
  if (playAudio) {
    soundSynth.playNotificationChime();
  }

  // Vibrate mobile device if supported
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([200, 100, 200]);
    } catch {
      // Ignore vibration error
    }
  }

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    // If ServiceWorker registration is available, show via SW (more reliable on mobile/background)
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && 'showNotification' in reg) {
        await reg.showNotification(title, {
          body,
          icon,
          tag,
          badge: '/pokeball.svg',
          requireInteraction: true,
        });
        return true;
      }
    }

    // Direct Notification fallback
    new Notification(title, {
      body,
      icon,
      tag,
      requireInteraction: true,
    });
    return true;
  } catch (err) {
    console.warn('Notification failed:', err);
    return false;
  }
}
