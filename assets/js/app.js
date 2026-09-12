/**
 * ==============================================================================
 * FILE: /assets/js/app.js
 * PROJECT: bestjobs.bg — Master Design Engine (Mobikom Network Unified)
 * LICENSE: MIT (https://opensource.org/licenses/MIT)
 * AUTHOR: Stoyan Stoyanov / Mobikom Bulgaria (mobikom.bg)
 * STANDARDS: CSS Grid Level 2 (Subgrid) • CSS Color Module 4 (light-dark)
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
      featured: "Featured",
      perMonth: "/ month",
      apply: "Apply to Employer",
      details: "Details",
      noResultsTitle: "No matching vacancies found",
      noResultsDesc: "Try adjusting your search query or selecting a different city filter.",
      directNotice: "Direct application to employer email. BestJobs.bg never intercepts your CV."
    },
    bg: {
      showing: "Показване на",
      roles: "проверени позиции",
      featured: "Препоръчана",
      perMonth: "/ на месец",
      apply: "Кандидатствай",
      details: "Детайли",
      noResultsTitle: "Няма намерени свободни позиции",
      noResultsDesc: "Моля, променете критериите за търсене или филтъра за град.",
      directNotice: "Директно кандидатстване към работодателя. BestJobs.bg не събира и не обработва CV-та."
    }
  }[lang];

  const gridContainer = document.getElementById('jobs-grid-container');
  const countLabel = document.getElementById('results-count-label');
  const searchInput = document.getElementById('live-search-input');
  const pillsContainer = document.getElementById('filter-pills-container');

  const drawerBackdrop = document.getElementById('job-drawer-backdrop');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerDismissBtn = document.getElementById('drawer-dismiss-btn');
  const drawerCategory = document.getElementById('drawer-category');
  const drawerTitle = document.getElementById('drawer-job-title');
  const drawerCompany = document.getElementById('drawer-company-line');
  const drawerSalary = document.getElementById('drawer-salary');
  const drawerDesc = document.getElementById('drawer-description');
  const drawerResp = document.getElementById('drawer-responsibilities');
  const drawerReqs = document.getElementById('drawer-requirements');
  const drawerApplyBtn = document.getElementById('drawer-apply-btn');

  let activeFilter = 'all';
  let searchQuery = '';
  let jobsDataset = [];

  const dataPath = window.location.pathname.includes('/bg/') ? '../assets/data/jobs.json' : 'assets/data/jobs.json';

  try {
    const res = await fetch(dataPath);
    jobsDataset = await res.json();
  } catch (e) {
    if (countLabel) countLabel.textContent = "Error loading jobs.";
    return;
  }

  function renderJobs() {
    gridContainer.innerHTML = '';

    const filtered = jobsDataset.filter(job => {
      const jobLoc = (job.location || '').toLowerCase();
      const jobMode = (job.workMode.en || job.workMode || '').toLowerCase();
      const filterLower = activeFilter.toLowerCase();

      // Aggregate Southern Coast under Burgas
      const isBurgasRegion = filterLower === 'burgas' && (
        jobLoc === 'burgas' || jobLoc.includes('sunny beach') || jobLoc.includes('primorsko')
      );

      const matchFilter = (activeFilter === 'all') ||
        isBurgasRegion ||
        (activeFilter === 'Remote' && (jobMode.includes('remote') || jobLoc === 'remote')) ||
        (activeFilter === 'Abroad' && (jobLoc === 'abroad' || jobMode.includes('abroad'))) ||
        (jobLoc === filterLower);

      const q = searchQuery.toLowerCase().trim();
      const title = (job.title[lang] || job.title.en || '').toLowerCase();
      const company = (job.company[lang] || job.company.en || '').toLowerCase();
      const desc = (job.desc[lang] || job.desc.en || '').toLowerCase();

      return matchFilter && (q === '' || title.includes(q) || company.includes(q) || desc.includes(q) || jobLoc.includes(q));
    });

    if (countLabel) countLabel.textContent = `${i18n.showing} ${filtered.length} ${i18n.roles}`;

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h3 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">${escapeHTML(i18n.noResultsTitle)}</h3>
          <p style="color: #64748b; font-size: 0.9375rem;">${escapeHTML(i18n.noResultsDesc)}</p>
        </div>
      `;
      return;
    }

    filtered.forEach(job => {
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

  function openDetails(id) {
    const job = jobsDataset.find(j => j.id === id);
    if (!job) return;

    const jobTitle = job.title[lang] || job.title.en;
    const companyName = job.company[lang] || job.company.en;

    drawerCategory.textContent = job.category[lang] || job.category.en;
    drawerTitle.textContent = jobTitle;
    drawerCompany.textContent = `${companyName} • ${job.location} (${job.workMode[lang] || job.workMode.en})`;
    drawerSalary.textContent = job.salary;
    drawerDesc.textContent = job.desc[lang] || job.desc.en;

    drawerResp.innerHTML = '';
    (job.responsibilities[lang] || job.responsibilities.en || []).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      drawerResp.appendChild(li);
    });

    drawerReqs.innerHTML = '';
    (job.requirements[lang] || job.requirements.en || []).forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      drawerReqs.appendChild(li);
    });

    const mailSubject = encodeURIComponent(`Application: ${jobTitle} (${companyName})`);
    drawerApplyBtn.href = `mailto:${encodeURIComponent(job.applyEmail)}?subject=${mailSubject}`;
    drawerApplyBtn.textContent = `${i18n.apply} (${job.applyEmail})`;

    drawerBackdrop.classList.add('is-open');
    drawerBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDetails() {
    drawerBackdrop.classList.remove('is-open');
    drawerBackdrop.setAttribute('aria-hidden', 'true');
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
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      pillsContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      renderJobs();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderJobs();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    } else if (e.key === 'Escape' && drawerBackdrop.classList.contains('is-open')) {
      closeDetails();
    }
  });

  if (gridContainer) {
    gridContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-open-details');
      if (btn) openDetails(btn.getAttribute('data-id'));
    });
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDetails);
  if (drawerDismissBtn) drawerDismissBtn.addEventListener('click', closeDetails);
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) closeDetails();
    });
  }

  // Deep-Link Auto-Opener (e.g. bestjobs.bg/bg/#job-05)
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash) {
    openDetails(initialHash);
  }

  renderJobs();
});
