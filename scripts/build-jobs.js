const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const JOBS_FILE = path.join(ROOT_DIR, 'data', 'jobs.json');
const TEMPLATE_FILE = path.join(ROOT_DIR, 'templates', 'job-detail.html');

const INDEX_EN_FILE = path.join(ROOT_DIR, 'bestjobs', 'index.html');
const INDEX_BG_FILE = path.join(ROOT_DIR, 'bestjobs', 'bg', 'index.html');

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

const getDatePath = (dateStr) => {
  const d = new Date(dateStr || Date.now());
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return { year, month, day, pathStr: `${year}/${month}/${day}` };
};

const generateIndividualPages = () => {
  jobs.forEach((job) => {
    const isExpired = job.expired === true;
    const folderType = isExpired ? 'archive' : 'v';
    const dp = getDatePath(job.date);
    const datePath = dp.pathStr;

    const chipsEnHtml = (job.chips_en || []).map((c) => `<span class="chip-item">${c}</span>`).join('\n          ');
    const chipsBgHtml = (job.chips_bg || []).map((c) => `<span class="chip-item">${c}</span>`).join('\n          ');

    const vipBadgeEn = job.vip ? '<a href="/bestjobs/help/#vip" class="vip-tag" title="VIP Fast-Track Placement">🌟 VIP FAST-TRACK</a>' : '';
    const vipBadgeBg = job.vip ? '<a href="/bestjobs/bg/help/#vip" class="vip-tag" title="VIP Скоростно наемане">🌟 VIP СКОРОСТНО НАЕМАНЕ</a>' : '';

    const canonicalEn = `https://bestjobs.bg/bestjobs/${folderType}/${datePath}/${job.slug}/`;
    const canonicalBg = `https://bestjobs.bg/bestjobs/bg/${folderType}/${datePath}/${job.slug}/`;

    const salaryEn = typeof job.salary_gross === 'number' ? `${job.salary_gross} € per month` : (job.salary_gross || 'Competitive');
    const salaryBg = typeof job.salary_gross === 'number' ? `${job.salary_gross} € на месец` : (job.salary_gross || 'По договаряне');
    const netEn = typeof job.salary_net === 'number' ? `(net ~${job.salary_net} €)` : (job.salary_net || '');
    const netBg = typeof job.salary_net === 'number' ? `(нето ~${job.salary_net} €)` : (job.salary_net || '');

    const varsEn = {
      LANG: 'en',
      META_TITLE: `${job.title_en} | ${job.company_en} • BestJobs Bulgaria`,
      META_DESC: `${job.title_en} vacancy at ${job.company_en}. Remuneration: ${salaryEn}. Direct verified email application.`,
      CANONICAL_URL: canonicalEn,
      HREFLANG_EN: canonicalEn,
      HREFLANG_BG: canonicalBg,
      ROOT_PATH: '../../../../../',
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
      BLOG_TITLE: 'Central Research Monographs Catalog',
      BLOG_TEXT: 'Monographs',
      HELP_TITLE: 'Unified Documentation for Candidates and Employers',
      HELP_TEXT: 'Help Desk',
      CONTACT_TITLE: 'Official Communication Desks',
      CONTACT_TEXT: 'Contact',
      ABOUT_TITLE: 'Historical Lineage and Governance',
      ABOUT_TEXT: 'About Us',
      LANG_TOGGLE_HREF: `/bestjobs/bg/${folderType}/${datePath}/${job.slug}/`,
      LANG_TOGGLE_HREFLANG: 'bg',
      LANG_TOGGLE_TITLE: 'Превключете към българската версия на обявата',
      LANG_TOGGLE_TEXT: 'Български (BG)',
      LANG_FOOTER_TEXT: 'Българска версия (BG)',
      ID: job.id,
      SECTOR_LABEL: (job.industry || 'PUBLIC-SECTOR').toUpperCase(),
      CITY_LABEL: (job.city || 'SOFIA').toUpperCase(),
      VIP_BADGE: vipBadgeEn,
      VERIFIED_LABEL: 'Verified Direct Counterparty',
      TITLE: job.title_en,
      SUBTITLE: job.subtitle_en || '',
      COMPANY: job.company_en,
      SALARY_GROSS: salaryEn,
      SALARY_NET: netEn,
      CHIPS_HTML: chipsEnHtml,
      DESC_HEADING: 'Position Overview & Responsibilities',
      DESC: job.desc_en || '',
      METADATA_HEADING: 'Statutory Employment Profile',
      TYPE_LABEL_KEY: 'Working Arrangement',
      TYPE_VALUE: job.type === 'civil-service' ? 'Civil Service / Institutional Appointment' : 'Direct Full-Time Contract',
      DATE_LABEL_KEY: 'Publication Date',
      DATE_VALUE: job.date,
      VALIDITY_LABEL_KEY: 'Listing Validity Period',
      VALIDITY_VALUE: isExpired ? 'ARCHIVED / POSITION CLOSED' : 'Immutable 30-Day Cycle',
      PAYMENT_STANDARD_KEY: 'Remuneration Standard',
      PAYMENT_STANDARD_VALUE: '100% White Economy • Official Direct Remittance',
      APPLY_MAILTO: isExpired ? '#' : `mailto:${job.email}?subject=${encodeURIComponent(`Application: ${job.title_en} (Ref: ${job.id} via BestJobs.bg)`)}&body=${encodeURIComponent(`Dear Hiring Authority,\n\nI hereby submit my application for the position of "${job.title_en}" (Reference ID: ${job.id}) published on the BestJobs.bg Sovereign Portal.\n\nPlease find my qualifications attached.\n\nSincerely,`)}`,
      APPLY_TITLE: isExpired ? 'This vacancy is closed and archived' : `Apply directly to ${job.company_en} via email`,
      APPLY_TEXT: isExpired ? 'Position Closed' : 'Apply with Email',
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
      META_DESC: `Обява за ${job.title_bg} в ${job.company_bg}. Възнаграждение: ${salaryBg}. Директно кандидатстване по имейл без посредници.`,
      CANONICAL_URL: canonicalBg,
      HREFLANG_EN: canonicalEn,
      HREFLANG_BG: canonicalBg,
      ROOT_PATH: '../../../../../',
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
      BLOG_TITLE: 'Каталог на научните трудови монографии',
      BLOG_TEXT: 'Монографии',
      HELP_TITLE: 'Документация за кандидати и работодатели',
      HELP_TEXT: 'Помощен център',
      CONTACT_TITLE: 'Официални координационни бюра и контакти',
      CONTACT_TEXT: 'Контакти',
      ABOUT_TITLE: 'История, принципи и управление на консорциума',
      ABOUT_TEXT: 'За нас',
      LANG_TOGGLE_HREF: `/bestjobs/${folderType}/${datePath}/${job.slug}/`,
      LANG_TOGGLE_HREFLANG: 'en',
      LANG_TOGGLE_TITLE: 'Switch to English listing version',
      LANG_TOGGLE_TEXT: 'English (EN)',
      LANG_FOOTER_TEXT: 'English Version (EN)',
      ID: job.id,
      SECTOR_LABEL: (job.industry || 'PUBLIC-SECTOR').toUpperCase(),
      CITY_LABEL: (job.city || 'SOFIA').toUpperCase(),
      VIP_BADGE: vipBadgeBg,
      VERIFIED_LABEL: 'Проверен директен работодател',
      TITLE: job.title_bg,
      SUBTITLE: job.subtitle_bg || '',
      COMPANY: job.company_bg,
      SALARY_GROSS: salaryBg,
      SALARY_NET: netBg,
      CHIPS_HTML: chipsBgHtml,
      DESC_HEADING: 'Описание на длъжността и ключови отговорности',
      DESC: job.desc_bg || '',
      METADATA_HEADING: 'Нормативни параметри на заетостта',
      TYPE_LABEL_KEY: 'Вид правоотношение',
      TYPE_VALUE: job.type === 'civil-service' ? 'Служебно / Институционално правоотношение' : 'Директен трудов договор',
      DATE_LABEL_KEY: 'Дата на обявяване',
      DATE_VALUE: job.date,
      VALIDITY_LABEL_KEY: 'Срок на валидност на обявата',
      VALIDITY_VALUE: isExpired ? 'ИЗТЕКЛА ОБЯВА / ПОЗИЦИЯТА Е ЗАТВОРЕНА' : 'Неотменим 30-дневен цикъл',
      PAYMENT_STANDARD_KEY: 'Стандарт на възнаграждението',
      PAYMENT_STANDARD_VALUE: '100% Бяла икономика • Официално изплащане по договор',
      APPLY_MAILTO: isExpired ? '#' : `mailto:${job.email}?subject=${encodeURIComponent(`Кандидатура: ${job.title_bg} (Реф. №: ${job.id} чрез BestJobs.bg)`)}&body=${encodeURIComponent(`Уважаема конкурсна комисия / Уважаеми работодател,\n\nПодавам своята кандидатура за длъжността „${job.title_bg}“ (Реф. №: ${job.id}) чрез BestJobs.bg.\n\nС уважение,`)}`,
      APPLY_TITLE: isExpired ? 'Тази позиция е затворена и архивирана' : `Кандидатствайте директно към ${job.company_bg} чрез имейл`,
      APPLY_TEXT: isExpired ? 'Позицията е затворена' : 'Кандидатствай по имейл',
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

    const enDir = path.join(ROOT_DIR, 'bestjobs', folderType, datePath, job.slug);
    ensureDir(enDir);
    fs.writeFileSync(path.join(enDir, 'index.html'), renderTemplate(template, varsEn), 'utf8');

    const bgDir = path.join(ROOT_DIR, 'bestjobs', 'bg', folderType, datePath, job.slug);
    ensureDir(bgDir);
    fs.writeFileSync(path.join(bgDir, 'index.html'), renderTemplate(template, varsBg), 'utf8');
  });
};

const updateCatalogIndexes = () => {
  const activeJobs = jobs.filter((j) => !j.expired);

  const cardsEn = activeJobs.map((job) => {
    const vipClass = job.vip ? ' vip-card' : '';
    const vipBadge = job.vip ? `\n              <div class="meta-badges-inline">\n                <a href="/bestjobs/help/#vip" class="vip-tag" title="VIP Fast-Track Placement">🌟 VIP FAST-TRACK</a>\n              </div>` : '';
    const vipReach = job.vip ? `\n            <div class="vip-reach-badge">📡 Syndicate: <a href="https://mobikom.bg" target="_blank" rel="noopener" title="Mobikom Bulgaria Institutional Hub">mobikom.bg</a> &bull; <a href="https://www.dobrichnews.com" target="_blank" rel="noopener noreferrer" title="Real-time daily news in North-East Bulgaria">dobrichnews.com</a> &bull; <a href="https://www.dobruja.com" target="_blank" rel="noopener noreferrer" title="Agricultural preservation, regional traditions and culture">dobruja.com</a></div>` : '';
    const chips = (job.chips_en || []).map((c) => `<span class="chip-item">${c}</span>`).join('\n              ');
    const datePath = getDatePath(job.date).pathStr;
    const salaryVal = typeof job.salary_gross === 'number' ? `${job.salary_gross} € per month` : (job.salary_gross || 'Competitive');
    const netVal = typeof job.salary_net === 'number' ? `(net ~${job.salary_net} €)` : (job.salary_net || '');

    return `          <article class="job-card${vipClass}" data-slug="${job.slug}" data-industry="${job.industry}" data-city="${job.city}" data-type="${job.type}" data-date="${job.date}">
            <div class="card-meta-bar">
              <span>${job.id} &bull; ${(job.industry || 'PUBLIC-SECTOR').toUpperCase()} &bull; ${(job.city || 'SOFIA').toUpperCase()}</span>${vipBadge}
            </div>${vipReach}
            <div class="card-title-box">
              <h3>${job.title_en}</h3>
              <div class="card-subtitle">${job.subtitle_en || ''}</div>
              <div class="card-company">${job.company_en}</div>
            </div>
            <div class="card-salary-box">
              <span class="salary-figure">${salaryVal}</span>
              <span class="salary-net-calc">${netVal}</span>
            </div>
            <div class="card-chips-row">
              ${chips}
            </div>
            <div class="card-text-summary">
              ${job.desc_en || ''}
            </div>
            <div class="card-footer-actions">
              <a href="/bestjobs/v/${datePath}/${job.slug}/" class="card-spec-link" title="Open complete technical specification for ${escapeXml(job.title_en)}">View Job &rarr;</a>
              <a href="mailto:${job.email}?subject=${encodeURIComponent(`Application: ${job.title_en} (Ref: ${job.id})`)}" class="btn-direct-apply" title="Apply directly to ${escapeXml(job.company_en)} via email">Apply &rarr;</a>
            </div>
          </article>`;
  }).join('\n\n');

  const cardsBg = activeJobs.map((job) => {
    const vipClass = job.vip ? ' vip-card' : '';
    const vipBadge = job.vip ? `\n              <div class="meta-badges-inline">\n                <a href="/bestjobs/bg/help/#vip" class="vip-tag" title="VIP Скоростно наемане">🌟 VIP СКОРОСТНО НАЕМАНЕ</a>\n              </div>` : '';
    const vipReach = job.vip ? `\n            <div class="vip-reach-badge">📡 Синдикация: <a href="https://mobikom.bg" target="_blank" rel="noopener" title="Мобиком България — Институционален хъб">mobikom.bg</a> &bull; <a href="https://www.dobrichnews.com" target="_blank" rel="noopener noreferrer" title="Ежедневни регионални новини от Североизточна България">dobrichnews.com</a> &bull; <a href="https://www.dobruja.com" target="_blank" rel="noopener noreferrer" title="Земеделски традиции, фолклор и добруджанска памет">dobruja.com</a></div>` : '';
    const chips = (job.chips_bg || []).map((c) => `<span class="chip-item">${c}</span>`).join('\n              ');
    const datePath = getDatePath(job.date).pathStr;
    const salaryVal = typeof job.salary_gross === 'number' ? `${job.salary_gross} € на месец` : (job.salary_gross || 'По договаряне');
    const netVal = typeof job.salary_net === 'number' ? `(нето ~${job.salary_net} €)` : (job.salary_net || '');

    return `          <article class="job-card${vipClass}" data-slug="${job.slug}" data-industry="${job.industry}" data-city="${job.city}" data-type="${job.type}" data-date="${job.date}">
            <div class="card-meta-bar">
              <span>${job.id} &bull; ${(job.industry || 'PUBLIC-SECTOR').toUpperCase()} &bull; ${(job.city || 'SOFIA').toUpperCase()}</span>${vipBadge}
            </div>${vipReach}
            <div class="card-title-box">
              <h3>${job.title_bg}</h3>
              <div class="card-subtitle">${job.subtitle_bg || ''}</div>
              <div class="card-company">${job.company_bg}</div>
            </div>
            <div class="card-salary-box">
              <span class="salary-figure">${salaryVal}</span>
              <span class="salary-net-calc">${netVal}</span>
            </div>
            <div class="card-chips-row">
              ${chips}
            </div>
            <div class="card-text-summary">
              ${job.desc_bg || ''}
            </div>
            <div class="card-footer-actions">
              <a href="/bestjobs/bg/v/${datePath}/${job.slug}/" class="card-spec-link" title="Отворете пълната техническа спецификация за ${escapeXml(job.title_bg)}">Преглед &rarr;</a>
              <a href="mailto:${job.email}?subject=${encodeURIComponent(`Кандидатура: ${job.title_bg} (Реф. №: ${job.id})`)}" class="btn-direct-apply" title="Кандидатствайте директно към ${escapeXml(job.company_bg)} по имейл">Кандидатствай &rarr;</a>
            </div>
          </article>`;
  }).join('\n\n');

  const replaceContainer = (filePath, cardsHtml) => {
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    const startTag = '<!-- JOBS_CONTAINER_START -->';
    const endTag = '<!-- JOBS_CONTAINER_END -->';

    const startIndex = content.indexOf(startTag);
    const endIndex = content.indexOf(endTag);

    if (startIndex !== -1 && endIndex !== -1) {
      const newContent = content.substring(0, startIndex + startTag.length) +
        '\n' + cardsHtml + '\n        ' +
        content.substring(endIndex);
      fs.writeFileSync(filePath, newContent, 'utf8');
    }
  };

  replaceContainer(INDEX_EN_FILE, cardsEn);
  replaceContainer(INDEX_BG_FILE, cardsBg);
};

const generateXmlFeeds = () => {
  const now = new Date().toUTCString();
  const activeJobs = jobs.filter((j) => !j.expired);

  let allItemsXml = '';
  let vipItemsXml = '';

  activeJobs.forEach((job) => {
    const dp = getDatePath(job.date);
    const datePath = dp.pathStr;
    const salStr = typeof job.salary_gross === 'number' ? `${job.salary_gross} € per month` : (job.salary_gross || 'Competitive');

    const itemXml = `    <item>
      <title>${escapeXml(job.title_en)} - ${escapeXml(job.company_en)}</title>
      <link>https://bestjobs.bg/bestjobs/v/${datePath}/${escapeXml(job.slug)}/</link>
      <guid isPermaLink="true">https://bestjobs.bg/bestjobs/v/${datePath}/${escapeXml(job.slug)}/</guid>
      <pubDate>${new Date(job.date).toUTCString()}</pubDate>
      <description>${escapeXml(job.desc_en || '')} Remuneration: ${escapeXml(salStr)}.</description>
    </item>\n`;

    allItemsXml += itemXml;

    if (job.vip) {
      const salBgStr = typeof job.salary_gross === 'number' ? `${job.salary_gross} € на месец` : (job.salary_gross || 'По договаряне');
      const vipItemXml = `    <item>
      <title>${escapeXml(job.title_bg)} - ${escapeXml(job.company_bg)}</title>
      <link>https://bestjobs.bg/bestjobs/bg/v/${datePath}/${escapeXml(job.slug)}/</link>
      <guid isPermaLink="true">https://bestjobs.bg/bestjobs/bg/v/${datePath}/${escapeXml(job.slug)}/</guid>
      <pubDate>${new Date(job.date).toUTCString()}</pubDate>
      <description>${escapeXml(job.desc_bg || '')} Възнаграждение: ${escapeXml(salBgStr)}.</description>
    </item>\n`;
      vipItemsXml += vipItemXml;
    }
  });

  const allFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>BestJobs Bulgaria - All Vacancies Feed</title>
    <link>https://bestjobs.bg/bestjobs/</link>
    <description>Verified direct employment postings across Bulgaria and global institutions.</description>
    <language>en-US</language>
    <lastBuildDate>${now}</lastBuildDate>
${allItemsXml.trimEnd()}
  </channel>
</rss>\n`;

  const vipFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>BestJobs България - VIP Синдикиран кариерен поток</title>
    <link>https://bestjobs.bg/bestjobs/bg/</link>
    <description>Синдикиран VIP поток с проверени позиции за медийния консорциум: dobrichnews.com, dobruja.com и mobikom.bg.</description>
    <language>bg</language>
    <lastBuildDate>${now}</lastBuildDate>
${vipItemsXml.trimEnd()}
  </channel>
</rss>\n`;

  fs.writeFileSync(path.join(ROOT_DIR, 'all-jobs.xml'), allFeed, 'utf8');
  fs.writeFileSync(path.join(ROOT_DIR, 'vip-jobs.xml'), vipFeed, 'utf8');
};

const generateSitemapIndex = () => {
  const today = new Date().toISOString().split('T')[0];

  const groupedByMonth = {};
  jobs.forEach((job) => {
    const dp = getDatePath(job.date);
    const key = `${dp.year}-${dp.month}`;
    if (!groupedByMonth[key]) groupedByMonth[key] = [];
    groupedByMonth[key].push(job);
  });

  let sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://bestjobs.bg/sitemap-static.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
`;

  const staticRoutes = [
    { url: 'https://bestjobs.bg/', priority: '1.0', changefreq: 'daily' },
    { url: 'https://bestjobs.bg/bg/', priority: '1.0', changefreq: 'daily' },
    { url: 'https://bestjobs.bg/bestjobs/', priority: '0.9', changefreq: 'daily' },
    { url: 'https://bestjobs.bg/bestjobs/bg/', priority: '0.9', changefreq: 'daily' },
    { url: 'https://bestjobs.bg/about/', priority: '0.7', changefreq: 'monthly' },
    { url: 'https://bestjobs.bg/bg/about/', priority: '0.7', changefreq: 'monthly' },
    { url: 'https://bestjobs.bg/blog/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/bg/blog/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/help/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/bg/help/', priority: '0.8', changefreq: 'weekly' },
    { url: 'https://bestjobs.bg/accessibility/', priority: '0.6', changefreq: 'monthly' },
    { url: 'https://bestjobs.bg/bg/accessibility/', priority: '0.6', changefreq: 'monthly' },
    { url: 'https://bestjobs.bg/privacy/', priority: '0.5', changefreq: 'monthly' },
    { url: 'https://bestjobs.bg/bg/privacy/', priority: '0.5', changefreq: 'monthly' },
    { url: 'https://bestjobs.bg/terms/', priority: '0.5', changefreq: 'monthly' },
    { url: 'https://bestjobs.bg/bg/terms/', priority: '0.5', changefreq: 'monthly' },
    { url: 'https://bestjobs.bg/gdpr/', priority: '0.5', changefreq: 'monthly' },
    { url: 'https://bestjobs.bg/bg/gdpr/', priority: '0.5', changefreq: 'monthly' },
    { url: 'https://bestjobs.bg/contact/', priority: '0.7', changefreq: 'monthly' },
    { url: 'https://bestjobs.bg/bg/contact/', priority: '0.7', changefreq: 'monthly' }
  ];

  let staticXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  staticRoutes.forEach((route) => {
    staticXml += `  <url>
    <loc>${route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>\n`;
  });
  staticXml += `</urlset>\n`;
  fs.writeFileSync(path.join(ROOT_DIR, 'sitemap-static.xml'), staticXml, 'utf8');

  for (const [monthKey, monthJobs] of Object.entries(groupedByMonth)) {
    const subMapFileName = `sitemap-jobs-${monthKey}.xml`;
    sitemapIndexXml += `  <sitemap>
    <loc>https://bestjobs.bg/${subMapFileName}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>\n`;

    let subXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
    monthJobs.forEach((job) => {
      const folderType = job.expired ? 'archive' : 'v';
      const dp = getDatePath(job.date);
      const datePath = dp.pathStr;
      subXml += `  <url>
    <loc>https://bestjobs.bg/bestjobs/${folderType}/${datePath}/${escapeXml(job.slug)}/</loc>
    <lastmod>${job.date}</lastmod>
    <changefreq>${job.expired ? 'never' : 'weekly'}</changefreq>
    <priority>${job.expired ? '0.3' : '0.7'}</priority>
  </url>\n`;
      subXml += `  <url>
    <loc>https://bestjobs.bg/bestjobs/bg/${folderType}/${datePath}/${escapeXml(job.slug)}/</loc>
    <lastmod>${job.date}</lastmod>
    <changefreq>${job.expired ? 'never' : 'weekly'}</changefreq>
    <priority>${job.expired ? '0.3' : '0.7'}</priority>
  </url>\n`;
    });
    subXml += `</urlset>\n`;
    fs.writeFileSync(path.join(ROOT_DIR, subMapFileName), subXml, 'utf8');
  }

  sitemapIndexXml += `</sitemapindex>\n`;
  fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), sitemapIndexXml, 'utf8');
};

generateIndividualPages();
updateCatalogIndexes();
generateXmlFeeds();
generateSitemapIndex();
