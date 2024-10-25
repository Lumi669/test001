// scraper.ts
import puppeteer from 'puppeteer';

const FIXED_SELECTOR = "form[action*='/cart/add'] button";

export async function getStylesFromUrl(
  url: string
): Promise<Array<Record<string, string>>> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Evaluate the styles of the selected elements using the fixed selector
    const stylesArray = await page.evaluate((sel) => {
      const buttons = document.querySelectorAll<HTMLButtonElement>(sel);
      const stylesList: Array<Record<string, string>> = [];

      buttons.forEach((button) => {
        const computedStyles = window.getComputedStyle(button);
        const stylesObject: Record<string, string> = {};

        for (let i = 0; i < computedStyles.length; i++) {
          const propName = computedStyles[i];
          stylesObject[propName] = computedStyles.getPropertyValue(propName);
        }

        stylesList.push(stylesObject);
      });

      return stylesList;
    }, FIXED_SELECTOR);

    return stylesArray;
  } catch (error) {
    console.error('Error fetching styles:', error);
    throw error;
  } finally {
    await browser.close();
  }
}
