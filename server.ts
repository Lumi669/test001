import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Example implementation of the scrapeShopifyPage function
async function scrapeShopifyPage(url: string): Promise<any> {
  // Perform scraping here and return the results.
  // For now, we'll return a placeholder response.
  return {
    fonts: [
      {
        family: 'Helvetica',
        variants: '400',
        letterSpacings: '0.01em',
        fontWeight: '400',
        url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
      },
    ],
    primaryButton: {
      fontFamily: 'Helvetica',
      fontSize: '16px',
      lineHeight: '1.5',
      letterSpacing: '0.01em',
      textTransform: 'uppercase',
      textDecoration: 'underline',
      textAlign: 'left',
      backgroundColor: '#000',
      color: '#fff',
      borderColor: '#000',
      borderWidth: '1px',
      borderRadius: '4px',
    },
  };
}

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

      const result = await scrapeShopifyPage(url as string); // Make sure 'url' is a string
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
