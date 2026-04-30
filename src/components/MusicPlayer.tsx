import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'AI Neon Drive', artist: 'Neural Net Synthesizer', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Cybernetic Dreams', artist: 'Algorithm Alpha', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Bitcrushed Future', artist: 'The Generators', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
];

export function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Autoplay likely prevented:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleSkipForward = () => {
     setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
  };

  const handleSkipBack = () => {
     setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
       const duration = audioRef.current.duration;
       if (duration > 0) {
         const p = (audioRef.current.currentTime / duration) * 100;
         setProgress(p);
       }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const val = parseFloat(e.target.value);
     setVolume(val);
     if (val > 0) {
       setIsMuted(false);
     }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && audioRef.current.duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full max-w-sm bg-zinc-900/80 backdrop-blur-md border border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.2)] rounded-2xl p-6 flex flex-col gap-5 relative overflow-hidden z-10 group">
      {/* Decorative gradient orb */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-600/30 blur-[40px] rounded-full pointer-events-none group-hover:bg-purple-500/40 transition-colors duration-1000"></div>

      <audio
        ref={audioRef}
        src={TRACKS[currentTrack].url}
        onEnded={handleSkipForward}
        onTimeUpdate={handleTimeUpdate}
        preload="metadata"
      />

      <div className="flex flex-col items-center text-center gap-1.5 pt-2">
         <h3 className="text-xs uppercase tracking-[0.2em] text-purple-400 font-bold mb-1 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
            Now Playing
         </h3>
         <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] truncate w-full px-2">
            {TRACKS[currentTrack].title}
         </h2>
         <p className="text-zinc-400 text-sm">{TRACKS[currentTrack].artist}</p>
      </div>

      {/* Progress bar */}
      <div 
        className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mt-2 relative cursor-pointer"
        onClick={handleProgressClick}
      >
         <div
           className="h-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)] transition-all duration-100 ease-linear"
           style={{ width: `${progress}%` }}
         />
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between w-full mt-1">
         <button onClick={handleSkipBack} className="p-2 text-zinc-400 hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">
            <SkipBack fill="currentColor" size={24} />
         </button>

         <button
           onClick={() => setIsPlaying(!isPlaying)}
           className="p-4 bg-purple-600 rounded-full text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:bg-purple-400 hover:shadow-[0_0_25px_rgba(192,132,252,0.8)] transition-all transform hover:scale-105 active:scale-95"
         >
            {isPlaying ? <Pause fill="currentColor" size={28} /> : <Play fill="currentColor" size={28} className="translate-x-[2px]" />}
         </button>

         <button onClick={handleSkipForward} className="p-2 text-zinc-400 hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all">
            <SkipForward fill="currentColor" size={24} />
         </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3 mt-1 text-zinc-400">
         <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white transition-colors">
           {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
         </button>
         <input
           type="range"
           min="0"
           max="1"
           step="0.01"
           value={isMuted ? 0 : volume}
           onChange={handleVolumeChange}
           className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500 outline-none"
         />
      </div>
    </div>
  )
}
