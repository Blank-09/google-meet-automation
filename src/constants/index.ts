import fs from "fs";
import path from "path";
import meetingLinks from "../../data/meet_links.json";

export const CSV_PATH = path.join(__dirname, "../../data/schedule/schedule.csv");

// @ts-ignore - This is a hack to make TypeScript happy
export const MEET_LINKS = meetingLinks;
export type MeetLinks = typeof MEET_LINKS;
export type SubjectCode = keyof MeetLinks;

export const LOCAL_STORAGE_PATH = path.join(__dirname, "../../.localstorage");
