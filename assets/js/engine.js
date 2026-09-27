(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initStreamAudioPlayer();
    initFilterSystem();
  });

  function initStreamAudioPlayer() {
    if (!('speechSynthesis' in window)) return;

    const streamBtn = document.getElementById('btn-stream-audio');
    if (!streamBtn) return;

    let isPlaying = false;

    streamBtn.addEventListener('click', (e) => {
      e.preventDefault();

      if (isPlaying || window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        isPlaying = false;
        streamBtn.textContent = '🔊 Listen to Vacancy Stream';
        return;
      }

      window.speechSynthesis.cancel();
      isPlaying = true;
      streamBtn.textContent = '⏹ Stop Listening';

      const visibleCards = Array.from(document.querySelectorAll('.job-card:not([hidden])'));
      if (visibleCards.length === 0) {
        isPlaying = false;
        streamBtn.textContent = '🔊 Listen to Vacancy Stream';
        return;
      }

      let currentIndex = 0;

      function speakNextCard() {
        if (!isPlaying || currentIndex >= visibleCards.length) {
          isPlaying = false;
          streamBtn.textContent = '🔊 Listen to Vacancy Stream';
          return;
        }

        const card = visibleCards[currentIndex];
        const title = card.querySelector('h3')?.textContent.trim() || '';
        const company = card.querySelector('.card-company')?.textContent.trim() || '';
        const salary = card.querySelector('.salary-figure')?.textContent.trim() || '';

        const text = `Vacancy ${currentIndex + 1}: ${title} at ${company}. Gross monthly salary: ${salary}.`;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.95;

        utterance.onend = () => {
          currentIndex++;
          speakNextCard();
        };

        utterance.onerror = () => {
          isPlaying = false;
          streamBtn.textContent = '🔊 Listen to Vacancy Stream';
        };

        window.speechSynthesis.speak(utterance);
      }

      speakNextCard();
    });
  }

  function initFilterSystem() {
    const industrySelect = document.getElementById('filter-industry');
    const citySelect = document.getElementById('filter-city');
    const typeSelect = document.getElementById('filter-type');
    const chipLinks = document.querySelectorAll('.chip-btn');
    const cards = document.querySelectorAll('.job-card');

    let activeTag = null;

    function applyFilters() {
      const selectedInd = industrySelect ? industrySelect.value : '';
      const selectedCity = citySelect ? citySelect.value : '';
      const selectedType = typeSelect ? typeSelect.value : '';

      cards.forEach((card) => {
        const ind = card.getAttribute('data-industry') || '';
        const city = card.getAttribute('data-city') || '';
        const type = card.getAttribute('data-type') || '';
        const chipsText = card.querySelector('.card-chips-row')?.textContent.toLowerCase() || '';

        const matchesInd = !selectedInd || ind === selectedInd;
        const matchesCity = !selectedCity || city === selectedCity;
        const matchesType = !selectedType || type === selectedType;
        const matchesTag = !activeTag || chipsText.includes(activeTag.toLowerCase());

        if (matchesInd && matchesCity && matchesType && matchesTag) {
          card.removeAttribute('hidden');
        } else {
          card.setAttribute('hidden', '');
        }
      });
    }

    if (industrySelect) industrySelect.addEventListener('change', applyFilters);
    if (citySelect) citySelect.addEventListener('change', applyFilters);
    if (typeSelect) typeSelect.addEventListener('change', applyFilters);

    chipLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tag = link.getAttribute('data-tag');

        if (activeTag === tag) {
          activeTag = null;
          link.classList.remove('active');
        } else {
          chipLinks.forEach((other) => other.classList.remove('active'));
          activeTag = tag;
          link.classList.add('active');
        }

        applyFilters();
      });
    });
  }
})();
