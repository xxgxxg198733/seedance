import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const { name, url } of [
  { name: 'pricing', url: 'http://localhost:3000/pricing' },
  { name: 'landing', url: 'http://localhost:3000' },
  { name: 'agent', url: 'http://localhost:3000/agent' },
  { name: 'video', url: 'http://localhost:3000/video' },
  { name: 'image', url: 'http://localhost:3000/image' },
]) {
  console.log(`📸 ${name}...`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(500);
  await page.screenshot({ path: `/tmp/${name}.png`, fullPage: name === 'pricing' || name === 'landing' });
}
await browser.close();
console.log('Done');
