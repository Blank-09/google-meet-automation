import { MEET_LINKS } from "@/constants";

export type DayOrderType = {
  dayOrder: number;
  lastUpdated: number;
};

export type MeetLinks = typeof MEET_LINKS;
export type SubjectCode = keyof MeetLinks;
