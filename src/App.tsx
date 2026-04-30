import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-zinc-950 relative overflow-hidden font-mono">
      {/* Background Ambient Cyber Grid */}
      <div className="absolute inset-x-0 bottom-0 top-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08)_0%,transparent_60%)] pointer-events-none z-0"></div>

      <header className="text-center z-10 mb-6 lg:mb-12 mt-4 lg:mt-0">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-pink-500 drop-shadow-[0_0_20px_rgba(74,222,128,0.4)] tracking-tighter uppercase italic py-2">
          Neon <span className="text-white">Serenade</span> Snake
        </h1>
        <p className="text-zinc-400 mt-2 text-sm md:text-base">Use Arrow Keys or WASD to control the snake. Press SPACE to Play/Pause.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 z-10 w-full max-w-6xl items-center justify-center">
         {/* Game Section */}
         <div className="flex flex-col items-center relative group">
            <div className="absolute inset-0 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none z-0 transition-opacity duration-700 opacity-50 group-hover:opacity-100"></div>
            <SnakeGame />
         </div>

         {/* Extrass Section (Music Player) */}
         <div className="flex flex-col items-center justify-center w-full max-w-[400px]">
            <MusicPlayer />
         </div>
      </div>
    </div>
  );
}
