import { useCallback, useRef, useState, useEffect } from 'react';

export function useTimer() {
  const [timerSeconds, setTimerSeconds] = useState(30);
  const timerRef = useRef<NodeJS.Timer | null>(null);
  const timerPausedRef = useRef<boolean>(false);

  const clearTimer = useCallback(() => {
    setTimerSeconds(5);
    timerPausedRef.current = false;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    const id = setInterval(() => {
      loop();
    }, 1000);
    timerRef.current = id;
  }, []);

  useEffect(() => {
    clearTimer();
  }, [clearTimer]);

  useEffect(() => {
    if (timerSeconds <= 0 && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [timerSeconds]);

  function pauseResumeTimer() {
    if (timerPausedRef.current) {
      // currently paused and want to resume
      timerPausedRef.current = false;
      const id = setInterval(() => {
        loop();
      }, 1000);
      timerRef.current = id;
    } else {
      // currently playing and wanting to pause
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        timerPausedRef.current = true;
      }
    }
  }

  function loop() {
    setTimerSeconds((prevSecs) => prevSecs - 1);
  }

  return {
    clearTimer,
    timerSeconds,
    pauseResumeTimer,
  };
}
