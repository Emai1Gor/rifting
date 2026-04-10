// Unique SVG hero icons for each Riftbound TCG character
// Each icon has a distinct silhouette/symbol on a colored gradient background

interface IconProps {
  className?: string;
}

type HeroIcon = (props: IconProps) => JSX.Element;

// Aelara - Arcane sorceress (crescent moon + stars)
const Aelara: HeroIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="aelara-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#aelara-bg)" />
    <path d="M55 25C40 25 28 37 28 52s12 27 27 27c-15 0-22-12-22-27S40 25 55 25z" fill="#e0e7ff" opacity="0.9" />
    <circle cx="62" cy="32" r="2.5" fill="#e0e7ff" />
    <circle cx="70" cy="42" r="1.8" fill="#e0e7ff" opacity="0.7" />
    <circle cx="66" cy="52" r="2" fill="#e0e7ff" opacity="0.5" />
  </svg>
);

// Brom - Armored warrior (shield)
const Brom: HeroIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="brom-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#brom-bg)" />
    <path d="M50 22L30 35v20c0 12 9 20 20 25 11-5 20-13 20-25V35L50 22z" fill="#fef3c7" opacity="0.9" />
    <path d="M50 32L38 40v14c0 8 5 14 12 18 7-4 12-10 12-18V40L50 32z" fill="url(#brom-bg)" />
    <path d="M50 42v20M42 52h16" stroke="#fef3c7" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Cael - Wind elementalist (swirl/tornado)
const Cael: HeroIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="cael-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0891b2" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#cael-bg)" />
    <path d="M30 55c0 0 10-15 25-10s15 20 0 20-15-10 0-20 25-10 25 5" stroke="#ecfeff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M35 40c5-8 15-8 20 0" stroke="#ecfeff" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
    <path d="M40 70c5 5 15 5 18-2" stroke="#ecfeff" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// Dara - Nature druid (leaf)
const Dara: HeroIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="dara-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#15803d" />
        <stop offset="100%" stopColor="#22c55e" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#dara-bg)" />
    <path d="M50 25C35 25 25 40 25 55c0 10 8 18 25 20C50 60 40 45 50 25z" fill="#dcfce7" opacity="0.9" />
    <path d="M50 25c15 0 25 15 25 30 0 10-8 18-25 20C50 60 60 45 50 25z" fill="#bbf7d0" opacity="0.7" />
    <path d="M50 30v42" stroke="#15803d" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// Eris - Chaos mage (shattered star)
const Eris: HeroIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="eris-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#be123c" />
        <stop offset="100%" stopColor="#e11d48" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#eris-bg)" />
    <path d="M50 22l4 18 16-10-8 17 18 5-18 5 8 17-16-10-4 18-4-18-16 10 8-17-18-5 18-5-8-17 16 10z" fill="#ffe4e6" opacity="0.9" />
  </svg>
);

// Fenix - Phoenix fire bird (flame wings)
const Fenix: HeroIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="fenix-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ea580c" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#fenix-bg)" />
    <path d="M50 70C42 70 30 62 28 48c0 0 6 8 14 6-4-6-6-16 0-24 3 8 8 14 8 14s2-14 8-22c2 10 4 18 8 22 0 0 5-6 8-14 6 8 4 18 0 24 8 2 14-6 14-6C86 62 58 70 50 70z" fill="#fef3c7" opacity="0.9" />
    <ellipse cx="50" cy="68" rx="6" ry="3" fill="#ea580c" opacity="0.5" />
  </svg>
);

// Grim - Death knight (skull)
const Grim: HeroIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="grim-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#374151" />
        <stop offset="100%" stopColor="#4b5563" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#grim-bg)" />
    <path d="M50 25c-14 0-22 12-22 24 0 10 5 16 10 18v8h6v-6h4v6h4v-6h4v6h6v-8c5-2 10-8 10-18 0-12-8-24-22-24z" fill="#e5e7eb" opacity="0.9" />
    <ellipse cx="41" cy="47" rx="5" ry="6" fill="#374151" />
    <ellipse cx="59" cy="47" rx="5" ry="6" fill="#374151" />
    <path d="M44 60v5M50 60v5M56 60v5" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Hex - Witch/warlock (potion/cauldron)
const Hex: HeroIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="hex-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#hex-bg)" />
    <path d="M35 50h30l5 20c0 3-8 6-20 6s-20-3-20-6l5-20z" fill="#ede9fe" opacity="0.9" />
    <path d="M35 50c0-3 7-5 15-5s15 2 15 5" fill="#c4b5fd" />
    <circle cx="42" cy="38" r="4" fill="#ede9fe" opacity="0.5" />
    <circle cx="55" cy="33" r="3" fill="#ede9fe" opacity="0.4" />
    <circle cx="48" cy="28" r="2.5" fill="#ede9fe" opacity="0.3" />
  </svg>
);

// Iris - Light priestess (radiant eye)
const Iris: HeroIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="iris-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#iris-bg)" />
    <ellipse cx="50" cy="50" rx="24" ry="14" fill="#fef9c3" opacity="0.9" />
    <circle cx="50" cy="50" r="8" fill="#d97706" />
    <circle cx="50" cy="50" r="4" fill="#1c1917" />
    <circle cx="52" cy="48" r="1.5" fill="#fef9c3" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
      <line
        key={angle}
        x1={50 + Math.cos(angle * Math.PI / 180) * 18}
        y1={50 + Math.sin(angle * Math.PI / 180) * 18}
        x2={50 + Math.cos(angle * Math.PI / 180) * 24}
        y2={50 + Math.sin(angle * Math.PI / 180) * 24}
        stroke="#fef9c3"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    ))}
  </svg>
);

