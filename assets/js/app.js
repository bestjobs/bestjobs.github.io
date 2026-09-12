/**
 * ==============================================================================
 * FILE: /assets/js/app.js
 * PROJECT: bestjobs.bg — Master Design Engine (Mobikom Network Unified)
 * LICENSE: MIT (https://opensource.org/licenses/MIT)
 * AUTHOR: Stoyan Stoyanov, MBM / MD • Mobikom Bulgaria (mobikom.bg)
 * STANDARDS: CSS Grid Level 2 (Subgrid) • Unified Jobs & Articles Search
 * COMPLIANCE: Strict CSP Level 3 • Zero !important • Zero Cookies
 * PERFORMANCE: Sub-14KB Single-Pass Engine • Native System Typography
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', async () => {
  const lang = (document.documentElement.lang || 'en').toLowerCase().startsWith('bg') ? 'bg' : 'en';

  const i18n = {
    en: {
      showing: "Showing",
      roles: "verified roles",
      articles: "articles & reports",
      featured: "Featured",
      perMonth: "/ month",
      apply: "Apply to Employer",
      details: "Details",
      readArticle: "Read Analysis",
      noResultsTitle: "No matching results found",
      noResultsDesc: "Try adjusting your keywords or clearing the city filters.",
      directNotice: "Direct application to employer email. BestJobs.bg never intercepts your CV.",
      allTab: "All Content",
      jobsTab: "Job Vacancies",
      articlesTab: "Economic Reports"
    },
    bg: {
      showing: "Показване на",
      roles: "проверени позиции",
      articles: "анализи и доклади",
      featured: "Препоръчана",
      perMonth: "/ на месец",
      apply: "Кандидатствай",
      details: "Детайли",
      readArticle: "Прочети анализа",
      noResultsTitle: "Няма намерени резултати",
      noResultsDesc: "Моля, променете ключовите думи или изчистете филтрите за град.",
      directNotice: "Директно кандидатстване към работодателя. BestJobs.bg не събира и не обработва CV-та.",
      allTab: "Всичко",
      jobsTab: "Обяви за работа",
      articlesTab: "Икономически доклади"
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

  // Drawer Elements
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
  let activeMode = 'all'; // 'all', 'jobs', 'articles'
  let searchQuery = '';
  let contentData = { jobs: [], articles: [] };

  const dataPath = window.location.pathname.includes('/bg/') ? '../assets/data/content.json' : 'assets/data/content.json';

  try {
    const res = await fetch(dataPath);
    contentData = await res.json();
  } catch (e) {
    if (countLabel) countLabel.textContent = "Error loading content repository.";
    return;
  }

  // Unified Rendering Engine
  function renderAll() {
    const q = searchQuery.toLowerCase().trim();
    const filterLower = activeFilter.toLowerCase();

    // 1. Filter Jobs
    const filteredJobs = contentData.jobs.filter(job => {
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

      const matchSearch = q === '' || title.includes(q) || company.includes(q) || desc.includes(q) || jobLoc.includes(q);
      return matchFilter && matchSearch;
    });

    // 2. Filter Articles
    const filteredArticles = contentData.articles.filter(art => {
      const title = (art.title[lang] || art.title.en || '').toLowerCase();
      const excerpt = (art.excerpt[lang] || art.excerpt.en || '').toLowerCase();
      const cat = (art.category[lang] || art.category.en || '').toLowerCase();

      return q === '' || title.includes(q) || excerpt.includes(q) || cat.includes(q);
    });

    // Update Counter
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
                ${job.featured ? `<span class="featured-tag">${escapeHTML(i18n.featured)}</span>` : ''}
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
                <a href="${directApplyUrl}" class="btn btn-primary btn-sm" rel="nofollow noopener noreferrer" title="${escapeHTML(i18n.directNotice)}">${escapeHTML(i18n.apply)}</a>
                <button type="button" class="btn btn-secondary btn-sm js-open-details" data-id="${job.id}">${escapeHTML(i18n.details)}</button>
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
              <button type="button" class="btn btn-secondary btn-sm js-open-article" data-id="${art.id}">${escapeHTML(i18n.readArticle)}</button>
            </div>
          `;
          articlesContainer.appendChild(card);
        });
      }
    }
  }

  // Open Details Drawer for a Job
  function openJobDrawer(id) {
    const job = contentData.jobs.find(j => j.id === id);
    if (!job) return;

    drawerCategory.textContent = job.category[lang] || job.category.en;
    drawerTitle.textContent = job.title[lang] || job.title.en;
    drawerCompany.textContent = `${job.company[lang] || job.company.en} • ${job.location}`;
    drawerCompany.style.display = 'block';
    drawerSalary.style.display = 'flex';
    drawerSalary.querySelector('.salary-num').textContent = job.salary;
    drawerDesc.textContent = job.desc[lang] || job.desc.en;

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
    const art = contentData.articles.find(a => a.id === id);
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

  // Filter Pills Listener
  if (pillsContainer) {
    pillsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      pillsContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      renderAll();
    });
  }

  // Segment Mode Switch (All / Jobs / Articles)
  if (modeContainer) {
    modeContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.mode-pill');
      if (!btn) return;
      modeContainer.querySelectorAll('.mode-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      activeMode = btn.getAttribute('data-mode');
      renderAll();
    });
  }

  // Live Search Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderAll();
    });
  }

  // Hotkey '/' focuses search, 'Escape' closes drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    } else if (e.key === 'Escape' && drawerBackdrop.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Delegated Clicks for Jobs and Articles
  document.addEventListener('click', (e) => {
    const jobBtn = e.target.closest('.js-open-details');
    if (jobBtn) {
      openJobDrawer(jobBtn.getAttribute('data-id'));
      return;
    }
    const artBtn = e.target.closest('.js-open-article');
    if (artBtn) {
      openArticleDrawer(artBtn.getAttribute('data-id'));
      return;
    }
  });

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerDismissBtn) drawerDismissBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) closeDrawer();
    });
  }

  // Deep-Link URL Hash Resolver (#job-01 or #art-01)
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash) {
    if (initialHash.startsWith('job-')) openJobDrawer(initialHash);
    else if (initialHash.startsWith('art-')) openArticleDrawer(initialHash);
  }

  renderAll();
});
