import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import TournamentListPage from './pages/TournamentListPage';
import TournamentCreatePage from './pages/TournamentCreatePage';
import TournamentPage from './pages/TournamentPage';
import FriendlyMatchPage from './pages/FriendlyMatchPage';
import PlayerListPage from './pages/PlayerListPage';
import PlayerProfilePage from './pages/PlayerProfilePage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tournaments" element={<TournamentListPage />} />
          <Route path="/tournaments/new" element={<TournamentCreatePage />} />
          <Route path="/tournaments/:id" element={<TournamentPage />} />
          <Route path="/friendly" element={<FriendlyMatchPage />} />
          <Route path="/players" element={<PlayerListPage />} />
          <Route path="/players/:id" element={<PlayerProfilePage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
