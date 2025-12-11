const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDF() {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 1024 });
    
    // Navigate to localhost
    console.log('Loading CV from localhost:4200...');
    await page.goto('http://localhost:4200', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for content to render
    await page.waitForSelector('.cv-wrapper', { timeout: 10000 });
    
    // Hide the download button
    await page.evaluate(() => {
      const controls = document.querySelector('.controls');
      if (controls) controls.style.display = 'none';
    });
    
    // Get the full page height
    const bodyHeight = await page.evaluate(() => {
      return document.body.scrollHeight;
    });
    
    console.log('Generating PDF...');
    // Generate PDF with exact dimensions
    await page.pdf({
      path: 'Georgios_Vasilakis_CV.pdf',
      format: 'A4',
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      printBackground: true,
      scale: 1,
      displayHeaderFooter: false
    });
    
    await browser.close();
    console.log('✓ PDF generated successfully: Georgios_Vasilakis_CV.pdf');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
}

generatePDF();