// Jyn - Rogue assassin (twin daggers)
const Jyn: HeroIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="jyn-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#jyn-bg)" />
    <path d="M38 28l-4 38 6-2 4-36z" fill="#e2e8f0" opacity="0.9" />
    <path d="M34 66l-4 4h12l-2-4z" fill="#94a3b8" />
    <path d="M62 28l4 38-6-2-4-36z" fill="#e2e8f0" opacity="0.9" />
    <path d="M66 66l4 4H58l2-4z" fill="#94a3b8" />
  </svg>
);

// Kai - Martial artist (fist)
const Kai: HeroIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="kai-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#kai-bg)" />
    <path d="M38 52V36c0-2 2-4 4-4s4 2 4 4v12h0V32c0-2 2-4 4-4s4 2 4 4v16h0V34c0-2 2-4 4-4s4 2 4 4v18h0V40c0-2 2-4 4-4s4 2 4 4v20c0 12-8 18-18 18h-2c-10 0-16-8-16-18V52c0-2 2-4 4-4s4 2 4 4z" fill="#fecaca" opacity="0.9" />
  </svg>
);

// Luna - Moon priestess (full moon)
const Luna: HeroIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="luna-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e1b4b" />
        <stop offset="100%" stopColor="#312e81" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#luna-bg)" />
    <circle cx="50" cy="45" r="18" fill="#e0e7ff" opacity="0.9" />
    <circle cx="44" cy="40" r="4" fill="#c7d2fe" opacity="0.5" />
    <circle cx="55" cy="48" r="3" fill="#c7d2fe" opacity="0.4" />
    <circle cx="48" cy="52" r="2" fill="#c7d2fe" opacity="0.3" />
    <path d="M25 72c5-3 10-2 15 0s10 3 15 0 10-2 15 0" stroke="#e0e7ff" strokeWidth="1.5" fill="none" opacity="0.4" />
    <path d="M20 78c5-3 10-2 15 0s10 3 15 0 10-2 15 0 10 3 15 0" stroke="#e0e7ff" strokeWidth="1.5" fill="none" opacity="0.25" />
  </svg>
);

// Mira - Mirror mage (diamond/reflection)
const Mira: HeroIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="mira-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0e7490" />
        <stop offset="100%" stopColor="#67e8f9" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#mira-bg)" />
    <path d="M50 24L72 50 50 76 28 50z" fill="#ecfeff" opacity="0.9" />
    <path d="M50 24L72 50 50 76z" fill="#a5f3fc" opacity="0.5" />
    <path d="M50 34L62 50 50 66 38 50z" fill="url(#mira-bg)" opacity="0.6" />
  </svg>
);

// Nyx - Shadow assassin (shadow cloak)
const Nyx: HeroIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="nyx-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#18181b" />
        <stop offset="100%" stopColor="#3f3f46" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#nyx-bg)" />
    <path d="M50 20C35 20 25 32 25 45c0 8 4 12 8 15l-8 20h50l-8-20c4-3 8-7 8-15 0-13-10-25-25-25z" fill="#52525b" opacity="0.8" />
    <ellipse cx="42" cy="42" rx="4" ry="3" fill="#a855f7" opacity="0.9" />
    <ellipse cx="58" cy="42" rx="4" ry="3" fill="#a855f7" opacity="0.9" />
  </svg>
);

// Orin - Holy paladin (sun/halo)
const Orin: HeroIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="orin-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#eab308" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#orin-bg)" />
    <circle cx="50" cy="48" r="16" fill="#fef9c3" opacity="0.9" />
    <circle cx="50" cy="48" r="10" fill="#fde047" opacity="0.8" />
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => (
      <line
        key={angle}
        x1={50 + Math.cos(angle * Math.PI / 180) * 20}
        y1={48 + Math.sin(angle * Math.PI / 180) * 20}
        x2={50 + Math.cos(angle * Math.PI / 180) * 27}
        y2={48 + Math.sin(angle * Math.PI / 180) * 27}
        stroke="#fef9c3"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
    ))}
  </svg>
);

// Pyre - Fire elemental (fireball)
const Pyre: HeroIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="pyre-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#991b1b" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#pyre-bg)" />
    <path d="M50 20c-5 15-18 20-18 35 0 12 8 22 18 22s18-10 18-22c0-15-13-20-18-35z" fill="#fca5a5" opacity="0.9" />
    <path d="M50 35c-3 10-10 14-10 24 0 7 4 13 10 13s10-6 10-13c0-10-7-14-10-24z" fill="#fef2f2" opacity="0.8" />
    <path d="M50 48c-2 6-5 8-5 14 0 4 2 7 5 7s5-3 5-7c0-6-3-8-5-14z" fill="#fde047" opacity="0.9" />
  </svg>
);

export const HERO_ICONS: Record<string, HeroIcon> = {
  aelara: Aelara,
  brom: Brom,
  cael: Cael,
  dara: Dara,
  eris: Eris,
  fenix: Fenix,
  grim: Grim,
  hex: Hex,
  iris: Iris,
  jyn: Jyn,
  kai: Kai,
  luna: Luna,
  mira: Mira,
  nyx: Nyx,
  orin: Orin,
  pyre: Pyre,
};
