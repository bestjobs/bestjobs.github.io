// bestjobs.bg - High Performance Link-Only Filter Engine (<2KB)
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

  // Pre-index for instantaneous sub-millisecond search
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

  // Link-Based Location Filter Dispatcher
  filterLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      filterLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      activeFilter = link.dataset.filter.toLowerCase();
      
      // Update browser URL state securely without reload
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

  // Link-Based Layout View Switcher
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

  // Check URL Parameters on Load
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
