import { useState } from 'react';
import PageShell from '../components/layout/PageShell';

export default function FriendlyMatchPage() {
  const [p1Name, setP1Name] = useState('Player 1');
  const [p2Name, setP2Name] = useState('Player 2');
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [editingName, setEditingName] = useState<'p1' | 'p2' | null>(null);

  const handleReset = () => {
    setP1Score(0);
    setP2Score(0);
  };

  return (
    <PageShell title="Point Tracker">
      <div className="max-w-lg mx-auto">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <div className="flex items-stretch gap-4">
            {/* Player 1 */}
            <div className="flex-1 text-center">
              {editingName === 'p1' ? (
                <input
                  type="text"
                  value={p1Name}
                  onChange={e => setP1Name(e.target.value)}
                  onBlur={() => setEditingName(null)}
                  onKeyDown={e => e.key === 'Enter' && setEditingName(null)}
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-2 py-1 text-white text-center text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-accent"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setEditingName('p1')}
                  className="text-white font-semibold text-sm mb-4 hover:text-accent-light transition-colors"
                >
                  {p1Name}
                </button>
              )}

              <div
                className="text-7xl font-bold text-white mb-6 tabular-nums cursor-pointer select-none"
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

            {/* Divider */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-px h-full bg-dark-border"></div>
              <span className="text-slate-500 text-sm font-bold py-2">VS</span>
              <div className="w-px h-full bg-dark-border"></div>
            </div>

            {/* Player 2 */}
            <div className="flex-1 text-center">
              {editingName === 'p2' ? (
                <input
                  type="text"
                  value={p2Name}
                  onChange={e => setP2Name(e.target.value)}
                  onBlur={() => setEditingName(null)}
                  onKeyDown={e => e.key === 'Enter' && setEditingName(null)}
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-2 py-1 text-white text-center text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-accent"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setEditingName('p2')}
                  className="text-white font-semibold text-sm mb-4 hover:text-accent-light transition-colors"
                >
                  {p2Name}
                </button>
              )}

              <div
                className="text-7xl font-bold text-white mb-6 tabular-nums cursor-pointer select-none"
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

          {/* Reset */}
          <div className="mt-6 pt-4 border-t border-dark-border text-center">
            <button
              onClick={handleReset}
              className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
            >
              Reset Scores
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-500 text-center mt-3">
          Click player names to rename. Tap the score or use +/- buttons.
        </p>
      </div>
    </PageShell>
  );
}
