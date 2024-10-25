// import express, { Request, Response } from 'express';
// import { getStylesFromUrl } from './scraper';

// const app = express();
// const PORT = 3000;

// // API endpoint to fetch styles
// app.get('/api/scrape', async (req: Request, res: Response) => {
//   const { url } = req.query;

//   if (!url) {
//     res
//       .status(400)
//       .json({ error: 'Please provide the url as a query parameter.' });
//     return; // Ensure the function doesn't proceed further
//   }

//   try {
//     const styles = await getStylesFromUrl(url as string);
//     res.json(styles);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch styles.' });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
import express, { Request, Response } from 'express';
import { getStylesFromUrl } from './scraper';

const app = express();
const PORT = 3000;

// Function to transform the scraped styles dynamically
function formatStyles(stylesArray: Array<Record<string, string>>) {
  // Fonts information can be set based on the available font styles
  const fonts = [
    {
      family: stylesArray[0]?.['font-family'] || null,
      variants: stylesArray[0]?.['font-weight'] || null,
      letterSpacings: stylesArray[0]?.['letter-spacing'] || null,
      fontWeight: stylesArray[0]?.['font-weight'] || null,
      url: null, // Set as null or dynamically generate the URL if needed
    },
  ];

  // Primary button styles are built dynamically based on the available styles
  const primaryButton = Object.keys(stylesArray[0] || {}).reduce(
    (acc, styleKey) => {
      acc[styleKey] = stylesArray[0][styleKey] || null;
      return acc;
    },
    {} as Record<string, string | null>
  );

  return { fonts, primaryButton };
}

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
    const formattedResponse = formatStyles(styles);
    res.json(formattedResponse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch styles.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
