import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function HomePage() {
  const { state } = useAppContext();
  const activeTournaments = state.tournaments.filter(t => t.status === 'active');

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-3">
          <span className="text-accent-light">Rifting</span>
        </h1>
        <p className="text-slate-400 text-lg">Swiss Round TCG Tournament Manager</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <Link
          to="/tournaments/new"
          className="bg-accent hover:bg-accent/80 text-white rounded-xl p-6 text-center transition-colors"
        >
          <div className="text-3xl mb-2">&#9876;</div>
          <div className="font-semibold text-lg">New Tournament</div>
          <div className="text-sm text-white/70 mt-1">Start a Swiss round</div>
        </Link>

        <Link
          to="/friendly"
          className="bg-dark-card hover:bg-dark-card/80 border border-dark-border text-white rounded-xl p-6 text-center transition-colors"
        >
          <div className="text-3xl mb-2">&#9876;</div>
          <div className="font-semibold text-lg">Point Tracker</div>
          <div className="text-sm text-slate-400 mt-1">Quick point counter</div>
        </Link>

        <Link
          to="/players"
          className="bg-dark-card hover:bg-dark-card/80 border border-dark-border text-white rounded-xl p-6 text-center transition-colors"
        >
          <div className="text-3xl mb-2">&#128100;</div>
          <div className="font-semibold text-lg">Players</div>
          <div className="text-sm text-slate-400 mt-1">{state.players.length} registered</div>
        </Link>
      </div>

      {activeTournaments.length > 0 && (
        <div className="mt-10 max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold text-white mb-3">Active Tournaments</h2>
          <div className="space-y-2">
            {activeTournaments.map(t => (
              <Link
                key={t.id}
                to={`/tournaments/${t.id}`}
                className="block bg-dark-card border border-dark-border rounded-lg p-4 hover:border-accent/50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-white">{t.name}</div>
                    <div className="text-sm text-slate-400">
                      Round {t.currentRound + 1} of {t.totalRounds} &middot; {t.playerIds.length} players &middot; {t.format}
                    </div>
                  </div>
                  <div className="text-accent-light text-sm">In Progress &rarr;</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
