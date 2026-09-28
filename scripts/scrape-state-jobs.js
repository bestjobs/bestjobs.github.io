const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT_DIR = path.resolve(__dirname, '..');
const JOBS_FILE = path.join(ROOT_DIR, 'data', 'jobs.json');

const rawJobs = fs.readFileSync(JOBS_FILE, 'utf8');
let currentJobs = JSON.parse(rawJobs);

const calculateNet = (gross) => {
  return Math.round(gross * 0.776);
};

const purgeExpiredJobs = (jobsList) => {
  const now = new Date();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  return jobsList.filter((job) => {
    const jobDate = new Date(job.date);
    return (now - jobDate) <= thirtyDaysMs;
  });
};

const runAggregator = () => {
  currentJobs = purgeExpiredJobs(currentJobs);

  fs.writeFileSync(JOBS_FILE, JSON.stringify(currentJobs, null, 2), 'utf8');
};

runAggregator();
