import { createContext, useContext, useReducer, useEffect, useRef, useCallback, useState, type ReactNode } from 'react';
import type { AppState, Player, Tournament, FriendlyMatch } from '../types';
import { loadState, saveState } from '../lib/storage';
import { createRoom, joinRoom, pushState, subscribeToRoom } from '../lib/sync';

// --- Actions ---
export type AppAction =
  | { type: 'ADD_PLAYER'; player: Player }
  | { type: 'UPDATE_PLAYER'; player: Player }
  | { type: 'DELETE_PLAYER'; playerId: string }
  | { type: 'CREATE_TOURNAMENT'; tournament: Tournament }
  | { type: 'UPDATE_TOURNAMENT'; tournament: Tournament }
  | { type: 'DELETE_TOURNAMENT'; tournamentId: string }
  | { type: 'ADD_FRIENDLY_MATCH'; match: FriendlyMatch }
  | { type: 'DELETE_FRIENDLY_MATCH'; matchId: string }
  | { type: 'SYNC_STATE'; state: AppState };

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
    case 'SYNC_STATE':
      return action.state;
    default:
      return state;
  }
}

// --- Sync Status ---
export type SyncStatus = 'offline' | 'syncing' | 'synced' | 'error';

// --- Context ---
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  roomCode: string | null;
  syncStatus: SyncStatus;
  createSyncRoom: () => Promise<string>;
  joinSyncRoom: (code: string) => Promise<boolean>;
  disconnectSync: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const ROOM_CODE_KEY = 'rifting-room-code';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);
  const [roomCode, setRoomCode] = useState<string | null>(
    () => localStorage.getItem(ROOM_CODE_KEY)
  );
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline');

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const unsubRef = useRef<(() => void) | undefined>(undefined);
  const isRemoteUpdate = useRef(false);
  const pushTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Save to localStorage on every state change
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => saveState(state), 300);
    return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current); };
  }, [state]);

  // Push to Firestore when state changes and we have a room
  useEffect(() => {
    if (!roomCode || isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }
    if (pushTimeout.current) clearTimeout(pushTimeout.current);
    pushTimeout.current = setTimeout(() => {
      setSyncStatus('syncing');
      pushState(roomCode, state)
        .then(() => setSyncStatus('synced'))
        .catch(() => setSyncStatus('error'));
    }, 500);
    return () => { if (pushTimeout.current) clearTimeout(pushTimeout.current); };
  }, [state, roomCode]);

  // Subscribe to remote changes when we have a room code
  useEffect(() => {
    if (!roomCode) return;
    setSyncStatus('syncing');

    unsubRef.current = subscribeToRoom(roomCode, (remoteState) => {
      isRemoteUpdate.current = true;
      dispatch({ type: 'SYNC_STATE', state: remoteState });
      setSyncStatus('synced');
    });

    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, [roomCode]);

  const createSyncRoom = useCallback(async () => {
    setSyncStatus('syncing');
    const code = await createRoom(state);
    localStorage.setItem(ROOM_CODE_KEY, code);
    setRoomCode(code);
    setSyncStatus('synced');
    return code;
  }, [state]);

  const joinSyncRoom = useCallback(async (code: string) => {
    setSyncStatus('syncing');
    const upper = code.toUpperCase();
    const remoteState = await joinRoom(upper);
    if (!remoteState) {
      setSyncStatus('error');
      return false;
    }
    dispatch({ type: 'SYNC_STATE', state: remoteState });
    localStorage.setItem(ROOM_CODE_KEY, upper);
    setRoomCode(upper);
    setSyncStatus('synced');
    return true;
  }, []);

  const disconnectSync = useCallback(() => {
    if (unsubRef.current) unsubRef.current();
    localStorage.removeItem(ROOM_CODE_KEY);
    setRoomCode(null);
    setSyncStatus('offline');
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, roomCode, syncStatus, createSyncRoom, joinSyncRoom, disconnectSync }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
