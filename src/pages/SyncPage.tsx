import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function SyncPage() {
  const { roomCode, syncStatus, createSyncRoom, joinSyncRoom, disconnectSync } = useAppContext();
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      await createSyncRoom();
    } catch {
      setError('無法建立房間，請檢查網絡連接');
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    if (joinCode.length < 6) {
      setError('請輸入 6 位房間碼');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const ok = await joinSyncRoom(joinCode);
      if (!ok) {
        setError('搵唔到呢個房間，請檢查房間碼');
      }
    } catch {
      setError('連接失敗，請檢查網絡');
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    if (roomCode) {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusLabel: Record<string, string> = {
    offline: '未連接',
    syncing: '同步中...',
    synced: '已同步',
    error: '同步錯誤',
  };

  const statusColor: Record<string, string> = {
    offline: 'text-slate-400',
    syncing: 'text-draw',
    synced: 'text-win',
    error: 'text-loss',
  };

  // Connected view
  if (roomCode) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold text-white">跨設備同步</h1>

        <div className="bg-dark-card border border-dark-border rounded-lg p-6 space-y-4">
          <div className="text-center">
            <div className="text-xs text-slate-400 uppercase mb-2">房間碼</div>
            <div className="text-4xl font-mono font-bold text-accent tracking-[0.3em]">
              {roomCode}
            </div>
            <button
              onClick={handleCopy}
              className="mt-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              {copied ? '已複製 ✓' : '複製房間碼'}
            </button>
          </div>

          <div className="text-center">
            <span className={`text-sm font-medium ${statusColor[syncStatus]}`}>
              {statusLabel[syncStatus]}
            </span>
          </div>

          <p className="text-xs text-slate-500 text-center">
            喺另一部設備打開 Rifting，輸入呢個房間碼就可以同步數據
          </p>

          <button
            onClick={disconnectSync}
            className="w-full bg-dark-surface hover:bg-dark-border text-slate-300 px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            斷開連接
          </button>
        </div>
      </div>
    );
  }

  // Not connected view
  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-white">跨設備同步</h1>

      {/* Create Room */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">建立房間</h2>
        <p className="text-sm text-slate-400">
          建立一個房間，將你嘅數據上傳到雲端，然後用房間碼喺其他設備同步
        </p>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-accent hover:bg-accent/80 text-black px-4 py-2.5 rounded font-medium transition-colors disabled:opacity-50"
        >
          {loading ? '建立中...' : '建立房間'}
        </button>
      </div>

      {/* Join Room */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">加入房間</h2>
        <p className="text-sm text-slate-400">
          輸入另一部設備嘅房間碼，下載並同步數據
        </p>
        <input
          type="text"
          value={joinCode}
          onChange={e => { setJoinCode(e.target.value.toUpperCase()); setError(''); }}
          placeholder="輸入 6 位房間碼"
          maxLength={6}
          className="w-full bg-dark-surface border border-dark-border rounded px-4 py-2.5 text-white text-center text-2xl font-mono tracking-[0.3em] placeholder:text-slate-600 placeholder:text-base placeholder:tracking-normal focus:outline-none focus:border-accent"
        />
        <button
          onClick={handleJoin}
          disabled={loading || joinCode.length < 6}
          className="w-full bg-win hover:bg-win/80 text-black px-4 py-2.5 rounded font-medium transition-colors disabled:opacity-50"
        >
          {loading ? '連接中...' : '加入房間'}
        </button>
      </div>

      {error && (
        <div className="bg-loss/10 border border-loss/30 rounded-lg p-3 text-loss text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}
