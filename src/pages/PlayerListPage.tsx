import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import PageShell from '../components/layout/PageShell';
import PlayerCard from '../components/player/PlayerCard';
import PlayerForm from '../components/player/PlayerForm';
import SearchBar from '../components/ui/SearchBar';
import Pagination from '../components/ui/Pagination';
import { generateId } from '../lib/utils';

const PER_PAGE = 10;

export default function PlayerListPage() {
  const { state, dispatch } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const handleAdd = (name: string, avatarKey: string) => {
    dispatch({
      type: 'ADD_PLAYER',
      player: { id: generateId(), name, avatarKey, createdAt: Date.now() },
    });
    setShowForm(false);
  };

  const handleDelete = (playerId: string) => {
    const inActiveTournament = state.tournaments.some(
      t => t.status === 'active' && t.playerIds.includes(playerId)
    );
    if (inActiveTournament) {
      alert('Cannot delete a player who is in an active tournament.');
      return;
    }
    dispatch({ type: 'DELETE_PLAYER', playerId });
  };

  const filtered = state.players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <PageShell
      title="Players"
      action={
        !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Add Player
          </button>
        )
      }
    >
      {showForm && (
        <div className="bg-dark-card border border-dark-border rounded-lg p-4 mb-6">
          <PlayerForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {state.players.length > 0 && (
        <div className="mb-4">
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Search players..."
          />
        </div>
      )}

      {state.players.length === 0 && !showForm ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg mb-2">No players yet</p>
          <p className="text-sm">Add players to start creating tournaments</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p className="text-sm">No players matching "{search}"</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {paginated.map(player => (
              <PlayerCard key={player.id} player={player} onDelete={handleDelete} />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          <div className="text-center text-xs text-slate-500 mt-2">
            {filtered.length} player{filtered.length !== 1 ? 's' : ''}
          </div>
        </>
      )}
    </PageShell>
  );
}
