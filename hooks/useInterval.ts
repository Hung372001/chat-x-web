import { useEffect, useRef } from 'react';

// TypeScript type for the callback function
type Callback = () => void;

const useInterval = (callback: Callback, interval: number) => {
  const savedCallback = useRef<Callback>();

  // Store the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };
    const intervalId = setInterval(tick, interval);

    return () => clearInterval(intervalId);
  }, [interval]);
};

export default useInterval;
