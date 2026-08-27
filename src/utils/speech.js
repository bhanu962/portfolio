/**
 * Robust Welcome Audio Player
 * Plays the user's custom recording from /audio.mpeg on first visit.
 * Handles browser autoplay policy with automatic gesture unlock and session tracking.
 */

let welcomeAudio = null;
let isAudioPlaying = false;

function getAudioInstance() {
  if (typeof window === 'undefined') return null;
  if (!welcomeAudio) {
    welcomeAudio = new Audio('/audio.mpeg');
    welcomeAudio.preload = 'auto';
    welcomeAudio.volume = 1.0;
  }
  return welcomeAudio;
}

export function playWelcomeAudio(force = false) {
  if (typeof window === 'undefined') return;

  // If not forced, check if already played in this session
  if (!force) {
    try {
      const alreadyPlayed = sessionStorage.getItem('portfolio_audio_played');
      if (alreadyPlayed === 'true') {
        return; // Skip on reload/refresh
      }
    } catch {}
  }

  const audio = getAudioInstance();
  if (!audio) return;

  try {
    audio.currentTime = 0;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isAudioPlaying = true;
          try {
            sessionStorage.setItem('portfolio_audio_played', 'true');
          } catch {}
          // Cleanup any interaction listeners once successfully playing
          removeInteractionListeners();
        })
        .catch((err) => {
          // Autoplay policy prevented immediate playback; wait for first user gesture
          console.log('Autoplay waiting for user gesture to play welcome audio...', err);
          setupGestureUnlock(force);
        });
    }
  } catch (err) {
    console.warn('Welcome audio error:', err);
    setupGestureUnlock(force);
  }
}

// Gesture unlock listeners
let gestureListenersAttached = false;

function onUserGesture() {
  if (isAudioPlaying) {
    removeInteractionListeners();
    return;
  }

  const audio = getAudioInstance();
  if (audio) {
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isAudioPlaying = true;
          try {
            sessionStorage.setItem('portfolio_audio_played', 'true');
          } catch {}
          removeInteractionListeners();
        })
        .catch(() => {});
    }
  }
}

function setupGestureUnlock(force = false) {
  if (gestureListenersAttached || typeof window === 'undefined') return;

  // If already played and not forced, do not attach
  if (!force) {
    try {
      if (sessionStorage.getItem('portfolio_audio_played') === 'true') return;
    } catch {}
  }

  gestureListenersAttached = true;
  const events = ['click', 'pointerdown', 'keydown', 'touchstart'];
  events.forEach((evt) => {
    window.addEventListener(evt, onUserGesture, { passive: true });
  });
}

function removeInteractionListeners() {
  if (!gestureListenersAttached || typeof window === 'undefined') return;
  gestureListenersAttached = false;
  const events = ['click', 'pointerdown', 'keydown', 'touchstart'];
  events.forEach((evt) => {
    window.removeEventListener(evt, onUserGesture);
  });
}

// Auto-initialize preloading
if (typeof window !== 'undefined') {
  getAudioInstance();
}

// Backward compatibility alias
export const speakWelcome = (force = false) => playWelcomeAudio(force);
