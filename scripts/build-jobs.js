const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const JOBS_FILE = path.join(ROOT_DIR, 'data', 'jobs.json');
const TEMPLATE_FILE = path.join(ROOT_DIR, 'templates', 'job-detail.html');

const rawJobs = fs.readFileSync(JOBS_FILE, 'utf8');
const jobs = JSON.parse(rawJobs);
const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const escapeXml = (unsafe) => {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
};

const renderTemplate = (tpl, vars) => {
  let output = tpl;
  for (const key of Object.keys(vars)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    output = output.replace(regex, vars[key]);
  }
  return output;
};

const generateIndividualPages = () => {
  jobs.forEach((job) => {
    const chipsEnHtml = job.chips_en.map((c) => `<span class="chip-item">${c}</span>`).join('\n          ');
    const chipsBgHtml = job.chips_bg.map((c) => `<span class="chip-item">${c}</span>`).join('\n          ');

    const vipBadgeEn = job.vip ? '<a href="../../bestjobs/help/#vip" class="vip-tag" title="Learn what a VIP listing is and how to syndicate across network">🌟 VIP</a>' : '';
    const vipBadgeBg = job.vip ? '<a href="../../../bestjobs/bg/help/#vip" class="vip-tag" title="Научете какво представлява VIP позицията и синдикацията">🌟 VIP</a>' : '';

    const varsEn = {
      LANG: 'en',
      META_TITLE: `${job.title_en} | ${job.company_en} • BestJobs Bulgaria`,
      META_DESC: `${job.title_en} vacancy at ${job.company_en}. Gross monthly salary: ${job.salary_gross} € per month. Direct verified email application.`,
      CANONICAL_URL: `https://bestjobs.bg/bestjobs/${job.slug}/`,
      HREFLANG_EN: `https://bestjobs.bg/bestjobs/${job.slug}/`,
      HREFLANG_BG: `https://bestjobs.bg/bestjobs/bg/${job.slug}/`,
      ROOT_PATH: '../../',
      BOARD_PATH: 'bestjobs/',
      LOGO_TITLE: 'BestJobs Bulgaria — Job Ads Board',
      NAV_ARIA: 'Job Board Navigation',
      PORTAL_HOME_TITLE: 'Return to Portal Home',
      PORTAL_HOME_TEXT: '&larr; Portal Home',
      PORTAL_HOME_TEXT_PLAIN: 'Portal Home',
      VACANCIES_TITLE: 'Current Active Vacancies Stream',
      VACANCIES_TEXT: 'Vacancies',
      POST_TITLE: 'Post Vacancy Ad Directly',
      POST_TEXT: '+ Post a Job',
      BLOG_TITLE: 'Career Advice and Labor Insights',
      BLOG_TEXT: 'Career Advice',
      HELP_TITLE: 'Employer and Candidate Documentation',
      HELP_TEXT: 'Help Desk',
      CONTACT_TITLE: 'Official Communication Desks',
      CONTACT_TEXT: 'Contact',
      ABOUT_TITLE: 'Historical Lineage and Governance',
      ABOUT_TEXT: 'About Us',
      LANG_TOGGLE_HREF: `../../bestjobs/bg/${job.slug}/`,
      LANG_TOGGLE_HREFLANG: 'bg',
      LANG_TOGGLE_TITLE: 'Превключете към българската версия на обявата',
      LANG_TOGGLE_TEXT: 'Български (BG)',
      LANG_FOOTER_TEXT: 'Българска версия (BG)',
      ID: job.id,
      SECTOR_LABEL: job.industry.toUpperCase(),
      CITY_LABEL: job.city.toUpperCase(),
      VIP_BADGE: vipBadgeEn,
      VERIFIED_LABEL: 'Verified Direct Counterparty',
      TITLE: job.title_en,
      SUBTITLE: job.subtitle_en,
      COMPANY: job.company_en,
      SALARY_GROSS: `${job.salary_gross} € per month`,
      SALARY_NET: `(net ~${job.salary_net} €)`,
      CHIPS_HTML: chipsEnHtml,
      DESC_HEADING: 'Position Overview & Responsibilities',
      DESC: job.desc_en,
      METADATA_HEADING: 'Statutory Employment Profile',
      TYPE_LABEL_KEY: 'Working Arrangement',
      TYPE_VALUE: job.type === 'civil-service' ? 'Civil Service (State Servant Act)' : 'Labor Code Contract (Art. 67 KT)',
      DATE_LABEL_KEY: 'Publication Date',
      DATE_VALUE: job.date,
      VALIDITY_LABEL_KEY: 'Listing Validity Period',
      VALIDITY_VALUE: 'Immutable 30-Day Cycle (Archived permanently thereafter)',
      PAYMENT_STANDARD_KEY: 'Remuneration Standard',
      PAYMENT_STANDARD_VALUE: '100% White Economy • Official Bank Wire Remittance',
      APPLY_MAILTO: `mailto:${job.email}?subject=${encodeURIComponent(`Application: ${job.title_en} (Ref: ${job.id})`)}`,
      APPLY_TITLE: `Apply directly to ${job.company_en} via email`,
      APPLY_TEXT: 'Apply with Email',
      BACK_TITLE: 'Return to active vacancy stream',
      BACK_TEXT: 'Back to Vacancies',
      SHIELD_HEADING: 'Regulatory Notice • ZNZ Intermediation Shield',
      SHIELD_ITEM1_KEY: 'Decentralized Bulletin',
      SHIELD_ITEM1_VAL: 'BestJobs.bg operates strictly as a classified job bulletin and does not mediate employment under the Employment Promotion Act (ЗНЗ).',
      SHIELD_ITEM2_KEY: 'Direct Contact',
      SHIELD_ITEM2_VAL: 'Candidate resumes route cleanly to the hiring authority email with zero candidate data stored in server databases.',
      SHIELD_ITEM3_KEY: 'Settlement Integrity',
      SHIELD_ITEM3_VAL: 'All commercial postings require bank wire authentication to ensure counterparty legitimacy.',
      RSS_ALL_TITLE: 'Subscribe to open RSS feed of all current vacancies',
      RSS_ALL_TEXT: 'Open Vacancy RSS Feed',
      RSS_VIP_TITLE: 'Syndicated VIP feed for media partners',
      PRIVACY_TITLE: 'Zero-cookie architecture and strict no-tracking privacy notice',
      PRIVACY_TEXT: 'Privacy Policy',
      TERMS_TITLE: 'Operational guidelines and employment board rules',
      TERMS_TEXT: 'Terms of Service',
      GDPR_TITLE: 'Regulation (EU) 2016/679 compliance declaration',
      DISPATCH_TITLE: 'Chief Editor Ani Ivanova Market Dispatch Desk',
      CANDIDATES_TITLE: 'Candidate support and verification desk',
      EMPLOYERS_TITLE: 'Employer B2B listing support and VIP syndication'
    };

    const varsBg = {
      LANG: 'bg',
      META_TITLE: `${job.title_bg} | ${job.company_bg} • BestJobs България`,
      META_DESC: `Обява за ${job.title_bg} в ${job.company_bg}. Брутна заплата: ${job.salary_gross} € на месец. Директно кандидатстване по имейл без посредници.`,
      CANONICAL_URL: `https://bestjobs.bg/bestjobs/bg/${job.slug}/`,
      HREFLANG_EN: `https://bestjobs.bg/bestjobs/${job.slug}/`,
      HREFLANG_BG: `https://bestjobs.bg/bestjobs/bg/${job.slug}/`,
      ROOT_PATH: '../../../',
      BOARD_PATH: 'bestjobs/bg/',
      LOGO_TITLE: 'BestJobs България — Табло за обяви за работа',
      NAV_ARIA: 'Навигация в кариерния борд',
      PORTAL_HOME_TITLE: 'Към началната страница на националния портал',
      PORTAL_HOME_TEXT: '&larr; Портал Начало',
      PORTAL_HOME_TEXT_PLAIN: 'Портал Начало',
      VACANCIES_TITLE: 'Поток от активни работни позиции',
      VACANCIES_TEXT: 'Свободни позиции',
      POST_TITLE: 'Публикувайте обява за свободна позиция',
      POST_TEXT: '+ Публикувай обява',
      BLOG_TITLE: 'Кариерни анализи и трудови монографии',
      BLOG_TEXT: 'Кариерен блог',
      HELP_TITLE: 'Документация и тарифи за работодатели',
      HELP_TEXT: 'Помощен център',
      CONTACT_TITLE: 'Официални координационни бюра',
      CONTACT_TEXT: 'Контакти',
      ABOUT_TITLE: 'Институционална история и консорциум',
      ABOUT_TEXT: 'За нас',
      LANG_TOGGLE_HREF: `../../${job.slug}/`,
      LANG_TOGGLE_HREFLANG: 'en',
      LANG_TOGGLE_TITLE: 'Switch to English listing version',
      LANG_TOGGLE_TEXT: 'English (EN)',
      LANG_FOOTER_TEXT: 'English Version (EN)',
      ID: job.id,
      SECTOR_LABEL: job.industry.toUpperCase(),
      CITY_LABEL: job.city.toUpperCase(),
      VIP_BADGE: vipBadgeBg,
      VERIFIED_LABEL: 'Проверен директен работодател',
      TITLE: job.title_bg,
      SUBTITLE: job.subtitle_bg,
      COMPANY: job.company_bg,
      SALARY_GROSS: `${job.salary_gross} € на месец`,
      SALARY_NET: `(нето ~${job.salary_net} €)`,
      CHIPS_HTML: chipsBgHtml,
      DESC_HEADING: 'Описание на длъжността и ключови отговорности',
      DESC: job.desc_bg,
      METADATA_HEADING: 'Нормативни параметри на заетостта',
      TYPE_LABEL_KEY: 'Вид правоотношение',
      TYPE_VALUE: job.type === 'civil-service' ? 'Служебно правоотношение (Закон за държавния служител)' : 'Трудов договор (чл. 67 от Кодекса на труда)',
      DATE_LABEL_KEY: 'Дата на обявяване',
      DATE_VALUE: job.date,
      VALIDITY_LABEL_KEY: 'Срок на валидност на обявата',
      VALIDITY_VALUE: 'Неотменим 30-дневен цикъл (трайно архивиране след 31-вия ден)',
      PAYMENT_STANDARD_KEY: 'Стандарт на възнаграждението',
      PAYMENT_STANDARD_VALUE: '100% Бяла икономика • Официален банков превод в Евро (€)',
      APPLY_MAILTO: `mailto:${job.email}?subject=${encodeURIComponent(`Кандидатура: ${job.title_bg} (Реф. №: ${job.id})`)}`,
      APPLY_TITLE: `Кандидатствайте директно към ${job.company_bg} чрез имейл`,
      APPLY_TEXT: 'Кандидатствай по имейл',
      BACK_TITLE: 'Обратно към потока с всички активни обяви',
      BACK_TEXT: 'Обратно към обявите',
      SHIELD_HEADING: 'Правна клауза • Защитен щит по ЗНЗ',
      SHIELD_ITEM1_KEY: 'Децентрализиран бюлетин',
      SHIELD_ITEM1_VAL: 'BestJobs.bg оперира стриктно като класифициран рекламен бюлетин и не осъществява трудово посредничество по смисъла на Закона за насърчаване на заетостта (ЗНЗ).',
      SHIELD_ITEM2_KEY: 'Директен контакт',
      SHIELD_ITEM2_VAL: 'Автобиографиите се изпращат пряко към електронната поща на работодателя без съхранение на лични данни в сървърни бази.',
      SHIELD_ITEM3_KEY: 'Банкова проверка',
      SHIELD_ITEM3_VAL: 'Всички платени обяви преминават през идентификация чрез банков превод за гарантиране на легитимността на юридическото лице.',
      RSS_ALL_TITLE: 'Абонирайте се за отворения RSS поток с всички позиции',
      RSS_ALL_TEXT: 'Отворен RSS поток с позиции',
      RSS_VIP_TITLE: 'Синдикиран VIP фийд за медийните партньори',
      PRIVACY_TITLE: 'Политика за поверителност и нулеви бисквитки',
      PRIVACY_TEXT: 'Поверителност',
      TERMS_TITLE: 'Общи условия и правила за публикуване',
      TERMS_TEXT: 'Общи условия',
      GDPR_TITLE: 'Декларация за съответствие с Регламент (ЕС) 2016/679',
      DISPATCH_TITLE: 'Бюро за макроикономически бюлетин на главния редактор Ани Иванова',
      CANDIDATES_TITLE: 'Бюро за поддръжка на кандидати и трудови права',
      EMPLOYERS_TITLE: 'Бюро за обслужване на работодатели и VIP синдикация'
    };

    const enDir = path.join(ROOT_DIR, 'bestjobs', job.slug);
    ensureDir(enDir);
    fs.writeFileSync(path.join(enDir, 'index.html'), renderTemplate(template, varsEn), 'utf8');

    const bgDir = path.join(ROOT_DIR, 'bestjobs', 'bg', job.slug);
    ensureDir(bgDir);
    fs.writeFileSync(path.join(bgDir, 'index.html'), renderTemplate(template, varsBg), 'utf8');
  });
};

