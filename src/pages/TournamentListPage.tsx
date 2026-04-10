import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import PageShell from '../components/layout/PageShell';
import SearchBar from '../components/ui/SearchBar';
import Pagination from '../components/ui/Pagination';

const PER_PAGE = 10;

export default function TournamentListPage() {
  const { state } = useAppContext();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const allTournaments = [...state.tournaments].sort((a, b) => b.createdAt - a.createdAt);

  const filtered = allTournaments.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
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
      title="Tournaments"
      action={
        <Link
          to="/tournaments/new"
          className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + New Tournament
        </Link>
      }
    >
      {allTournaments.length > 0 && (
        <div className="mb-4">
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Search tournaments..."
          />
        </div>
      )}

      {allTournaments.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg mb-2">No tournaments yet</p>
          <p className="text-sm">Create your first tournament to get started</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p className="text-sm">No tournaments matching "{search}"</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paginated.map(t => (
              <Link
                key={t.id}
                to={`/tournaments/${t.id}`}
                className="block bg-dark-card border border-dark-border rounded-lg p-4 hover:border-accent/50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-white">{t.name}</div>
                    <div className="text-sm text-slate-400">
                      {new Date(t.createdAt).toLocaleDateString()} &middot; {t.playerIds.length} players &middot; {t.format} &middot; {t.totalRounds} rounds
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    t.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    t.status === 'complete' ? 'bg-slate-500/20 text-slate-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {t.status === 'active' ? 'In Progress' : t.status === 'complete' ? 'Completed' : 'Setup'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
          <div className="text-center text-xs text-slate-500 mt-2">
            {filtered.length} tournament{filtered.length !== 1 ? 's' : ''}
          </div>
        </>
      )}
    </PageShell>
  );
}
