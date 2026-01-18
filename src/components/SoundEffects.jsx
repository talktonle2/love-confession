import { useState, useEffect, useRef } from 'react';

export default function SoundEffects() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isHapticEnabled, setIsHapticEnabled] = useState(true);
  const audioContext = useRef(null);

  useEffect(() => {
    // Initialize Web Audio API
    try {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.log('Web Audio API not supported:', error);
    }
  }, []);

  const playSound = (type) => {
    if (!isSoundEnabled || !audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    switch (type) {
      case 'click':
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
        break;
      case 'success':
        oscillator.frequency.value = 1200;
        gainNode.gain.value = 0.15;
        break;
      case 'error':
        oscillator.frequency.value = 300;
        gainNode.gain.value = 0.1;
        break;
      case 'notification':
        oscillator.frequency.value = 1000;
        gainNode.gain.value = 0.08;
        break;
      case 'hover':
        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.03;
        break;
      case 'swipe':
        oscillator.frequency.value = 400;
        gainNode.gain.value = 0.05;
        break;
    }

    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + 0.1);

    return () => {
      oscillator.stop();
      gainNode.disconnect();
    };
  };

  const triggerHaptic = (intensity = 'medium') => {
    if (!isHapticEnabled) return;

    // Check if haptic feedback is available
    if ('vibrate' in navigator) {
      switch (intensity) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(25);
          break;
        case 'strong':
          navigator.vibrate(50);
          break;
        case 'success':
          navigator.vibrate([10, 50, 100]);
          break;
        case 'error':
          navigator.vibrate([100, 50, 10]);
          break;
        case 'double':
          navigator.vibrate([10, 10]);
          break;
        case 'long':
          navigator.vibrate(200);
          break;
      }
    }

    // For iOS devices, try using Taptic Engine API if available
    if ('TapticEngine' in window && window.TapticEngine) {
      try {
        switch (intensity) {
          case 'light':
            window.TapticEngine.impact({ style: 'light' });
            break;
          case 'medium':
            window.TapticEngine.impact({ style: 'medium' });
            break;
          case 'strong':
            window.TapticEngine.impact({ style: 'heavy' });
            break;
          case 'success':
            window.TapticEngine.notification({ style: 'success' });
            break;
          case 'error':
            window.TapticEngine.notification({ style: 'error' });
            break;
        }
      } catch (error) {
        console.log('Taptic Engine error:', error);
      }
    }
  };

  const playClickSound = () => {
    playSound('click')();
    triggerHaptic('light');
  };

  const playSuccessSound = () => {
    playSound('success')();
    triggerHaptic('success');
  };

  const playErrorSound = () => {
    playSound('error')();
    triggerHaptic('error');
  };

  const playNotificationSound = () => {
    playSound('notification')();
    triggerHaptic('medium');
  };

  const playHoverSound = () => {
    playSound('hover')();
    triggerHaptic('light');
  };

  const playSwipeSound = () => {
    playSound('swipe')();
    triggerHaptic('light');
  };

  return {
    isSoundEnabled,
    setIsSoundEnabled,
    isHapticEnabled,
    setIsHapticEnabled,
    playClickSound,
    playSuccessSound,
    playErrorSound,
    playNotificationSound,
    playHoverSound,
    playSwipeSound,
    triggerHaptic,
  };
}
