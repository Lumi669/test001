import axios from 'axios';
import cheerio from 'cheerio';

interface FontStyle {
  family: string;
  variants: string;
  letterSpacings: string;
  fontWeight: string;
  url: string;
}

interface ButtonStyle {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  textTransform: string;
  textDecoration: string;
  textAlign: string;
  backgroundColor: string;
  color: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
}

interface ScraperResponse {
  fonts: FontStyle[];
  primaryButton: ButtonStyle;
}

async function scrapeShopifyPage(url: string): Promise<ScraperResponse> {
  try {
    // Fetch the page content
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    // Detect font styles
    const fonts: FontStyle[] = [];
    $('link[rel="stylesheet"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('fonts.googleapis.com')) {
        const url = href;
        const fontFamilyMatch = /family=([^:]+)/.exec(href);
        const fontWeightMatch = /wght@(\d+)/.exec(href);
        fonts.push({
          family: fontFamilyMatch ? fontFamilyMatch[1] : '',
          variants: fontWeightMatch ? fontWeightMatch[1] : '',
          letterSpacings: '0.01em', // Default value; you can extract more dynamically if needed
          fontWeight: fontWeightMatch ? fontWeightMatch[1] : '',
          url,
        });
      }
    });

    // Detect button styles
    const buttonStyles = $('form[action*="/cart/add"] button').first().css();
    const primaryButton: ButtonStyle = {
      fontFamily: buttonStyles['font-family'] || 'inherit',
      fontSize: buttonStyles['font-size'] || 'inherit',
      lineHeight: buttonStyles['line-height'] || 'normal',
      letterSpacing: buttonStyles['letter-spacing'] || 'normal',
      textTransform: buttonStyles['text-transform'] || 'none',
      textDecoration: buttonStyles['text-decoration'] || 'none',
      textAlign: buttonStyles['text-align'] || 'left',
      backgroundColor: buttonStyles['background-color'] || 'transparent',
      color: buttonStyles['color'] || '#000',
      borderColor: buttonStyles['border-color'] || 'transparent',
      borderWidth: buttonStyles['border-width'] || '0px',
      borderRadius: buttonStyles['border-radius'] || '0px',
    };

    return { fonts, primaryButton };
  } catch (error) {
    console.error('Error scraping the page:', error);
    throw error;
  }
}

export default scrapeShopifyPage;
