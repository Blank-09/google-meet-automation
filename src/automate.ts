import puppeteer from "puppeteer-core";

import { CSV_PATH, EXECUTABLE_PATH, PROFILE_DIRECTORY, USER_DATA_DIR } from "./constants";
import { DayOrderType } from "./types/LocalStorage";
import { exitOnKeypress, findMyNextClass, localStorage, printClassTimeTable, sleep } from "./utils";
import { parse_csv } from "./utils/csv";
import { format } from "date-format-parse";

const csv_data = parse_csv(CSV_PATH);

console.log("👾 config:", {
  EXECUTABLE_PATH,
  USER_DATA_DIR,
  PROFILE_DIRECTORY,
});

async function automate() {
  console.log();
  printClassTimeTable(csv_data);

  const chalk = (await import("chalk")).default;
  const dayOrder = localStorage.getItem("dayOrder") as DayOrderType;
  const nextClass = await findMyNextClass(csv_data);

  console.log("\n📅 Today's Day Order is", dayOrder.dayOrder);
  console.log("\n🔔 Status:", nextClass, "\n");

  if (nextClass.status === "done") {
    console.log(nextClass.message);
    console.log("\n" + "-".repeat(50));
    exitOnKeypress();
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
    executablePath: EXECUTABLE_PATH,
    userDataDir: USER_DATA_DIR,
    ignoreDefaultArgs: ["--enable-automation"],
    args: [
      "--profile-directory=" + PROFILE_DIRECTORY,
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

  const hasNextClass = (await findMyNextClass(csv_data)).status !== "done";

  if (!hasNextClass) {
    console.log("🎉 You are done for today!");
    console.log("\n" + "-".repeat(50));
    exitOnKeypress();
    return;
  }

  console.log("👋 See you in the next class!");
  console.log("\n" + "-".repeat(50));

  automate();
}

export { automate };
