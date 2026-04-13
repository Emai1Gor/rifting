import { useState, useEffect, useRef } from 'react';
import PageShell from '../components/layout/PageShell';
import type { MatchFormat } from '../types';
import { getWinsNeeded } from '../lib/utils';

interface GameResult {
  winner: 'p1' | 'p2' | 'draw';
  p1Score: number;
  p2Score: number;
}

type Phase = 'setup' | 'playing' | 'done';

function DiceRoll({ p1Name, p2Name }: { p1Name: string; p2Name: string }) {
  const [rolling, setRolling] = useState(false);
  const [highlight, setHighlight] = useState<'p1' | 'p2' | null>(null);
  const [winner, setWinner] = useState<'p1' | 'p2' | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleRoll = () => {
    if (rolling) return;
    setRolling(true);
    setWinner(null);

    let count = 0;
    const totalFlashes = 12 + Math.floor(Math.random() * 6); // 12-17 flashes
    let speed = 80;

    const flash = () => {
      setHighlight(prev => prev === 'p1' ? 'p2' : 'p1');
      count++;

      if (count >= totalFlashes) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        const result: 'p1' | 'p2' = Math.random() < 0.5 ? 'p1' : 'p2';
        setHighlight(result);
        setWinner(result);
        setRolling(false);
        return;
      }

      // Slow down near the end
      if (count > totalFlashes - 5) {
        speed += 60;
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(flash, speed);
      }
    };

    intervalRef.current = setInterval(flash, speed);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-4">
      <div className="flex items-center gap-3">
        {/* P1 */}
        <div className={`flex-1 py-3 rounded-lg text-center text-sm font-semibold transition-all duration-100 ${
          highlight === 'p1'
            ? winner === 'p1'
              ? 'bg-accent/30 text-accent-light border-2 border-accent shadow-[0_0_16px_rgba(99,102,241,0.5)]'
              : 'bg-accent/20 text-accent-light border border-accent/50'
            : 'bg-dark-surface text-slate-400 border border-transparent'
        }`}>
          {p1Name}
          {winner === 'p1' && <div className="text-xs mt-1 text-accent">Goes First!</div>}
        </div>

        {/* Dice Button */}
        <button
          onClick={handleRoll}
          disabled={rolling}
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all shrink-0 ${
            rolling
              ? 'bg-accent/20 animate-pulse cursor-wait'
              : 'bg-dark-surface hover:bg-accent/20 hover:text-accent-light cursor-pointer'
          }`}
          title="Roll for first turn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="3" />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            <circle cx="16" cy="8" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="8" cy="16" r="1.5" fill="currentColor" />
            <circle cx="16" cy="16" r="1.5" fill="currentColor" />
          </svg>
        </button>

        {/* P2 */}
        <div className={`flex-1 py-3 rounded-lg text-center text-sm font-semibold transition-all duration-100 ${
          highlight === 'p2'
            ? winner === 'p2'
              ? 'bg-accent/30 text-accent-light border-2 border-accent shadow-[0_0_16px_rgba(99,102,241,0.5)]'
              : 'bg-accent/20 text-accent-light border border-accent/50'
            : 'bg-dark-surface text-slate-400 border border-transparent'
        }`}>
          {p2Name}
          {winner === 'p2' && <div className="text-xs mt-1 text-accent">Goes First!</div>}
        </div>
      </div>
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
      <PageShell title="Practice Match">
        <div className="max-w-md mx-auto space-y-4">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-5">
            {/* Names */}
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

            {/* Format */}
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

            {/* Start */}
            <button
              onClick={handleStart}
              className="w-full bg-win hover:bg-win/80 text-black py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Start Match
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  // --- Playing Phase ---
  if (phase === 'playing') {
    const isBo1 = format === 'BO1';

    return (
      <PageShell title="Practice Match">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Dice Roll */}
          <DiceRoll p1Name={p1Name} p2Name={p2Name} />

          {/* Score Header */}
          {!isBo1 && (
            <div className="text-center">
              <div className="text-xs text-slate-400 uppercase mb-1">
                Game {currentGame} of {format.replace('BO', '')}
              </div>
              <div className="flex justify-center items-center gap-4 text-2xl font-bold">
                <span className={p1Wins > p2Wins ? 'text-win' : 'text-white'}>{p1Wins}</span>
                <span className="text-slate-500">-</span>
                <span className={p2Wins > p1Wins ? 'text-win' : 'text-white'}>{p2Wins}</span>
              </div>
              <div className="flex justify-center items-center gap-4 text-xs text-slate-400">
                <span>{p1Name}</span>
                <span></span>
                <span>{p2Name}</span>
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            {isBo1 ? (
              /* BO1: Simple point tracker */
              <>
                <div className="flex items-stretch gap-4">
                  <div className="flex-1 text-center">
                    <div className="text-sm text-slate-400 mb-2">{p1Name}</div>
                    <div
                      className="text-7xl font-bold text-white mb-4 tabular-nums cursor-pointer select-none"
                      onClick={() => setP1Score(p1Score + 1)}
                    >
                      {p1Score}
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setP1Score(Math.max(0, p1Score - 1))}
                        className="w-12 h-12 rounded-xl bg-dark-surface text-slate-300 hover:bg-loss/20 hover:text-loss flex items-center justify-center text-2xl font-bold transition-colors"
                      >
                        -
                      </button>
                      <button
                        onClick={() => setP1Score(p1Score + 1)}
                        className="w-12 h-12 rounded-xl bg-dark-surface text-slate-300 hover:bg-win/20 hover:text-win flex items-center justify-center text-2xl font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="w-px h-full bg-dark-border"></div>
                    <span className="text-slate-500 text-sm font-bold py-2">VS</span>
                    <div className="w-px h-full bg-dark-border"></div>
                  </div>

                  <div className="flex-1 text-center">
                    <div className="text-sm text-slate-400 mb-2">{p2Name}</div>
                    <div
                      className="text-7xl font-bold text-white mb-4 tabular-nums cursor-pointer select-none"
                      onClick={() => setP2Score(p2Score + 1)}
                    >
                      {p2Score}
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setP2Score(Math.max(0, p2Score - 1))}
                        className="w-12 h-12 rounded-xl bg-dark-surface text-slate-300 hover:bg-loss/20 hover:text-loss flex items-center justify-center text-2xl font-bold transition-colors"
                      >
                        -
                      </button>
                      <button
                        onClick={() => setP2Score(p2Score + 1)}
                        className="w-12 h-12 rounded-xl bg-dark-surface text-slate-300 hover:bg-win/20 hover:text-win flex items-center justify-center text-2xl font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-dark-border text-center">
                  <button
                    onClick={handleEndMatch}
                    className="bg-dark-surface hover:bg-dark-border text-slate-300 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    End Match
                  </button>
                </div>
              </>
            ) : (
              /* BO3/BO5: Score tracker per game */
              <>
                <div className="text-center text-xs text-slate-400 uppercase mb-4">
                  Game {currentGame} Score
                </div>
                <div className="flex items-stretch gap-4">
                  <div className="flex-1 text-center">
                    <div className="text-sm text-slate-400 mb-2">{p1Name}</div>
                    <div
                      className="text-7xl font-bold text-white mb-4 tabular-nums cursor-pointer select-none"
                      onClick={() => setP1Score(p1Score + 1)}
                    >
                      {p1Score}
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setP1Score(Math.max(0, p1Score - 1))}
                        className="w-12 h-12 rounded-xl bg-dark-surface text-slate-300 hover:bg-loss/20 hover:text-loss flex items-center justify-center text-2xl font-bold transition-colors"
                      >
                        -
                      </button>
                      <button
                        onClick={() => setP1Score(p1Score + 1)}
                        className="w-12 h-12 rounded-xl bg-dark-surface text-slate-300 hover:bg-win/20 hover:text-win flex items-center justify-center text-2xl font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="w-px h-full bg-dark-border"></div>
                    <span className="text-slate-500 text-sm font-bold py-2">VS</span>
                    <div className="w-px h-full bg-dark-border"></div>
                  </div>

                  <div className="flex-1 text-center">
                    <div className="text-sm text-slate-400 mb-2">{p2Name}</div>
                    <div
                      className="text-7xl font-bold text-white mb-4 tabular-nums cursor-pointer select-none"
                      onClick={() => setP2Score(p2Score + 1)}
                    >
                      {p2Score}
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setP2Score(Math.max(0, p2Score - 1))}
                        className="w-12 h-12 rounded-xl bg-dark-surface text-slate-300 hover:bg-loss/20 hover:text-loss flex items-center justify-center text-2xl font-bold transition-colors"
                      >
                        -
                      </button>
                      <button
                        onClick={() => setP2Score(p2Score + 1)}
                        className="w-12 h-12 rounded-xl bg-dark-surface text-slate-300 hover:bg-win/20 hover:text-win flex items-center justify-center text-2xl font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-dark-border flex flex-col items-center gap-3">
                  <button
                    onClick={handleConfirmGame}
                    disabled={p1Score === 0 && p2Score === 0}
                    className="bg-accent hover:bg-accent/80 text-black px-8 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Confirm Game {currentGame}
                  </button>
                  <button
                    onClick={handleEndMatch}
                    className="text-slate-500 hover:text-slate-300 text-xs transition-colors"
                  >
                    End Match Early
                  </button>
                </div>

                {/* Game History */}
                {games.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-dark-border">
                    <div className="text-xs text-slate-400 mb-2">Game History</div>
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
              </>
            )}
          </div>
        </div>
      </PageShell>
    );
  }

  // --- Done Phase ---
  // BO1 uses point scores, BOx uses game wins
  const isBo1 = format === 'BO1';
  const bo1Winner = p1Score > p2Score ? p1Name : p2Score > p1Score ? p2Name : null;
  const boxWinner = p1Wins > p2Wins ? p1Name : p2Wins > p1Wins ? p2Name : null;
  const matchWinner = isBo1 ? bo1Winner : boxWinner;

  return (
    <PageShell title="Practice Match">
      <div className="max-w-md mx-auto space-y-4">
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

          {/* Game-by-game history for BOx */}
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

          <button
            onClick={handleNewMatch}
            className="w-full bg-accent hover:bg-accent/80 text-black py-3 rounded-lg font-semibold transition-colors"
          >
            New Match
          </button>
        </div>
      </div>
    </PageShell>
  );
}
