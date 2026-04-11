const PLACEHOLDER_BG = '#2F5F73';
const PLACEHOLDER_FG = '#FFFFFF';
const MAX_LABEL_LENGTH = 42;

function normalizeLabel(rawLabel: string): string {
  if (!rawLabel) return 'Produto';
  const trimmed = rawLabel.replace(/\s+/g, ' ').trim();
  if (!trimmed) return 'Produto';
  return trimmed.slice(0, MAX_LABEL_LENGTH);
}

export function getFallbackImageDataUrl(label: string): string {
  const safeLabel = normalizeLabel(label);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" role="img" aria-label="Imagem indisponível"><rect width="400" height="300" fill="${PLACEHOLDER_BG}"/><text x="50%" y="50%" fill="${PLACEHOLDER_FG}" font-family="Montserrat, Arial, sans-serif" font-size="20" text-anchor="middle" dominant-baseline="middle">${safeLabel}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}