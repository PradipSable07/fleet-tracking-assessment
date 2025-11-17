import { useEffect, useRef } from "react";
import { pushEventBatch } from "./eventsSlice";

export function useEventSimulation(events, dispatch, playback) {
  const simRef = useRef(null);

  const start = () => {
    if (simRef.current) return;

    let index = 0;

    simRef.current = setInterval(() => {
      if (!playback.isPlaying) return;

      const batch = events.slice(index, index + 300);
      index += 300;

      if (batch.length === 0) {
        stop();
        return;
      }

      dispatch(pushEventBatch(batch));
    }, 200);
  };

  const stop = () => {
    clearInterval(simRef.current);
    simRef.current = null;
  };

  const reset = () => {
    stop();
    index = 0;
  };

  useEffect(() => {
    return () => stop();
  }, []);

  return { start, stop, reset };
}
