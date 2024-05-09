import { CSVData } from "./csv";
import { parse } from "date-format-parse";
import { LOCAL_STORAGE_PATH, MEET_LINKS, MeetLinks, SubjectCode } from "../constants";
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
  const dayOrder = 5;

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
  return { status: "done", message: "No more classes for the day" };
}

export function printClassTimeTable(csv_data: CSVData) {
  console.log("📅 Class Time Table");
  const { schedule, timetable, ...table } = csv_data;
  const obj = { ...table };
  const keys = Object.keys(table);

  for (var i = keys.length - 1; i >= 0; i--) {
    obj[+keys[i] + 1] = obj[+keys[i]];
  }

  delete obj["0"];

  console.table(obj);
}

const localStorage = new JSONStorage(LOCAL_STORAGE_PATH);

export { findMyNextClass, localStorage };
