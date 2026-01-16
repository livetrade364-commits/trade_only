export const getLogoUrl = (website?: string, symbol?: string) => {
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
      return `https://logo.clearbit.com/${hostname}`;
    } catch (e) {
      // invalid url
    }
  }
  
  if (cleanSymbol) {
      // Fallback with symbol assumption
      return `https://logo.clearbit.com/${cleanSymbol}.com`;
  }

  return null;
};
