const express = require('express');
const cors = require('cors');
const YahooFinance = require('yahoo-finance2').default;

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const STOCKS = [
  { name: '삼성전자', symbol: '005930.KS' },
  { name: 'SK하이닉스', symbol: '000660.KS' },
  { name: '파두', symbol: '440110.KQ' },
  { name: '아이씨티케이', symbol: '456010.KQ' },
  { name: '레인보우로보틱스', symbol: '277810.KQ' },
];

app.get('/api/stocks', async (req, res) => {
  try {
    const results = await Promise.all(
      STOCKS.map(async (stock) => {
        try {
          const quote = await yahooFinance.quote(stock.symbol);
          
          const end = new Date();
          const start = new Date();
          start.setDate(end.getDate() - 10); // 조금 더 넉넉하게 10일치
          
          const chartData = await yahooFinance.chart(stock.symbol, {
            period1: start,
            period2: end,
            interval: '1d',
          });

          if (!quote || !chartData || !chartData.quotes) return null;

          return {
            name: stock.name,
            symbol: stock.symbol,
            price: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
            prevClose: quote.regularMarketPreviousClose,
            history: chartData.quotes
              .filter(q => q.close !== undefined)
              .map(q => ({
                date: q.date.toISOString().split('T')[0],
                close: q.close
              }))
          };
        } catch (err) {
          console.error(`Error fetching ${stock.name} (${stock.symbol}):`, err.message);
          return null;
        }
      })
    );

    // Filter out stocks that failed to fetch
    const filteredResults = results.filter(r => r !== null);
    res.json(filteredResults);
  } catch (error) {
    console.error('General server error:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
