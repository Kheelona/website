/* ──────────────────────────────────────────────────────────────────
   Kheelona Marketing UI Kit — primitive atoms.
   Loaded with <script type="text/babel" src="components.jsx">.
   ────────────────────────────────────────────────────────────────── */

// ── Brand wordmark (uses the PNG asset; falls back fine if missing)
function Logo({ size = 36 }) {
  return (
    <img
      src="../../assets/logo-wordmark.png"
      alt="Kheelona"
      style={{ height: size, display: 'block', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.18))' }}
    />
  );
}

// ── A single brand shape, tintable via the `color` prop
function Shape({ name, size = 80, color = '#EF762F', style }) {
  const url = `../../assets/shapes/${name}.svg`;
  return (
    <div
      style={{
        width: size,
        height: size,
        background: color,
        WebkitMaskImage: `url(${url})`,
        maskImage: `url(${url})`,
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        ...style,
      }}
    />
  );
}

// ── A character: shape body + eyes + mouth
// Variants are small bundled presets so callers don't have to think about geometry.
function Character({ shape = 'squircle', color = '#EF762F', mood = 'happy', size = 100, style }) {
  const moods = {
    happy: (
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
        <g transform="translate(20,28)"><circle cx="14" cy="14" r="14" fill="#fff"/><circle cx="14" cy="15" r="11" fill="#000"/><circle cx="22" cy="20" r="2" fill="#fff"/></g>
        <g transform="translate(52,28)"><circle cx="14" cy="14" r="14" fill="#fff"/><circle cx="14" cy="15" r="11" fill="#000"/><circle cx="22" cy="20" r="2" fill="#fff"/></g>
        <ellipse cx="50" cy="71" rx="11" ry="5" fill="#FF2A2A"/>
      </svg>
    ),
    curious: (
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
        <g transform="translate(22,32)"><circle cx="13" cy="13" r="11" fill="#fff"/><circle cx="13" cy="13" r="8" fill="#000"/></g>
        <g transform="translate(52,32)"><circle cx="13" cy="13" r="11" fill="#fff"/><circle cx="13" cy="13" r="8" fill="#000"/></g>
        <path d="M40 66 Q50 76 60 66" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    ooh: (
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
        <g transform="translate(22,28)"><circle cx="14" cy="14" r="12" fill="#fff"/><circle cx="14" cy="17" r="9" fill="#000"/></g>
        <g transform="translate(50,28)"><circle cx="14" cy="14" r="12" fill="#fff"/><circle cx="14" cy="17" r="9" fill="#000"/></g>
        <circle cx="50" cy="70" r="4" fill="#FF2A2A"/>
      </svg>
    ),
    giggle: (
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
        <g transform="translate(22,32)"><circle cx="13" cy="13" r="11" fill="#fff"/><circle cx="13" cy="13" r="8" fill="#000"/><circle cx="19" cy="18" r="2" fill="#fff"/></g>
        <g transform="translate(52,32)"><circle cx="13" cy="13" r="11" fill="#fff"/><circle cx="13" cy="13" r="8" fill="#000"/><circle cx="19" cy="18" r="2" fill="#fff"/></g>
        <path d="M37 65 Q50 78 63 65 Z" fill="#FF2A2A"/>
      </svg>
    ),
    sleepy: (
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
        <path d="M25 38 Q33 30 41 38" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
        <path d="M59 38 Q67 30 75 38" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
        <ellipse cx="50" cy="65" rx="10" ry="6" fill="#FF2A2A"/>
      </svg>
    ),
  };
  return (
    <div className="kh-char" style={{ width: size, height: size, position: 'relative', ...style }}>
      <Shape name={shape} color={color} size={size} style={{ position: 'absolute', inset: 0 }} />
      {moods[mood]}
    </div>
  );
}

// ── The orange "kheelona" pill marker that sits at the bottom of every brand page
function Marker({ children = 'kheelona', style }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 22px',
        background: 'var(--kh-orange)',
        border: '1.5px solid #fff',
        boxShadow: 'var(--kh-shadow)',
        borderRadius: 6,
        color: '#fff',
        fontFamily: 'var(--kh-font-display)',
        fontWeight: 700,
        letterSpacing: '0.02em',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ── Hand-drawn orange tick used under section titles
function Tick({ width = 100, style }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width,
        height: 8,
        background: 'var(--kh-orange)',
        borderRadius: 4,
        transform: 'rotate(2deg)',
        ...style,
      }}
    />
  );
}

// ── A clutter of 15%-opacity shapes pinned to a corner (the playmat)
function Cluster({ corner = 'tr', style }) {
  const tiles = [
    { shape: 'polygon', tint: 'var(--kh-blue-15)' },
    { shape: 'flower-3', tint: 'var(--kh-yellow-15)' },
    { shape: 'triangle-5', tint: 'var(--kh-purple-15)' },
    { shape: 'flower-4', tint: 'var(--kh-yellow-15)' },
    { shape: 'squircle', tint: 'var(--kh-teal-15)' },
    { shape: 'flower-5', tint: 'var(--kh-orange-15)' },
    { shape: 'flower-13', tint: 'var(--kh-blue-15)' },
    { shape: 'flower-3', tint: 'var(--kh-orange-15)' },
    { shape: 'polygon', tint: 'var(--kh-teal-15)' },
  ];
  // 3 cols × 3 rows
  const sz = 180;
  return (
    <div style={{ position: 'absolute', width: sz * 3, height: sz * 3, pointerEvents: 'none', ...style }}>
      {tiles.map((t, i) => {
        const r = Math.floor(i / 3), c = i % 3;
        return (
          <Shape
            key={i}
            name={t.shape}
            color={t.tint}
            size={sz}
            style={{ position: 'absolute', left: c * sz, top: r * sz }}
          />
        );
      })}
    </div>
  );
}

// ── Buttons
function Button({ children, variant = 'primary', size = 'md', onClick, type, style }) {
  const base = {
    fontFamily: 'var(--kh-font-text)',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    borderRadius: 999,
    transition: 'transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 220ms, box-shadow 220ms',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  };
  const sizes = {
    sm: { padding: '10px 18px', fontSize: 14 },
    md: { padding: '14px 28px', fontSize: 18 },
    lg: { padding: '18px 36px', fontSize: 22 },
  };
  const variants = {
    primary: { background: 'var(--kh-orange)', color: '#fff', boxShadow: 'var(--kh-shadow)', border: '2px solid #fff' },
    ghost: { background: 'transparent', color: 'var(--kh-ink)', border: '2px solid var(--kh-ink)' },
    light: { background: '#fff', color: 'var(--kh-ink)', border: '2px solid var(--kh-line)' },
  };
  return (
    <button type={type} onClick={onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

// ── A small icon-in-soft-tile badge used in feature rows
function IconBadge({ icon, color = 'var(--kh-orange-15)', iconColor = 'var(--kh-orange)' }) {
  return (
    <div style={{ width: 44, height: 44, borderRadius: 12, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <i data-lucide={icon} style={{ width: 22, height: 22, color: iconColor }}></i>
    </div>
  );
}

Object.assign(window, { Logo, Shape, Character, Marker, Tick, Cluster, Button, IconBadge });
