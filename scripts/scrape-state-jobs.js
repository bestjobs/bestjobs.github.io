const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT_DIR = path.resolve(__dirname, '..');
const JOBS_FILE = path.join(ROOT_DIR, 'data', 'jobs.json');

const ensureDirectoryStructure = () => {
  const dirs = [
    path.join(ROOT_DIR, 'bestjobs', 'v'),
    path.join(ROOT_DIR, 'bestjobs', 'archive'),
    path.join(ROOT_DIR, 'bestjobs', 'bg', 'v'),
    path.join(ROOT_DIR, 'bestjobs', 'bg', 'archive')
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, '.gitkeep'), '', 'utf8');
    }
  });
};

const rawJobs = fs.readFileSync(JOBS_FILE, 'utf8');
let currentJobs = JSON.parse(rawJobs);

const calculateNet = (gross) => Math.round(gross * 0.776);

const detectSector = (title, org) => {
  const t = (title + ' ' + org).toLowerCase();
  if (t.includes('болниц') || t.includes('мбал') || t.includes('умбал') || t.includes('цсмп') || t.includes('лекар') || t.includes('медицинск') || t.includes('здравн')) return 'healthcare';
  if (t.includes('съд') || t.includes('прокурор') || t.includes('всс') || t.includes('вписвания') || t.includes('кадастър') || t.includes('агкк')) return 'judiciary';
  if (t.includes('отбран') || t.includes('армия') || t.includes('воен') || t.includes('мвр') || t.includes('полици') || t.includes('пожарн') || t.includes('пбзн')) return 'defense-security';
  if (t.includes('професор') || t.includes('доцент') || t.includes('асистент') || t.includes('докторант') || t.includes('бан') || t.includes('университет') || t.includes('нацид')) return 'academic';
  if (t.includes('училищ') || t.includes('мон') || t.includes('руо') || t.includes('педагог') || t.includes('учител')) return 'education';
  if (t.includes('бдж') || t.includes('нкжи') || t.includes('рвд') || t.includes('bulatsa') || t.includes('пристанищ') || t.includes('летищ') || t.includes('апи') || t.includes('транспорт')) return 'transport-infrastructure';
  if (t.includes('земедел') || t.includes('дфз') || t.includes('бабх') || t.includes('горск') || t.includes('мзх') || t.includes('аграр')) return 'agriculture-forestry';
  if (t.includes('риосв') || t.includes('басейнова') || t.includes('еколог') || t.includes('мосв') || t.includes('води')) return 'environment-water';
  if (t.includes('театър') || t.includes('музей') || t.includes('опера') || t.includes('култур') || t.includes('галери') || t.includes('библиотек')) return 'culture-heritage';
  if (t.includes('аец') || t.includes('есо') || t.includes('енерг') || t.includes('bess') || t.includes('ауер') || t.includes('газ')) return 'energy-storage';
  if (t.includes('спорт') || t.includes('тото') || t.includes('ммс') || t.includes('нсб')) return 'sports-youth';
  if (t.includes('общин') || t.includes('кмет') || t.includes('областна администрация')) return 'municipal-regional';
  if (t.includes('кзк') || t.includes('кевр') || t.includes('кфн') || t.includes('крс') || t.includes('кзлд') || t.includes('сем') || t.includes('кпконпи')) return 'regulators';
  return 'public-sector';
};

const detectCity = (text) => {
  const t = text.toLowerCase();
  const cities = {
    'пловдив': 'plovdiv', 'варна': 'varna', 'бургас': 'burgas', 'добрич': 'dobrich',
    'русе': 'ruse', 'стара загора': 'stara-zagora', 'благоевград': 'blagoevgrad',
    'велико търново': 'veliko-tarnovo', 'видин': 'vidin', 'враца': 'vratsa',
    'габрово': 'gabrovo', 'кърджали': 'kardzhali', 'кюстендил': 'kyustendil',
    'ловеч': 'lovech', 'монтана': 'montana', 'пазарджик': 'pazardzhik',
    'перник': 'pernik', 'плевен': 'pleven', 'разград': 'razgrad',
    'силистра': 'silistra', 'сливен': 'sliven', 'смолян': 'smolyan',
    'търговище': 'targovishte', 'хасково': 'haskovo', 'шумен': 'shumen', 'ямбол': 'yambol'
  };
  for (const [bgName, slug] of Object.entries(cities)) {
    if (t.includes(bgName)) return slug;
  }
  return 'sofia';
};

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

const fetchHtml = (url) => {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) BestJobs-State-Scraper/1.0 (+https://bestjobs.bg)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchHtml(res.headers.location));
      }
      if (res.statusCode !== 200) return resolve('');
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
};

const transliterate = (text) => {
  const map = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
    'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sht', 'ъ': 'a', 'ь': 'y',
    'ю': 'yu', 'я': 'ya'
  };
  return text.toLowerCase().split('').map(c => map[c] || c).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
};

const runAggregator = async () => {
  ensureDirectoryStructure();
  currentJobs = purgeExpiredJobs(currentJobs);

  const iisdaUrl = 'https://iisda.government.bg/competitions/all_competitions';
  const html = await fetchHtml(iisdaUrl);

  if (html) {
    const regex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let match;
    let newCount = 0;

    while ((match = regex.exec(html)) !== null && newCount < 15) {
      const row = match[1];
      if (row.includes('<th>') || !row.includes('href=')) continue;

      const titleMatch = row.match(/<a[^>]*>([\s\S]*?)<\/a>/i);
      const textMatch = row.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

      if (titleMatch) {
        const titleBg = titleMatch[1].replace(/<[^>]+>/g, '').trim();
        const parts = textMatch.split(' ');
        const orgBg = parts.slice(1, 6).join(' ') || 'Държавна администрация на Република България';
        
        const sector = detectSector(titleBg, textMatch);
        const city = detectCity(textMatch);
        const latinSlug = transliterate(titleBg).slice(0, 45);
        const uniqueId = `BJ-${Date.now().toString().slice(-4)}${newCount}`;
        const fullSlug = `${uniqueId}-${latinSlug}`;

        const exists = currentJobs.some((j) => j.title_bg.toLowerCase() === titleBg.toLowerCase());

        if (!exists && titleBg.length > 5) {
          const salaryGross = 1350;
          const salaryNet = calculateNet(salaryGross);

          currentJobs.unshift({
            id: uniqueId,
            slug: fullSlug,
            vip: false,
            expired: false,
            date: new Date().toISOString().split('T')[0],
            city: city,
            industry: sector,
            type: 'civil-service',
            salary_gross: salaryGross,
            salary_net: salaryNet,
            email: 'ras@government.bg',
            title_en: titleBg,
            subtitle_en: orgBg,
            company_en: `${orgBg} (government.bg)`,
            desc_en: `Official public sector competitive procedure organized under the State Servant Act. Remuneration strictly in Euro (€).`,
            chips_en: ['🩺 Medical Exams', '📴 Disconnect', '🏥 Full Health'],
            title_bg: titleBg,
            subtitle_bg: orgBg,
            company_bg: `${orgBg} (government.bg)`,
            desc_bg: `Официална конкурсна процедура за държавни служители по Закона за държавния служител в публичната администрация. Възнаграждение в чисто евро (€).`,
            chips_bg: ['🩺 Медицински прегледи', '📴 Право на изключване', '🏥 Здравно осигуряване']
          });
          newCount++;
        }
      }
    }
  }

  fs.writeFileSync(JOBS_FILE, JSON.stringify(currentJobs, null, 2), 'utf8');
};

runAggregator();
