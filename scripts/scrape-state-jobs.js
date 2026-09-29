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

const detectSector = (text) => {
  const t = text.toLowerCase();
  if (t.includes('space') || t.includes('космо') || t.includes('байконур') || t.includes('nasa') || t.includes('esa') || t.includes('авио') || t.includes('карго') || t.includes('boeing')) return 'space-aerospace';
  if (t.includes('аец') || t.includes('nuclear') || t.includes('яядрен') || t.includes('edf') || t.includes('iaea') || t.includes('маае') || t.includes('westinghouse')) return 'nuclear-energy';
  if (t.includes('telecom') || t.includes('телеком') || t.includes('vodafone') || t.includes('deutsche telekom') || t.includes('orange') || t.includes('оптика') || t.includes('5g')) return 'telecom-infrastructure';
  if (t.includes('signal') || t.includes('telegram') || t.includes('crypto') || t.includes('крипто') || t.includes('infosec') || t.includes('сигурност')) return 'privacy-messaging-crypto';
  if (t.includes('tiktok') || t.includes('bytedance') || t.includes('social') || t.includes('социалн') || t.includes('алгоритм')) return 'social-media-algorithms';
  if (t.includes('google') || t.includes('apple') || t.includes('microsoft') || t.includes('amazon') || t.includes('nvidia') || t.includes('tesla') || t.includes('cloud')) return 'big-tech-cloud';
  if (t.includes('harvard') || t.includes('oxford') || t.includes('cambridge') || t.includes('sorbonne') || t.includes('mit') || t.includes('професор') || t.includes('доцент') || t.includes('бан')) return 'elite-universities';
  if (t.includes('mayo clinic') || t.includes('charit') || t.includes('болниц') || t.includes('лекар') || t.includes('мбал') || t.includes('умбал') || t.includes('клиник') || t.includes('цсмп')) return 'world-hospitals';
  if (t.includes('cnn') || t.includes('al jazeera') || t.includes('reuters') || t.includes('bloomberg') || t.includes('bbc') || t.includes('меди') || t.includes('новин')) return 'global-tv-news';
  if (t.includes('chanel') || t.includes('cardin') || t.includes('dior') || t.includes('rolex') || t.includes('lvmh') || t.includes('мода') || t.includes('дизайн')) return 'haute-couture-luxury';
  if (t.includes('negresco') || t.includes('massena') || t.includes('ritz') || t.includes('burj al arab') || t.includes('хотел') || t.includes('курорт') || t.includes('ривиера') || t.includes('кариби')) return 'iconic-hospitality';
  if (t.includes('hell') || t.includes('ramsay') || t.includes('ducasse') || t.includes('michelin') || t.includes('кулинар') || t.includes('ресторант') || t.includes('готвач')) return 'michelin-culinary';
  if (t.includes('hollywood') || t.includes('bollywood') || t.includes('кино') || t.includes('актьор') || t.includes('студио') || t.includes('бояна')) return 'cinema-actors-hollywood';
  if (t.includes('foster') || t.includes('hadid') || t.includes('gensler') || t.includes('архитект') || t.includes('строител') || t.includes('bim')) return 'master-architecture';
  if (t.includes('лувър') || t.includes('louvre') || t.includes('ермитаж') || t.includes('музей') || t.includes('дворец') || t.includes('замък') || t.includes('windsor')) return 'royal-heritage-museums';
  if (t.includes('blackrock') || t.includes('goldman') || t.includes('world bank') || t.includes('imf') || t.includes('мвф') || t.includes('банка') || t.includes('борса')) return 'global-banking-funds';
  if (t.includes('турция') || t.includes('сърбия') || t.includes('македония') || t.includes('румъния') || t.includes('молдова')) return 'cross-border-balkans';
  return 'public-sector-bg';
};

