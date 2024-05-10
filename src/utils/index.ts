import readline from "readline";

import { CSVData } from "./csv";
import { parse } from "date-format-parse";
import { LOCAL_STORAGE_PATH, MEET_LINKS } from "../constants";
import { MeetLinks, SubjectCode } from "@/types/LocalStorage";
import { JSONStorage } from "node-localstorage";

type NextClass =
  | {
      status: "ongoing" | "upcoming";
      class: MeetLinks[SubjectCode];
      start: Date;
      end: Date;
      timeLeft: number;
    }
  | {
      status: "done";
      message: string;
    };

async function findMyNextClass(csv_data: CSVData): Promise<NextClass> {
  const now = new Date();
  const dayOrder = localStorage.getItem("dayOrder").dayOrder as number;

  // Assuming the first day of the week is Sunday and represented by 0 in the timetable array
  const todayClasses = csv_data.timetable[dayOrder - 1];

  for (let i = 0; i < csv_data.schedule.length; i++) {
    const [start, end] = csv_data.schedule[i]
      .split(" - ")
      .map((time) => parse(time, "H:mm", { backupDate: new Date() }));

    if (now >= start && now <= end) {
      return {
        status: "ongoing",
        class: MEET_LINKS[todayClasses[i] as SubjectCode],
        start: start,
        end: end,
        timeLeft: (end.getTime() - now.getTime()) / 1000,
      };
    }

    if (now < start) {
      return {
        status: "upcoming",
        class: MEET_LINKS[todayClasses[i] as SubjectCode],
        start: start,
        end: end,
        timeLeft: (start.getTime() - now.getTime()) / 1000,
      };
    }
  }

  // If there are no more classes for the day
  return { status: "done", message: "🎉 You are done for today!" };
}

export function printClassTimeTable(csv_data: CSVData) {
  console.log("📅 Class Time Table");
  const { schedule, timetable, ...table } = csv_data;
  const obj = {};
  const keys = Object.keys(table);

  for (var i = 0; i < keys.length; i++) {
    // @ts-ignore
    obj["Day order " + (+keys[i] + 1)] = table[keys[i]];
  }
  console.table(obj);
}

function exitOnKeypress() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Press `enter` to exit");

  rl.on("line", () => {
    rl.close();
    process.exit(0);
  });

  rl.on("SIGINT", () => {
    rl.close();
    process.exit(0);
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const localStorage = new JSONStorage(LOCAL_STORAGE_PATH);

export { exitOnKeypress, findMyNextClass, localStorage, sleep };
