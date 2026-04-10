import { HERO_ICONS } from './HeroIcons';

const AVATARS = [
  { key: 'aelara', label: 'Aelara' },
  { key: 'brom', label: 'Brom' },
  { key: 'cael', label: 'Cael' },
  { key: 'dara', label: 'Dara' },
  { key: 'eris', label: 'Eris' },
  { key: 'fenix', label: 'Fenix' },
  { key: 'grim', label: 'Grim' },
  { key: 'hex', label: 'Hex' },
  { key: 'iris', label: 'Iris' },
  { key: 'jyn', label: 'Jyn' },
  { key: 'kai', label: 'Kai' },
  { key: 'luna', label: 'Luna' },
  { key: 'mira', label: 'Mira' },
  { key: 'nyx', label: 'Nyx' },
  { key: 'orin', label: 'Orin' },
  { key: 'pyre', label: 'Pyre' },
];

export { AVATARS };

export function getAvatarLabel(key: string): string {
  return AVATARS.find(a => a.key === key)?.label ?? key;
}

interface AvatarDisplayProps {
  avatarKey: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarDisplay({ avatarKey, size = 'md', className = '' }: AvatarDisplayProps) {
  const label = getAvatarLabel(avatarKey);
  const HeroIcon = HERO_ICONS[avatarKey];

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  if (!HeroIcon) {
    return (
      <div
        className={`bg-slate-600 ${sizeClasses[size]} rounded-full shrink-0 ${className}`}
        title={label}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} shrink-0 ${className}`} title={label}>
      <HeroIcon className="w-full h-full rounded-full" />
    </div>
  );
}

interface AvatarPickerProps {
  selected: string;
  onSelect: (key: string) => void;
}

export default function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">Avatar</label>
      <div className="grid grid-cols-8 gap-2">
        {AVATARS.map(avatar => (
          <button
            key={avatar.key}
            type="button"
            onClick={() => onSelect(avatar.key)}
            title={avatar.label}
            className={`flex items-center justify-center p-1.5 rounded-lg transition-all ${
              selected === avatar.key
                ? 'bg-accent/20 ring-2 ring-accent'
                : 'hover:bg-white/5'
            }`}
          >
            <AvatarDisplay avatarKey={avatar.key} size="sm" />
          </button>
        ))}
      </div>
    </div>
  );
}
