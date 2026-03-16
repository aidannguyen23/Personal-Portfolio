// screenshot.js — Puppeteer screenshot utility for visual review
// Usage: node screenshot.js [url] [filename]
// Defaults: url = http://localhost:8080, filename = screenshot_<timestamp>.png

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const url = process.argv[2] || 'http://localhost:8080';
const name = process.argv[3] || `screenshot_${Date.now()}`;
const outputDir = path.join(__dirname, 'temp_screenshots');
const outputPath = path.join(outputDir, `${name}.png`);

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Desktop viewport
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });

  // Scroll through page to trigger reveal animations
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let y = 0;
      const step = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        y += step;
        if (y >= document.body.scrollHeight) {
          window.scrollTo(0, 0);
          clearInterval(timer);
          resolve();
        }
      }, 120);
    });
  });
  await new Promise(r => setTimeout(r, 600));

  // Full-page screenshot
  await page.screenshot({ path: outputPath, fullPage: true });
  console.log(`Screenshot saved: ${outputPath}`);

  // Also take a mobile viewport screenshot
  const mobilePath = path.join(outputDir, `${name}_mobile.png`);
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.screenshot({ path: mobilePath, fullPage: true });
  console.log(`Mobile screenshot saved: ${mobilePath}`);

  await browser.close();
})();
