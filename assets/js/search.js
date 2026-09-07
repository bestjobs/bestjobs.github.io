/**
 * ==============================================================================
 * FILE: /assets/js/search.js
 * PROJECT: bestjobs.bg (Mobikom Network Unified)
 * LICENSE: MIT (https://opensource.org/licenses/MIT)
 * AUTHOR: Stoyan Stoyanov / Mobikom Bulgaria (mobikom.bg)
 * ==============================================================================
 */
(() => {
  const input = document.getElementById('search-input');
  const cards = Array.from(document.querySelectorAll('.feature-card'));
  const pills = document.querySelectorAll('.filter-pill');
  if (!cards.length) return;

  let activeFilter = 'all';

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

  const index = cards.map(el => ({
    el,
    raw: (el.getAttribute('data-searchable') || el.textContent).toLowerCase(),
    norm: normalize(el.getAttribute('data-searchable') || el.textContent)
  }));

  function filter() {
    const q = (input ? input.value : '').toLowerCase().trim();
    const qNorm = normalize(q);

    index.forEach(item => {
      const matchQuery = !q || item.raw.includes(q) || item.norm.includes(qNorm);
      const matchFilter = activeFilter === 'all' || item.raw.includes(activeFilter);

      if (matchQuery && matchFilter) {
        item.el.removeAttribute('hidden');
      } else {
        item.el.setAttribute('hidden', '');
      }
    });
  }

  if (input) input.addEventListener('input', filter);

  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.getAttribute('data-filter').toLowerCase();

      const url = new URL(window.location);
      if (activeFilter === 'all') url.searchParams.delete('filter');
      else url.searchParams.set('filter', activeFilter);
      window.history.replaceState({}, '', url);

      filter();
    });
  });

  const params = new URLSearchParams(window.location.search);
  const initial = params.get('filter');
  if (initial) {
    const target = Array.from(pills).find(p => p.getAttribute('data-filter') === initial);
    if (target) {
      pills.forEach(p => p.classList.remove('active'));
      target.classList.add('active');
      activeFilter = initial;
      filter();
    }
  }
})();
