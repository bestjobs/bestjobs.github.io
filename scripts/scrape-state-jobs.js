const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT_DIR = path.resolve(__dirname, '..');
const JOBS_FILE = path.join(ROOT_DIR, 'data', 'jobs.json');

const rawJobs = fs.readFileSync(JOBS_FILE, 'utf8');
let currentJobs = JSON.parse(rawJobs);

const purgeExpiredJobs = (jobsList) => {
  const now = new Date();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  return jobsList.map((job) => {
    const jobDate = new Date(job.date);
    if ((now - jobDate) > thirtyDaysMs) {
      return { ...job, expired: true };
    }
    return job;
  });
};

const fetchJson = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'BestJobs-Aggregator/1.0 (+https://bestjobs.bg)' } }, (res) => {
      if (res.statusCode !== 200) {
        return resolve([]);
      }
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
};

const runAggregator = async () => {
  currentJobs = purgeExpiredJobs(currentJobs);

  const openDataUrl = 'https://data.egov.bg/api/list/competitions';
  const remoteCompetitions = await fetchJson(openDataUrl);

  if (Array.isArray(remoteCompetitions) && remoteCompetitions.length > 0) {
    remoteCompetitions.forEach((item) => {
      const exists = currentJobs.some((j) => j.id === item.id || j.slug === item.slug);
      if (!exists && item.title_bg && item.salary_gross) {
        const salaryGross = Number(item.salary_gross) || 1200;
        const salaryNet = Number(item.salary_net) || Math.round(salaryGross * 0.776);
        currentJobs.unshift({
          id: item.id || `BJ-${Date.now().toString().slice(-4)}`,
          slug: item.slug || `BJ-${Date.now().toString().slice(-4)}-state-competition`,
          vip: false,
          expired: false,
          date: new Date().toISOString().split('T')[0],
          city: item.city || 'sofia',
          industry: item.industry || 'public-sector',
          type: item.type || 'civil-service',
          salary_gross: salaryGross,
          salary_net: salaryNet,
          email: item.email || 'ras@government.bg',
          title_en: item.title_en || item.title_bg,
          subtitle_en: item.subtitle_en || 'Public Administration Directorate',
          company_en: item.company_en || 'State Administration of Bulgaria',
          desc_en: item.desc_en || 'Official public administration competition under the State Servant Act.',
          chips_en: ['🩺 Medical Exams', '📴 Disconnect', '🏥 Full Health'],
          title_bg: item.title_bg,
          subtitle_bg: item.subtitle_bg || 'Държавна администрация',
          company_bg: item.company_bg || 'Държавна администрация на Република България',
          desc_bg: item.desc_bg || 'Конкурс за заемане на длъжност по Закона за държавния служител.',
          chips_bg: ['🩺 Медицински прегледи', '📴 Право на изключване', '🏥 Здравно осигуряване']
        });
      }
    });
  }

  fs.writeFileSync(JOBS_FILE, JSON.stringify(currentJobs, null, 2), 'utf8');
};

runAggregator();
