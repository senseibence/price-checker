const puppeteer = require("puppeteer");

(async () => {

  const link = 'ws://127.0.0.1:9222/devtools/browser/95add02f-4ed1-45e0-9f31-148dc1a61622';
  const browser = await puppeteer.connect({
      headless: true,
      defaultViewport: null,
      browserWSEndpoint: link,
  });

  const page = await browser.newPage();
  await page.goto("https://dexscreener.com/polygon/0x7b23afe559433aace4d61ed65e225a74094defcb", { waitUntil: "networkidle2" })
  await page.waitForXPath('//*[@id="root"]/div/main/div/div/div[2]/div/div/div[1]/div[1]/div[1]/span[2]/div/text()[2]');
  let [getPriceXPath] = await page.$x('//*[@id="root"]/div/main/div/div/div[2]/div/div/div[1]/div[1]/div[1]/span[2]/div/text()[2]');
  let price = await page.evaluate(getPriceXPath => getPriceXPath.textContent, getPriceXPath);

  while (price < 0.025) {
    await page.waitForTimeout(3000)
    await page.waitForXPath('//*[@id="root"]/div/main/div/div/div[2]/div/div/div[1]/div[1]/div[1]/span[2]/div/text()[2]');
    let [getPriceXPath] = await page.$x('//*[@id="root"]/div/main/div/div/div[2]/div/div/div[1]/div[1]/div[1]/span[2]/div/text()[2]');
    let price = await page.evaluate(getPriceXPath => getPriceXPath.textContent, getPriceXPath);
  }

  sendEmail(browser)

})();

async function sendEmail(browser) {

  const page2 = await browser.newPage();
  await page2.goto("https://mail.google.com/mail/u/0/#inbox", { waitUntil: "networkidle2" })

  await page2.waitForSelector('body > div:nth-child(20) > div.nH > div > div.nH.aqk.aql.bkL > div.aeN.WR.nH.oy8Mbf > div.aic > div > div');
  await page2.click('body > div:nth-child(20) > div.nH > div > div.nH.aqk.aql.bkL > div.aeN.WR.nH.oy8Mbf > div.aic > div > div');
  await page2.waitForTimeout(500)
  await page2.type("#\\:qd", "bence.lukacsy@gmail.com");
  await page2.type("#\\:pv", "ROY Price 2.5 cents");  
  await page2.waitForSelector("#\\:pl");
  await page2.click("#\\:pl");
  
  await browser.disconnect();
  console.log("Email Sent");
}
