export type PlayerId = string;
export type TournamentId = string;
export type MatchId = string;

export interface Player {
  id: PlayerId;
  name: string;
  avatarKey: string;
  createdAt: number;
}

export type MatchStatus = 'pending' | 'complete';

export interface Match {
  id: MatchId;
  player1Id: PlayerId;
  player2Id: PlayerId | null; // null = bye
  player1Wins: number;
  player2Wins: number;
  draws: number;
  status: MatchStatus;
}

export interface Round {
  roundNumber: number;
  matches: Match[];
  timerEnd: number | null;
  confirmed: boolean;
}

export type MatchFormat = 'BO1' | 'BO3' | `BO${number}`;

export interface Tournament {
  id: TournamentId;
  name: string;
  format: MatchFormat;
  playerIds: PlayerId[];
  rounds: Round[];
  currentRound: number;
  totalRounds: number;
  timerMinutes: number;
  status: 'setup' | 'active' | 'complete';
  createdAt: number;
}

export interface FriendlyMatch {
  id: MatchId;
  player1Id: PlayerId;
  player2Id: PlayerId;
  player1Wins: number;
  player2Wins: number;
  draws: number;
  playedAt: number;
}

export interface PlayerStanding {
  playerId: PlayerId;
  matchPoints: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  omw: number;
  gwp: number;   // Game Win Percentage
  ogw: number;   // Opponent Game Win Percentage
  rank: number;
}

export interface AppState {
  players: Player[];
  tournaments: Tournament[];
  friendlyMatches: FriendlyMatch[];
}
