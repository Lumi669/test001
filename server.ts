import express from 'express';
import scrapeShopifyPage from './scraper';

const app = express();
const port = 3000;

app.get('/api/scrape', async (req, res) => {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const result = await scrapeShopifyPage(url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape the page' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
