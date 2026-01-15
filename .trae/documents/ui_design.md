# UI/UX Design Documentation

## 1. Design System
- **Colors**:
    - Primary: Neutral base (Zinc/Slate).
    - Accents: Blue (for links/actions), Green (for positive change), Red (for negative change).
    - Background: Clean white/light gray or dark mode alternative.
- **Typography**:
    - Clean sans-serif font (Inter or system default).
    - Hierarchy:
        - H1: Page Titles (Stock Names).
        - H2: Section Headers (Charts, Stats).
        - Body: Standard text.
        - Caption: Timestamps, small labels.
- **Spacing**: Multiples of 4px (Tailwind standard).

## 2. Page Layouts

### 2.1 Dashboard (/)
- **Header**: Navigation bar (Logo, Search Bar, Watchlist Link).
- **Hero Section**: Market Overview (S&P 500, Nasdaq, Dow Jones summary cards).
- **Watchlist Section**: Grid or list of user's watched stocks with mini-charts (sparklines) if possible.
- **News Feed**: (Optional) Latest market news.

### 2.2 Stock Detail (/stock/:symbol)
- **Header**: Stock Name, Symbol, Current Price, Big Change Indicator (Green/Red).
- **Main Chart**: Interactive price chart (Line/Candlestick) with time period selectors (1D, 1W, 1M, etc.).
- **Key Statistics**: Grid layout showing Open, High, Low, Vol, Mkt Cap, PE, etc.
- **Company Info**: Brief description and sector/industry tags.

### 2.3 Market Overview (/market-overview)
- **Sectors Grid**: Cards showing different sectors and their performance.
- **Industries List**: Drill down into industries.

### 2.4 Search Results (/search)
- **List View**: Results matching the query with Symbol, Name, and Exchange.

## 3. Components
- **Navbar**: Sticky top navigation.
- **StockCard**: Summary card for a stock.
- **ChartComponent**: Reusable chart wrapper (using Recharts or similar).
- **StatBox**: Simple box for displaying a single metric.
- **Layout**: Main layout wrapper.
