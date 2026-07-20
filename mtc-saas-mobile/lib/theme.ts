// lib/theme.ts – shared design tokens, aligned to the MTC storefront design

export const colors = {
  ink: '#111827',
  navy: '#1c51a3',
  navyDark: '#0f2454',
  bg: '#f9fafb',
  surface: '#ffffff',
  border: '#e5e7eb',
  muted: '#6b7280',
  mutedLight: '#9ca3af',
  tint: '#eaf1fb',
  tintBorder: '#bcd3f0',
  danger: '#dc2626',
  dangerBg: '#fee2e2',
};

export const label = {
  fontSize: 12,
  fontWeight: '800' as const,
  letterSpacing: 1,
  textTransform: 'uppercase' as const,
  color: colors.navy,
};

export const display = {
  fontWeight: '900' as const,
  letterSpacing: 0.2,
  color: colors.ink,
};
