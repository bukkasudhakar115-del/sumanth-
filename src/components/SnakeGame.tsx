import React, { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIR = { x: 0, y: -1 }; // start by moving up
const SPEED = 130;

export function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState(INITIAL_DIR);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const dirRef = useRef(dir);
  const currentDirRef = useRef(dir);

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDir(INITIAL_DIR);
    dirRef.current = INITIAL_DIR;
    currentDirRef.current = INITIAL_DIR;
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
  }, [generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent window scrolling for game keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault(); 
      }

      if (e.key === ' ' || e.key === 'Enter') {
        if (isGameOver) {
           resetGame();
        } else {
           setIsPaused(p => !p);
        }
        return;
      }

      if (isPaused || isGameOver) return;

      const cDir = currentDirRef.current;
      let newDir = dirRef.current; 

      switch(e.key) {
        case 'ArrowUp':
        case 'w':
          if (cDir.y !== 1) newDir = { x: 0, y: -1 }; break;
        case 'ArrowDown':
        case 's':
          if (cDir.y !== -1) newDir = { x: 0, y: 1 }; break;
        case 'ArrowLeft':
        case 'a':
          if (cDir.x !== 1) newDir = { x: -1, y: 0 }; break;
        case 'ArrowRight':
        case 'd':
          if (cDir.x !== -1) newDir = { x: 1, y: 0 }; break;
      }

      dirRef.current = newDir;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, isGameOver, resetGame]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const interval = setInterval(() => {
      setSnake(prev => {
        const cDir = dirRef.current;
        currentDirRef.current = cDir; 

        const head = prev[0];
        const newHead = { x: head.x + cDir.x, y: head.y + cDir.y };

        // Collisions
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)
        ) {
          setIsGameOver(true);
          if (score > highScore) setHighScore(score);
          return prev;
        }

        const newSnake = [newHead, ...prev];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); 
        }

        return newSnake;
      });
    }, SPEED);

    return () => clearInterval(interval);
  }, [isPaused, isGameOver, food, generateFood, score, highScore]);

  return (
    <div className="flex flex-col items-center select-none pt-4">
      <div className="flex justify-between w-full max-w-[400px] mb-4 text-cyan-400 font-bold text-xl neon-text-cyan px-2">
         <div>SCORE: {score}</div>
         <div>HIGH: {highScore}</div>
      </div>

      <div className="relative border-4 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.6)] bg-zinc-950 rounded-lg overflow-hidden w-full max-w-[400px] aspect-square"
           style={{ maxWidth: 400, maxHeight: 400 }}>

         <div className="absolute inset-0 grid" style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
         }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
               const x = i % GRID_SIZE;
               const y = Math.floor(i / GRID_SIZE);
               const isSnake = snake.some(s => s.x === x && s.y === y);
               const isHead = snake[0].x === x && snake[0].y === y;
               const isFood = food.x === x && food.y === y;

               return (
                 <div key={i} className={`w-full h-full ${
                   isHead ? 'bg-green-300 shadow-[0_0_12px_#86efac] z-10 scale-110 rounded-sm' :
                   isSnake ? 'bg-green-500 shadow-[0_0_8px_#22c55e] z-10 rounded-sm scale-95' :
                   isFood ? 'bg-pink-500 shadow-[0_0_15px_#ec4899] z-10 animate-pulse rounded-full scale-[0.85]' :
                   'border-[0.5px] border-white/5'
                 }`} />
               );
            })}
         </div>

         {/* Overlays */}
         {(isPaused && !isGameOver && snake.length === INITIAL_SNAKE.length) && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm z-20">
              <h2 className="text-4xl font-bold mb-6 neon-text-green text-green-400 tracking-wider">SNAKE</h2>
              <button 
                onClick={() => setIsPaused(false)} 
                className="px-8 py-3 bg-zinc-900 border-2 border-green-500 text-green-400 rounded-lg hover:bg-green-500 hover:text-zinc-950 transition-all font-bold shadow-[0_0_15px_rgba(34,197,94,0.5)] md:text-lg">
                 START GAME
              </button>
              <p className="mt-6 text-sm text-zinc-400">Arrows / WASD to move</p>
            </div>
         )}

         {(isPaused && !isGameOver && snake.length > INITIAL_SNAKE.length) && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px] z-20">
              <h2 className="text-3xl font-bold text-cyan-400 neon-text-cyan animate-pulse tracking-[0.2em]">PAUSED</h2>
            </div>
         )}

         {isGameOver && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-[4px] z-20">
              <h2 className="text-4xl font-bold mb-2 text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] animate-pulse">GAME OVER</h2>
              <p className="mb-8 text-xl text-white">Final Score: <span className="text-cyan-400 neon-text-cyan">{score}</span></p>
              <button 
                onClick={resetGame} 
                className="px-8 py-3 bg-zinc-900 border-2 border-pink-500 text-pink-500 rounded-lg hover:bg-pink-500 hover:text-zinc-950 transition-all font-bold shadow-[0_0_15px_rgba(236,72,153,0.5)] md:text-lg">
                 PLAY AGAIN
              </button>
            </div>
         )}
      </div>
    </div>
  );
}
