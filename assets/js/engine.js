(() => {
  'use strict';

  let liveAnnouncer = null;

  document.addEventListener('DOMContentLoaded', () => {
    initLiveAnnouncer();
    initStreamAudioPlayer();
    initArticleVoiceReader();
    initAntiBotGate();
    initFilterSystem();
    initViewSwitcher();
    initLoadMore();
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

  function getCleanSummary(text) {
    if (!text) return '';
    const clean = text.replace(/\s+/g, ' ').trim();
    if (clean.length <= 140) return clean;
    const sentences = clean.split(/[.!?]+/);
    return sentences[0] ? sentences[0].trim() + '.' : clean.slice(0, 140) + '...';
  }

  function initAntiBotGate() {
    const gateBox = document.querySelector('.anti-bot-gate');
    if (!gateBox) return;

    const num1 = Math.floor(Math.random() * 6) + 1;
    const num2 = Math.floor(Math.random() * 5) + 1;
    const expected = num1 + num2;

    const equationEl = gateBox.querySelector('.math-equation');
    const selectEl = gateBox.querySelector('.math-select');
    const applyBtn = gateBox.querySelector('.gate-actions-row .btn-direct-apply');
    const mailtoHref = gateBox.getAttribute('data-mailto') || '#';
    const btnActiveText = gateBox.getAttribute('data-btn-text') || 'Apply with Email &rarr;';
    const isBg = (gateBox.getAttribute('data-lang') || 'en') === 'bg';

    if (equationEl) equationEl.textContent = `${num1} + ${num2}`;

    if (selectEl) {
      const options = [expected - 1, expected, expected + 2, expected + 1].sort(() => Math.random() - 0.5);
      const uniqueOptions = Array.from(new Set(options)).filter(n => n > 0);

      uniqueOptions.forEach(optVal => {
        const opt = document.createElement('option');
        opt.value = String(optVal);
        opt.textContent = String(optVal);
        selectEl.appendChild(opt);
      });

      selectEl.addEventListener('change', () => {
        if (parseInt(selectEl.value, 10) === expected) {
          applyBtn.classList.remove('disabled');
          applyBtn.setAttribute('href', mailtoHref);
          applyBtn.innerHTML = btnActiveText;
          applyBtn.setAttribute('title', isBg ? 'Кандидатствайте директно по имейл' : 'Send application directly via email');
          announce(isBg ? 'Проверката е успешна. Бутонът за кандидатстване е отключен.' : 'Verification passed. Application button unlocked.');
        } else {
          applyBtn.classList.add('disabled');
          applyBtn.setAttribute('href', '#apply');
          applyBtn.textContent = isBg ? 'Грешен отговор &bull; Опитайте отново' : 'Incorrect &bull; Try Again';
          announce(isBg ? 'Грешен отговор на проверката.' : 'Incorrect math answer.');
        }
      });
    }
  }

  function initArticleVoiceReader() {
    if (!('speechSynthesis' in window)) return;
    const btn = document.getElementById('btn-read-article');
    if (!btn) return;

    const isBg = (document.documentElement.lang || '').toLowerCase().startsWith('bg');
    let isSpeaking = false;

    const stopArticleVoice = () => {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      btn.textContent = isBg ? '🔊 Прочети на глас' : '🔊 Read Aloud';
    };

    btn.addEventListener('click', (e) => {
      e.preventDefault();

      if (isSpeaking || window.speechSynthesis.speaking) {
        stopArticleVoice();
        return;
      }

      const contentBox = document.querySelector('article.audit-box, main .shell, main .shell-prose');
      if (!contentBox) return;

      const title = contentBox.querySelector('h1')?.textContent.trim() || '';
      const textNodes = Array.from(contentBox.querySelectorAll('p, li'));
      const textToRead = textNodes.map(n => n.textContent.trim()).filter(Boolean).join('. ');

      const fullText = `${title}. ${textToRead}`;
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = isBg ? 'bg-BG' : 'en-US';
      utterance.rate = 0.95;

      isSpeaking = true;
      btn.textContent = isBg ? '⏹ Спри четенето' : '⏹ Stop Reading';

      utterance.onend = stopArticleVoice;
      utterance.onerror = stopArticleVoice;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });
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
      const rawNet = card.querySelector('.salary-net-calc')?.textContent.trim() || '';
      const rawDesc = card.querySelector('.card-text-summary, p')?.textContent.trim() || '';

      const cleanNet = rawNet.replace(/[()~]/g, '').replace(/^(нето|net)\s*/i, '').trim();
      const desc = getCleanSummary(rawDesc);

      let phrase = '';
      if (salary) {
        phrase = isBg
          ? `Обява ${currentIndex + 1}: ${title}${company ? ' в ' + company : ''}. Възнаграждение: ${salary}${cleanNet ? ', чисто ' + cleanNet : ''}. ${desc}`
          : `Vacancy ${currentIndex + 1}: ${title}${company ? ' at ' + company : ''}. Remuneration: ${salary}${cleanNet ? ', net ' + cleanNet : ''}. ${desc}`;
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
    const searchBtn = document.getElementById('btn-filter-search');
    const resetBtn = document.getElementById('btn-filter-reset');
    const cards = Array.from(document.querySelectorAll('.job-card'));
    const loadMoreBtn = document.getElementById('btn-load-more');

    if (!industrySelect && !citySelect && !typeSelect && chipLinks.length === 0) return;

    const isBg = (document.documentElement.lang || '').toLowerCase().startsWith('bg');
    let activeTag = null;

    const tagSynonyms = {
      'disconnect': ['disconnect', 'изключване'],
      'medical': ['medical', 'прегледи', 'медицински'],
      'transit': ['transit', 'транспорт', 'shuttle'],
      'bike': ['bike', 'велосипед'],
      'smoke-free': ['smoke-free', 'непушачи'],
      'fruits': ['fruits', 'плодове', 'вода'],
      'dental': ['dental', 'дентален', 'зъболекар'],
      'housing': ['housing', 'жилищна', 'квартира'],
      '4-day': ['4-day', '4-дневна', 'седмица'],
      'car': ['car', 'автомобил', 'служебен'],
      'insurance': ['insurance', 'здравно', 'осигуряване'],
      'bonus': ['bonus', 'бонус', 'резултати'],
      'tuition': ['tuition', 'обучителни', 'квалификация'],
      'kindergarten': ['kindergarten', 'градина', 'детска'],
      'relocation': ['relocation', 'релокация', 'преместване'],
      'mental': ['mental', 'възстановяване', 'психологическо'],
      'sabbatical': ['sabbatical', 'сабатикъл', 'творчески'],
      'sober': ['sober', 'трезвост', 'алкохол'],
      'flight': ['flight', 'полет', 'самолетни'],
      'tax-free': ['tax-free', 'необлагаем', 'дипломатически'],
      'child-edu': ['child-edu', 'образование', 'деца'],
      'flexitime': ['flexitime', 'гъвкаво', 'плаващо'],
      'eco-transit': ['eco-transit', 'екологичен', 'зелен']
    };

    const applyMultiFilter = (e) => {
      if (e) e.preventDefault();

      const sInd = (industrySelect?.value || '').toLowerCase().trim();
      const sCity = (citySelect?.value || '').toLowerCase().trim();
      const sType = (typeSelect?.value || '').toLowerCase().trim();

      let matchCount = 0;
      const synonyms = activeTag ? (tagSynonyms[activeTag] || [activeTag]) : [];

      cards.forEach((card) => {
        const ind = (card.getAttribute('data-industry') || '').toLowerCase().trim();
        const city = (card.getAttribute('data-city') || '').toLowerCase().trim();
        const type = (card.getAttribute('data-type') || '').toLowerCase().trim();
        const cardText = card.textContent.toLowerCase();

        const matchesInd = !sInd || ind === sInd;
        const matchesCity = !sCity || city === sCity;
        const matchesType = !sType || type === sType;
        const matchesTag = !activeTag || synonyms.some(term => cardText.includes(term.toLowerCase()));

        if (matchesInd && matchesCity && matchesType && matchesTag) {
          card.removeAttribute('hidden');
          matchCount++;
        } else {
          card.setAttribute('hidden', '');
        }
      });

      if (loadMoreBtn) {
        loadMoreBtn.setAttribute('hidden', '');
      }

      announce(isBg ? `Намерени резултати: ${matchCount}` : `Matched results: ${matchCount}`);
    };

    const resetFilters = (e) => {
      if (e) e.preventDefault();
      if (industrySelect) industrySelect.value = '';
      if (citySelect) citySelect.value = '';
      if (typeSelect) typeSelect.value = '';

      activeTag = null;
      chipLinks.forEach(c => c.classList.remove('active'));

      cards.forEach((card, idx) => {
        if (idx < 21) {
          card.removeAttribute('hidden');
        } else {
          card.setAttribute('hidden', '');
        }
      });

      if (loadMoreBtn && cards.length > 21) {
        loadMoreBtn.removeAttribute('hidden');
      }

      announce(isBg ? 'Филтрите са нулирани.' : 'Filters reset.');
    };

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
      });
    });

    if (searchBtn) {
      searchBtn.addEventListener('click', applyMultiFilter);
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', resetFilters);
    }
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

  function initLoadMore() {
    const loadMoreBtn = document.getElementById('btn-load-more');
    const cards = Array.from(document.querySelectorAll('.job-card'));
    if (!loadMoreBtn || cards.length <= 21) {
      if (loadMoreBtn) loadMoreBtn.setAttribute('hidden', '');
      return;
    }

    const PAGE_SIZE = 21;
    let visibleCount = PAGE_SIZE;

    for (let i = PAGE_SIZE; i < cards.length; i++) {
      cards[i].setAttribute('hidden', '');
    }

    loadMoreBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const nextBatch = cards.slice(visibleCount, visibleCount + PAGE_SIZE);
      nextBatch.forEach(c => c.removeAttribute('hidden'));

      visibleCount += nextBatch.length;

      if (visibleCount >= cards.length) {
        loadMoreBtn.setAttribute('hidden', '');
      }

      announce(`Показани още ${nextBatch.length} позиции.`);
    });
  }
})();
