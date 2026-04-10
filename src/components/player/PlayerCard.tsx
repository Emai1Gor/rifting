import { Link } from 'react-router-dom';
import type { Player } from '../../types';
import { AvatarDisplay } from './AvatarPicker';

interface Props {
  player: Player;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

export default function PlayerCard({ player, onDelete, compact }: Props) {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <AvatarDisplay avatarKey={player.avatarKey} size="sm" />
        <span className="text-white text-sm font-medium">{player.name}</span>
      </div>
    );
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-4 flex items-center gap-4">
      <AvatarDisplay avatarKey={player.avatarKey} size="md" />
      <div className="flex-1 min-w-0">
        <Link
          to={`/players/${player.id}`}
          className="text-white font-medium hover:text-accent-light transition-colors"
        >
          {player.name}
        </Link>
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(player.id)}
          className="text-slate-500 hover:text-red-400 transition-colors text-sm"
        >
          Delete
        </button>
      )}
    </div>
  );
}
