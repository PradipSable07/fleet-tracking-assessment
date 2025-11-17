import { useEffect, useRef } from "react";
import { pushEventBatch } from "../features/eventsSlice";

export function useEventSimulation(events, dispatch, playback) {
  const simRef = useRef(null);
  const indexRef = useRef(0);

  const start = () => {
    if (simRef.current) return;    

    indexRef.current = 0;            

    simRef.current = setInterval(() => {
      if (!playback.isPlaying) return;

      const startIndex = indexRef.current;
      const batch = events.slice(startIndex, startIndex + 300);
      indexRef.current += 300;

      if (batch.length === 0) {
        stop();
        return;
      }

      dispatch(pushEventBatch(batch));
    }, 200);
  };

  const stop = () => {
    if (simRef.current) {
      clearInterval(simRef.current);
      simRef.current = null;
    }
  };

  const reset = () => {
    stop();
    indexRef.current = 0;    
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => stop();
  }, []);

  return { start, stop, reset };
}
