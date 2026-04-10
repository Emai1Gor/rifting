import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import PageShell from '../components/layout/PageShell';
import PlayerCard from '../components/player/PlayerCard';
import { generateId, getDefaultRounds } from '../lib/utils';
import type { MatchFormat } from '../types';

export default function TournamentCreatePage() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [formatType, setFormatType] = useState<'BO1' | 'BO3' | 'custom'>('BO1');
  const [customBo, setCustomBo] = useState(5);
  const [timerMinutes, setTimerMinutes] = useState(50);
  const [roundsOverride, setRoundsOverride] = useState<number | ''>('');

  const togglePlayer = (id: string) => {
    setSelectedPlayerIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedPlayerIds(state.players.map(p => p.id));
  };

  const deselectAll = () => {
    setSelectedPlayerIds([]);
  };

  const format: MatchFormat = formatType === 'custom' ? `BO${customBo}` : formatType;
  const defaultRounds = getDefaultRounds(selectedPlayerIds.length);
  const totalRounds = typeof roundsOverride === 'number' && roundsOverride > 0
    ? roundsOverride
    : defaultRounds;

  const canCreate = name.trim() && selectedPlayerIds.length >= 2;

  const handleCreate = () => {
    if (!canCreate) return;
    const tournament = {
      id: generateId(),
      name: name.trim(),
      format,
      playerIds: selectedPlayerIds,
      rounds: [],
      currentRound: 0,
      totalRounds,
      timerMinutes,
      status: 'active' as const,
      createdAt: Date.now(),
    };
    dispatch({ type: 'CREATE_TOURNAMENT', tournament });
    navigate(`/tournaments/${tournament.id}`);
  };

  return (
    <PageShell title="New Tournament">
      <div className="max-w-2xl space-y-6">
        {/* Tournament Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Tournament Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Weekly Riftbound Swiss"
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        {/* Match Format */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Match Format
          </label>
          <div className="flex gap-2 flex-wrap">
            {(['BO1', 'BO3', 'custom'] as const).map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setFormatType(opt)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formatType === opt
                    ? 'bg-accent text-white'
                    : 'bg-dark-surface border border-dark-border text-slate-300 hover:bg-dark-card'
                }`}
              >
                {opt === 'custom' ? 'Custom' : opt}
              </button>
            ))}
            {formatType === 'custom' && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">Best of</span>
                <input
                  type="number"
                  min={1}
                  max={99}
                  step={2}
                  value={customBo}
                  onChange={e => {
                    let v = parseInt(e.target.value);
                    if (v % 2 === 0) v += 1; // force odd
                    setCustomBo(v);
                  }}
                  className="w-16 bg-dark-surface border border-dark-border rounded-lg px-2 py-2 text-white text-center text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            )}
          </div>
        </div>

        {/* Timer */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Round Timer (minutes)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={999}
              value={timerMinutes}
              onChange={e => setTimerMinutes(parseInt(e.target.value) || 0)}
              className="w-24 bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <span className="text-slate-500 text-sm">0 = no timer</span>
          </div>
        </div>

        {/* Rounds */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Number of Rounds
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={20}
              value={roundsOverride || ''}
              onChange={e => setRoundsOverride(e.target.value ? parseInt(e.target.value) : '')}
              placeholder={String(defaultRounds)}
              className="w-24 bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <span className="text-slate-500 text-sm">
              Default: {defaultRounds} (for {selectedPlayerIds.length} players)
            </span>
          </div>
        </div>

        {/* Player Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-300">
              Select Players ({selectedPlayerIds.length} selected)
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="text-xs text-accent-light hover:underline"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={deselectAll}
                className="text-xs text-slate-400 hover:underline"
              >
                Deselect All
              </button>
            </div>
          </div>

          {state.players.length === 0 ? (
            <div className="bg-dark-card border border-dark-border rounded-lg p-4 text-center text-slate-500 text-sm">
              No players available. Go to Players to add some first.
            </div>
          ) : (
            <div className="space-y-1">
              {state.players.map(player => {
                const isSelected = selectedPlayerIds.includes(player.id);
                return (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => togglePlayer(player.id)}
                    className={`w-full text-left rounded-lg p-3 transition-colors ${
                      isSelected
                        ? 'bg-accent/15 border border-accent/40'
                        : 'bg-dark-card border border-dark-border hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-accent bg-accent' : 'border-slate-500'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <PlayerCard player={player} compact />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Create Button */}
        <div className="pt-2">
          <button
            onClick={handleCreate}
            disabled={!canCreate}
            className="bg-accent hover:bg-accent/80 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors w-full"
          >
            Create Tournament ({selectedPlayerIds.length} players, {totalRounds} rounds, {format})
          </button>
          {!canCreate && name.trim() && selectedPlayerIds.length < 2 && (
            <p className="text-sm text-red-400 mt-2 text-center">
              Select at least 2 players
            </p>
          )}
        </div>
      </div>
    </PageShell>
  );
}
