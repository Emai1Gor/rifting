import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import PageShell from '../components/layout/PageShell';
import StandingsTable from '../components/tournament/StandingsTable';
import MatchResultInput from '../components/tournament/MatchResultInput';
import PairingEditor from '../components/tournament/PairingEditor';
import RoundTimer from '../components/tournament/RoundTimer';
import { computeStandings } from '../lib/scoring';
import { generatePairings } from '../lib/swiss';
import { getWinsNeeded } from '../lib/utils';
import type { Match, Round } from '../types';

export default function TournamentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [showPairingEditor, setShowPairingEditor] = useState(false);
  const [pendingMatches, setPendingMatches] = useState<Match[] | null>(null);
  const [editingRound, setEditingRound] = useState<number | null>(null);

  const tournament = state.tournaments.find(t => t.id === id);
  if (!tournament) {
    return (
      <PageShell title="Tournament Not Found">
        <div className="text-center py-16 text-slate-500">This tournament does not exist.</div>
      </PageShell>
    );
  }

  const players = state.players.filter(p => tournament.playerIds.includes(p.id));
  const standings = computeStandings(tournament);
  const currentRound = tournament.rounds[tournament.currentRound] as Round | undefined;
  const isComplete = tournament.status === 'complete';
  const winsNeeded = getWinsNeeded(tournament.format);
  const boNum = parseInt(tournament.format.replace('BO', ''));

  // Check if all matches in current round are complete
  const allMatchesComplete = currentRound?.matches.every(m => m.status === 'complete') ?? false;
  const isLastRound = tournament.currentRound >= tournament.totalRounds - 1;

  const handleGenerateRound = () => {
    const matches = generatePairings(tournament);
    setPendingMatches(matches);
    setShowPairingEditor(true);
  };

  const handleConfirmPairings = (matches: Match[]) => {
    const newRound: Round = {
      roundNumber: tournament.rounds.length + 1,
      matches,
      timerEnd: null,
      confirmed: true,
    };
    const updated = {
      ...tournament,
      rounds: [...tournament.rounds, newRound],
      currentRound: tournament.rounds.length,
    };
    dispatch({ type: 'UPDATE_TOURNAMENT', tournament: updated });
    setShowPairingEditor(false);
    setPendingMatches(null);
  };

  const handleCancelPairings = () => {
    setShowPairingEditor(false);
    setPendingMatches(null);
  };

  const handleUpdateMatchResult = (matchId: string, p1Wins: number, p2Wins: number, draws: number) => {
    if (!currentRound) return;

    const updatedMatches = currentRound.matches.map(m => {
      if (m.id !== matchId) return m;

      // Determine if match is complete
      let status = m.status;
      if (boNum === 1) {
        // BO1: any result submitted = complete
        status = (p1Wins > 0 || p2Wins > 0 || draws > 0) ? 'complete' : 'pending';
      } else {
        // BOx: one player reaches winsNeeded, or it's a draw scenario
        status = (p1Wins >= winsNeeded || p2Wins >= winsNeeded) ? 'complete' : 'pending';
      }

      return { ...m, player1Wins: p1Wins, player2Wins: p2Wins, draws, status };
    });

    const updatedRounds = tournament.rounds.map((r, i) =>
      i === tournament.currentRound ? { ...r, matches: updatedMatches } : r
    );
    dispatch({ type: 'UPDATE_TOURNAMENT', tournament: { ...tournament, rounds: updatedRounds } });
  };

  const handleAdvanceRound = () => {
    if (isLastRound) {
      dispatch({
        type: 'UPDATE_TOURNAMENT',
        tournament: { ...tournament, status: 'complete' },
      });
    } else {
      // Generate next round pairings immediately
      const matches = generatePairings(tournament);
      setPendingMatches(matches);
      setShowPairingEditor(true);
      // We don't dispatch yet - we wait for pairing confirmation
      // The confirm handler will add the round and update currentRound
    }
  };

  const handleStartTimer = () => {
    if (!currentRound) return;
    const timerEnd = Date.now() + tournament.timerMinutes * 60 * 1000;
    const updatedRounds = tournament.rounds.map((r, i) =>
      i === tournament.currentRound ? { ...r, timerEnd } : r
    );
    dispatch({ type: 'UPDATE_TOURNAMENT', tournament: { ...tournament, rounds: updatedRounds } });
  };

  const handleResetTimer = () => {
    if (!currentRound) return;
    const updatedRounds = tournament.rounds.map((r, i) =>
      i === tournament.currentRound ? { ...r, timerEnd: null } : r
    );
    dispatch({ type: 'UPDATE_TOURNAMENT', tournament: { ...tournament, rounds: updatedRounds } });
  };

  const handleUpdatePastMatchResult = (roundIndex: number, matchId: string, p1Wins: number, p2Wins: number, draws: number) => {
    const round = tournament.rounds[roundIndex];
    if (!round) return;

    const updatedMatches = round.matches.map(m => {
      if (m.id !== matchId) return m;
      let status = m.status;
      if (boNum === 1) {
        status = (p1Wins > 0 || p2Wins > 0 || draws > 0) ? 'complete' : 'pending';
      } else {
        status = (p1Wins >= winsNeeded || p2Wins >= winsNeeded) ? 'complete' : 'pending';
      }
      return { ...m, player1Wins: p1Wins, player2Wins: p2Wins, draws, status };
    });

    const updatedRounds = tournament.rounds.map((r, i) =>
      i === roundIndex ? { ...r, matches: updatedMatches } : r
    );
    dispatch({ type: 'UPDATE_TOURNAMENT', tournament: { ...tournament, rounds: updatedRounds } });
  };

  const handleDeleteTournament = () => {
    if (confirm('Are you sure you want to delete this tournament?')) {
      dispatch({ type: 'DELETE_TOURNAMENT', tournamentId: tournament.id });
      navigate('/tournaments');
    }
  };

  return (
    <PageShell
      title={tournament.name}
      action={
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            isComplete ? 'bg-slate-500/20 text-slate-400' : 'bg-green-500/20 text-green-400'
          }`}>
            {isComplete ? 'Completed' : `Round ${tournament.currentRound + 1} / ${tournament.totalRounds}`}
          </span>
          <span className="text-xs text-slate-500">{tournament.format}</span>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Standings */}
        <div className="lg:col-span-1">
          <h2 className="text-sm font-semibold text-slate-400 uppercase mb-3">Standings</h2>
          <StandingsTable standings={standings} players={players} />
        </div>

        {/* Right: Round Management */}
        <div className="lg:col-span-2">
          {/* Timer */}
          {tournament.timerMinutes > 0 && currentRound && !isComplete && (
            <div className="mb-4">
              <RoundTimer
                timerEnd={currentRound.timerEnd}
                timerMinutes={tournament.timerMinutes}
                onStart={handleStartTimer}
                onReset={handleResetTimer}
              />
            </div>
          )}

          {/* Pairing Editor */}
          {showPairingEditor && pendingMatches && (
            <div className="mb-4">
              <PairingEditor
                matches={pendingMatches}
                players={players}
                onConfirm={handleConfirmPairings}
                onCancel={handleCancelPairings}
              />
            </div>
          )}

          {/* Current Round Matches */}
          {currentRound && !showPairingEditor && (
            <div>
              <h2 className="text-sm font-semibold text-slate-400 uppercase mb-3">
                Round {currentRound.roundNumber} Matches
              </h2>
              <div className="space-y-3">
                {currentRound.matches.map(match => (
                  <MatchResultInput
                    key={match.id}
                    match={match}
                    players={players}
                    format={tournament.format}
                    onUpdate={handleUpdateMatchResult}
                  />
                ))}
              </div>

              {/* Round Controls */}
              {allMatchesComplete && !isComplete && (
                <div className="mt-4">
                  <button
                    onClick={handleAdvanceRound}
                    className="bg-accent hover:bg-accent/80 text-white px-6 py-2.5 rounded-lg font-medium transition-colors w-full"
                  >
                    {isLastRound ? 'Finish Tournament' : 'Next Round'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* No round yet / generate first round */}
          {!currentRound && !showPairingEditor && !isComplete && (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">Ready to start Round 1</p>
              <button
                onClick={handleGenerateRound}
                className="bg-accent hover:bg-accent/80 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                Generate Pairings
              </button>
            </div>
          )}

          {/* Tournament Complete */}
          {isComplete && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">&#127942;</div>
              <h2 className="text-xl font-bold text-white mb-1">Tournament Complete!</h2>
              {standings[0] && (
                <p className="text-accent-light">
                  Winner: {players.find(p => p.id === standings[0].playerId)?.name}
                </p>
              )}
            </div>
          )}

          {/* Previous Rounds */}
          {tournament.rounds.length > 1 && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-slate-400 uppercase mb-3">Previous Rounds</h2>
              <div className="space-y-4">
                {tournament.rounds
                  .map((round, idx) => ({ round, idx }))
                  .filter(({ idx }) => idx !== tournament.currentRound || isComplete)
                  .map(({ round, idx }) => {
                    const isEditing = editingRound === idx;
                    return (
                      <div key={round.roundNumber} className="bg-dark-surface border border-dark-border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xs text-slate-400 font-medium">Round {round.roundNumber}</h3>
                          <button
                            onClick={() => setEditingRound(isEditing ? null : idx)}
                            className="text-xs text-slate-500 hover:text-accent-light transition-colors"
                          >
                            {isEditing ? 'Done' : 'Edit'}
                          </button>
                        </div>

                        {isEditing ? (
                          <div className="space-y-3">
                            {round.matches.map(match => (
                              <MatchResultInput
                                key={match.id}
                                match={match}
                                players={players}
                                format={tournament.format}
                                onUpdate={(matchId, p1w, p2w, d) => handleUpdatePastMatchResult(idx, matchId, p1w, p2w, d)}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {round.matches.map(match => {
                              const p1 = players.find(p => p.id === match.player1Id);
                              const p2 = match.player2Id ? players.find(p => p.id === match.player2Id) : null;
                              return (
                                <div key={match.id} className="flex items-center justify-between text-sm">
                                  <span className={match.player1Wins > match.player2Wins ? 'text-win' : 'text-white'}>
                                    {p1?.name}
                                  </span>
                                  <span className="text-slate-500 text-xs mx-2">
                                    {p2 ? `${match.player1Wins}-${match.player2Wins}` : 'BYE'}
                                  </span>
                                  <span className={!p2 ? 'text-yellow-400' : match.player2Wins > match.player1Wins ? 'text-win' : 'text-white'}>
                                    {p2?.name ?? 'BYE'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Delete */}
          <div className="mt-8 pt-4 border-t border-dark-border">
            <button
              onClick={handleDeleteTournament}
              className="text-red-400 hover:text-red-300 text-sm transition-colors"
            >
              Delete Tournament
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
