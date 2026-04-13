import { useState, useEffect, useRef } from 'react';
import type { MatchFormat } from '../types';
import { getWinsNeeded } from '../lib/utils';

interface GameResult {
  winner: 'p1' | 'p2' | 'draw';
  p1Score: number;
  p2Score: number;
}

type Phase = 'setup' | 'playing' | 'done';

function DiceRollCompact({ p1Name, p2Name }: { p1Name: string; p2Name: string }) {
  const [rolling, setRolling] = useState(false);
  const [winner, setWinner] = useState<'p1' | 'p2' | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleRoll = () => {
    if (rolling) return;
    setRolling(true);
    setWinner(null);

    const delay = 800 + Math.floor(Math.random() * 400);
    timeoutRef.current = setTimeout(() => {
      const result: 'p1' | 'p2' = Math.random() < 0.5 ? 'p1' : 'p2';
      setWinner(result);
      setRolling(false);
    }, delay);
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleRoll}
        disabled={rolling}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all shrink-0 ${
          rolling ? 'bg-accent/20 animate-pulse' : 'bg-dark-surface hover:bg-accent/20 text-slate-400 hover:text-accent-light'
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="3" />
          <circle cx="8" cy="8" r="1.5" fill="currentColor" />
          <circle cx="16" cy="8" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="8" cy="16" r="1.5" fill="currentColor" />
          <circle cx="16" cy="16" r="1.5" fill="currentColor" />
        </svg>
      </button>
      {winner && (
        <span className="text-accent text-xs font-medium animate-pulse">
          {winner === 'p1' ? p1Name : p2Name} first!
        </span>
      )}
    </div>
  );
}

