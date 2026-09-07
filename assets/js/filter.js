/**
 * bestjobs.bg - High-Performance, Privacy-First Job Board Engine
 * File: /assets/js/filter.js
 * Description: Zero-dependency client-side engine under 2KB. Implements bi-directional
 *              Latin <-> Cyrillic phonetic normalization, link-only filter dispatching
 *              with History API state persistence, and subgrid view preferences.
 * 
 * SPDX-License-Identifier: MIT
 * License: MIT License (https://opensource.org/licenses/MIT)
 * Copyright (c) 2026 bestjobs.bg
 */

(() => {
  const searchInput = document.getElementById('job-search');
  const feed = document.getElementById('feed');
  const cards = Array.from(feed.querySelectorAll('.job-card'));
  const filterLinks = document.querySelectorAll('#location-filters .pill-link');
  const viewLinks = document.querySelectorAll('.layout-switcher .view-link');

  let activeFilter = 'all';

  // Bi-directional phonetic mapping for Bulgarian transliteration
  const bgMap = {
    'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'e': 'е', 'zh': 'ж',
    'z': 'з', 'i': 'и', 'y': 'й', 'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н',
    'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у', 'f': 'ф',
    'h': 'х', 'ts': 'ц', 'ch': 'ч', 'sh': 'ш', 'sht': 'щ', 'yu': 'ю', 'ya': 'я'
  };

  function normalize(str) {
    let s = str.toLowerCase().trim();
    for (const [lat, cyr] of Object.entries(bgMap)) {
      s = s.replaceAll(lat, cyr);
    }
    return s;
  }

  // Pre-index text to achieve sub-millisecond search without memory churn
  const index = cards.map(card => ({
    element: card,
    text: (card.textContent + ' ' + (card.dataset.tags || '')).toLowerCase(),
    norm: normalize(card.textContent + ' ' + (card.dataset.tags || ''))
  }));

  function runFilter() {
    const q = searchInput.value.toLowerCase().trim();
    const qNorm = normalize(q);

    index.forEach(item => {
      const matchesText = !q || item.text.includes(q) || item.norm.includes(qNorm);
      const matchesFilter = activeFilter === 'all' || item.text.includes(activeFilter);

      if (matchesText && matchesFilter) {
        item.element.removeAttribute('hidden');
      } else {
        item.element.setAttribute('hidden', '');
      }
    });
  }

  searchInput.addEventListener('input', runFilter);

  // Link-based Location Filter Handling
  filterLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      filterLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      activeFilter = link.dataset.filter.toLowerCase();
      
      const url = new URL(window.location);
      if (activeFilter === 'all') {
        url.searchParams.delete('filter');
      } else {
        url.searchParams.set('filter', activeFilter);
      }
      window.history.replaceState({}, '', url);

      runFilter();
    });
  });

  // Link-based Layout Switcher
  function setView(mode) {
    feed.dataset.view = mode;
    viewLinks.forEach(l => {
      if (l.dataset.view === mode) {
        l.classList.add('active');
      } else {
        l.classList.remove('active');
      }
    });
    localStorage.setItem('bj_view_pref', mode);
  }

  viewLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const mode = link.dataset.view;
      setView(mode);

      const url = new URL(window.location);
      url.searchParams.set('view', mode);
      window.history.replaceState({}, '', url);
    });
  });

  // Restore State on Fresh Load
  const params = new URLSearchParams(window.location.search);
  const initialFilter = params.get('filter');
  const initialView = params.get('view') || localStorage.getItem('bj_view_pref');

  if (initialFilter) {
    const target = Array.from(filterLinks).find(l => l.dataset.filter === initialFilter);
    if (target) {
      filterLinks.forEach(l => l.classList.remove('active'));
      target.classList.add('active');
      activeFilter = initialFilter;
    }
  }

  if (initialView && (initialView === 'list' || initialView === 'grid')) {
    setView(initialView);
  }

  runFilter();
})();
