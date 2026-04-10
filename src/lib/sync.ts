import { doc, getDoc, setDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from './firebase';
import type { AppState } from '../types';

const COLLECTION = 'rooms';

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 to avoid confusion
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function ensureAuth(): Promise<void> {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
}

export async function createRoom(state: AppState): Promise<string> {
  await ensureAuth();
  const code = generateRoomCode();
  const ref = doc(db, COLLECTION, code);
  await setDoc(ref, {
    state: JSON.stringify(state),
    updatedAt: Date.now(),
  });
  return code;
}

export async function joinRoom(code: string): Promise<AppState | null> {
  await ensureAuth();
  const ref = doc(db, COLLECTION, code.toUpperCase());
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return JSON.parse(snap.data().state) as AppState;
}

export async function pushState(roomCode: string, state: AppState): Promise<void> {
  const ref = doc(db, COLLECTION, roomCode);
  await setDoc(ref, {
    state: JSON.stringify(state),
    updatedAt: Date.now(),
  });
}

export function subscribeToRoom(
  roomCode: string,
  onUpdate: (state: AppState) => void,
): Unsubscribe {
  const ref = doc(db, COLLECTION, roomCode);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      const data = JSON.parse(snap.data().state) as AppState;
      onUpdate(data);
    }
  });
}
