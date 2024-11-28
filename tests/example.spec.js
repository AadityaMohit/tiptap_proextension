import { test, expect, chromium } from '@playwright/test';

test('should enter text into Tiptap editor in Chromium and detect update', async () => {
  const browser = await chromium.launch({ headless: false }); 
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:3000');  
  const editor = page.locator('.ProseMirror');
  await editor.waitFor();
  await editor.click();

   for (let i = 1; i <= 5; i++) {
    const text = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi impedit consequuntur laborum quia nemo commodi, illo, perferendis optio, vero possimus quidem? Nisi nobis libero amet, tenetur harum provident  - ${i}`;
    console.log(`Typing: ${text}`);
    await editor.type(text);
    await editor.press('Enter');  
  }

  

   

 });