const generateXmlFeeds = () => {
  const now = new Date().toUTCString();

  let allItemsXml = '';
  let vipItemsXml = '';

  jobs.forEach((job) => {
    const itemXml = `    <item>
      <title>${escapeXml(job.title_en)} - ${escapeXml(job.company_en)}</title>
      <link>https://bestjobs.bg/bestjobs/${escapeXml(job.slug)}/</link>
      <guid isPermaLink="true">https://bestjobs.bg/bestjobs/${escapeXml(job.slug)}/</guid>
      <pubDate>${new Date(job.date).toUTCString()}</pubDate>
      <description>${escapeXml(job.desc_en)} Gross Salary: ${job.salary_gross} EUR/mo.</description>
    </item>\n`;

    allItemsXml += itemXml;

    if (job.vip) {
      vipItemsXml += itemXml;
    }
  });

  const allFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>BestJobs Bulgaria - All Vacancies Feed</title>
    <link>https://bestjobs.bg/bestjobs/</link>
    <description>Verified direct employment postings across Bulgaria with transparent Euro compensation.</description>
    <language>en-US</language>
    <lastBuildDate>${now}</lastBuildDate>
${allItemsXml.trimEnd()}
  </channel>
</rss>\n`;

  const vipFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>BestJobs Bulgaria - VIP Priority Network Feed</title>
    <link>https://bestjobs.bg/bestjobs/</link>
    <description>Syndicated priority verified postings for DobrichNews.com and Dobruja.com media consortium.</description>
    <language>en-US</language>
    <lastBuildDate>${now}</lastBuildDate>
${vipItemsXml.trimEnd()}
  </channel>
</rss>\n`;

  fs.writeFileSync(path.join(ROOT_DIR, 'all-jobs.xml'), allFeed, 'utf8');
  fs.writeFileSync(path.join(ROOT_DIR, 'vip-jobs.xml'), vipFeed, 'utf8');
};

