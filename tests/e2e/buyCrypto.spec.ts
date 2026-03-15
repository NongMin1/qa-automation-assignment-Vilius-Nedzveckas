import { test, expect } from "@playwright/test";
import { BasePage } from "../../pages/BasePage";
import { BuyCryptoPage } from "../../pages/BuyCryptoPage";

test.describe("buy crypto tests", () => {
  let basePage: BasePage;
  let buyCryptoPage: BuyCryptoPage;
  const btcAddress = process.env.DUMMY_BTC_ADDRESS || "";

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    basePage = new BasePage(page);
    buyCryptoPage = new BuyCryptoPage(page);
  });

  test.describe("Positive Test Cases", () => {
    test.fixme("should navigate to Checkout page with legacy Crypto key", async ({ page }) => {
      //DOES IT HELP? How to solve problem in GitHub Actions where the test gets stuck on walletconnect request?
      //TODO - headless and headed works locally. In CI it gets stuck on walletconnect request. https://pulse.walletconnect.org/e?projectId={someid} ends with Status code = 400.
      //Payload response: Bad Request - Missing origin header.
      //TODO maybe even it is not needed to setTimeout
      test.setTimeout(60000);
      const amount = "200";
      const crypto = "BTC";

      await basePage.clickBuyCrypto();
      await buyCryptoPage.waitForWidgetToBeReady();

      await buyCryptoPage.selectCrypto(crypto);
      await buyCryptoPage.enterMoneyAmount(amount);

      await test.step("Enter crypto address (Masked)", async () => {
        await buyCryptoPage.addressInput.evaluate((el) => (el.style.filter = "blur(10px)"));
        await buyCryptoPage.enterCryptoAddress(btcAddress);

        await test.info().attach("masked-address-screenshot", {
          body: await page.screenshot({ mask: [buyCryptoPage.addressInput] }),
          contentType: "image/png",
        });
      });

      await buyCryptoPage.clickContinue();

      await expect(page.locator(".loading-spinner")).toBeHidden({ timeout: 30000 });
      await expect(page).toHaveURL(/.*simplexcc\.com.*/, { timeout: 60000 });

      await expect(page.getByText("Credit/Debit card")).toBeVisible({ timeout: 15000 });
      await expect(page.getByText("Euro Bank Transfer")).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe("Negative Test Cases", () => {
    test("should display an error when entering an amount below the minimum limit", async ({}) => {
      await basePage.clickBuyCrypto();
      await buyCryptoPage.waitForWidgetToBeReady();
      await buyCryptoPage.enterMoneyAmount("1");
      await expect(buyCryptoPage.erroMessage).toContainText(/The Euro amount must be between/);
    });

    test("should display an error when entering an amount above the maximum limit", async ({}) => {
      await basePage.clickBuyCrypto();
      await buyCryptoPage.waitForWidgetToBeReady();
      await buyCryptoPage.enterMoneyAmount("200000");
      await expect(buyCryptoPage.erroMessage).toContainText(/The Euro amount must be between/);
    });

    test("should display an error when entering non-numeric characters in the amount field", async ({}) => {
      await basePage.clickBuyCrypto();
      await buyCryptoPage.waitForWidgetToBeReady();
      await buyCryptoPage.enterMoneyAmount("abc");
      await buyCryptoPage.clickContinue();
      await expect(buyCryptoPage.erroMessage).toContainText(/Please enter Euro amount/);
    });

    test("should display an error when entering non-numeric characters in the crypto amount field", async ({}) => {
      await basePage.clickBuyCrypto();
      await buyCryptoPage.waitForWidgetToBeReady();
      await buyCryptoPage.enterCryptoAmount("abc");
      await expect(buyCryptoPage.erroMessage).toContainText(/Please enter Bitcoin amount/);
    });

    //TODO add test for invalid crypto address - fails only on POST part
    //Payload: {"walletaddress":"asd","last_quote_response":{"user_id":"8dfd68a3-dd5e-420c-be3e-087540917d59","quote_id":"d0e63c2b-aa43-4182-ba40-47fb7b7f7829","digital_money":{"currency":"BTC","amount":0.00026796},"fiat_money":{"currency":"EUR","base_amount":17.44,"total_amount":26.16,"amount":26.16},"supported_digital_currencies":["1INCH","AAVE","ACT","ELF","AERO","AEVO","AIOZ","AKT","ACH","ALGO","AMP","ANKR","APE","APT","ARB","ARKM","FET","AUDIO","AVAX","AVAX-C","AXS-ERC20","BABYDOGE","BAT","BICO","BNB-SC","BNB","BTC","BCH","BSV","BMX","TAO","BTT","BAL","BONK","BOME","BRETT","CARAT","ADA","CSPR","MEW","TIA","CELO","CHZ","CRS","CVC","C98-SC","COMP","DAG","CVX","COQ","ATOM","COTI","CRO-ERC20","CRV","DAI","MANA","USDD-TRC20","DEGEN","DENT","DOGE","ELON","WIF","DRIFT","XEC","ENJ","ENA","ETH","ETH-BASE","ETH-OPTIMISM","ETH-ARBITRUM","ETC","ENS","FARTCOIN","FIL","NEIRO","FLOKI-SC","FLOW","FOGO","GALA","GMEE","GHX","GTC","GMX-ARBITRUM","GNO","GOAT","GLM","ONE","HFT","HBAR","HOT","HYPE","ICX","ILV","IMX","ICP","MIOTA","JTO","JUP","JST","KAITO","KAS","KAVA","KLV","KCS","KSM","KNC","LDO","LTC","LPT","LRC","ME","MNT","MEME","MOG","MON","GLMR","MORPHO","MOVE","MUBARAK","EGLD","SHELL","XNO","NEAR","NEO","CKB","NOT","MELANIA","TRUMP","ONDO","XCN","OP","ORDI","OSMO","CAKE","PYUSD","PNUT","PEPE","PERP","DOT","POL-ERC20","POL","POPCAT","PROM","PENGU","PYTH","QNT","RVN","RAY","RED","RENDER","XRP","RLUSD","RPL","SFP","SEI","SEI-EVM","SHIB","SKL","SOL","SOMI","SPX","SSV","STG","STRK","XLM","GMT-SC","IP","STRAX","SUI","SUNDOG","SUSHI","SYN","TLOS","TLOS-EVM","TLOS-SC","TLOS-ERC20","XAUT","USDT","USDT-TRC20","USDT-OPTIMISM","USDT-SOL","USDT-TON","USDT-SC","USDT-ARBITRUM","USDT-POL","XTZ","GRT","SAND","THETA","RUNE","TON","TRX","TRU","TWT","UOS-ERC20","UOS","UNI","USDC","USDC-XLM","USDC-SOL","USDC-BASE","USDC-SC","USDC-POL","USDC-SUI","VET","VIRTUAL","VINU-SC","WCT","WAXP","WOO","WLFI","WLD","XDB","XDC","XYO","YOSHI-ERC20","YOSHI-FTM","YOSHI-SC","ZIL","ZK"],"supported_fiat_currencies":["USD","CAD","JPY","GBP","ILS","KRW","PLN","CHF","NOK","DKK","SEK","AUD","ZAR","CZK","NZD","HUF","INR","UAH","HKD","MYR","NGN","SGD","TWD","BRL","MAD","RON","MXN","AED","VND","KZT","PHP","DOP","PEN","COP","MDL","QAR","GEL","UYU","CLP","CRC","NAD","AZN","EUR","SAR","LKR","BOB","CNY","ALL","ANG","BBD","BDT","BMD","BND","BWP","DJF","EGP","GHS","GTQ","TZS","UGX","XOF","KGS","MZN","BAM","MNT","AMD","KHR","KYD","PAB","PGK","PYG","KES","RSD","SOS","THB","MOP","MUR","ISK","JMD","MKD","BHD","IQD","JOD","KWD","OMR","TRY"],"fees":{"partner_fee":{"currency":"EUR","amount":"0.00"},"payment_fee":{"currency":"EUR","amount":"8.72"},"blockchain_fee":{"currency":"EUR","amount":"0.11"}},"txn_amount_limits":{"fiat":{"currency":"EUR","minimumAmount":"26.16","maximumAmount":"17440.8"},"crypto":{"currency":"BTC","minimumAmount":"0.00026795","maximumAmount":"0.22518082"}}},"referrer":"https://www.simplex.com/buy-crypto","abTests":{},"hostname":"https://buy.simplex.com/"}
    //  response: {"isAddressValid":false,"isTagValid":true}
  });
});
