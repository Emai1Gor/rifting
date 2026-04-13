import type { Match, Player, MatchFormat } from '../../types';
import { AvatarDisplay } from '../player/AvatarPicker';
import { getWinsNeeded } from '../../lib/utils';

interface Props {
  match: Match;
  players: Player[];
  format: MatchFormat;
  onUpdate: (matchId: string, p1Wins: number, p2Wins: number, draws: number) => void;
}

export default function MatchResultInput({ match, players, format, onUpdate }: Props) {
  const p1 = players.find(p => p.id === match.player1Id);
  const p2 = match.player2Id ? players.find(p => p.id === match.player2Id) : null;
  const winsNeeded = getWinsNeeded(format);
  const boNum = parseInt(format.replace('BO', ''));

  // Bye match - auto complete, show as info only
  if (!p2) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {p1 && <AvatarDisplay avatarKey={p1.avatarKey} size="sm" />}
            <span className="text-white font-medium">{p1?.name}</span>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
            BYE
          </span>
        </div>
      </div>
    );
  }

  const isBo1 = boNum === 1;

  const handleBo1 = (result: 'p1' | 'p2' | 'draw') => {
    if (result === 'p1') onUpdate(match.id, 1, 0, 0);
    else if (result === 'p2') onUpdate(match.id, 0, 1, 0);
    else onUpdate(match.id, 0, 0, 1);
  };

  const handleScoreChange = (player: 'p1' | 'p2', delta: number) => {
    let p1w = match.player1Wins;
    let p2w = match.player2Wins;

    if (player === 'p1') p1w = Math.max(0, Math.min(winsNeeded, p1w + delta));
    else p2w = Math.max(0, Math.min(winsNeeded, p2w + delta));

    onUpdate(match.id, p1w, p2w, match.draws);
  };

  const isComplete = match.status === 'complete';

  return (
    <div className={`bg-dark-card border rounded-lg p-4 ${
      isComplete ? 'border-win/30' : 'border-dark-border'
    }`}>
      <div className="flex items-center gap-4">
        {/* Player 1 */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {p1 && <AvatarDisplay avatarKey={p1.avatarKey} size="sm" />}
            <span className={`font-medium ${
              isComplete && match.player1Wins > match.player2Wins ? 'text-win' :
              isComplete && match.player1Wins < match.player2Wins ? 'text-loss' :
              'text-white'
            }`}>
              {p1?.name}
            </span>
          </div>
        </div>

        {/* Score */}
        {isBo1 ? (
          <div className="flex gap-1">
            {(['p1', 'draw', 'p2'] as const).map(result => {
              const label = result === 'p1' ? p1?.name?.charAt(0) ?? '1' :
                           result === 'p2' ? p2?.name?.charAt(0) ?? '2' : 'D';
              const isSelected =
                (result === 'p1' && match.player1Wins > match.player2Wins && isComplete) ||
                (result === 'p2' && match.player2Wins > match.player1Wins && isComplete) ||
                (result === 'draw' && match.draws > 0 && isComplete);
              return (
                <button
                  key={result}
                  onClick={() => handleBo1(result)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    isSelected
                      ? result === 'draw' ? 'bg-draw text-black' : 'bg-win text-black'
                      : 'bg-dark-surface text-slate-400 hover:bg-dark-border'
                  }`}
                >
                  {result === 'draw' ? 'Draw' : `${label} Win`}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleScoreChange('p1', -1)}
                className="w-7 h-7 rounded bg-dark-surface text-slate-400 hover:bg-dark-border flex items-center justify-center text-sm"
              >-</button>
              <span className="w-8 text-center text-white font-bold text-lg">{match.player1Wins}</span>
              <button
                onClick={() => handleScoreChange('p1', 1)}
                className="w-7 h-7 rounded bg-dark-surface text-slate-400 hover:bg-dark-border flex items-center justify-center text-sm"
              >+</button>
            </div>
            <span className="text-slate-500">-</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleScoreChange('p2', -1)}
                className="w-7 h-7 rounded bg-dark-surface text-slate-400 hover:bg-dark-border flex items-center justify-center text-sm"
              >-</button>
              <span className="w-8 text-center text-white font-bold text-lg">{match.player2Wins}</span>
              <button
                onClick={() => handleScoreChange('p2', 1)}
                className="w-7 h-7 rounded bg-dark-surface text-slate-400 hover:bg-dark-border flex items-center justify-center text-sm"
              >+</button>
            </div>
          </div>
        )}

        {/* Player 2 */}
        <div className="flex-1 text-right">
          <div className="flex items-center gap-2 justify-end mb-2">
            <span className={`font-medium ${
              isComplete && match.player2Wins > match.player1Wins ? 'text-win' :
              isComplete && match.player2Wins < match.player1Wins ? 'text-loss' :
              'text-white'
            }`}>
              {p2?.name}
            </span>
            {p2 && <AvatarDisplay avatarKey={p2.avatarKey} size="sm" />}
          </div>
        </div>
      </div>

      {isComplete && (
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="text-xs text-slate-500">
            {match.player1Wins > match.player2Wins
              ? `${p1?.name} wins`
              : match.player2Wins > match.player1Wins
              ? `${p2?.name} wins`
              : 'Draw'}
            {' '}&middot; {match.player1Wins}-{match.player2Wins}
            {match.draws > 0 && `-${match.draws}`}
          </span>
          <button
            onClick={() => onUpdate(match.id, 0, 0, 0)}
            className="text-xs text-slate-600 hover:text-draw transition-colors"
            title="Reset result"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}
