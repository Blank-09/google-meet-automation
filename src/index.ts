import puppeteer from "puppeteer-core";
import dotenv from "dotenv";

import { findMyNextClass, localStorage, printClassTimeTable } from "./utils";
import { parse_csv } from "./utils/csv";
import { CSV_PATH } from "./constants";
import { format } from "date-format-parse";
import { input } from "@inquirer/prompts";
import { validateDayOrder } from "./utils/validate";
import { DayOrderType } from "./types/LocalStorage";

dotenv.config();

const executablePath = process.env.BROWSER_PATH;
const userDataDir = process.env.USER_DATA_DIR;
const profileDirectory = process.env.PROFILE_DIRECTORY;

console.log("👾 config:", { executablePath, userDataDir, profileDirectory });

const csv_data = parse_csv(CSV_PATH);

async function loop() {
  console.log();
  printClassTimeTable(csv_data);

  const dayOrder = localStorage.getItem("dayOrder") as DayOrderType;
  console.log("\n📅 Today's Day Order is", dayOrder.dayOrder);

  const chalk = (await import("chalk")).default;
  const nextClass = await findMyNextClass(csv_data);
  console.log("\n🔔 Status:", nextClass, "\n");

  if (nextClass.status === "done") {
    console.log(nextClass.message);
    return;
  }

  console.log("⏩ Next class is", chalk.green("'" + nextClass.class.name + "'"));

  if (nextClass.status === "upcoming") {
    console.log("⏰ Waiting for the class to start at", chalk.yellow(format(nextClass.start, "h:mm A")));
    await sleep(nextClass.timeLeft * 1000);
    nextClass.timeLeft = (nextClass.end.getTime() - Date.now()) / 1000;
  }

  console.log("🎒 Joining class", chalk.green("'" + nextClass.class.name + "'"));

  const browser = await puppeteer.launch({
    executablePath: executablePath,
    userDataDir: userDataDir,
    ignoreDefaultArgs: ["--enable-automation"],
    args: [
      "--profile-directory=" + profileDirectory,
      "--start-fullscreen",
      "--autoplay-policy=no-user-gesture-required",
    ],
    headless: false,
  });

  const blankPage = (await browser.pages()).filter((page) => page.url() === "about:blank")[0];
  const page = await browser.newPage();

  await blankPage.close();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto(nextClass.class.meetLink);

  console.log("\n🚀 Opening the meeting in browser:\n");
  console.log(chalk.green("  ✔ ") + "Class name   :", chalk.green("'" + nextClass.class.name + "'"));
  console.log(chalk.green("  ✔ ") + "Meeting link :", chalk.cyan("'" + nextClass.class.meetLink) + "'");
  console.log(
    chalk.green("  ✔ ") + "Timing       :",
    chalk.yellow(format(nextClass.start, "h:mm A") + " - " + format(nextClass.end, "h:mm A"))
  );

  await page.waitForSelector('[data-promo-anchor-id="w5gBed"]');
  await page.click('[data-promo-anchor-id="hw0c9"]'); // Microphone button
  // await page.click('[data-promo-anchor-id="psRWwc"]'); // Video button

  await page.click('[data-promo-anchor-id="w5gBed"]'); // Join now button

  // TODO: Implement intraction with class

  await sleep(nextClass.timeLeft * 1000);
  await browser.close();

  console.log("\n🎉 Class is over!");
  console.log("👋 See you in the next class!");
  console.log("\n" + "-".repeat(50));
  loop();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  let dayOrder = localStorage.getItem("dayOrder") as DayOrderType;

  if (!dayOrder) {
    var order = await input({
      message: "Enter the day order (1-5):",
      validate: validateDayOrder,
    });

    dayOrder = {
      dayOrder: +order,
      lastUpdated: new Date().getTime(),
    };

    // Save the day order to local storage
    localStorage.setItem("dayOrder", dayOrder);
  }

  // Update the day order if it's a new day
  const now = new Date();
  const lastUpdated = new Date(dayOrder.lastUpdated);

  // If the day has changed increment the day order
  if (now.getDate() !== lastUpdated.getDate()) {
    dayOrder.dayOrder = (dayOrder.dayOrder % 5) + 1;
    dayOrder.lastUpdated = now.getTime();
    localStorage.setItem("dayOrder", dayOrder);
  }

  loop();
})();
