import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode } from 'react';
import type { AppState, Player, Tournament, FriendlyMatch } from '../types';
import { loadState, saveState } from '../lib/storage';

// --- Actions ---
export type AppAction =
  | { type: 'ADD_PLAYER'; player: Player }
  | { type: 'UPDATE_PLAYER'; player: Player }
  | { type: 'DELETE_PLAYER'; playerId: string }
  | { type: 'CREATE_TOURNAMENT'; tournament: Tournament }
  | { type: 'UPDATE_TOURNAMENT'; tournament: Tournament }
  | { type: 'DELETE_TOURNAMENT'; tournamentId: string }
  | { type: 'ADD_FRIENDLY_MATCH'; match: FriendlyMatch }
  | { type: 'DELETE_FRIENDLY_MATCH'; matchId: string };

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.player] };
    case 'UPDATE_PLAYER':
      return {
        ...state,
        players: state.players.map(p => p.id === action.player.id ? action.player : p),
      };
    case 'DELETE_PLAYER':
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.playerId),
      };
    case 'CREATE_TOURNAMENT':
      return { ...state, tournaments: [...state.tournaments, action.tournament] };
    case 'UPDATE_TOURNAMENT':
      return {
        ...state,
        tournaments: state.tournaments.map(t =>
          t.id === action.tournament.id ? action.tournament : t
        ),
      };
    case 'DELETE_TOURNAMENT':
      return {
        ...state,
        tournaments: state.tournaments.filter(t => t.id !== action.tournamentId),
      };
    case 'ADD_FRIENDLY_MATCH':
      return {
        ...state,
        friendlyMatches: [...state.friendlyMatches, action.match],
      };
    case 'DELETE_FRIENDLY_MATCH':
      return {
        ...state,
        friendlyMatches: state.friendlyMatches.filter(m => m.id !== action.matchId),
      };
    default:
      return state;
  }
}

// --- Context ---
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => saveState(state), 300);
    return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current); };
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
