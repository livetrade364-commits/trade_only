export const getLogoUrl = (website?: string, symbol?: string) => {
  const LOGO_DEV_PUBLIC_KEY = 'pk_BmKulLwASdauYisnhhi5Mg';
  
  // Clean symbol for indices (remove ^)
  const cleanSymbol = symbol ? symbol.replace('^', '').toLowerCase() : '';
  
  // Don't try to fetch logos for indices as they don't have websites/logos usually
  if (symbol && symbol.startsWith('^')) {
      return null;
  }

  if (website) {
    try {
      let hostname = new URL(website).hostname;
      hostname = hostname.replace(/^www\./, '');
      return `https://img.logo.dev/${hostname}?token=${LOGO_DEV_PUBLIC_KEY}`;
    } catch (e) {
      // invalid url
    }
  }
  
  if (cleanSymbol) {
      // Fallback with symbol assumption
      return `https://img.logo.dev/${cleanSymbol}.com?token=${LOGO_DEV_PUBLIC_KEY}`;
  }

  return null;
};