const generateSitemapXml = () => {
  const today = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    { url: 'https://bestjobs.bg/', priority: '1.0', changefreq: 'daily' },
    { url: 'https://bestjobs.bg/bg/', priority: '1.0', changefreq: 'daily' },
    { url: 'https://bestjobs.bg/bestjobs/', priority: '0.9', changefreq: 'daily' },
    { url: 'https://bestjobs.bg/bestjobs/bg/', priority: '0.9', changefreq: 'daily' },
    { url: 'https://bestjobs.bg/mall/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/mall/bg/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/energy/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/energy/bg/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/invest/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/invest/bg/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/property/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/property/bg/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/medical/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/medical/bg/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/education/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/education/bg/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/sports/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/sports/bg/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/culture/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/culture/bg/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/legal/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/legal/bg/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/blog/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/bg/blog/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/about/', priority: '0.5', changefreq: 'monthly' },
    { url: 'https://bestjobs.bg/bg/about/', priority: '0.5', changefreq: 'monthly' },
    { url: 'https://bestjobs.bg/contact/', priority: '0.5', changefreq: 'monthly' },
    { url: 'https://bestjobs.bg/bg/contact/', priority: '0.5', changefreq: 'monthly' },
    { url: 'https://bestjobs.bg/privacy/', priority: '0.3', changefreq: 'monthly' },
    { url: 'https://bestjobs.bg/terms/', priority: '0.3', changefreq: 'monthly' },
    { url: 'https://bestjobs.bg/gdpr/', priority: '0.3', changefreq: 'monthly' }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  staticRoutes.forEach((route) => {
    xml += `  <url>
    <loc>${route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>\n`;
  });

  jobs.forEach((job) => {
    xml += `  <url>
    <loc>https://bestjobs.bg/bestjobs/${escapeXml(job.slug)}/</loc>
    <lastmod>${job.date}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.7</priority>
  </url>\n`;

    xml += `  <url>
    <loc>https://bestjobs.bg/bestjobs/bg/${escapeXml(job.slug)}/</loc>
    <lastmod>${job.date}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.7</priority>
  </url>\n`;
  });

  xml += `</urlset>\n`;

  fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), xml, 'utf8');
};

generateIndividualPages();
generateXmlFeeds();
generateSitemapXml();
