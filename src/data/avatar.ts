const PALETTE = [
  { bg: '#073763', text: '#FFFBEE' },
  { bg: '#C4762B', text: '#FFFBEE' },
  { bg: '#7D8B6E', text: '#FFFBEE' },
  { bg: '#8B6E7D', text: '#FFFBEE' },
  { bg: '#6E7D8B', text: '#FFFBEE' },
  { bg: '#A67B5B', text: '#FFFBEE' },
  { bg: '#5B7BA6', text: '#FFFBEE' },
  { bg: '#7B5BA6', text: '#FFFBEE' },
  { bg: '#5BA67B', text: '#FFFBEE' },
  { bg: '#8B7D6E', text: '#FFFBEE' },
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function getAvatarColor(name: string): { bg: string; text: string } {
  return PALETTE[hashName(name) % PALETTE.length];
}
