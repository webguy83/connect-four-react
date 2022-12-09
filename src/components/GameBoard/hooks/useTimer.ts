import { useCallback, useRef, useState, useEffect } from 'react';

export function useTimer() {
  const [seconds, setSeconds] = useState(30);
  const timerRef = useRef<NodeJS.Timer | null>(null);

  const clearTimer = useCallback(() => {
    setSeconds(5);

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
    if (seconds <= 0 && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [seconds]);

  function loop() {
    setSeconds((prevSecs) => prevSecs - 1);
  }

  return {
    clearTimer,
    seconds,
  };
}
