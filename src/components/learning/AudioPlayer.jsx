import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function AudioPlayer({ src, title = "Listening audio" }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    audio.pause();
    audio.currentTime = 0;
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    const syncDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const syncTime = () => setCurrentTime(audio.currentTime || 0);
    const handleEnded = () => setPlaying(false);

    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch (error) {
        console.warn("MarzaLearn: audio playback could not start.", error);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  function seek(event) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const nextTime = Number(event.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function restart() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  }

  const progress = duration ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="rounded-[28px] border border-[#DCE5E0] bg-[#24332D] p-5 text-white shadow-[0_22px_55px_rgba(36,51,45,0.14)] sm:p-6">
      <audio ref={audioRef} src={src} preload="metadata" aria-label={title} />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#B8D5C8]">
            Listen to the text
          </p>
          <p className="mt-2 max-w-md text-base font-extrabold leading-snug tracking-[-0.025em] text-white sm:text-lg">
            {title}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPlaybackRate((rate) => (rate === 1 ? 0.85 : rate === 0.85 ? 1.15 : 1))}
          className="shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-extrabold text-white transition-colors hover:bg-white/15"
          aria-label={`Playback speed ${playbackRate} times. Change speed.`}
        >
          {playbackRate}×
        </button>
      </div>

      <div className="mt-7 flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={togglePlay}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#CFE8DD] text-[#24332D] shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-transform hover:scale-[1.04]"
          aria-label={playing ? "Pause audio" : "Play audio"}
        >
          {playing ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" className="ml-0.5" />}
        </button>

        <div className="min-w-0 flex-1">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={seek}
            className="ml-audio-range w-full"
            aria-label="Audio progress"
            style={{ "--ml-audio-progress": `${progress}%` }}
          />
          <div className="mt-1.5 flex justify-between text-[10px] font-bold tabular-nums text-white/55">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={restart}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white/65 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Restart audio"
        >
          <RotateCcw size={17} />
        </button>
        <button
          type="button"
          onClick={toggleMute}
          className="hidden h-10 w-10 shrink-0 place-items-center rounded-full text-white/65 transition-colors hover:bg-white/10 hover:text-white sm:grid"
          aria-label={muted ? "Unmute audio" : "Mute audio"}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </div>
  );
}
