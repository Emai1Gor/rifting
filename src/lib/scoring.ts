import type { Tournament, PlayerStanding, PlayerId, Match } from '../types';

function getMatchResult(match: Match, playerId: PlayerId): 'win' | 'loss' | 'draw' | null {
  if (match.status !== 'complete') return null;

  if (match.player1Id === playerId) {
    if (match.player2Id === null) return 'win'; // bye
    if (match.player1Wins > match.player2Wins) return 'win';
    if (match.player1Wins < match.player2Wins) return 'loss';
    return 'draw';
  }

  if (match.player2Id === playerId) {
    if (match.player2Wins > match.player1Wins) return 'win';
    if (match.player2Wins < match.player1Wins) return 'loss';
    return 'draw';
  }

  return null;
}

export function computeStandings(tournament: Tournament): PlayerStanding[] {
  const statsMap = new Map<PlayerId, {
    matchPoints: number;
    matchesPlayed: number;
    wins: number;
    losses: number;
    draws: number;
    opponents: PlayerId[];
    gameWins: number;
    gameLosses: number;
    gameDraws: number;
  }>();

  // Initialize all players
  for (const pid of tournament.playerIds) {
    statsMap.set(pid, {
      matchPoints: 0,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      opponents: [],
      gameWins: 0,
      gameLosses: 0,
      gameDraws: 0,
    });
  }

  // Process completed rounds
  for (const round of tournament.rounds) {
    if (!round.confirmed) continue;
    for (const match of round.matches) {
      if (match.status !== 'complete') continue;

      // Player 1
      const p1Stats = statsMap.get(match.player1Id);
      if (p1Stats) {
        const result = getMatchResult(match, match.player1Id);
        if (result === 'win') { p1Stats.matchPoints += 3; p1Stats.wins++; }
        else if (result === 'draw') { p1Stats.matchPoints += 1; p1Stats.draws++; }
        else if (result === 'loss') { p1Stats.losses++; }
        p1Stats.matchesPlayed++;
        p1Stats.gameWins += match.player1Wins;
        p1Stats.gameLosses += match.player2Wins;
        p1Stats.gameDraws += match.draws;
        if (match.player2Id) p1Stats.opponents.push(match.player2Id);
      }

      // Player 2 (skip if bye)
      if (match.player2Id) {
        const p2Stats = statsMap.get(match.player2Id);
        if (p2Stats) {
          const result = getMatchResult(match, match.player2Id);
          if (result === 'win') { p2Stats.matchPoints += 3; p2Stats.wins++; }
          else if (result === 'draw') { p2Stats.matchPoints += 1; p2Stats.draws++; }
          else if (result === 'loss') { p2Stats.losses++; }
          p2Stats.matchesPlayed++;
          p2Stats.gameWins += match.player2Wins;
          p2Stats.gameLosses += match.player1Wins;
          p2Stats.gameDraws += match.draws;
          p2Stats.opponents.push(match.player1Id);
        }
      }
    }
  }

  // Helper: compute GWP for a player
  const getGWP = (stats: { gameWins: number; gameLosses: number; gameDraws: number }) => {
    const totalGames = stats.gameWins + stats.gameLosses + stats.gameDraws;
    if (totalGames === 0) return 0.33;
    return Math.max((stats.gameWins + stats.gameDraws * 0.5) / totalGames, 0.33);
  };

  // Compute OMW, GWP, OGW
  const standings: PlayerStanding[] = [];
  for (const [playerId, stats] of statsMap) {
    let omw = 0;
    let ogw = 0;
    if (stats.opponents.length > 0) {
      const oppMWPs = stats.opponents.map(oppId => {
        const oppStats = statsMap.get(oppId);
        if (!oppStats || oppStats.matchesPlayed === 0) return 0.33;
        return Math.max(oppStats.matchPoints / (oppStats.matchesPlayed * 3), 0.33);
      });
      omw = oppMWPs.reduce((sum, v) => sum + v, 0) / oppMWPs.length;

      const oppGWPs = stats.opponents.map(oppId => {
        const oppStats = statsMap.get(oppId);
        if (!oppStats) return 0.33;
        return getGWP(oppStats);
      });
      ogw = oppGWPs.reduce((sum, v) => sum + v, 0) / oppGWPs.length;
    }

    const gwp = getGWP(stats);

    standings.push({
      playerId,
      matchPoints: stats.matchPoints,
      matchesPlayed: stats.matchesPlayed,
      wins: stats.wins,
      losses: stats.losses,
      draws: stats.draws,
      omw,
      gwp,
      ogw,
      rank: 0,
    });
  }

  // Sort: matchPoints DESC, then OMW DESC
  standings.sort((a, b) => {
    if (b.matchPoints !== a.matchPoints) return b.matchPoints - a.matchPoints;
    return b.omw - a.omw;
  });

  // Assign ranks
  standings.forEach((s, i) => { s.rank = i + 1; });

  return standings;
}