export default function FriendlyMatchPage() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [p1Name, setP1Name] = useState('Player 1');
  const [p2Name, setP2Name] = useState('Player 2');
  const [format, setFormat] = useState<MatchFormat>('BO1');
  const [games, setGames] = useState<GameResult[]>([]);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);

  const winsNeeded = getWinsNeeded(format);
  const currentGame = games.length + 1;
  const p1Wins = games.filter(g => g.winner === 'p1').length;
  const p2Wins = games.filter(g => g.winner === 'p2').length;
  const draws = games.filter(g => g.winner === 'draw').length;
  const isBo1 = format === 'BO1';

  const handleStart = () => {
    setGames([]);
    setP1Score(0);
    setP2Score(0);
    setPhase('playing');
  };

  const handleConfirmGame = () => {
    const winner: 'p1' | 'p2' | 'draw' = p1Score > p2Score ? 'p1' : p2Score > p1Score ? 'p2' : 'draw';
    const newGames: GameResult[] = [...games, { winner, p1Score, p2Score }];
    setGames(newGames);
    setP1Score(0);
    setP2Score(0);

    const newP1Wins = newGames.filter(g => g.winner === 'p1').length;
    const newP2Wins = newGames.filter(g => g.winner === 'p2').length;

    if (newP1Wins >= winsNeeded || newP2Wins >= winsNeeded) {
      setPhase('done');
    }
  };

  const handleEndMatch = () => {
    setPhase('done');
  };

  const handleNewMatch = () => {
    setPhase('setup');
    setGames([]);
    setP1Score(0);
    setP2Score(0);
  };

  // --- Setup Phase ---
  if (phase === 'setup') {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-white text-center">Practice Match</h1>

          <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Player 1</label>
                <input
                  type="text"
                  value={p1Name}
                  onChange={e => setP1Name(e.target.value)}
                  placeholder="Player 1"
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Player 2</label>
                <input
                  type="text"
                  value={p2Name}
                  onChange={e => setP2Name(e.target.value)}
                  placeholder="Player 2"
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-2">Format</label>
              <div className="flex gap-2">
                {(['BO1', 'BO3', 'BO5'] as MatchFormat[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      format === f
                        ? 'bg-accent text-black'
                        : 'bg-dark-surface text-slate-300 hover:bg-dark-border'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-win hover:bg-win/80 text-black py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Start Match
            </button>
          </div>

          <a href="/" className="block text-center text-slate-500 hover:text-slate-300 text-sm transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // --- Playing Phase (Face-to-Face fullscreen) ---
  if (phase === 'playing') {
    return (
      <div className="fixed inset-0 bg-dark-bg flex flex-col z-50">
        {/* Player 2 (top half, rotated 180°) */}
        <div
          className="flex-1 flex flex-col items-center justify-center p-4 rotate-180 border-b-0"
          style={{ minHeight: 0 }}
        >
          <div className="text-sm text-slate-400 mb-1">{p2Name}</div>
          {!isBo1 && (
            <div className="text-xs text-slate-500 mb-1">Games won: {p2Wins}</div>
          )}
          <div
            className="text-8xl sm:text-9xl font-bold text-white tabular-nums cursor-pointer select-none active:scale-95 transition-transform"
            onClick={() => setP2Score(p2Score + 1)}
          >
            {p2Score}
          </div>
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => setP2Score(Math.max(0, p2Score - 1))}
              className="w-14 h-14 rounded-2xl bg-dark-surface text-slate-300 active:bg-loss/30 flex items-center justify-center text-3xl font-bold transition-colors"
            >
              -
            </button>
            <button
              onClick={() => setP2Score(p2Score + 1)}
              className="w-14 h-14 rounded-2xl bg-dark-surface text-slate-300 active:bg-win/30 flex items-center justify-center text-3xl font-bold transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Center bar */}
        <div className="shrink-0 bg-dark-surface border-y border-dark-border px-4 py-2 flex items-center justify-between gap-2">
          <DiceRollCompact p1Name={p1Name} p2Name={p2Name} />

          <div className="flex items-center gap-3 text-center">
            {!isBo1 && (
              <span className="text-xs text-slate-400">
                G{currentGame}/{format.replace('BO', '')}
              </span>
            )}
            <span className="text-slate-500 font-bold text-sm">VS</span>
            {!isBo1 && (
              <span className="text-xs text-slate-400 font-mono">
                {p1Wins}-{p2Wins}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {!isBo1 && (
              <button
                onClick={handleConfirmGame}
                disabled={p1Score === 0 && p2Score === 0}
                className="bg-accent hover:bg-accent/80 text-black px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-30"
              >
                Next
              </button>
            )}
            <button
              onClick={handleEndMatch}
              className="bg-dark-card hover:bg-dark-border text-slate-400 px-3 py-1.5 rounded-lg text-xs transition-colors"
            >
              End
            </button>
          </div>
        </div>

        {/* Player 1 (bottom half, normal orientation) */}
        <div
          className="flex-1 flex flex-col items-center justify-center p-4"
          style={{ minHeight: 0 }}
        >
          <div className="text-sm text-slate-400 mb-1">{p1Name}</div>
          {!isBo1 && (
            <div className="text-xs text-slate-500 mb-1">Games won: {p1Wins}</div>
          )}
          <div
            className="text-8xl sm:text-9xl font-bold text-white tabular-nums cursor-pointer select-none active:scale-95 transition-transform"
            onClick={() => setP1Score(p1Score + 1)}
          >
            {p1Score}
          </div>
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => setP1Score(Math.max(0, p1Score - 1))}
              className="w-14 h-14 rounded-2xl bg-dark-surface text-slate-300 active:bg-loss/30 flex items-center justify-center text-3xl font-bold transition-colors"
            >
              -
            </button>
            <button
              onClick={() => setP1Score(p1Score + 1)}
              className="w-14 h-14 rounded-2xl bg-dark-surface text-slate-300 active:bg-win/30 flex items-center justify-center text-3xl font-bold transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Done Phase ---
  const bo1Winner = p1Score > p2Score ? p1Name : p2Score > p1Score ? p2Name : null;
  const boxWinner = p1Wins > p2Wins ? p1Name : p2Wins > p1Wins ? p2Name : null;
  const matchWinner = isBo1 ? bo1Winner : boxWinner;

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-center space-y-4">
          <div className="text-xs text-slate-400 uppercase">Match Result</div>

          {matchWinner ? (
            <div>
              <div className="text-3xl font-bold text-win mb-1">{matchWinner} Wins!</div>
              <div className="text-slate-400">
                {isBo1
                  ? `${p1Score} - ${p2Score}`
                  : `${p1Wins} - ${p2Wins}${draws > 0 ? ` (${draws} draw${draws > 1 ? 's' : ''})` : ''}`
                }
              </div>
            </div>
          ) : (
            <div>
              <div className="text-3xl font-bold text-draw mb-1">Draw!</div>
              <div className="text-slate-400">
                {isBo1 ? `${p1Score} - ${p2Score}` : `${p1Wins} - ${p2Wins}`}
              </div>
            </div>
          )}

          {games.length > 0 && !isBo1 && (
            <div className="pt-4 border-t border-dark-border">
              <div className="space-y-1.5">
                {games.map((g, i) => (
                  <div key={i} className="flex justify-between text-sm items-center">
                    <span className="text-slate-400">Game {i + 1}</span>
                    <span className="text-slate-300 font-mono">{g.p1Score} - {g.p2Score}</span>
                    <span className={`text-xs font-medium ${
                      g.winner === 'p1' ? 'text-win' : g.winner === 'p2' ? 'text-loss' : 'text-draw'
                    }`}>
                      {g.winner === 'p1' ? p1Name : g.winner === 'p2' ? p2Name : 'Draw'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleNewMatch}
              className="flex-1 bg-accent hover:bg-accent/80 text-black py-3 rounded-lg font-semibold transition-colors"
            >
              New Match
            </button>
            <a
              href="/"
              className="flex-1 bg-dark-surface hover:bg-dark-border text-slate-300 py-3 rounded-lg font-semibold transition-colors text-center"
            >
              Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
