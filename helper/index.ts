import MailSlurp from "mailslurp-client";
import { Page } from "puppeteer";
import { setTimeout } from "timers/promises";

interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  country: string;
  inboxId: string;
  category: string;
  special_skill: string;
  company: string;
  university: string;
  bio: string;
  hourly: string;
  address: string;
  city: string;
  birthday: string;
  number: string;
}

export const randomDelay = (min: number, max: number) => {
  return setTimeout(Math.floor(Math.random() * (max - min + 1)) + min);
};

export async function clickBtn(page: Page, selector: string) {
  try {
    await page.waitForSelector(selector);
    await page.click(selector);
    await randomDelay(800, 1000);
  } catch (error) {
    console.log(error);
  }
}

export async function typeInput(page: Page, selector: string, value: string) {
  try {
    await page.waitForSelector(selector);
    await page.type(selector, value, { delay: 50 });
    await randomDelay(200, 300);
  } catch (error) {
    console.log(error);
  }
}

export async function signUpForm(page: Page, user: IUser) {
  try {
    await randomDelay(1000, 2000);
    await page.click("#checkbox-terms > span.air3-checkbox-fake-input");
    await randomDelay(800, 1000);
    await typeInput(page, 'input[id="first-name-input"]', user.first_name);
    await randomDelay(800, 1000);
    await typeInput(page, 'input[id="last-name-input"]', user.last_name);
    await randomDelay(800, 1000);
    await typeInput(page, 'input[type="email"]', user.email);
    await randomDelay(800, 1000);
    await typeInput(page, 'input[id="password-input"]', user.password);
    await randomDelay(800, 1000);

    await page.click('div[aria-labelledby="select-a-country"]');
    await page.waitForSelector('input[type="search"]');

    await page.type('input[type="search"]', user.country, {
      delay: 20,
    });

    await randomDelay(800, 1000);

    // Pick the first result from the dropdown
    await page.evaluate(() => {
      const firstResult = document.querySelector("li.air3-menu-item");
      if (firstResult instanceof HTMLElement) {
        firstResult.click();
      } else {
        console.error("No search country found");
      }
    });

    await randomDelay(1000, 2000);
    await page.click('button[id="button-submit-form"]');
    await page.click('button[id="button-submit-form"]');
    await randomDelay(1000, 2000);
  } catch (error) {
    console.log(error);
  }
}

export async function launchBrowser(puppeteer: any, options = {}) {
  return await puppeteer.launch({
    headless: false,
    ...options,
  });
}

