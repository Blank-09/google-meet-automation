# Google Meet Automation

An automation software to join Google Meet meetings. The software uses the csv file to get the schedule of the meetings and joins the meeting at the scheduled time.

<!-- Emoji -->

## ⚙️ Setup

- Clone the repository
- Install the required dependencies
  ```bash
  pnpm install
  ```
- Change the [schedule.csv](data/schedule/schedule.csv) file to your schedule
- Change the [meet_links.json](data/meet_links.json) file to your meet links
- Make sure every schedule is mapped to a meet link in the [meet_links.json](data/meet_links.json) file
- Rename `sample.env` to `.env` and fill the required fields

### 🚀 Run Command

```bash
pnpm start
```

### 🛠️ Development Command

```bash
pnpm dev
```

### 📸 Screenshot

![alt text](./assets/image.png)
