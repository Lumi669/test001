import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define your route handler with proper types
app.get(
  '/api/scrape',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { url } = req.query;

      if (!url || typeof url !== 'string') {
        res.status(400).json({ error: 'URL parameter is required' });
        return;
      }

      const result = await scrapeShopifyPage(url as string); // Ensure 'url' is a string
      res.json(result);
    } catch (error) {
      next(error); // Use the Express error handling middleware
    }
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
