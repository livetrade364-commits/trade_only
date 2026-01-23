export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  const localeMap: Record<string, string> = {
    'USD': 'en-US',
    'INR': 'en-IN',
    'EUR': 'de-DE',
    'GBP': 'en-GB',
    // Add more as needed
  };

  const locale = localeMap[currency] || 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
