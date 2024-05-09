import { localStorage } from "./utils";
import { input } from "@inquirer/prompts";
import { validateDayOrder } from "./utils/validate";
import { DayOrderType } from "./types/LocalStorage";
import { automate as startAutomation } from "./automate";

(async () => {
  let dayOrder = localStorage.getItem("dayOrder") as DayOrderType;

  if (!dayOrder) {
    console.log();
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

  startAutomation();
})();