const detectCity = (text) => {
  const t = text.toLowerCase();
  if (t.includes('лондон') || t.includes('london')) return 'world-uk';
  if (t.includes('женева') || t.includes('цюрих') || t.includes('geneva') || t.includes('cern')) return 'world-switzerland';
  if (t.includes('париж') || t.includes('ница') || t.includes('paris') || t.includes('nice')) return 'eu-france';
  if (t.includes('берлин') || t.includes('мюнхен') || t.includes('berlin')) return 'eu-germany';
  if (t.includes('вашингтон') || t.includes('ню йорк') || t.includes('бостън') || t.includes('usa')) return 'world-usa';
  if (t.includes('торонто') || t.includes('монреал') || t.includes('canada')) return 'world-canada';
  if (t.includes('дубай') || t.includes('абу даби') || t.includes('dubai')) return 'middle-east-uae';
  if (t.includes('доха') || t.includes('qatar')) return 'middle-east-qatar';
  if (t.includes('тел авив') || t.includes('israel')) return 'middle-east-israel';
  if (t.includes('пекин') || t.includes('шанхай') || t.includes('china')) return 'world-china';
  if (t.includes('мумубай') || t.includes('дели') || t.includes('india')) return 'world-india';
  if (t.includes('тайпе') || t.includes('taiwan')) return 'world-taiwan';
  if (t.includes('токио') || t.includes('japan')) return 'world-japan';
  if (t.includes('сеул') || t.includes('korea')) return 'world-korea-south';
  if (t.includes('йоханесбург') || t.includes('south africa')) return 'world-south-africa';
  if (t.includes('истанбул') || t.includes('анкара') || t.includes('turkey')) return 'turkey';
  if (t.includes('букурещ') || t.includes('romania')) return 'romania';
  if (t.includes('белград') || t.includes('serbia')) return 'serbia';
  if (t.includes('скопние') || t.includes('macedonia')) return 'north-macedonia';
  if (t.includes('кишинев') || t.includes('moldova')) return 'moldova';

  const bgCities = {
    'пловдив': 'plovdiv', 'варна': 'varna', 'бургас': 'burgas', 'добрич': 'dobrich',
    'русе': 'ruse', 'стара загора': 'stara-zagora', 'благоевград': 'blagoevgrad',
    'велико търново': 'veliko-tarnovo', 'видин': 'vidin', 'враца': 'vratsa',
    'габрово': 'gabrovo', 'кърджали': 'kardzhali', 'кюстендил': 'kyustendil',
    'ловеч': 'lovech', 'монтана': 'montana', 'пазарджик': 'pazardzhik',
    'перник': 'pernik', 'плевен': 'pleven', 'разград': 'razgrad',
    'силистра': 'silistra', 'сливен': 'sliven', 'смолян': 'smolyan',
    'търговище': 'targovishte', 'хасково': 'haskovo', 'шумен': 'shumen', 'ямбол': 'yambol'
  };
  for (const [bgName, slug] of Object.entries(bgCities)) {
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
    const req = https.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'bg,en;q=0.9'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchHtml(res.headers.location));
      }
      if (res.statusCode !== 200) return resolve('');
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    });

    req.on('error', () => resolve(''));
    req.on('timeout', () => { req.destroy(); resolve(''); });
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

  const iisdaUrl = 'https://iisda.government.bg/competitions/competitions_list';
  const html = await fetchHtml(iisdaUrl);

  if (html) {
    const linkRegex = /<a[^>]*href=["']([^"']*competitions\/show_competition[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    let newCount = 0;

    while ((match = linkRegex.exec(html)) !== null && newCount < 25) {
      const titleBg = match[2].replace(/<[^>]+>/g, '').trim();

      const surroundingText = html.slice(Math.max(0, match.index - 100), Math.min(html.length, match.index + 500));
      const textClean = surroundingText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

      const orgMatch = textClean.match(/Административна структура:\s*([^\.]+)/i);
      const orgBg = orgMatch ? orgMatch[1].trim() : 'Държавна администрация на Република България';

      const sector = detectSector(titleBg + ' ' + orgBg);
      const city = detectCity(textClean);
      const latinSlug = transliterate(titleBg).slice(0, 45);
      const uniqueId = `BJ-${Date.now().toString().slice(-4)}${newCount}`;
      const fullSlug = `${uniqueId}-${latinSlug}`;

      const exists = currentJobs.some((j) => j.title_bg.toLowerCase() === titleBg.toLowerCase());

      if (!exists && titleBg.length > 4) {
        currentJobs.unshift({
          id: uniqueId,
          slug: fullSlug,
          vip: false,
          expired: false,
          date: new Date().toISOString().split('T')[0],
          city: city,
          industry: sector,
          type: 'civil-service',
          salary_gross: '1,380 € на месец',
          salary_net: 'нето ~1,071 €',
          email: 'ras@government.bg',
          title_en: titleBg,
          subtitle_en: orgBg,
          company_en: `${orgBg} (government.bg)`,
          desc_en: `Official public competitive employment procedure published under the State Servant Act. Remuneration in contract currency. Direct application.`,
          chips_en: ['🩺 Medical Exams', '📴 Disconnect', '🏥 Full Health'],
          title_bg: titleBg,
          subtitle_bg: orgBg,
          company_bg: `${orgBg} (government.bg)`,
          desc_bg: `Официална конкурсна процедура за държавна служба по реда на Закона за държавния служител. Документите за участие се подават директно чрез официален имейл адрес.`,
          chips_bg: ['🩺 Медицински прегледи', '📴 Право на изключване', '🏥 Здравно осигуряване']
        });
        newCount++;
      }
    }
  }

  fs.writeFileSync(JOBS_FILE, JSON.stringify(currentJobs, null, 2), 'utf8');
};

runAggregator();
