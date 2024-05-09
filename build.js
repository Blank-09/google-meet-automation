const fs = require("fs");
const { execSync } = require("child_process");

if (!fs.existsSync("./dist")) {
  console.log("Running build...");
  execSync("pnpm build", { stdio: "inherit" });
}

if (!fs.existsSync("./dist/data/schedule")) {
  fs.mkdirSync("./dist/data/schedule", { recursive: true });
}

// Copy schedule.csv to dist
fs.copyFileSync("./data/schedule/schedule.csv", "./dist/data/schedule/schedule.csv");
