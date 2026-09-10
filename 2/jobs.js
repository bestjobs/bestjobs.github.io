/* ==============================================================================
   BESTJOBS.BG /2/ — Live Subgrid Matrix Controller (Zero-eval, Strict CSP)
   ============================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('job-search');
  const pills = document.querySelectorAll('.pill-btn');
  const cards = document.querySelectorAll('.job-card');

  let activeFilter = 'all';

  // Keyboard shortcut: Press '/' anywhere to jump to search
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  function applyFilter() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    cards.forEach(function (card) {
      const location = card.getAttribute('data-location') || '';
      const tags = card.getAttribute('data-tags') || '';
      const text = card.innerText.toLowerCase();

      const matchesPill = (activeFilter === 'all') || location.includes(activeFilter);
      const matchesSearch = (query === '') || text.includes(query) || tags.includes(query);

      if (matchesPill && matchesSearch) {
        card.style.display = 'grid';
      } else {
        card.style.display = 'none';
      }
    });
  }

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      pills.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      activeFilter = this.getAttribute('data-filter') || 'all';
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilter);
  }
});
