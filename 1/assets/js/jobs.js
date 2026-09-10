/* ==============================================================================
   BESTJOBS.BG — High-Performance Client Filter Engine (CSP Level 3 Compliant)
   ============================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('search-jobs');
  const locationSelect = document.getElementById('location-filter');
  const resetBtn = document.getElementById('reset-filters');
  const jobCards = document.querySelectorAll('.job-card');
  const countDisplay = document.getElementById('visible-count');

  function filterJobs() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedLocation = locationSelect ? locationSelect.value.toLowerCase() : '';
    let visible = 0;

    jobCards.forEach(function (card) {
      const title = card.getAttribute('data-title') || '';
      const tags = card.getAttribute('data-tags') || '';
      const location = card.getAttribute('data-location') || '';

      const matchesSearch = query === '' || title.includes(query) || tags.includes(query);
      const matchesLocation = selectedLocation === '' || location.includes(selectedLocation);

      if (matchesSearch && matchesLocation) {
        card.style.display = 'grid';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countDisplay) {
      countDisplay.textContent = visible;
    }
  }

  if (searchInput) searchInput.addEventListener('input', filterJobs);
  if (locationSelect) locationSelect.addEventListener('change', filterJobs);
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (searchInput) searchInput.value = '';
      if (locationSelect) locationSelect.value = '';
      filterJobs();
    });
  }

  // Prevent accidental form submission
  const searchForm = document.getElementById('jobs-filter-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
    });
  }
});
