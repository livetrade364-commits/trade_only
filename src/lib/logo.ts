const LOGO_BASE_URL = 'https://img.logo.dev';
const PUBLISHABLE_KEY = import.meta.env.VITE_LOGODEV_KEY;

export const getLogoUrl = (website?: string, symbol?: string) => {
  if (website) {
    try {
      const domain = new URL(website.startsWith('http') ? website : `https://${website}`).hostname;
      return `${LOGO_BASE_URL}/${domain}?token=${PUBLISHABLE_KEY}`;
    } catch (e) {
      // Fallback
    }
  }
  
  // Enhanced fallback logic: Try to construct domain from symbol/name if website is missing
  if (symbol) {
    // Basic heuristic for common tickers
    const cleanSymbol = symbol.replace('^', '').toLowerCase();
    return `${LOGO_BASE_URL}/${cleanSymbol}.com?token=${PUBLISHABLE_KEY}`;
  }
  
  return null;
};
