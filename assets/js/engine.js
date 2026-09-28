(() => {
  'use strict';

  let liveAnnouncer = null;

  document.addEventListener('DOMContentLoaded', () => {
    initLiveAnnouncer();
    initStreamAudioPlayer();
    initFilterSystem();
    initViewSwitcher();
  });

  function initLiveAnnouncer() {
    liveAnnouncer = document.getElementById('a11y-announcer');
    if (!liveAnnouncer) {
      liveAnnouncer = document.createElement('div');
      liveAnnouncer.id = 'a11y-announcer';
      liveAnnouncer.setAttribute('aria-live', 'polite');
      liveAnnouncer.setAttribute('aria-atomic', 'true');
      liveAnnouncer.style.position = 'absolute';
      liveAnnouncer.style.width = '1px';
      liveAnnouncer.style.height = '1px';
      liveAnnouncer.style.padding = '0';
      liveAnnouncer.style.margin = '-1px';
      liveAnnouncer.style.overflow = 'hidden';
      liveAnnouncer.style.clip = 'rect(0, 0, 0, 0)';
      liveAnnouncer.style.whiteSpace = 'nowrap';
      liveAnnouncer.style.border = '0';
      document.body.appendChild(liveAnnouncer);
    }
  }

  function announce(msg) {
    if (liveAnnouncer) {
      liveAnnouncer.textContent = '';
      setTimeout(() => {
        liveAnnouncer.textContent = msg;
      }, 50);
    }
  }

  function initStreamAudioPlayer() {
    if (!('speechSynthesis' in window)) return;

    const streamBtn = document.getElementById('btn-stream-audio');
    if (!streamBtn) return;

    const isBg = (document.documentElement.lang || '').toLowerCase().startsWith('bg');
    const i18n = {
      lang: isBg ? 'bg-BG' : 'en-US',
      play: isBg ? '🔊 Слушай потока' : '🔊 Listen to Stream',
      stop: isBg ? '⏹ Спри четенето' : '⏹ Stop Listening'
    };

    let isPlaying = false;
    let currentIndex = 0;
    let visibleCards = [];

    const stopPlayback = () => {
      window.speechSynthesis.cancel();
      isPlaying = false;
      streamBtn.textContent = i18n.play;
    };

    const speakNextCard = () => {
      if (!isPlaying || currentIndex >= visibleCards.length) {
        stopPlayback();
        return;
      }

      const card = visibleCards[currentIndex];
      const title = card.querySelector('h3, h2')?.textContent.trim() || '';
      const company = card.querySelector('.card-company')?.textContent.trim() || '';
      const salary = card.querySelector('.salary-figure')?.textContent.trim() || '';
      const desc = card.querySelector('.card-text-summary, p')?.textContent.trim() || '';

      let phrase = '';
      if (salary) {
        phrase = isBg
          ? `Обява ${currentIndex + 1}: ${title}${company ? ' в ' + company : ''}. Брутна заплата: ${salary}.`
          : `Vacancy ${currentIndex + 1}: ${title}${company ? ' at ' + company : ''}. Gross monthly salary: ${salary}.`;
      } else {
        phrase = isBg
          ? `Секция ${currentIndex + 1}: ${title}. ${desc}`
          : `Section ${currentIndex + 1}: ${title}. ${desc}`;
      }

      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = i18n.lang;
      utterance.rate = 0.95;

      utterance.onend = () => {
        currentIndex++;
        speakNextCard();
      };

      utterance.onerror = stopPlayback;

      window.speechSynthesis.speak(utterance);
    };

    streamBtn.addEventListener('click', (e) => {
      e.preventDefault();

      if (isPlaying || window.speechSynthesis.speaking) {
        stopPlayback();
        return;
      }

      window.speechSynthesis.cancel();
      visibleCards = Array.from(document.querySelectorAll('.job-card:not([hidden]), .portal-card:not([hidden]), article:not([hidden])'));

      if (visibleCards.length === 0) {
        stopPlayback();
        return;
      }

      isPlaying = true;
      currentIndex = 0;
      streamBtn.textContent = i18n.stop;
      speakNextCard();
    });
  }

  function initFilterSystem() {
    const industrySelect = document.getElementById('filter-industry');
    const citySelect = document.getElementById('filter-city');
    const typeSelect = document.getElementById('filter-type');
    const chipLinks = document.querySelectorAll('.chip-btn');
    const cards = document.querySelectorAll('.job-card');

    if (!industrySelect && !citySelect && !typeSelect && chipLinks.length === 0) return;

    const isBg = (document.documentElement.lang || '').toLowerCase().startsWith('bg');
    let activeTag = null;

    const applyFilters = () => {
      const sInd = industrySelect?.value || '';
      const sCity = citySelect?.value || '';
      const sType = typeSelect?.value || '';
      const searchTag = activeTag ? activeTag.toLowerCase() : null;

      let matchCount = 0;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const ind = card.getAttribute('data-industry') || '';
        const city = card.getAttribute('data-city') || '';
        const type = card.getAttribute('data-type') || '';
        const chips = searchTag ? (card.querySelector('.card-chips-row')?.textContent.toLowerCase() || '') : '';

        const visible = (!sInd || ind === sInd) &&
                        (!sCity || city === sCity) &&
                        (!sType || type === sType) &&
                        (!searchTag || chips.includes(searchTag));

        if (visible) {
          card.removeAttribute('hidden');
          matchCount++;
        } else {
          card.setAttribute('hidden', '');
        }
      }

      announce(isBg ? `Филтрирани: ${matchCount} резултата.` : `Filtered: ${matchCount} results.`);
    };

    industrySelect?.addEventListener('change', applyFilters);
    citySelect?.addEventListener('change', applyFilters);
    typeSelect?.addEventListener('change', applyFilters);

    chipLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tag = link.getAttribute('data-tag');

        if (activeTag === tag) {
          activeTag = null;
          link.classList.remove('active');
        } else {
          for (let i = 0; i < chipLinks.length; i++) {
            chipLinks[i].classList.remove('active');
          }
          activeTag = tag;
          link.classList.add('active');
        }

        applyFilters();
      });
    });
  }

  function initViewSwitcher() {
    const container = document.getElementById('jobs-container');
    const viewButtons = document.querySelectorAll('.view-btn');
    if (!container || viewButtons.length === 0) return;

    const isBg = (document.documentElement.lang || '').toLowerCase().startsWith('bg');
    const viewLabels = {
      grid: isBg ? 'Изглед карти' : 'Cards view',
      rows: isBg ? 'Изглед редове' : 'Rows view',
      accordion: isBg ? 'Разгъващ се изглед' : 'Accordion view',
      ticker: isBg ? 'Бюлетин изглед' : 'Bulletin ticker view'
    };

    viewButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const view = btn.getAttribute('data-view') || 'grid';

        container.setAttribute('data-view', view);

        viewButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        announce(viewLabels[view] || view);
      });
    });
  }
})();
