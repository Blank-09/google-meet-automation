import { sleep } from "../utils";
import { Page } from "puppeteer-core";

async function addToggleVideoShortcut(page: Page) {
  // Click on the Ellipsis button
  await page.waitForSelector('[data-promo-anchor-id="aGHX8e"]');
  await page.click('[data-promo-anchor-id="aGHX8e"]');

  // Setting btn
  await page.waitForSelector('[jsname="dq27Te"]');
  await page.click('[jsname="dq27Te"]');

  // Wait for model to appear
  await page.waitForSelector('[jsname="SKJcrd"]');

  await sleep(1000);

  await page.evaluate(() => {
    document.querySelector<HTMLLIElement>('[jsname="SKJcrd"]')!.parentElement?.remove();
    document.body.appendChild(document.querySelectorAll(".HfXvjb")[0]);
    document.querySelector<HTMLButtonElement>('[data-mdc-dialog-action="close"]')!.click();
    document.querySelector<HTMLElement>(".HfXvjb")!.style.display = "none";

    let isVideoOn = document.querySelector<HTMLLIElement>('li[aria-label="Audio only"]')!.ariaSelected == "false";
    document.onkeydown = (e) => {
      if (e.altKey && e.key == "h") {
        isVideoOn
          ? document.querySelector<HTMLLIElement>('li[aria-label="Audio only"]')!.click()
          : document
              .querySelector<HTMLLIElement>('li[aria-label="Standard definition (360p), one video at a time"]')!
              .click();
        isVideoOn = !isVideoOn;
      }
    };
  });
}

export { addToggleVideoShortcut };
