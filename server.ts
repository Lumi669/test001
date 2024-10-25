import express, { Request, Response } from 'express';
import { getStylesFromUrl } from './scraper';

const app = express();
const PORT = 3000;

// API endpoint to fetch styles
app.get('/api/scrape', async (req: Request, res: Response) => {
  const { url } = req.query;

  if (!url) {
    res
      .status(400)
      .json({ error: 'Please provide the url as a query parameter.' });
    return; // Ensure the function doesn't proceed further
  }

  try {
    const styles = await getStylesFromUrl(url as string);
    res.json(styles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch styles.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
