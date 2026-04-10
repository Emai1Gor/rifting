import { useState } from 'react';
import type { Match, Player } from '../../types';
import { AvatarDisplay } from '../player/AvatarPicker';

interface Props {
  matches: Match[];
  players: Player[];
  onConfirm: (matches: Match[]) => void;
  onCancel: () => void;
}

export default function PairingEditor({ matches, players, onConfirm, onCancel }: Props) {
  const [editableMatches, setEditableMatches] = useState<Match[]>(matches);
  const [selectedSlot, setSelectedSlot] = useState<{ matchIndex: number; slot: 'p1' | 'p2' } | null>(null);

  const getPlayer = (id: string | null) => id ? players.find(p => p.id === id) : null;

  const handleSlotClick = (matchIndex: number, slot: 'p1' | 'p2') => {
    // Can't swap bye slots
    if (slot === 'p2' && editableMatches[matchIndex].player2Id === null) return;

    if (!selectedSlot) {
      setSelectedSlot({ matchIndex, slot });
      return;
    }

    // Same slot clicked - deselect
    if (selectedSlot.matchIndex === matchIndex && selectedSlot.slot === slot) {
      setSelectedSlot(null);
      return;
    }

    // Swap the two players
    const newMatches = [...editableMatches].map(m => ({ ...m }));
    const getPlayerId = (mi: number, s: 'p1' | 'p2') =>
      s === 'p1' ? newMatches[mi].player1Id : newMatches[mi].player2Id;
    const setPlayerId = (mi: number, s: 'p1' | 'p2', id: string | null) => {
      if (s === 'p1') newMatches[mi].player1Id = id!;
      else newMatches[mi].player2Id = id;
    };

    const id1 = getPlayerId(selectedSlot.matchIndex, selectedSlot.slot);
    const id2 = getPlayerId(matchIndex, slot);
    setPlayerId(selectedSlot.matchIndex, selectedSlot.slot, id2);
    setPlayerId(matchIndex, slot, id1);

    setEditableMatches(newMatches);
    setSelectedSlot(null);
  };

  const isSelected = (matchIndex: number, slot: 'p1' | 'p2') =>
    selectedSlot?.matchIndex === matchIndex && selectedSlot?.slot === slot;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">Edit Pairings</h3>
          <p className="text-xs text-slate-400 mt-0.5">Click two players to swap them</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {editableMatches.map((match, mi) => {
          const p1 = getPlayer(match.player1Id);
          const p2 = getPlayer(match.player2Id);
          const isBye = match.player2Id === null;

          return (
            <div key={match.id} className="bg-dark-card border border-dark-border rounded-lg p-3 flex items-center gap-3">
              <span className="text-xs text-slate-500 w-6">#{mi + 1}</span>

              <button
                onClick={() => handleSlotClick(mi, 'p1')}
                className={`flex-1 flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  isSelected(mi, 'p1')
                    ? 'bg-accent/20 ring-2 ring-accent'
                    : 'hover:bg-white/5'
                }`}
              >
                {p1 && <AvatarDisplay avatarKey={p1.avatarKey} size="sm" />}
                <span className="text-white text-sm font-medium">{p1?.name}</span>
              </button>

              <span className="text-slate-500 text-xs font-bold">VS</span>

              {isBye ? (
                <div className="flex-1 flex items-center justify-center p-2">
                  <span className="text-yellow-400 text-sm font-medium">BYE</span>
                </div>
              ) : (
                <button
                  onClick={() => handleSlotClick(mi, 'p2')}
                  className={`flex-1 flex items-center gap-2 p-2 rounded-lg transition-colors justify-end ${
                    isSelected(mi, 'p2')
                      ? 'bg-accent/20 ring-2 ring-accent'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <span className="text-white text-sm font-medium">{p2?.name}</span>
                  {p2 && <AvatarDisplay avatarKey={p2.avatarKey} size="sm" />}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onConfirm(editableMatches)}
          className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Confirm Pairings
        </button>
        <button
          onClick={onCancel}
          className="bg-dark-surface hover:bg-dark-border text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
