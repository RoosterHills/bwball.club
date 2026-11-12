const HEX = /^#[0-9a-fA-F]{6}$/;

const clean = (value, fallback) => {
  const raw = String(value ?? "").trim();
  if (!raw) return fallback;
  const hex = raw.startsWith("#") ? raw : `#${raw}`;
  return HEX.test(hex) ? hex : fallback;
};

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

const luminance = (hex) => {
  const [r, g, b] = rgb(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};

export const brandFor = (team, brands = []) => {
  if (!team?.brand) return null;
  return brands.find((b) => b.id === team.brand) || null;
};

export const brandPrimary = (brand) => clean(brand?.primary_color, "#0b0b0c");

export const brandAccent = (brand) => clean(brand?.accent_color, "#c9a227");

export const brandBackground = (brand) => clean(brand?.background_color, "#f7f5f0");

// True when the primary band needs light (white) text on top of it.
export const usesLightText = (brand) => luminance(brandPrimary(brand)) < 0.62;

export function brandVars(brand) {
  const primary = brandPrimary(brand);
  return {
    "--brand-primary": primary,
    "--brand-on-primary": clean(brand?.text_color, usesLightText(brand) ? "#ffffff" : "#12161c"),
    "--brand-accent": brandAccent(brand),
    "--brand-secondary": clean(brand?.secondary_color, brandBackground(brand)),
    "--brand-bg": brandBackground(brand),
  };
}

export const brandFont = (brand) => brand?.font_pairing || "athletic";

export const brandLogo = (brand) => brand?.logo || "";

export const brandBanner = (brand) => brand?.banner_image || "";