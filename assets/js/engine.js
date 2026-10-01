(() => {
  'use strict';

  let liveAnnouncer = null;
  let audioCtx = null;

  document.addEventListener('DOMContentLoaded', () => {
    initLiveAnnouncer();
    initElevatorSystem();
    initTvCompactPlayer();
    initConciergeDesk();
    initStreamAudioPlayer();
    initArticleVoiceReader();
    initWebShare();
    initPrintSlip();
    initAntiBotGate();
    initFilterSystem();
    initViewSwitcher();
    initLoadMore();
  });

  // A11y Live Announcer
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
      setTimeout(() => { liveAnnouncer.textContent = msg; }, 50);
    }
  }

  // 1. CONCIERGE DYNAMIC DESK
  function initConciergeDesk() {
    const listEl = document.getElementById('concierge-dynamic-list');
    if (!listEl) return;

    const isBg = (document.documentElement.lang || '').toLowerCase().startsWith('bg');
    const conciergeOffers = isBg ? [
      { title: 'Ла Скала &bull; Милано', tag: 'Кралска ВИП Ложа', desc: 'Персонални ложи за премиерни оперни заглавия.', href: '/floor/0/#concierge-scala' },
      { title: 'Виенска държавна опера', tag: 'Централен балкон', desc: 'Ексклузивни места за виенската филхармония.', href: '/floor/0/#concierge-vienna' },
      { title: 'NBA Финали &bull; Първи ред', tag: 'Floor Row 1', desc: 'Билети на самата линия с пълен клубен достъп.', href: '/floor/0/#concierge-nba' },
      { title: 'Евролига &bull; Финална четворка', tag: 'Президентски апартамент', desc: 'ВИП ложи за шампионските мачове на Европа.', href: '/floor/0/#concierge-euroleague' }
    ] : [
      { title: 'Teatro alla Scala &bull; Milan', tag: 'VIP Royal Box', desc: 'Sovereign private box seating for premier seasonal operas.', href: '/floor/0/#concierge-scala' },
      { title: 'Vienna State Opera &bull; Austria', tag: 'Direct Loge Access', desc: 'Exclusive executive bookings for classical philharmonic performances.', href: '/floor/0/#concierge-vienna' },
      { title: 'NBA Finals &bull; Courtside Prime', tag: 'Floor Row 1', desc: 'Direct courtside baseline passes with private lounge hospitality.', href: '/floor/0/#concierge-nba' },
      { title: 'EuroLeague Final Four', tag: 'Presidential Suite', desc: 'Full corporate hospitality lounge access for global championship matches.', href: '/floor/0/#concierge-euroleague' }
    ];

    listEl.innerHTML = conciergeOffers.map(item => `
      <li class="concierge-entry-card">
        <a href="${item.href}" title="${item.title} - ${item.tag}">
          <span class="concierge-tier-tag">${item.tag}</span>
          <strong>${item.title}</strong>
          <span class="concierge-sub-desc">${item.desc}</span>
        </a>
      </li>
    `).join('');
  }

  // 2. COMPACT TV CONTROLLER & FULLSCREEN ENGINE
  function initTvCompactPlayer() {
    const channelSelect = document.getElementById('tv-channel-select');
    const tvViewport = document.getElementById('tv-viewport');
    const btnFullscreen = document.getElementById('btn-tv-fullscreen');

    if (!channelSelect || !tvViewport) return;

    channelSelect.addEventListener('change', (e) => {
      const vid = e.target.value;
      if (!vid) {
        tvViewport.innerHTML = `
          <div id="tv-standby-message">
            <div class="plasma-standby-title">Standby (0 KB)</div>
            <p class="plasma-standby-desc">Изберете ТВ канал от менюто горе.</p>
          </div>
        `;
        if (btnFullscreen) btnFullscreen.style.display = 'none';
      } else {
        tvViewport.innerHTML = `<iframe id="tv-live-iframe" src="https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&mute=0&rel=0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen title="Live Broadcast"></iframe>`;
        if (btnFullscreen) btnFullscreen.style.display = 'inline-flex';
      }
    });

    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', (e) => {
        e.preventDefault();
        const iframe = document.getElementById('tv-live-iframe');
        if (!iframe) return;

        if (iframe.requestFullscreen) {
          iframe.requestFullscreen();
        } else if (iframe.webkitRequestFullscreen) {
          iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) {
          iframe.msRequestFullscreen();
        }
      });
    }
  }

  // 3. ELEVATOR SOUND & SPEEDOMETER ENGINE (10 Floors / Second)
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playElevatorSound() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Harmonic Triad Chord: C4 (261.63Hz), E4 (329.63Hz), G4 (392.00Hz)
    const freqs = [261.63, 329.63, 392.00];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);

      gain.gain.setValueAtTime(0.001, now + idx * 0.15);
      gain.gain.linearRampToValueAtTime(0.07, now + idx * 0.15 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 1.9);
    });

    // Arrival Ding (A5 - 880Hz Triangle Wave)
    setTimeout(() => {
      const dingOsc = ctx.createOscillator();
      const dingGain = ctx.createGain();
      dingOsc.type = 'triangle';
      dingOsc.frequency.setValueAtTime(880, ctx.currentTime);
      dingOsc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.2);

      dingGain.gain.setValueAtTime(0.2, ctx.currentTime);
      dingGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      dingOsc.connect(dingGain);
      dingGain.connect(ctx.destination);

      dingOsc.start(ctx.currentTime);
      dingOsc.stop(ctx.currentTime + 1.2);
    }, 1800);
  }

  function initElevatorSystem() {
    const readout = document.getElementById('flight-readout');
    const bufferDisplay = document.getElementById('keypad-buffer');
    const isBg = (document.documentElement.lang || '').toLowerCase().startsWith('bg');
    let currentBuffer = '';

    const knownFloors = {
      '7777': { name: isBg ? 'Пентхаус Мобиком' : 'Mobikom Penthouse', url: 'https://mobikom.bg' },
      '100':  { name: isBg ? 'Етаж 100 • Казино & Залози' : 'Floor 100 • Gaming & Betting', url: '/floor/100/' },
      '50':   { name: isBg ? 'Етаж 50 • Енергетика & BESS' : 'Floor 50 • Energy & BESS', url: '/floor/50/' },
      '40':   { name: isBg ? 'Етаж 40 • Кариерен борд' : 'Floor 40 • Career Board', url: isBg ? '/bestjobs/bg/' : '/bestjobs/' },
      '30':   { name: isBg ? 'Етаж 30 • B2B Мол Витрини' : 'Floor 30 • B2B Virtual Mall', url: isBg ? '/mall/bg/' : '/mall/' },
      '10':   { name: isBg ? 'Етаж 10 • Тото & Игри' : 'Floor 10 • Lotteries & Fun', url: '/floor/10/' },
      '0':    { name: isBg ? 'Етаж 0 • Каса & IBAN' : 'Floor 0 • Cashier & IBAN', url: '/floor/0/' },
      '-1':   { name: isBg ? 'Етаж -1 • Дигитален гардероб' : 'Floor -1 • Digital Wardrobe', url: '/floor/-1/' },
      '-3':   { name: isBg ? 'Етаж -3 • Загубени вещи & Архив' : 'Floor -3 • Lost & Found Archives', url: '/floor/-3/' }
    };

    function executeTransit(targetFloorStr) {
      playElevatorSound();

      const targetNum = parseInt(targetFloorStr, 10);
      const destination = knownFloors[targetFloorStr] || { 
        name: isBg ? `Етаж ${targetFloorStr}` : `Floor ${targetFloorStr}`, 
        url: `/floor/${targetFloorStr}/` 
      };

      let simulatedFloor = 0;
      const step = targetNum >= 0 ? 1 : -1;
      const intervalTime = 100; // 100ms = 10 floors per second

      if (readout) {
        readout.style.color = 'var(--vip-gold)';
      }

      const transitInterval = setInterval(() => {
        if ((step > 0 && simulatedFloor < targetNum) || (step < 0 && simulatedFloor > targetNum)) {
          const delta = Math.max(1, Math.floor(Math.abs(targetNum - simulatedFloor) / 10));
          simulatedFloor += (step * delta);

          if ((step > 0 && simulatedFloor > targetNum) || (step < 0 && simulatedFloor < targetNum)) {
            simulatedFloor = targetNum;
          }
          if (readout) {
            readout.textContent = isBg ? `ТРАНЗИТ • ПРЕМИНАВА СЕ ЕТАЖ ${simulatedFloor}...` : `TRANSIT • PASSING FLOOR ${simulatedFloor}...`;
          }
        } else {
          clearInterval(transitInterval);
          if (readout) {
            readout.style.color = 'var(--console-green)';
            readout.textContent = isBg ? `ПРИСТИГАНЕ • ${destination.name.toUpperCase()}` : `ARRIVED • ${destination.name.toUpperCase()}`;
          }
          announce(isBg ? `Пристигнахте на ${destination.name}` : `Arrived at ${destination.name}`);
          
          setTimeout(() => {
            window.location.href = destination.url;
          }, 1100);
        }
      }, intervalTime);
    }

    // Keypad Handlers
    document.querySelectorAll('.num-key').forEach(key => {
      key.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentBuffer.length < 4) {
          currentBuffer += key.getAttribute('data-digit');
          if (bufferDisplay) bufferDisplay.textContent = currentBuffer;
        }
      });
    });

    const clearBtn = document.getElementById('key-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentBuffer = '';
        if (bufferDisplay) bufferDisplay.textContent = '----';
      });
    }

    const goBtn = document.getElementById('key-go');
    if (goBtn) {
      goBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentBuffer !== '') {
          executeTransit(currentBuffer);
        }
      });
    }

    // Direct Portal Interceptors
    document.querySelectorAll('.floor-portal-anchor[data-floor]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const fl = link.getAttribute('data-floor');
        executeTransit(fl);
      });
    });
  }

  // 4. WEB SHARE API
  function initWebShare() {
    const shareBtn = document.getElementById('btn-share-page');
    if (!shareBtn) return;

    const isBg = (document.documentElement.lang || '').toLowerCase().startsWith('bg');

    shareBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const shareData = {
        title: document.title,
        text: document.querySelector('meta[name="description"]')?.getAttribute('content') || document.title,
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          announce(isBg ? 'Успешно споделяне.' : 'Shared successfully.');
        } catch (err) {}
      } else if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(window.location.href);
          const orig = shareBtn.textContent;
          shareBtn.textContent = isBg ? '✓ Копирано' : '✓ Copied';
          setTimeout(() => { shareBtn.textContent = orig; }, 2000);
          announce(isBg ? 'Линкът е копиран в клипборда.' : 'Link copied to clipboard.');
        } catch (err) {}
      }
    });
  }

  // 5. PRINT SLIP
  function initPrintSlip() {
    const printBtn = document.getElementById('btn-print-slip');
    if (!printBtn) return;

    printBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  }

  // 6. ANTI-BOT MATH GATE
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

    if (selectEl && applyBtn) {
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
          announce(isBg ? 'Проверката е успешна. Бутонът е отключен.' : 'Verification passed. Button unlocked.');
        } else {
          applyBtn.classList.add('disabled');
          applyBtn.setAttribute('href', '#apply');
          applyBtn.textContent = isBg ? 'Грешен отговор • Опитайте отново' : 'Incorrect • Try Again';
          announce(isBg ? 'Грешен отговор на проверката.' : 'Incorrect math answer.');
        }
      });
    }
  }

  // 7. ARTICLE READ ALOUD (SpeechSynthesis)
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

  // 8. STREAM AUDIO PLAYER
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
      const rawDesc = card.querySelector('.card-text-summary, p')?.textContent.trim() || '';

      let phrase = salary
        ? (isBg ? `Обява ${currentIndex + 1}: ${title} в ${company}. Заплата: ${salary}. ${rawDesc}` : `Vacancy ${currentIndex + 1}: ${title} at ${company}. Remuneration: ${salary}. ${rawDesc}`)
        : (isBg ? `Секция ${currentIndex + 1}: ${title}. ${rawDesc}` : `Section ${currentIndex + 1}: ${title}. ${rawDesc}`);

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
      visibleCards = Array.from(document.querySelectorAll('.job-card:not([hidden]), .portal-card:not([hidden])'));

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

  // 9. FILTER SYSTEM (Floor 40 Multi-Filter)
  function initFilterSystem() {
    const industrySelect = document.getElementById('filter-industry');
    const citySelect = document.getElementById('filter-city');
    const typeSelect = document.getElementById('filter-type');
    const chipLinks = Array.from(document.querySelectorAll('.chip-btn'));
    const searchBtn = document.getElementById('btn-filter-search');
    const resetBtn = document.getElementById('btn-filter-reset');
    const cards = Array.from(document.querySelectorAll('.job-card'));
    const loadMoreBtn = document.getElementById('btn-load-more');

    if (!industrySelect && !citySelect && !typeSelect && chipLinks.length === 0) return;

    const isBg = (document.documentElement.lang || '').toLowerCase().startsWith('bg');
    let activeTags = [];

    const applyMultiFilter = (e) => {
      if (e) e.preventDefault();

      const sInd = (industrySelect?.value || '').toLowerCase().trim();
      const sCity = (citySelect?.value || '').toLowerCase().trim();
      const sType = (typeSelect?.value || '').toLowerCase().trim();

      let matchCount = 0;

      cards.forEach((card) => {
        const ind = (card.getAttribute('data-industry') || '').toLowerCase().trim();
        const city = (card.getAttribute('data-city') || '').toLowerCase().trim();
        const type = (card.getAttribute('data-type') || '').toLowerCase().trim();
        const cardText = card.textContent.toLowerCase();

        const matchesInd = !sInd || ind === sInd;
        const matchesCity = !sCity || city === sCity;
        const matchesType = !sType || type === sType;
        
        let matchesAllTags = true;
        if (activeTags.length > 0) {
          activeTags.forEach(tag => {
            if (!cardText.includes(tag.toLowerCase())) matchesAllTags = false;
          });
        }

        if (matchesInd && matchesCity && matchesType && matchesAllTags) {
          card.removeAttribute('hidden');
          matchCount++;
        } else {
          card.setAttribute('hidden', '');
        }
      });

      if (loadMoreBtn) loadMoreBtn.setAttribute('hidden', '');
      announce(isBg ? `Намерени резултати: ${matchCount}` : `Matched results: ${matchCount}`);
    };

    const resetFilters = (e) => {
      if (e) e.preventDefault();
      if (industrySelect) industrySelect.value = '';
      if (citySelect) citySelect.value = '';
      if (typeSelect) typeSelect.value = '';

      activeTags = [];
      chipLinks.forEach(c => c.classList.remove('active'));

      cards.forEach((card, idx) => {
        if (idx < 21) card.removeAttribute('hidden');
        else card.setAttribute('hidden', '');
      });

      if (loadMoreBtn && cards.length > 21) loadMoreBtn.removeAttribute('hidden');
      announce(isBg ? 'Филтрите са нулирани.' : 'Filters reset.');
    };

    chipLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tag = link.getAttribute('data-tag');
        
        if (activeTags.includes(tag)) {
          activeTags = activeTags.filter(t => t !== tag);
          link.classList.remove('active');
        } else {
          activeTags.push(tag);
          link.classList.add('active');
        }
      });
    });

    if (searchBtn) searchBtn.addEventListener('click', applyMultiFilter);
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
  }

  // 10. VIEW SWITCHER (Cards, Rows, Accordion, Ticker)
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

  // 11. LOAD MORE PAGINATION
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

      if (visibleCount >= cards.length) loadMoreBtn.setAttribute('hidden', '');
      announce(`Показани още ${nextBatch.length} позиции.`);
    });
  }
})();
