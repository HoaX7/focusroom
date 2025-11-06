/**
 * Audio notification system for timer events
 * Plays notification.mp3 for break start/end notifications
 */

let notificationAudio: HTMLAudioElement | null = null;

/**
 * Get the cached notification audio element
 * Lazily creates the audio element on first use
 */
function getNotificationAudio(): HTMLAudioElement {
  if (!notificationAudio) {
    notificationAudio = new Audio("/static/notification.mp3");
    notificationAudio.volume = 0.1; // Set reasonable default volume
  }
  return notificationAudio;
}

/**
 * Play notification sound from MP3 file
 * Used for break start/end notifications
 */
export function playNotificationSound(): void {
  try {
    const audio = getNotificationAudio();
    audio.currentTime = 0; // Reset to start for repeated plays
    audio.play().catch((error) => {
      console.warn("Failed to play notification sound:", error);
    });
  } catch (error) {
    console.warn("Failed to play notification sound:", error);
  }
}
