const fs = require("fs");
const { execSync } = require("child_process");

if (!fs.existsSync("./dist")) {
  console.log("Running build...");
  execSync("pnpm build", { stdio: "inherit" });
}
