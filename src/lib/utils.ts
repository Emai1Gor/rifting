export function generateId(): string {
  return crypto.randomUUID();
}

export function formatMatchScore(p1Wins: number, p2Wins: number, draws: number): string {
  if (draws > 0) {
    return `${p1Wins}-${p2Wins}-${draws}`;
  }
  return `${p1Wins}-${p2Wins}`;
}

export function getWinsNeeded(format: string): number {
  const num = parseInt(format.replace('BO', ''));
  return Math.ceil(num / 2);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getDefaultRounds(playerCount: number): number {
  if (playerCount <= 1) return 0;
  return Math.ceil(Math.log2(playerCount));
}
