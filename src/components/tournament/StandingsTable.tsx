import type { PlayerStanding, Player } from '../../types';
import { AvatarDisplay } from '../player/AvatarPicker';

interface Props {
  standings: PlayerStanding[];
  players: Player[];
}

export default function StandingsTable({ standings, players }: Props) {
  const getPlayer = (id: string) => players.find(p => p.id === id);

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg overflow-x-auto">
      <table className="w-full text-sm min-w-0">
        <thead>
          <tr className="border-b border-dark-border text-slate-400 text-xs uppercase">
            <th className="px-2 py-2.5 text-left w-8">#</th>
            <th className="px-2 py-2.5 text-left">Player</th>
            <th className="px-1.5 py-2.5 text-center w-8">W</th>
            <th className="px-1.5 py-2.5 text-center w-8">L</th>
            <th className="px-1.5 py-2.5 text-center w-8">D</th>
            <th className="px-1.5 py-2.5 text-center w-10">Pts</th>
            <th className="px-1.5 py-2.5 text-center w-14">OMW</th>
          </tr>
        </thead>
        <tbody>
          {standings.map(s => {
            const player = getPlayer(s.playerId);
            if (!player) return null;
            return (
              <tr key={s.playerId} className="border-b border-dark-border/50 hover:bg-white/5">
                <td className="px-2 py-2 text-slate-400 font-mono text-xs">
                  <span className={
                    s.rank === 1 ? 'text-gold font-bold' :
                    s.rank === 2 ? 'text-silver font-bold' :
                    s.rank === 3 ? 'text-bronze font-bold' : ''
                  }>
                    {s.rank}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <AvatarDisplay avatarKey={player.avatarKey} size="sm" />
                    <span className="text-white font-medium text-xs truncate">{player.name}</span>
                  </div>
                </td>
                <td className="px-1.5 py-2 text-center text-win text-xs">{s.wins}</td>
                <td className="px-1.5 py-2 text-center text-loss text-xs">{s.losses}</td>
                <td className="px-1.5 py-2 text-center text-draw text-xs">{s.draws}</td>
                <td className="px-1.5 py-2 text-center text-white font-bold text-xs">{s.matchPoints}</td>
                <td className="px-1.5 py-2 text-center text-slate-400 text-xs">
                  {(s.omw * 100).toFixed(0)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
