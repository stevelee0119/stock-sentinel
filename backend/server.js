const express = require('express');
const cors = require('cors');
const YahooFinance = require('yahoo-finance2').default;

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const STOCKS = [
  { name: '삼성전자', symbol: '005930.KS' },
  { name: 'SK하이닉스', symbol: '000660.KS' },
  { name: '파두', symbol: '440110.KQ' },
  { name: '아이씨티케이', symbol: '456010.KQ' },
  { name: '레인보우로보틱스', symbol: '277810.KQ' },
];

app.get('/api/stocks', async (req, res) => {
  console.log(`[${new Date().toISOString()}] Fetching stock data...`);
  try {
    const results = await Promise.all(
      STOCKS.map(async (stock) => {
        try {
          // Fetch quote and chart in parallel for better performance
          const [quote, chartData] = await Promise.all([
            yahooFinance.quote(stock.symbol),
            yahooFinance.chart(stock.symbol, {
              period1: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
              period2: new Date(),
              interval: '1d',
            })
          ]);
          
          if (!quote || !chartData || !chartData.quotes) {
            console.warn(`[WARN] Incomplete data for ${stock.name} (${stock.symbol})`);
            return null;
          }

          return {
            name: stock.name,
            symbol: stock.symbol,
            price: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
            prevClose: quote.regularMarketPreviousClose,
            marketState: quote.marketState,
            history: chartData.quotes
              .filter(q => q.close !== undefined)
              .map(q => ({
                date: q.date.toISOString().split('T')[0],
                close: q.close
              }))
          };
        } catch (err) {
          console.error(`[ERROR] Failed to fetch ${stock.name} (${stock.symbol}):`, err.message);
          return null;
        }
      })
    );

    const filteredResults = results.filter(r => r !== null);
    
    if (filteredResults.length === 0) {
      return res.status(503).json({ error: 'All stock data requests failed' });
    }

    res.json(filteredResults);
  } catch (error) {
    console.error('[CRITICAL] General server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
