const base = (size) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
});

export const HomeIcon = ({ size = 20 }) => (
  <svg {...base(size)}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>
);

export const UserIcon = ({ size = 20 }) => (
  <svg {...base(size)}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" /></svg>
);

export const LogoutIcon = ({ size = 20 }) => (
  <svg {...base(size)}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>
);

export const HeartIcon = ({ size = 20, filled = false }) => (
  <svg {...base(size)} fill={filled ? 'currentColor' : 'none'}>
    <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 000-7.8z" />
  </svg>
);

export const CommentIcon = ({ size = 20 }) => (
  <svg {...base(size)}><path d="M21 12a8 8 0 01-11.6 7.1L3 21l1.9-6.4A8 8 0 1121 12z" /></svg>
);

export const TrashIcon = ({ size = 18 }) => (
  <svg {...base(size)}><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /></svg>
);

export const CloseIcon = ({ size = 16 }) => (
  <svg {...base(size)}><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>
);

export const SendIcon = ({ size = 18 }) => (
  <svg {...base(size)}><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>
);

export const SunIcon = ({ size = 20 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const MoonIcon = ({ size = 20 }) => (
  <svg {...base(size)}><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" /></svg>
);

export const SparkIcon = ({ size = 20 }) => (
  <svg {...base(size)}><path d="M12 3l2.2 6.3L21 12l-6.8 2.7L12 21l-2.2-6.3L3 12l6.8-2.7L12 3z" /></svg>
);