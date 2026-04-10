import type { Tournament, Match, PlayerId } from '../types';
import { computeStandings } from './scoring';
import { generateId, getWinsNeeded } from './utils';

export function generatePairings(tournament: Tournament): Match[] {
  const standings = computeStandings(tournament);
  const sortedPlayerIds = standings.map(s => s.playerId);
  const matches: Match[] = [];
  const paired = new Set<PlayerId>();

  // Build "played last round" set for rematch avoidance
  const lastRoundOpponents = new Map<PlayerId, Set<PlayerId>>();
  const lastRound = tournament.rounds.length > 0
    ? tournament.rounds[tournament.rounds.length - 1]
    : null;

  if (lastRound) {
    for (const match of lastRound.matches) {
      if (match.player2Id === null) continue;
      if (!lastRoundOpponents.has(match.player1Id)) {
        lastRoundOpponents.set(match.player1Id, new Set());
      }
      if (!lastRoundOpponents.has(match.player2Id)) {
        lastRoundOpponents.set(match.player2Id, new Set());
      }
      lastRoundOpponents.get(match.player1Id)!.add(match.player2Id);
      lastRoundOpponents.get(match.player2Id)!.add(match.player1Id);
    }
  }

  // Build "has had bye" set
  const hadBye = new Set<PlayerId>();
  for (const round of tournament.rounds) {
    for (const match of round.matches) {
      if (match.player2Id === null) {
        hadBye.add(match.player1Id);
      }
    }
  }

  // Handle BYE if odd number
  if (sortedPlayerIds.length % 2 === 1) {
    // Walk from bottom (lowest score) to find first player without a bye
    let byePlayer: PlayerId | null = null;
    for (let i = sortedPlayerIds.length - 1; i >= 0; i--) {
      if (!hadBye.has(sortedPlayerIds[i])) {
        byePlayer = sortedPlayerIds[i];
        break;
      }
    }
    // If everyone has had a bye, give it to the lowest ranked
    if (!byePlayer) {
      byePlayer = sortedPlayerIds[sortedPlayerIds.length - 1];
    }

    const winsNeeded = getWinsNeeded(tournament.format);
    matches.push({
      id: generateId(),
      player1Id: byePlayer,
      player2Id: null,
      player1Wins: winsNeeded,
      player2Wins: 0,
      draws: 0,
      status: 'complete', // bye is auto-complete
    });
    paired.add(byePlayer);
  }

  // Greedy top-down pairing
  for (let i = 0; i < sortedPlayerIds.length; i++) {
    const player = sortedPlayerIds[i];
    if (paired.has(player)) continue;

    let bestOpponent: PlayerId | null = null;

    // First pass: find closest-ranked opponent not played last round
    for (let j = i + 1; j < sortedPlayerIds.length; j++) {
      const candidate = sortedPlayerIds[j];
      if (paired.has(candidate)) continue;
      const lastOpp = lastRoundOpponents.get(player);
      if (!lastOpp || !lastOpp.has(candidate)) {
        bestOpponent = candidate;
        break;
      }
    }

    // Second pass: if all remaining are last-round opponents, take closest
    if (!bestOpponent) {
      for (let j = i + 1; j < sortedPlayerIds.length; j++) {
        const candidate = sortedPlayerIds[j];
        if (paired.has(candidate)) continue;
        bestOpponent = candidate;
        break;
      }
    }

    if (bestOpponent) {
      matches.push({
        id: generateId(),
        player1Id: player,
        player2Id: bestOpponent,
        player1Wins: 0,
        player2Wins: 0,
        draws: 0,
        status: 'pending',
      });
      paired.add(player);
      paired.add(bestOpponent);
    }
  }

  return matches;
}
