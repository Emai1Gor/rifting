import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import PageShell from '../components/layout/PageShell';
import PlayerForm from '../components/player/PlayerForm';
import { AvatarDisplay } from '../components/player/AvatarPicker';
import type { Match, Tournament } from '../types';

interface MatchRecord {
  tournamentName: string;
  tournamentId: string;
  roundNumber: number;
  opponentName: string;
  opponentId: string | null;
  result: 'win' | 'loss' | 'draw' | 'bye';
  score: string;
}

function getMatchRecords(
  playerId: string,
  tournaments: Tournament[],
  getPlayerName: (id: string) => string
): MatchRecord[] {
  const records: MatchRecord[] = [];

  for (const tournament of tournaments) {
    if (!tournament.playerIds.includes(playerId)) continue;
    if (tournament.status === 'setup') continue;

    for (const round of tournament.rounds) {
      for (const match of round.matches) {
        if (match.status !== 'complete') continue;

        let result: MatchRecord['result'];
        let opponentId: string | null;
        let score: string;

        if (match.player1Id === playerId) {
          opponentId = match.player2Id;
          if (match.player2Id === null) {
            result = 'bye';
            score = 'BYE';
          } else if (match.player1Wins > match.player2Wins) {
            result = 'win';
            score = `${match.player1Wins}-${match.player2Wins}`;
          } else if (match.player1Wins < match.player2Wins) {
            result = 'loss';
            score = `${match.player1Wins}-${match.player2Wins}`;
          } else {
            result = 'draw';
            score = `${match.player1Wins}-${match.player2Wins}`;
          }
        } else if (match.player2Id === playerId) {
          opponentId = match.player1Id;
          if (match.player2Wins > match.player1Wins) {
            result = 'win';
            score = `${match.player2Wins}-${match.player1Wins}`;
          } else if (match.player2Wins < match.player1Wins) {
            result = 'loss';
            score = `${match.player2Wins}-${match.player1Wins}`;
          } else {
            result = 'draw';
            score = `${match.player1Wins}-${match.player2Wins}`;
          }
        } else {
          continue;
        }

        records.push({
          tournamentName: tournament.name,
          tournamentId: tournament.id,
          roundNumber: round.roundNumber,
          opponentName: opponentId ? getPlayerName(opponentId) : 'BYE',
          opponentId,
          result,
          score,
        });
      }
    }
  }

  return records.reverse(); // newest first
}

export default function PlayerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [editing, setEditing] = useState(false);

  const player = state.players.find(p => p.id === id);
  if (!player) {
    return (
      <PageShell title="Player Not Found">
        <div className="text-center py-16 text-slate-500">
          <p>This player does not exist.</p>
        </div>
      </PageShell>
    );
  }

  const getPlayerName = (pid: string) => state.players.find(p => p.id === pid)?.name ?? 'Unknown';

  // Compute stats
  const records = getMatchRecords(player.id, state.tournaments, getPlayerName);
  const nonByeRecords = records.filter(r => r.result !== 'bye');
  const totalWins = nonByeRecords.filter(r => r.result === 'win').length;
  const totalLosses = nonByeRecords.filter(r => r.result === 'loss').length;
  const totalDraws = nonByeRecords.filter(r => r.result === 'draw').length;
  const totalMatches = nonByeRecords.length;
  const winRate = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : '0.0';

  const tournamentsPlayed = state.tournaments.filter(t =>
    t.playerIds.includes(player.id) && t.status !== 'setup'
  );

  const handleUpdate = (name: string, avatarKey: string) => {
    dispatch({ type: 'UPDATE_PLAYER', player: { ...player, name, avatarKey } });
    setEditing(false);
  };

  const resultColor = (r: MatchRecord['result']) => {
    switch (r) {
      case 'win': return 'text-win';
      case 'loss': return 'text-loss';
      case 'draw': return 'text-draw';
      case 'bye': return 'text-yellow-400';
    }
  };

  const resultLabel = (r: MatchRecord['result']) => {
    switch (r) {
      case 'win': return 'WIN';
      case 'loss': return 'LOSS';
      case 'draw': return 'DRAW';
      case 'bye': return 'BYE';
    }
  };

  return (
    <PageShell title="Player Profile">
      {editing ? (
        <div className="bg-dark-card border border-dark-border rounded-lg p-4 max-w-lg">
          <PlayerForm
            initialName={player.name}
            initialAvatar={player.avatarKey}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
            submitLabel="Save Changes"
          />
        </div>
      ) : (
        <div className="max-w-2xl">
          {/* Profile Header */}
          <div className="bg-dark-card border border-dark-border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <AvatarDisplay avatarKey={player.avatarKey} size="lg" />
              <div>
                <h2 className="text-xl font-bold text-white">{player.name}</h2>
                <button
                  onClick={() => setEditing(true)}
                  className="text-accent-light text-sm hover:underline mt-1"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              <div className="bg-dark-surface rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{totalMatches}</div>
                <div className="text-[10px] text-slate-400">Matches</div>
              </div>
              <div className="bg-dark-surface rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{winRate}%</div>
                <div className="text-[10px] text-slate-400">Win Rate</div>
              </div>
              <div className="bg-dark-surface rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-win">{totalWins}</div>
                <div className="text-[10px] text-slate-400">Wins</div>
              </div>
              <div className="bg-dark-surface rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-loss">{totalLosses}</div>
                <div className="text-[10px] text-slate-400">Losses</div>
              </div>
              <div className="bg-dark-surface rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-draw">{totalDraws}</div>
                <div className="text-[10px] text-slate-400">Draws</div>
              </div>
              <div className="bg-dark-surface rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-accent-light">{tournamentsPlayed.length}</div>
                <div className="text-[10px] text-slate-400">Tourneys</div>
              </div>
            </div>
          </div>

          {/* Match History */}
          <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-dark-border">
              <h3 className="text-sm font-semibold text-slate-300">Match History</h3>
            </div>

            {records.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No matches played yet
              </div>
            ) : (
              <div className="divide-y divide-dark-border/50">
                {records.map((record, i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-3 hover:bg-white/5">
                    {/* Result badge */}
                    <span className={`text-[10px] font-bold w-10 text-center ${resultColor(record.result)}`}>
                      {resultLabel(record.result)}
                    </span>

                    {/* Opponent & score */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">
                          vs {record.opponentName}
                        </span>
                        <span className="text-slate-400 text-xs font-mono">{record.score}</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        <Link
                          to={`/tournaments/${record.tournamentId}`}
                          className="hover:text-accent-light transition-colors"
                        >
                          {record.tournamentName}
                        </Link>
                        {' '}&middot; Round {record.roundNumber}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/players')}
            className="mt-4 text-slate-400 hover:text-slate-200 text-sm transition-colors"
          >
            &larr; Back to Players
          </button>
        </div>
      )}
    </PageShell>
  );
}
