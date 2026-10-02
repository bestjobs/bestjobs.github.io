(() => {
  'use strict';

  let liveAnnouncer = null;
  let audioCtx = null;
  let currentRadioAudio = null;

  document.addEventListener('DOMContentLoaded', () => {
    initLiveAnnouncer();
    initElevatorSystem();
    initTvCompactPlayer();
    initRadioPlayer();
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

  // 1. ACCESSIBILITY LIVE ANNOUNCER
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

  // 2. CONCIERGE DYNAMIC DESK
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

  // 3. COMPACT TV CONTROLLER (Music, Cinema, Sports/Boxing/Fishing, Fashion, News)
  function initTvCompactPlayer() {
    const channelSelect = document.getElementById('tv-channel-select');
    const tvViewport = document.getElementById('tv-viewport');
    const btnFullscreen = document.getElementById('btn-tv-fullscreen');

    if (!channelSelect || !tvViewport) return;

    // Стриктно разпределение по новите категории
    const tvChannels = [
      { group: 'Музика (Music Channels)', options: [
        { name: 'Lofi Girl (24/7 Global Chill/Beats)', id: 'jfKfPfyJRdk' },
        { name: 'Classical Music & Opera Live', id: 'k6zW2Jp-q6k' },
        { name: 'Clubbing TV (Electronic & Beats)', id: 'vW10jY-4_Xk' }
      ]},
      { group: 'Кино (Cinema & Movies)', options: [
        { name: 'Classic Cinema Vault (Public Domain)', id: 'V8ZwaKz_X8s' },
        { name: 'Sci-Fi & Fantasy Classics Live', id: 'dp8PhLsUcFE' },
        { name: 'Documentary Central Live', id: 'FI2P4O-V50Q' }
      ]},
      { group: 'Спорт, Бокс & Риболов (Sports & Outdoor)', options: [
        { name: 'DAZN Combat Sports Highlights', id: '2qF8Z6uE_zQ' },
        { name: 'Red Bull Action & Extreme Sports', id: 'FI2P4O-V50Q' },
        { name: 'World Surf League Official', id: 'c_6lKzYF9Xw' },
        { name: 'Ocean Coral Reef & Deep Fishing', id: 'F109TZt3nRc' },
        { name: 'African Safari Wildlife Hub', id: 'Xv2XJ9P2xU4' }
      ]},
      { group: 'Мода (Fashion & Runway)', options: [
        { name: 'Fashion TV Runway Highlights', id: 'aBcDefGh123' },
        { name: 'Luxury Lifestyle & Haute Couture', id: 'w_Ma8oQLmSM' }
      ]},
      { group: 'Новини & Финанси (News & Global Finance)', options: [
        { name: 'Euronews International Live', id: 'sPJXq0lPzaM' },
        { name: 'Bloomberg Global Financial', id: 'dp8PhLsUcFE' },
        { name: 'Sky News UK Live Stream', id: '9Auq9mYxFEE' },
        { name: 'ABC News Live Worldwide', id: 'w_Ma8oQLmSM' },
        { name: 'Al Jazeera English Live', id: 'gCNeDWCI0vo' }
      ]}
    ];

    let selectHtml = '<option value="">-- Select TV Channel (Instant Play) --</option>';
    tvChannels.forEach(cat => {
      selectHtml += `<optgroup label="${cat.group}">`;
      cat.options.forEach(opt => {
        selectHtml += `<option value="${opt.id}">${opt.name}</option>`;
      });
      selectHtml += `</optgroup>`;
    });

    channelSelect.innerHTML = selectHtml;

    // Контрол на размера в падащото меню (да не излиза от карето)
    channelSelect.style.maxWidth = '100%';
    channelSelect.style.boxSizing = 'border-box';
    channelSelect.style.textOverflow = 'ellipsis';

    channelSelect.addEventListener('change', (e) => {
      const vid = e.target.value;
      if (!vid) {
        tvViewport.innerHTML = `
          <div id="tv-standby-message" style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%;">
            <div class="plasma-standby-title" style="font-size:0.95rem; color:#f1f5f9; font-weight:800; text-transform:uppercase;">Standby (0 KB)</div>
            <p class="plasma-standby-desc" style="font-size:0.75rem; color:#94a3b8;">Select channel to stream.</p>
          </div>
        `;
        if (btnFullscreen) btnFullscreen.style.display = 'none';
      } else {
        tvViewport.innerHTML = `<iframe id="tv-live-iframe" src="https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&mute=0&rel=0" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen="true" style="width:100%; height:100%; border:none;"></iframe>`;
        if (btnFullscreen) btnFullscreen.style.display = 'inline-flex';
      }
    });

    // Работещ Fullscreen върху външния контейнер
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', (e) => {
        e.preventDefault();
        if (!document.fullscreenElement) {
          if (tvViewport.requestFullscreen) tvViewport.requestFullscreen();
          else if (tvViewport.webkitRequestFullscreen) tvViewport.webkitRequestFullscreen();
          else if (tvViewport.msRequestFullscreen) tvViewport.msRequestFullscreen();
        } else {
          if (document.exitFullscreen) document.exitFullscreen();
        }
      });
    }
  }

  // 4. LEGAL INTERNET RADIO AUDIO PLAYER
  function initRadioPlayer() {
    const radioSelect = document.getElementById('radio-station-select');
    const radioStatus = document.getElementById('radio-status-text');
    if (!radioSelect) return;

    const radioStreams = [
      { name: 'БНР Хоризонт (Обществено радио)', url: 'https://stream.bgradio.bg:8000/horizont' },
      { name: 'Classic FM (Световна класика)', url: 'https://stream.bgradio.bg:8000/classicfm' },
      { name: 'SomaFM: Groove Salad (Ambient)', url: 'https://ice1.somafm.com/groovesalad-128-mp3' },
      { name: 'Swiss Jazz Live (Цюрих, Швейцария)', url: 'https://stream.srg-ssr.ch/m/rjs/mp3_128' }
    ];

    let radioHtml = '<option value="">-- Радио Изключено (0 KB) --</option>';
    radioStreams.forEach(st => {
      radioHtml += `<option value="${st.url}">${st.name}</option>`;
    });
    radioSelect.innerHTML = radioHtml;
    radioSelect.style.maxWidth = '100%';
    radioSelect.style.boxSizing = 'border-box';

    radioSelect.addEventListener('change', (e) => {
      const url = e.target.value;
      if (currentRadioAudio) {
        currentRadioAudio.pause();
        currentRadioAudio.src = '';
        currentRadioAudio = null;
      }

      if (!url) {
        if (radioStatus) radioStatus.textContent = 'Радио: Изключено';
        return;
      }

      currentRadioAudio = new Audio(url);
      currentRadioAudio.play().then(() => {
        if (radioStatus) radioStatus.textContent = 'Радио: На живо';
        announce('Радиото стартира.');
      }).catch(() => {
        if (radioStatus) radioStatus.textContent = 'Грешка при зареждане на аудио стрийма.';
      });
    });
  }

  // 5. ELEVATOR SOUND & SPEEDOMETER (10 Floors / Second)
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
    const freqs = [261.63, 329.63, 392.00]; // C4, E4, G4

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

    // Arrival Ding
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
      const intervalTime = 100; // 10 етажа в секунда (100ms)

      if (readout) readout.style.color = 'var(--vip-gold)';

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
        if (currentBuffer !== '') executeTransit(currentBuffer);
      });
    }

    document.querySelectorAll('.floor-portal-anchor[data-floor]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        executeTransit(link.getAttribute('data-floor'));
      });
    });
  }

  // 6. WEB SHARE API
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
        try { await navigator.share(shareData); } catch (err) {}
      } else if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(window.location.href);
          const orig = shareBtn.textContent;
          shareBtn.textContent = isBg ? '✓ Копирано' : '✓ Copied';
          setTimeout(() => { shareBtn.textContent = orig; }, 2000);
        } catch (err) {}
      }
    });
  }

  // 7. PRINT SLIP
  function initPrintSlip() {
    const printBtn = document.getElementById('btn-print-slip');
    if (printBtn) printBtn.addEventListener('click', (e) => { e.preventDefault(); window.print(); });
  }

  // 8. ANTI-BOT MATH GATE
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
    const btnActiveText = gateBox.getAttribute('data-btn-text') || 'Apply &rarr;';

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
        } else {
          applyBtn.classList.add('disabled');
          applyBtn.setAttribute('href', '#apply');
          applyBtn.textContent = 'Incorrect';
        }
      });
    }
  }

  // 9. ARTICLE VOICE READER (SpeechSynthesis)
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
      if (isSpeaking || window.speechSynthesis.speaking) return stopArticleVoice();

      const contentBox = document.querySelector('article.audit-box, main .shell');
      if (!contentBox) return;

      const title = contentBox.querySelector('h1')?.textContent.trim() || '';
      const textToRead = Array.from(contentBox.querySelectorAll('p, li')).map(n => n.textContent.trim()).filter(Boolean).join('. ');
      
      const utterance = new SpeechSynthesisUtterance(`${title}. ${textToRead}`);
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

  // 10. STREAM AUDIO PLAYER
  function initStreamAudioPlayer() {
    if (!('speechSynthesis' in window)) return;
    const streamBtn = document.getElementById('btn-stream-audio');
    if (!streamBtn) return;
    const isBg = (document.documentElement.lang || '').toLowerCase().startsWith('bg');
    let isPlaying = false, currentIndex = 0, visibleCards = [];

    const stopPlayback = () => {
      window.speechSynthesis.cancel();
      isPlaying = false;
      streamBtn.textContent = isBg ? '🔊 Слушай' : '🔊 Listen';
    };

    const speakNextCard = () => {
      if (!isPlaying || currentIndex >= visibleCards.length) return stopPlayback();

      const card = visibleCards[currentIndex];
      const title = card.querySelector('h3')?.textContent.trim() || '';
      const company = card.querySelector('.card-company')?.textContent.trim() || '';
      const salary = card.querySelector('.salary-figure')?.textContent.trim() || '';
      const phrase = salary 
        ? (isBg ? `Обява: ${title}, ${company}, Заплата: ${salary}.` : `Vacancy: ${title}, ${company}, Salary: ${salary}.`) 
        : `Item: ${title}.`;

      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = isBg ? 'bg-BG' : 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => { currentIndex++; speakNextCard(); };
      window.speechSynthesis.speak(utterance);
    };

    streamBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isPlaying) return stopPlayback();
      window.speechSynthesis.cancel();
      visibleCards = Array.from(document.querySelectorAll('.job-card:not([hidden]), .portal-card:not([hidden])'));
      if (visibleCards.length === 0) return stopPlayback();
      
      isPlaying = true; currentIndex = 0;
      streamBtn.textContent = isBg ? '⏹ Спри' : '⏹ Stop';
      speakNextCard();
    });
  }

  // 11. FILTER SYSTEM (Floor 40 Multi-Filter)
  function initFilterSystem() {
    const searchBtn = document.getElementById('btn-filter-search');
    const resetBtn = document.getElementById('btn-filter-reset');
    if (!searchBtn && !resetBtn) return;

    const cards = Array.from(document.querySelectorAll('.job-card'));
    const loadMoreBtn = document.getElementById('btn-load-more');
    const chipLinks = Array.from(document.querySelectorAll('.chip-btn'));
    let activeTags = [];

    const applyFilter = (e) => {
      if (e) e.preventDefault();
      let matchCount = 0;

      cards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        const matchesTags = activeTags.length === 0 || activeTags.every(tag => text.includes(tag.toLowerCase()));

        if (matchesTags) {
          card.removeAttribute('hidden');
          matchCount++;
        } else {
          card.setAttribute('hidden', '');
        }
      });
      if (loadMoreBtn) loadMoreBtn.setAttribute('hidden', '');
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

    if (searchBtn) searchBtn.addEventListener('click', applyFilter);
    if (resetBtn) resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      activeTags = [];
      chipLinks.forEach(c => c.classList.remove('active'));
      cards.forEach((c, idx) => { if (idx < 21) c.removeAttribute('hidden'); else c.setAttribute('hidden', ''); });
      if (loadMoreBtn && cards.length > 21) loadMoreBtn.removeAttribute('hidden');
    });
  }

  // 12. VIEW SWITCHER
  function initViewSwitcher() {
    const container = document.getElementById('jobs-container');
    const viewButtons = document.querySelectorAll('.view-btn');
    if (!container || viewButtons.length === 0) return;

    viewButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        container.setAttribute('data-view', btn.getAttribute('data-view') || 'grid');
        viewButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  // 13. LOAD MORE PAGINATION
  function initLoadMore() {
    const loadMoreBtn = document.getElementById('btn-load-more');
    const cards = Array.from(document.querySelectorAll('.job-card'));
    if (!loadMoreBtn || cards.length <= 21) {
      if (loadMoreBtn) loadMoreBtn.setAttribute('hidden', '');
      return;
    }

    let visibleCount = 21;
    for (let i = 21; i < cards.length; i++) cards[i].setAttribute('hidden', '');

    loadMoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const nextBatch = cards.slice(visibleCount, visibleCount + 21);
      nextBatch.forEach(c => c.removeAttribute('hidden'));
      visibleCount += nextBatch.length;
      if (visibleCount >= cards.length) loadMoreBtn.setAttribute('hidden', '');
    });
  }
})();
