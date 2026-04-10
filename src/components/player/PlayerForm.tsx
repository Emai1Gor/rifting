import { useState } from 'react';
import AvatarPicker, { AVATARS } from './AvatarPicker';

interface Props {
  initialName?: string;
  initialAvatar?: string;
  onSubmit: (name: string, avatarKey: string) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function PlayerForm({ initialName = '', initialAvatar, onSubmit, onCancel, submitLabel = 'Add Player' }: Props) {
  const [name, setName] = useState(initialName);
  const [avatarKey, setAvatarKey] = useState(initialAvatar ?? AVATARS[0].key);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed, avatarKey);
    if (!initialName) {
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="player-name" className="block text-sm font-medium text-slate-300 mb-1">
          Player Name
        </label>
        <input
          id="player-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter player name"
          className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          autoFocus
        />
      </div>

      <AvatarPicker selected={avatarKey} onSelect={setAvatarKey} />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!name.trim()}
          className="bg-accent hover:bg-accent/80 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-dark-surface hover:bg-dark-border text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
