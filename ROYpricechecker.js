const puppeteer = require("puppeteer");
const nodemailer = require('nodemailer');

(async () => {
  const link = 'ws://127.0.0.1:9222/devtools/browser/08e51d0b-97a7-4c91-9901-f46be53200a3';
  const browser = await puppeteer.connect({
      headless: true,
      defaultViewport: null,
      browserWSEndpoint: link,
  });

  const page = await browser.newPage();
  await page.goto(dexscreenerLink, { waitUntil: "networkidle2" })
  
  /* 
  Dexscreener Links
  Harmony: "https://dexscreener.com/harmony/0x7d183c0e2d2db4ff643218b2bc05626522f862a7"
  Polygon: "https://dexscreener.com/polygon/0x7b23afe559433aace4d61ed65e225a74094defcb"
  Avalanche: "https://dexscreener.com/avalanche/0x86783a149fe417831ae8c59dd0e2b60664a3dfd1"
  */
  
  await page.waitForXPath('//*[@id="root"]/div/main/div/div/div[2]/div/div/div[1]/div[1]/div[1]/span[2]/div/text()[2]');
  let [getPriceXPath] = await page.$x('//*[@id="root"]/div/main/div/div/div[2]/div/div/div[1]/div[1]/div[1]/span[2]/div/text()[2]');
  let price = await page.evaluate(getPriceXPath => getPriceXPath.textContent, getPriceXPath);

  while (price < 0.025) {
    await page.waitForTimeout(3000)
    await page.waitForXPath('//*[@id="root"]/div/main/div/div/div[2]/div/div/div[1]/div[1]/div[1]/span[2]/div/text()[2]');
    let [getPriceXPath] = await page.$x('//*[@id="root"]/div/main/div/div/div[2]/div/div/div[1]/div[1]/div[1]/span[2]/div/text()[2]');
    price = await page.evaluate(getPriceXPath => getPriceXPath.textContent, getPriceXPath);
  }

  sendMail()

})();

async function sendMail() {
  try {
    const transport = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: 'profanityfilter1@hotmail.com', // I'm reusing my profanity-filtering bot's email
        pass: // hotmail password here
      }
    })

    const mailOptions = {
      from: '"Price Checker" <profanityfilter1@hotmail.com>',
      to: 'profanityfilter1@hotmail.com',
      subject: 'ROY Price',
      text: 'Sell!'
    };

    await transport.sendMail(mailOptions);

  } catch (error) {
    console.error(error);
  }
}
