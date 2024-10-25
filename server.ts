import express, { Request, Response, NextFunction } from 'express';
import axios from 'axios';

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

function isValidUrl(url: string): boolean {
  try {
    new URL(url); // This checks if the URL is valid
    return true;
  } catch (e) {
    return false;
  }
}

app.get(
  '/api/scrape',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { url } = req.query;

      if (!url || typeof url !== 'string' || !isValidUrl(url)) {
        res.status(400).json({ error: 'A valid URL parameter is required' });
        return;
      }

      // Optionally, check if the URL belongs to a Shopify store (contains "shopify" in the domain)
      if (!url.includes('shopify')) {
        res
          .status(400)
          .json({ error: 'The URL must belong to a Shopify store' });
        return;
      }

      // Attempt to fetch the content of the URL to verify it's reachable
      try {
        await axios.get(url); // This will throw an error if the URL is not reachable
      } catch (err) {
        res.status(400).json({ error: 'The URL is not reachable' });
        return;
      }

      const result = await scrapeShopifyPage(url as string);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
