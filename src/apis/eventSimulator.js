// eventSimulator.js
// Simulates events over time using a simulation clock and batch processing.
// Usage:
//   startSimulation(events, storeDispatch, getStatePlayback, opts)
//   stopSimulation()

let _timer = null;

export function startSimulation(events, dispatch, getPlaybackState, opts = {}) {
  // events: sorted array by timestamp asc
  // dispatch: redux dispatch
  // getPlaybackState: function () => playbackState (current speed/isPlaying)
  // opts: { batchSize = 200, tickMs = 1000 }

  const batchSize = opts.batchSize ?? 200;
  const tickMs = opts.tickMs ?? 1000;

  if (!events || events.length === 0) return { stop: () => {} };

  // pointer index into events
  let ptr = 0;
  // simulation base time: start from first event timestamp
  let simTime = new Date(events[0].timestamp).getTime();
  // real time of last tick
  let lastReal = performance.now();

  _timer = setInterval(() => {
    const playback = getPlaybackState();
    if (!playback.isPlaying) {
      lastReal = performance.now();
      return;
    }
    const nowReal = performance.now();
    const realDeltaMs = nowReal - lastReal;
    lastReal = nowReal;

    // advance simTime by realDeltaMs * speed
    simTime += realDeltaMs * playback.speed;

    // collect batch of events with timestamp <= simTime
    const batch = [];
    let processed = 0;
    while (ptr < events.length && processed < batchSize) {
      const evTime = new Date(events[ptr].timestamp).getTime();
      if (evTime <= simTime) {
        batch.push(events[ptr]);
        ptr++;
        processed++;
      } else break;
    }

    if (batch.length > 0) {
      dispatch({ type: "events/pushEventBatch", payload: batch });
      dispatch({ type: "playback/setProcessedCount", payload: ptr });
    }
    dispatch({ type: "playback/setSimTime", payload: simTime });

    if (ptr >= events.length) {
      // stop simulation automatically
      clearInterval(_timer);
      _timer = null;
      dispatch({ type: "playback/setPlaying", payload: false });
    }
  }, tickMs);

  return {
    stop: () => {
      if (_timer) {
        clearInterval(_timer);
        _timer = null;
      }
    },
  };
}

export function stopSimulation() {
  if (_timer) {
    clearInterval(_timer);
    _timer = null;
  }
}
