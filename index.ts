import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
// import AdBlocker from "puppeteer-extra-plugin-adblocker";
import AnonymizeUAPluigin from "puppeteer-extra-plugin-anonymize-ua";
import * as dotenv from "dotenv";
import fs from "fs/promises";
import { Browser, Page } from "puppeteer";
import { users } from "./account.json";
import {
  addProfile,
  cekCookies,
  clickBtn,
  fetchingTokenVerify,
  generateUpworkSafeUserAgent,
  randomDelay,
  signUpForm,
  welcomeSteps,
} from "./helper";
import path from "path";

// puppeteer configuration
puppeteer.use(StealthPlugin());
// puppeteer.use(AdBlocker());
// puppeteer.use(AnonymizeUAPluigin());
dotenv.config();

// proxi implementation optional
// const username: string = process.env.USERNAME_PROXY || "";
// const password: string = process.env.PASSWORD_PROXY || "";
const mailslurpApi: string = process.env.MAILSLURP_API || "";

(async () => {
  try {
    // Generating each account
    for (let i = 0; i <= users.length; i++) {
      const user = users[i];

      // make user agent anonim
      const UA = AnonymizeUAPluigin({
        customFn: () =>
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        stripHeadless: true,
        makeWindows: true,
      });
      puppeteer.use(UA);

      // UPWORK PROCESS
      console.log(`\n=== PROCESSING CREATING ACCOUNT`);
      const upworkBrowser: Browser = await puppeteer.launch({
        headless: false,
        ignoreDefaultArgs: ["--enable-automation"],
        args: [
          // `--proxy-server=http://pr.oxylabs.io:7777`,
          `--start-maximized`,
          "--disable-automation",
          "--disable-blink-features=AutomationControlled",
        ],
      });

      // page configuration
      const useragent = generateUpworkSafeUserAgent();
      const page: Page = await upworkBrowser.newPage();
      // await page.setUserAgent(useragent);
      await page.setDefaultTimeout(20000);
      await page.setBypassCSP(true);

      // START PROCESS
      await page.goto("https://www.upwork.com/nx/signup/", {
        waitUntil: "domcontentloaded",
      });
      await randomDelay(1500, 2000);

      // SIGN UP as WORKER
      const freelancerSection = 'input[value="work"]';
      const btnApply = 'button[data-qa="btn-apply"]';
      await clickBtn(page, freelancerSection);
      await clickBtn(page, btnApply);
      await randomDelay(2000, 3000);

      // SIGN-UP FORM
      await page.setBypassCSP(true);
      await signUpForm(page, user);
      await randomDelay(4000, 5000);

      // MAILSLURP IMPLEMENTATION
      console.log(`=== FETCHING VERIFY TOKEN`);
      await randomDelay(1000, 2000);
      const token = await fetchingTokenVerify(mailslurpApi, user.inboxId);
      console.log("verify-token: ", token);

      // verificating token
      console.log(`=== REDIRECTING TO TOKEN VALID`);
      await page.goto("about:blank"); // Clear current page
      await randomDelay(3000, 5000);

      // open newpage to avoid account suspended
      // await page.close();

      // Visit token URL in same page
      await page.goto(token as string, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });
      await randomDelay(1000, 2000);

      /*
      
      // LOGIN AND CREATING PROFILES WITH COOKIES

      const cookiesData = JSON.parse(await fs.readFile('./cookies.json', "utf8"))
      const accountPage: Page = await upworkBrowser.newPage()
      // await accountPage.setUserAgent(useragent)
      await accountPage.setBypassCSP(true);

      if (cookiesData && Array.isArray(cookiesData)) {
      console.log('cookies found');

      // Format cookies with essential properties
        const formattedCookies = cookiesData.map(cookie => ({
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
          path: cookie.path,
          expires: cookie.expires > -1 ? cookie.expires : undefined,
          httpOnly: cookie.httpOnly,
          secure: cookie.secure
        }));

        // Set cookies
        const contextBrowser = upworkBrowser.defaultBrowserContext();
        await contextBrowser.setCookie(...formattedCookies);
        console.log('cookies set successfully');

        await accountPage.goto("https://www.upwork.com/ab/account-security/login")
        await randomDelay(3000, 4000)
      }else{
      console.log('cookie not found')
      await accountPage.goto("https://www.upwork.com/ab/account-security/login", {waitUntil: "domcontentloaded"})
      await randomDelay(3000, 4000)
      // username
      await accountPage.waitForSelector('input[id="login_username"]')
      await accountPage.focus('input[id="login_username"]')
      await accountPage.type('input[id="login_username"]', user.email, {delay: 200})
      await randomDelay(500, 1000)
      await accountPage.click('button[id="login_password_continue"]')
      await randomDelay(2000, 3000)
      // password
      await accountPage.waitForSelector('input[id="login_password"]')
      await accountPage.focus('input[id="login_password"]')
      await accountPage.type('input[id="login_password"]', user.password, {delay: 200})
      await randomDelay(500, 1000)
      await accountPage.click('button[id="login_control_continue"]')
      await randomDelay(5000, 8000)

      // END

      */

      // get cookies and save
      // SAVE COOKIES TO BE REUSABLE
      const contextBrowser = upworkBrowser.defaultBrowserContext();
      const cookies = await contextBrowser.cookies();

      try {
        await fs.writeFile(
          path.join(__dirname, "cookies.json"),
          JSON.stringify(cookies, null, 2)
        );
        console.log("cookie saved");
      } catch (error) {
        console.log("error saving cookie", error);
      }

      // }

      // WELCOME STEPS
      await cekCookies(page);
      await welcomeSteps(page);

      // PROFILE CREATING
      await addProfile(page, user);
      await upworkBrowser.close();
    }
  } catch (error) {
    console.log(error);
  }
})();
