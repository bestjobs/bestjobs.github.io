/**
 * ===============================================================================
 * FILE: /assets/js/app.js
 * PROJECT: bestjobs.bg — Master Design Engine (Mobikom Network Unified)
 * LICENSE: MIT (https://opensource.org/licenses/MIT)
 * AUTHOR: Stoyan Stoyanov, MBM / MD • Mobikom Bulgaria (mobikom.bg)
 * STANDARDS: CSS Grid Level 2 (Subgrid) • CSS Color Module 4 (light-dark)
 * COMPLIANCE: Strict CSP Level 3 • Zero Cookies
 * PERFORMANCE: Sub-14KB Single-Pass Engine • Native System Typography
 * ===============================================================================
 */

// Embedded Production Repository (Jobs + Articles)
const CONTENT_REPOSITORY = {
  jobs: [
    {
      id: "job-01",
      title: { en: "Lead Cloud Infrastructure Architect", bg: "Водещ архитект на облачна инфраструктура" },
      company: { en: "Mobikom Network Labs", bg: "Мобиком Нетуърк Лабс" },
      category: { en: "Engineering", bg: "Инженерство" },
      location: "Sofia",
      workMode: { en: "Hybrid", bg: "Хибридно" },
      type: { en: "Full-Time", bg: "Пълен работен ден" },
      salary: "€5,200 – €6,800",
      desc: {
        en: "Architect high-performance European edge clusters, Cloudflare enterprise routing, and hybrid backbones.",
        bg: "Архитектура на европейски edge клъстери, Cloudflare конфигурации и хибридни мрежи."
      },
      responsibilities: {
        en: ["Architect resilient edge networks", "Enforce Zero Trust access security"],
        bg: ["Проектиране на устойчиви мрежи", "Внедряване на Zero Trust политики"]
      },
      requirements: {
        en: ["6+ years enterprise cloud architecture", "Deep HTTP/3 and Anycast knowledge"],
        bg: ["6+ години опит с облачни архитектури", "Владеене на HTTP/3 и Anycast"]
      },
      applyEmail: "careers@mobikom.bg"
    },
    {
      id: "job-02",
      title: { en: "Senior Full Stack TypeScript Engineer", bg: "Старши Full Stack TypeScript инженер" },
      company: { en: "Dobrudja Tech Systems", bg: "Добруджа Тех Системс" },
      category: { en: "IT & Software", bg: "ИТ и Софтуер" },
      location: "Dobrich",
      workMode: { en: "Remote", bg: "Дистанционно" },
      type: { en: "Full-Time", bg: "Пълен работен ден" },
      salary: "€4,000 – €5,200",
      desc: {
        en: "Lead web engineering for regional publishing and media platforms serving millions of monthly readers.",
        bg: "Разработка на високопроизводителни уеб архитектури за регионални медийни платформи."
      },
      responsibilities: {
        en: ["Build blazing-fast frontend components", "Optimize Core Web Vitals to sub-second speeds"],
        bg: ["Изграждане на бързи UI компоненти", "Оптимизация на Core Web Vitals"]
      },
      requirements: {
        en: ["5+ years TypeScript development", "High autonomous problem solving"],
        bg: ["5+ години опит с TypeScript", "Отлична самостоятелност"]
      },
      applyEmail: "dev-jobs@dobrudja.com"
    },
    {
      id: "job-03",
      title: { en: "Industrial Automation & PLC Specialist", bg: "Специалист индустриална автоматизация (PLC)" },
      company: { en: "Trakia Mechatronics", bg: "Тракия Мехатроника" },
      category: { en: "Engineering", bg: "Инженерство" },
      location: "Plovdiv",
      workMode: { en: "On-site", bg: "На място" },
      type: { en: "Full-Time", bg: "Пълен работен ден" },
      salary: "€3,400 – €4,500",
      desc: {
        en: "Commission and calibrate Siemens and Beckhoff automation lines in the Trakia Economic Zone.",
        bg: "Внедряване и програмиране на автоматизирани линии на Siemens и Beckhoff в Тракия Икономическа Зона."
      },
      responsibilities: {
        en: ["Program Siemens S7-1500 and Beckhoff TwinCAT", "Troubleshoot industrial SCADA networks"],
        bg: ["Програмиране на Siemens S7-1500", "Диагностика на SCADA системи"]
      },
      requirements: {
        en: ["Degree in Mechatronics or Electrical Engineering", "3+ years on-site plant experience"],
        bg: ["Висше инженерно образование", "3+ години опит в производство"]
      },
      applyEmail: "careers@trakia-mechatronics.bg"
    },
    {
      id: "job-04",
      title: { en: "Port Logistics & Intermodal Dispatcher", bg: "Диспечер морска логистика и интермодален транспорт" },
      company: { en: "Black Sea Cargo Ltd", bg: "Блек Сий Карго ООД" },
      category: { en: "Logistics", bg: "Логистика" },
      location: "Varna",
      workMode: { en: "On-site", bg: "На място" },
      type: { en: "Full-Time", bg: "Пълен работен ден" },
      salary: "€2,600 – €3,300",
      desc: {
        en: "Coordinate maritime freight handling, customs compliance, and European rail forwarding at Port Varna.",
        bg: "Координация на контейнерни превози, митническо оформяне и железопътна спедиция от Варна."
      },
      responsibilities: {
        en: ["Schedule vessel loading cycles", "Handle EU customs documentation"],
        bg: ["Графици на товарене на съдове", "Оформяне на митнически документи"]
      },
      requirements: {
        en: ["Experience in maritime forwarding", "Fluency in English and Bulgarian"],
        bg: ["Опит в морската спедиция", "Владеене на английски език"]
      },
      applyEmail: "jobs@blackseacargo.bg"
    },
    {
      id: "job-05",
      title: { en: "Head of Cardiology & Intensive Care", bg: "Началник отделение по Кардиология" },
      company: { en: "Burgas Specialized Hospital", bg: "Специализирана Болница Бургас" },
      category: { en: "Healthcare", bg: "Медицина" },
      location: "Burgas",
      workMode: { en: "On-site", bg: "На място" },
      type: { en: "Full-Time", bg: "Пълен работен ден" },
      salary: "€5,500 – €8,000",
      desc: {
        en: "Lead inpatient cardiovascular care, invasive diagnostics, and clinical protocols in a modern hospital complex.",
        bg: "Ръководство на кардиологично отделение и инвазивна диагностика в модерен болничен комплекс в Бургас."
      },
      responsibilities: {
        en: ["Direct department medical staff", "Oversee intensive care protocols"],
        bg: ["Организация на лечебния процес", "Контрол на интензивните грижи"]
      },
      requirements: {
        en: ["Board certified in Cardiology", "5+ years clinical leadership"],
        bg: ["Специалност по Кардиология", "5+ години лекарски стаж"]
      },
      applyEmail: "cardio-careers@burgas-hospital.bg"
    },
    {
      id: "job-06",
      title: { en: "Resort Complex General Manager", bg: "Главен управител на морски комплекс" },
      company: { en: "Sunny Beach Hospitality Group", bg: "Слънчев бряг Хоспиталити Груп" },
      category: { en: "Hospitality", bg: "Туризъм" },
      location: "Burgas",
      workMode: { en: "Sunny Beach", bg: "Слънчев бряг" },
      type: { en: "Full-Time", bg: "Пълен работен ден" },
      salary: "€4,500 – €6,500",
      desc: {
        en: "Direct full seasonal operations, international tour operator contracts, and department heads for a 600-room resort.",
        bg: "Оперативно управление на комплекс с 600 стаи в Слънчев бряг. Бюджетиране, договори и персонал."
      },
      responsibilities: {
        en: ["Control seasonal P&L and EBITDA targets", "Supervise F&B, Rooms, and Engineering"],
        bg: ["Контрол на сезонния P&L бюджет", "Ръководство на отделите"]
      },
      requirements: {
        en: ["Proven track record in resort management", "Fluent English and German or Russian"],
        bg: ["Опит като управител на голям хотел", "Владеене на английски и немски/френски"]
      },
      applyEmail: "exec-recruiting@sunnybeach-holdings.bg"
    }
  ],
  articles: [
    {
      id: "art-01",
      title: {
        en: "The Euro (€) Standard in Bulgaria: How Regional Salaries Are Realigning",
        bg: "Евростандартът в България: Защо заплатите се оферират директно в Евро (€)"
      },
      category: { en: "Economic Analysis", bg: "Икономически Анализ" },
      date: "2026-09-12",
      author: "Stoyan Stoyanov, MBM / MD",
      excerpt: {
        en: "With Bulgarian commercial hubs integrating deeper into the Eurozone economy, employers in Sofia, Plovdiv, Varna, and Dobrich are standardizing compensations directly in Euro to retain technical talent.",
        bg: "Водещите технологични, инженерни и логистични работодатели в София, Пловдив, Варна и Добрич преминават към евро договори за гарантиране на прозрачност и конкурентност в ЕС."
      },
      body: {
        en: "<p>With Bulgarian industrial and technology hubs integrating deeper into the European single market, employers are abandoning ambiguous 'negotiable' terms in favor of transparent Euro (€) brackets.</p><p>Data from BestJobs.bg indicates that technical listings stating Euro compensation receive up to 300% more qualified applicant interactions compared to legacy local listings.</p><p>Key growth nodes include Varna maritime logistics, Plovdiv robotics, and renewable energy grids across Dobrudja.</p>",
        bg: "<p>С интеграцията на българските индустриални и технологични центрове в европейската икономика, работодателите изоставят практиката на обяви „по договаряне“ и въвеждат прозрачни възнаграждения в Евро (€).</p><p>Данните на BestJobs.bg показват, че обявите с фиксирана заплата в евро привличат до 3 пъти повече опитни специалисти спрямо традиционните платформи.</p><p>Основните двигатели на растежа са морската логистика във Варна, мехатрониката в Пловдив и възобновяемата енергия в района на Добруджа.</p>"
      }
    },
    {
      id: "art-02",
      title: {
        en: "The Dobrudja & Northern Corridor Boom: Renewable Energy & AgTech",
        bg: "Възходът на Добруджа: Вятърна енергия, агротехнологии и заплати над €3,000"
      },
      category: { en: "Regional Focus", bg: "Регионален Фокус" },
      date: "2026-09-10",
      author: "Stoyan Stoyanov, MBM / MD",
      excerpt: {
        en: "Why Dobrich, Shabla, and the Northern Black Sea corridor are experiencing double-digit demand for mechatronics, renewable grid specialists, and precision agriculture leaders.",
        bg: "Защо Добрич, Шабла и регионът на Северното Черноморие бележат сериозен ръст в търсенето на специалисти по вятърна енергия, соларни паркове и прецизно земеделие."
      },
      body: {
        en: "<p>The Kavarna-Shabla-Dobrich plateau has matured into Bulgaria's premier renewable energy corridor. Field technicians and high-voltage electrical engineers command monthly packages between €2,500 and €3,800.</p><p>Simultaneously, grain logistics and automated machinery fleets across Dobrudja require precision agronomists with packages reaching €3,500.</p>",
        bg: "<p>Платото Каварна – Шабла – Добрич се утвърди като водещ енергиен коридор в страната. Сервизните техници и електроинженерите по поддръжка на ветропаркове получават възнаграждения между €2,500 и €3,800.</p><p>Успоредно с това, прецизното земеделие и модерните зърнобази в Добруджа търсят специалисти със стартови нива от €3,500.</p>"
      }
    }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const lang = (document.documentElement.lang || 'en').toLowerCase().startsWith('bg') ? 'bg' : 'en';

  const i18n = {
    en: {
      showing: "Showing",
      roles: "verified roles",
      articles: "articles & reports",
      testBadge: "TEST • NOT ACTIVE",
      testNotice: "⚠️ DEMONSTRATION & TEST POSITION: This vacancy is for system testing and demonstration only.",
      perMonth: "/ month",
      apply: "Apply to Employer",
      details: "Details",
      readArticle: "Read Analysis",
      noResultsTitle: "No matching results found",
      noResultsDesc: "Try adjusting your keywords or clearing the city filters.",
      directNotice: "Direct application to employer email. BestJobs.bg never intercepts your CV."
    },
    bg: {
      showing: "Показване на",
      roles: "проверени позиции",
      articles: "анализи и доклади",
      testBadge: "ТЕСТОВА • НЕАКТИВНА",
      testNotice: "⚠️ ТЕСТОВА ДЕМОНСТРАЦИОННА ПОЗИЦИЯ: Тази обява е с тестови характер за демонстрация на системата.",
      perMonth: "/ на месец",
      apply: "Кандидатствай",
      details: "Детайли",
      readArticle: "Прочети анализа",
      noResultsTitle: "Няма намерени резултати",
      noResultsDesc: "Моля, променете ключовите думи или изчистете филтрите за град.",
      directNotice: "Директно кандидатстване към работодателя. BestJobs.bg не събира и не обработва CV-та."
    }
  }[lang];

  // DOM Cache
  const gridContainer = document.getElementById('jobs-grid-container');
  const articlesContainer = document.getElementById('articles-grid-container');
  const articlesSection = document.getElementById('articles-section');
  const countLabel = document.getElementById('results-count-label');
  const searchInput = document.getElementById('live-search-input');
  const pillsContainer = document.getElementById('filter-pills-container');
  const modeContainer = document.getElementById('content-mode-container');

  const drawerBackdrop = document.getElementById('job-drawer-backdrop');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerDismissBtn = document.getElementById('drawer-dismiss-btn');
  const drawerCategory = document.getElementById('drawer-category');
  const drawerTitle = document.getElementById('drawer-job-title');
  const drawerCompany = document.getElementById('drawer-company-line');
  const drawerSalary = document.getElementById('drawer-salary');
  const drawerDesc = document.getElementById('drawer-description');
  const drawerRespTitle = document.getElementById('drawer-resp-title');
  const drawerResp = document.getElementById('drawer-responsibilities');
  const drawerReqsTitle = document.getElementById('drawer-reqs-title');
  const drawerReqs = document.getElementById('drawer-requirements');
  const drawerArticleBody = document.getElementById('drawer-article-body');
  const drawerApplyBtn = document.getElementById('drawer-apply-btn');

  let activeFilter = 'all';
  let activeMode = 'all';
  let searchQuery = '';

  function renderAll() {
    const q = searchQuery.toLowerCase().trim();
    const filterLower = activeFilter.toLowerCase();

    // 1. Filter Jobs
    const filteredJobs = CONTENT_REPOSITORY.jobs.filter(job => {
      const jobLoc = (job.location || '').toLowerCase();
      const jobMode = (job.workMode.en || job.workMode || '').toLowerCase();

      const isBurgasRegion = filterLower === 'burgas' && (
        jobLoc === 'burgas' || jobLoc.includes('sunny beach') || jobLoc.includes('primorsko')
      );

      const matchFilter = (activeFilter === 'all') ||
        isBurgasRegion ||
        (activeFilter === 'Remote' && (jobMode.includes('remote') || jobLoc === 'remote')) ||
        (activeFilter === 'Abroad' && (jobLoc === 'abroad' || jobMode.includes('abroad'))) ||
        (jobLoc === filterLower);

      const title = (job.title[lang] || job.title.en || '').toLowerCase();
      const company = (job.company[lang] || job.company.en || '').toLowerCase();
      const desc = (job.desc[lang] || job.desc.en || '').toLowerCase();

      return matchFilter && (q === '' || title.includes(q) || company.includes(q) || desc.includes(q) || jobLoc.includes(q));
    });

    // 2. Filter Articles
    const filteredArticles = CONTENT_REPOSITORY.articles.filter(art => {
      const title = (art.title[lang] || art.title.en || '').toLowerCase();
      const excerpt = (art.excerpt[lang] || art.excerpt.en || '').toLowerCase();
      const cat = (art.category[lang] || art.category.en || '').toLowerCase();

      return q === '' || title.includes(q) || excerpt.includes(q) || cat.includes(q);
    });

    if (countLabel) {
      countLabel.textContent = `${i18n.showing} ${filteredJobs.length} ${i18n.roles} • ${filteredArticles.length} ${i18n.articles}`;
    }

    // Render Jobs Grid
    if (gridContainer) {
      gridContainer.innerHTML = '';
      if (activeMode === 'articles') {
        gridContainer.style.display = 'none';
      } else {
        gridContainer.style.display = 'grid';
        if (filteredJobs.length === 0 && activeMode === 'jobs') {
          gridContainer.innerHTML = `
            <div class="no-results-card">
              <h3 class="no-results-title">${escapeHTML(i18n.noResultsTitle)}</h3>
              <p class="no-results-text">${escapeHTML(i18n.noResultsDesc)}</p>
            </div>
          `;
        } else {
          filteredJobs.forEach(job => {
            const card = document.createElement('article');
            card.className = 'job-card';
            card.setAttribute('data-id', job.id);

            const jobTitle = escapeHTML(job.title[lang] || job.title.en);
            const companyName = escapeHTML(job.company[lang] || job.company.en);
            const categoryName = escapeHTML(job.category[lang] || job.category.en);
            const modeName = escapeHTML(job.workMode[lang] || job.workMode.en);
            const typeName = escapeHTML(job.type[lang] || job.type.en);
            const descText = escapeHTML(job.desc[lang] || job.desc.en);

            const mailSubject = encodeURIComponent(`Application: ${jobTitle} (${companyName})`);
            const directApplyUrl = `mailto:${encodeURIComponent(job.applyEmail)}?subject=${mailSubject}`;

            card.innerHTML = `
              <header class="card-track-header">
                <span class="category-tag">${categoryName}</span>
                <span class="badge-test">${escapeHTML(i18n.testBadge)}</span>
              </header>

              <div class="card-track-title">
                <h2 class="job-h2">${jobTitle}</h2>
                <div class="company-meta">
                  <span>${companyName}</span>
                  <svg class="verified-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-label="Verified Employer">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
              </div>

              <div class="card-track-badges">
                <span class="attr-chip">${escapeHTML(job.location)}</span>
                <span class="attr-chip">${modeName}</span>
                <span class="attr-chip">${typeName}</span>
              </div>

              <p class="card-track-desc">${descText}</p>

              <div class="card-track-salary">
                <span class="salary-num">${escapeHTML(job.salary)}</span>
                <span class="salary-freq">${escapeHTML(i18n.perMonth)}</span>
              </div>

              <footer class="card-track-actions">
                <a href="${directApplyUrl}" class="btn btn-primary btn-sm" target="_blank" rel="nofollow noopener noreferrer" title="${escapeHTML(i18n.directNotice)}">${escapeHTML(i18n.apply)}</a>
                <a href="#${job.id}" class="btn btn-secondary btn-sm js-open-details" data-id="${job.id}" role="button">${escapeHTML(i18n.details)}</a>
              </footer>
            `;
            gridContainer.appendChild(card);
          });
        }
      }
    }

    // Render Articles Grid
    if (articlesContainer && articlesSection) {
      articlesContainer.innerHTML = '';
      if (activeMode === 'jobs' || filteredArticles.length === 0) {
        articlesSection.style.display = 'none';
      } else {
        articlesSection.style.display = 'block';
        filteredArticles.forEach(art => {
          const card = document.createElement('article');
          card.className = 'article-card';

          const artTitle = escapeHTML(art.title[lang] || art.title.en);
          const artCat = escapeHTML(art.category[lang] || art.category.en);
          const artExcerpt = escapeHTML(art.excerpt[lang] || art.excerpt.en);

          card.innerHTML = `
            <span class="article-badge">${artCat}</span>
            <h3 class="article-title">${artTitle}</h3>
            <p class="article-excerpt">${artExcerpt}</p>
            <div class="article-footer">
              <span>${art.date}</span>
              <a href="#${art.id}" class="btn btn-secondary btn-sm js-open-article" data-id="${art.id}" role="button">${escapeHTML(i18n.readArticle)}</a>
            </div>
          `;
          articlesContainer.appendChild(card);
        });
      }
    }
  }

  // Open Details Drawer for a Job
  function openJobDrawer(id) {
    const job = CONTENT_REPOSITORY.jobs.find(j => j.id === id);
    if (!job) return;

    drawerCategory.textContent = job.category[lang] || job.category.en;
    drawerTitle.textContent = job.title[lang] || job.title.en;
    drawerCompany.textContent = `${job.company[lang] || job.company.en} • ${job.location}`;
    drawerCompany.style.display = 'block';
    drawerSalary.style.display = 'flex';
    drawerSalary.querySelector('.salary-num').textContent = job.salary;

    // Red Test Warning Banner inside Drawer
    drawerDesc.innerHTML = `
      <div class="test-position-alert">${escapeHTML(i18n.testNotice)}</div>
      <div>${escapeHTML(job.desc[lang] || job.desc.en)}</div>
    `;

    drawerRespTitle.style.display = 'block';
    drawerResp.style.display = 'block';
    drawerResp.innerHTML = '';
    (job.responsibilities[lang] || job.responsibilities.en || []).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      drawerResp.appendChild(li);
    });

    drawerReqsTitle.style.display = 'block';
    drawerReqs.style.display = 'block';
    drawerReqs.innerHTML = '';
    (job.requirements[lang] || job.requirements.en || []).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      drawerReqs.appendChild(li);
    });

    drawerArticleBody.style.display = 'none';
    drawerApplyBtn.style.display = 'inline-flex';
    const mailSubject = encodeURIComponent(`Application: ${job.title[lang] || job.title.en}`);
    drawerApplyBtn.href = `mailto:${encodeURIComponent(job.applyEmail)}?subject=${mailSubject}`;
    drawerApplyBtn.textContent = `${i18n.apply} (${job.applyEmail})`;

    drawerBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  // Open Details Drawer for an Article
  function openArticleDrawer(id) {
    const art = CONTENT_REPOSITORY.articles.find(a => a.id === id);
    if (!art) return;

    drawerCategory.textContent = art.category[lang] || art.category.en;
    drawerTitle.textContent = art.title[lang] || art.title.en;
    drawerCompany.textContent = `Published: ${art.date} • Author: ${art.author}`;
    drawerSalary.style.display = 'none';
    drawerDesc.textContent = art.excerpt[lang] || art.excerpt.en;

    drawerRespTitle.style.display = 'none';
    drawerResp.style.display = 'none';
    drawerReqsTitle.style.display = 'none';
    drawerReqs.style.display = 'none';

    drawerArticleBody.style.display = 'block';
    drawerArticleBody.innerHTML = art.body[lang] || art.body.en;

    drawerApplyBtn.style.display = 'none';

    drawerBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawerBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, t => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[t] || t));
  }

  if (pillsContainer) {
    pillsContainer.addEventListener('click', (e) => {
      const anchor = e.target.closest('.filter-pill');
      if (!anchor) return;
      e.preventDefault();
      pillsContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      anchor.classList.add('active');
      activeFilter = anchor.getAttribute('data-filter');
      renderAll();
    });
  }

  if (modeContainer) {
    modeContainer.addEventListener('click', (e) => {
      const anchor = e.target.closest('.mode-pill');
      if (!anchor) return;
      e.preventDefault();
      modeContainer.querySelectorAll('.mode-pill').forEach(p => p.classList.remove('active'));
      anchor.classList.add('active');
      activeMode = anchor.getAttribute('data-mode');
      renderAll();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderAll();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    } else if (e.key === 'Escape' && drawerBackdrop.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  document.addEventListener('click', (e) => {
    const jobLink = e.target.closest('.js-open-details');
    if (jobLink) {
      e.preventDefault();
      openJobDrawer(jobLink.getAttribute('data-id'));
      return;
    }
    const artLink = e.target.closest('.js-open-article');
    if (artLink) {
      e.preventDefault();
      openArticleDrawer(artLink.getAttribute('data-id'));
      return;
    }
    const closeTrigger = e.target.closest('#drawer-close-btn, #drawer-dismiss-btn');
    if (closeTrigger) {
      e.preventDefault();
      closeDrawer();
      return;
    }
  });

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) closeDrawer();
    });
  }

  const initialHash = window.location.hash.replace('#', '');
  if (initialHash) {
    if (initialHash.startsWith('job-')) openJobDrawer(initialHash);
    else if (initialHash.startsWith('art-')) openArticleDrawer(initialHash);
  }

  renderAll();
});
