import path from "path";
import dotenv from "dotenv";

import meetingLinks from "../../data/meet_links.json";

dotenv.config();

export const isDev = process.env.NODE_ENV !== "production";
export const CSV_PATH = path.join(__dirname, "../../data/schedule/schedule.csv");

// @ts-ignore - This is a hack to make TypeScript happy
export const MEET_LINKS = meetingLinks;
export const LOCAL_STORAGE_PATH = path.join(__dirname, "../../.localstorage");

export const EXECUTABLE_PATH = process.env.BROWSER_PATH;
export const USER_DATA_DIR = process.env.USER_DATA_DIR;
export const PROFILE_DIRECTORY = process.env.PROFILE_DIRECTORY;
