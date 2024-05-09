import fs from "fs";

export type CSVData = Array<Record<string, string>> & {
  schedule: string[];
  timetable: string[][];
};

function parse_schedule_csv(csv_path: string) {
  const csv_data = fs.readFileSync(csv_path, { encoding: "utf-8" });

  const data = csv_data
    .split(/[\n\r]+/)
    .map((row: string) => row.split(","))
    .filter((row: string[]) => row.length > 1);

  // @ts-ignore - This is a hack to make TypeScript happy
  const result: CSVData = [];

  result.schedule = data[0].slice(1);
  result.timetable = [];

  for (let i = 1; i < data.length; i++) {
    const arr = [];
    const obj = {};
    for (let j = 1; j < data[i].length; j++) {
      // @ts-ignore
      obj[data[0][j]] = data[i][j];
      arr.push(data[i][j]);
    }
    result.push(obj);
    result.timetable.push(arr);
  }

  return result;
}

export { parse_schedule_csv as parse_csv };