export async function fetchingTokenVerify(
  apiKey: string,
  inboxId: string
): Promise<string | null> {
  try {
    if (!apiKey) throw new Error("MAILSLURP_API is not defined");
    const mailslurp = new MailSlurp({ apiKey: apiKey });

    const verifyEmailRegex =
      /(?:href=\\?"|<a href=")?(https:\/\/www\.upwork\.com\/nx\/(?:signup\/)?verify-email\/token\/[^"\\>]+)/;
    const lastMail = await mailslurp.waitForLatestEmail(inboxId);

    const matchToken = lastMail.body?.match(verifyEmailRegex);
    const verifyTokenValid = matchToken ? matchToken[1] : null;
    return verifyTokenValid;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function generateUpworkSafeUserAgent(): string {
  const chromeVersions = ["119.0.0.0", "120.0.0.0", "121.0.0.0"];
  const osVersions = ["10.15.7", "11.0", "12.0.1"];
  const safariVersions = ["537.36"];

  // Focus on MacOS and Windows as they're most common for freelancers
  const platforms = [
    {
      name: "Macintosh",
      format: (chromeVer: string, osVer: string, safari: string) =>
        `Mozilla/5.0 (Macintosh; Intel Mac OS X ${osVer.replace(
          /\./g,
          "_"
        )}) AppleWebKit/${safari} (KHTML, like Gecko) Chrome/${chromeVer} Safari/${safari}`,
    },
    // {
    //   name: "Windows",
    //   format: (chromeVer: string, _: string, safari: string) =>
    //     `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/${safari} (KHTML, like Gecko) Chrome/${chromeVer} Safari/${safari}`,
    // },
  ];

  const randomPlatform =
    platforms[Math.floor(Math.random() * platforms.length)];
  const randomChrome =
    chromeVersions[Math.floor(Math.random() * chromeVersions.length)];
  const randomOS = osVersions[Math.floor(Math.random() * osVersions.length)];
  const randomSafari =
    safariVersions[Math.floor(Math.random() * safariVersions.length)];

  return randomPlatform.format(randomChrome, randomOS, randomSafari);
}

export async function welcomeSteps(accountPage: Page) {
  try {
    // WELCOME STEPS
    const nextButton = 'button[data-test="next-button"]';

    await accountPage.waitForSelector(
      'button[data-ev-label="get_started_btn"]'
    );
    await accountPage.click('button[data-ev-label="get_started_btn"]');
    await randomDelay(500, 1000);

    // 1/3 steps
    await accountPage.waitForSelector('input[value="FREELANCED_BEFORE"]');
    await accountPage.click('input[value="FREELANCED_BEFORE"]');
    await randomDelay(500, 1000);
    await accountPage.click(nextButton);
    await randomDelay(1000, 2000);

    // 2/3 steps
    await accountPage.waitForSelector('input[value="EXPLORING"]');
    await accountPage.click('input[value="EXPLORING"]');
    await randomDelay(500, 1000);
    await accountPage.click(nextButton);
    await randomDelay(1000, 2000);

    // 3/3 steps
    await accountPage.waitForSelector('input[aria-labelledby="button-box-21"]');
    await accountPage.click('input[aria-labelledby="button-box-21"]');
    await randomDelay(500, 1000);
    await accountPage.click(nextButton);
    await randomDelay(1000, 2000);
  } catch (error) {
    console.log(error);
  }
}

export async function cekCookies(accountPage: Page) {
  await randomDelay(5000, 6000);
  await accountPage.waitForSelector("button#onetrust-accept-btn-handler");
  await randomDelay(500, 1000);
  await accountPage.click("button#onetrust-accept-btn-handler");
  await randomDelay(1000, 2000);
}

export async function clickBtnProfile(page: Page, selector: string) {
  await page.waitForSelector(selector);
  await page.click(selector);
  await randomDelay(1000, 2000);
}

export async function typeInputProfile(
  page: Page,
  selector: string,
  user: string
) {
  await page.waitForSelector(selector);
  await page.focus(selector);
  await randomDelay(500, 700);
  await page.type(selector, user, { delay: 100 });
  await randomDelay(500, 700);
}

export async function nextBtn(page: Page) {
  await page.click('button[data-test="next-button"]');
  await randomDelay(1000, 2000);
}

export async function addProfile(accountPage: Page, user: IUser) {
  try {
    const nextButton = 'button[data-test="next-button"]';

    // 1/10
    await clickBtn(
      accountPage,
      'button[data-ev-label="resume_fill_manually_btn"]'
    );

    // 2/10
    const categoriesSkill = await accountPage.$$("ul.categories li a");
    for (const category of categoriesSkill) {
      const text = await category.evaluate((el) =>
        el.textContent?.trim().toLowerCase()
      );
      if (text === user.category.toLowerCase()) {
        await category.click();
        await randomDelay(1000, 2000);
        break;
      }
    }
    // await accountPage.waitForSelector("div.specialties");

    await randomDelay(1000, 2000);
    // Use label elements instead of input directly
    const specialistSkills = await accountPage.$$(
      'label[data-test="checkbox-label"]'
    );

    for (const special of specialistSkills) {
      // Get text from the label
      const specialText = await special.evaluate((element) => {
        // Get the text content excluding the hidden SVG content
        const text = element.textContent || "";
        return text.trim().toLowerCase();
      });

      console.log("Found skill:", specialText); // Debug log

      if (specialText === user.special_skill.toLowerCase()) {
        // Click the label, which will toggle the checkbox
        await special.click();
        console.log("Clicked skill:", specialText); // Debug log
        await randomDelay(1000, 2000);
        break;
      }
    }

    await randomDelay(2000, 3000);
    await nextBtn(accountPage);
    await randomDelay(2000, 3000);

    // 3/10
    // const additionalClicks = Math.floor(Math.random() * 2) + 1; // Random between 1-3
    const tokenSkillSet = await accountPage.$$(
      'div.token-container div[role="button"]'
    );
    // Click first token
    if (tokenSkillSet.length > 0) {
      await tokenSkillSet[0].click();
      await randomDelay(1000, 2000);
    }

    // Click second token
    if (tokenSkillSet.length > 1) {
      await tokenSkillSet[1].click();
      await randomDelay(1000, 2000);
    }
    await nextBtn(accountPage);
    await randomDelay(2000, 3000);

    // 4/10
    await typeInputProfile(
      accountPage,
      'input[aria-labelledby="title-label"]',
      user.special_skill
    );
    await nextBtn(accountPage);
    await randomDelay(1000, 2000);

    // 5/10
    await clickBtnProfile(accountPage, 'div[data-qa="employment"] a');
    // modal
    await accountPage.waitForSelector("div.air3-modal-content");
    await typeInputProfile(
      accountPage,
      'input[placeholder="Ex: Software Engineer"]',
      user.special_skill
    );
    await typeInputProfile(
      accountPage,
      'input[placeholder="Ex: Microsoft"]',
      user.company
    );
    await randomDelay(1000, 2000);
    // start-date
    // month
    await accountPage.click('div[aria-labelledby="start-date-month"]');
    await randomDelay(500, 700);
    await accountPage.keyboard.press("ArrowDown");
    await randomDelay(500, 700);
    await accountPage.keyboard.press("Enter");
    await randomDelay(500, 1000);
    // year
    await accountPage.click('div[aria-labelledby="start-date-year"]');
    // // ENHANCED WITH CUSTOM YEAR
    // // await randomDelay(500, 700)
    // // await accountPage.waitForSelector('input[type="search"]');
    // // await accountPage.focus('input[type="search"]')
    // // await randomDelay(500, 700)
    // // await accountPage.type('input[type="search"]', "2019", {
    // //   delay: 100,
    // // });
    await randomDelay(500, 700);
    await accountPage.keyboard.press("ArrowDown");
    await randomDelay(500, 700);
    await accountPage.keyboard.press("ArrowDown");
    await randomDelay(500, 700);
    await accountPage.keyboard.press("ArrowDown");
    await randomDelay(500, 700);
    await accountPage.keyboard.press("ArrowDown");
    await randomDelay(500, 700);
    await accountPage.keyboard.press("Enter");
    await randomDelay(500, 1000);

    // end-date
    // month
    await accountPage.click('div[aria-labelledby="end-date-month"]');
    await randomDelay(500, 700);
    await accountPage.keyboard.press("ArrowDown");
    await randomDelay(500, 700);
    await accountPage.keyboard.press("Enter");
    await randomDelay(500, 1000);
    // year
    await accountPage.click('div[aria-labelledby="end-date-year"]');
    // // ENHANCED WITH CUSTOM YEAR
    // // await randomDelay(500, 700)
    // // await accountPage.waitForSelector('input[type="search"]');
    // // await accountPage.focus('input[type="search"]')
    // // await randomDelay(500, 700)
    // // await accountPage.type('input[type="search"]', "2019", {
    // //   delay: 100,
    // // });
    await randomDelay(500, 700);
    await accountPage.keyboard.press("ArrowDown");
    await randomDelay(500, 700);
    await accountPage.keyboard.press("ArrowDown");
    await randomDelay(500, 700);
    await accountPage.keyboard.press("Enter");
    await randomDelay(500, 1000);

    // save
    await accountPage.click('button[data-qa="btn-save"]');
    await randomDelay(1000, 1500);
    await nextBtn(accountPage);
    await randomDelay(1000, 2000);

    // 6/10
    await clickBtnProfile(accountPage, 'div[data-qa="education"] a');
    // modal
    // univ
    await accountPage.waitForSelector("div.air3-modal-content");
    await typeInputProfile(
      accountPage,
      'input[placeholder="Ex: Northwestern University"]',
      user.university
    );
    await accountPage.keyboard.press("ArrowDown");
    await randomDelay(500, 700);
    await accountPage.keyboard.press("Enter");
    await randomDelay(500, 700);

    // save
    await accountPage.click('button[data-qa="btn-save"]');
    await randomDelay(1000, 1500);
    await nextBtn(accountPage);
    await randomDelay(2000, 3000);

    // 7/10
    await clickBtnProfile(
      accountPage,
      'div[aria-labelledby="dropdown-label-english"]'
    );
    for (let i = 0; i < 2; i++) {
      await accountPage.keyboard.press("ArrowDown");
      await randomDelay(500, 700);
    }
    await accountPage.keyboard.press("Enter");
    await randomDelay(1000, 1500);
    await nextBtn(accountPage);

    // 8/10
    await accountPage.waitForSelector(
      'textarea[aria-labelledby="overview-label"]'
    );
    await accountPage.type(
      'textarea[aria-labelledby="overview-label"]',
      user.bio
    );
    await randomDelay(1000, 1500);
    await nextBtn(accountPage);
    await randomDelay(1000, 2000);

    // 9/10
    await randomDelay(1000, 2000);
    await typeInputProfile(
      accountPage,
      // 'input[type="text"]',
      "div.air3-grid-container > div.span-md-5.span-8.d-flex.align-end.align-items-center.justify-content-end > div > div > div > div > input",
      user.hourly
    );
    await randomDelay(1000, 1500);
    await nextBtn(accountPage);
    await randomDelay(1000, 1500);

    // 10/10
    // acountry
    await clickBtnProfile(
      accountPage,
      'div.air3-dropdown-toggle[aria-labelledby="country-label"]'
    );
    await typeInputProfile(accountPage, 'input[type="search"]', user.country);
    await accountPage.keyboard.press("ArrowDown");
    await randomDelay(500, 700);
    await accountPage.keyboard.press("Enter");
    await randomDelay(1000, 1500);
    // address
    await typeInputProfile(
      accountPage,
      'input[aria-labelledby="street-label"]',
      user.address
    );
    // city
    await typeInputProfile(
      accountPage,
      'input[placeholder="Enter city"]',
      user.city
    );
    await accountPage.keyboard.press("ArrowDown");
    await randomDelay(500, 700);
    await accountPage.keyboard.press("Enter");
    await randomDelay(500, 700);
    // date
    await typeInputProfile(
      accountPage,
      'input[aria-labelledby="date-of-birth-label"]',
      user.birthday
    );
    await accountPage.click('input[aria-labelledby="date-of-birth-label"]');
    await randomDelay(500, 700);
    // phone
    await accountPage.focus('input[placeholder="Enter number"]');
    await randomDelay(500, 700);
    await accountPage.type('input[placeholder="Enter number"]', user.number);
    await randomDelay(500, 1000);

    // image
    await accountPage.click('button[data-qa="open-loader"]');
    const uploadImage = await accountPage.waitForSelector('input[type="file"]');
    await randomDelay(1000, 2000);
    await uploadImage?.uploadFile("./marsupilami.png");
    await randomDelay(5000, 6000);
    await accountPage.click('button[data-qa="btn-save"]');
    await randomDelay(5000, 6000);
    await accountPage.click(nextButton);
    await randomDelay(1000, 2000);

    // submit profile
    await accountPage.click('button[data-ev-label="submit_profile_top_btn"]');
    await randomDelay(8000, 10000);
  } catch (error) {
    console.log(error);
  }
}
