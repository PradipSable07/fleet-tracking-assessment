import { useDispatch, useSelector } from "react-redux";
import { setPlaying, setSpeed } from "../features/playbackSlice";

export function usePlaybackControls() {
  const dispatch = useDispatch();
  const playback = useSelector(s => s.playback);

  const play = () => dispatch(setPlaying(true));
  const pause = () => dispatch(setPlaying(false));
  const changeSpeed = (s) => dispatch(setSpeed(s));

  return { playback, play, pause, changeSpeed };
}
