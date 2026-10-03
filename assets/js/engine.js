(() => {
  'use strict';

  let liveAnnouncer = null;
  let audioCtx = null;

  document.addEventListener('DOMContentLoaded', () => {
    try { initLiveAnnouncer(); } catch (e) {}
    try { initMeridianClocks(); } catch (e) {}
    try { initConciergeDesk(); } catch (e) {}
    try { initExquisiteChambers(); } catch (e) {}
    try { initExecutiveWorkbench(); } catch (e) {}
    try { initElevatorSystem(); } catch (e) {}
    try { initMallFilter(); } catch (e) {}
    try { initArticleVoiceReader(); } catch (e) {}
    try { initStreamAudioPlayer(); } catch (e) {}
    try { initWebShare(); } catch (e) {}
    try { initPrintSlip(); } catch (e) {}
    try { initAntiBotGate(); } catch (e) {}
    try { initFilterSystem(); } catch (e) {}
    try { initViewSwitcher(); } catch (e) {}
    try { initLoadMore(); } catch (e) {}
  });

  // 1. A11Y ANNOUNCER
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

  // 2. 2-ROW MERIDIAN MARKET CLOCKS
  function initMeridianClocks() {
    const dateEl = document.getElementById('current-calendar-date');
    const elNy = document.getElementById('clock-ny');
    const elLondon = document.getElementById('clock-london');
    const elMonaco = document.getElementById('clock-monaco');
    const elSofia = document.getElementById('clock-sofia');
    const elMoscow = document.getElementById('clock-moscow');
    const elAbuDhabi = document.getElementById('clock-abudhabi');
    const elHongKong = document.getElementById('clock-hongkong');
    const elTokyo = document.getElementById('clock-tokyo');

    if (!elSofia && !elLondon && !elNy && !elTokyo) return;

    function updateClocks() {
      const now = new Date();
      const isBg = (document.documentElement.lang || '').toLowerCase().startsWith('bg');
      
      if (dateEl) {
        dateEl.textContent = new Intl.DateTimeFormat(isBg ? 'bg-BG' : 'en-GB', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }).format(now);
      }

      const fmt = (tz) => {
        try {
          return new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }).format(now);
        } catch (e) {
          return '--:--';
        }
      };

      if (elNy) elNy.textContent = fmt('America/New_York');
      if (elLondon) elLondon.textContent = fmt('Europe/London');
      if (elMonaco) elMonaco.textContent = fmt('Europe/Monaco');
      if (elSofia) elSofia.textContent = fmt('Europe/Sofia');
      if (elMoscow) elMoscow.textContent = fmt('Europe/Moscow');
      if (elAbuDhabi) elAbuDhabi.textContent = fmt('Asia/Dubai');
      if (elHongKong) elHongKong.textContent = fmt('Asia/Hong_Kong');
      if (elTokyo) elTokyo.textContent = fmt('Asia/Tokyo');
    }

    updateClocks();
    setInterval(updateClocks, 1000);
  }

  // 3. CONCIERGE VIP OFFERS
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

  // 4. 100 EXQUISITE CONFERENCE CHAMBERS (Instant Teleport Jump)
  function initExquisiteChambers() {
    const selectChamber = document.getElementById('select-chamber');
    if (!selectChamber) return;

    selectChamber.addEventListener('change', (e) => {
      const fl = e.target.value;
      if (fl) {
        const readout = document.getElementById('flight-readout');
        const isBg = (document.documentElement.lang || '').toLowerCase().startsWith('bg');
        if (readout) {
          readout.style.color = 'var(--console-green)';
          readout.textContent = isBg ? `МИГНОВЕН СКОК • ЗАЛА НА ЕТАЖ ${fl}` : `INSTANT TELEPORT • CHAMBER FLOOR ${fl}`;
        }
        playElevatorSound(true);
        setTimeout(() => {
          window.location.href = `/floor/${fl}/`;
        }, 800);
      }
    });
  }

  // 5. IN-LOBBY DRAFTING DESK (Working .TXT, PDF, Word, Print, Mail, Clear)
  function initExecutiveWorkbench() {
    const editor = document.getElementById('workbench-editor');
    const counter = document.getElementById('workbench-counter');
    const btnTxt = document.getElementById('btn-bench-txt');
    const btnPdf = document.getElementById('btn-bench-pdf');
    const btnDocx = document.getElementById('btn-bench-docx');
    const btnPrint = document.getElementById('btn-bench-print');
    const btnMail = document.getElementById('btn-bench-mail');
    const btnClear = document.getElementById('btn-bench-clear');

    if (!editor) return;

    const getText = () => (editor.value || '').trim();

    editor.addEventListener('input', () => {
      const text = getText();
      const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
      if (counter) counter.textContent = `${words} words`;
    });

    // 1. Download .TXT
    if (btnTxt) {
      btnTxt.addEventListener('click', (e) => {
        e.preventDefault();
        const text = getText();
        if (!text) { alert('Draft is empty.'); return; }
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `bestjobs-draft-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      });
    }

    // Isolated Print Driver: Prints ONLY document text
    function printOnlyDraft(text) {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Document Print</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.6;
      padding: 2cm;
      margin: 0;
      color: #000000;
    }
    p {
      margin: 0 0 1em 0;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  </style>
</head>
<body>
  ${text.split('\n').map(line => `<p>${line ? line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '&nbsp;'}</p>`).join('')}
</body>
</html>`);
      doc.close();

      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }

    // 2. Export PDF
    if (btnPdf) {
      btnPdf.addEventListener('click', (e) => {
        e.preventDefault();
        const text = getText();
        if (!text) { alert('Draft is empty.'); return; }
        printOnlyDraft(text);
      });
    }

    // 3. Export Word (.doc XML format)
    if (btnDocx) {
      btnDocx.addEventListener('click', (e) => {
        e.preventDefault();
        const text = getText();
        if (!text) { alert('Draft is empty.'); return; }
        const paragraphs = text.split('\n').map(p => `<p>${p || '&nbsp;'}</p>`).join('');
        const docContent = `
          <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
          <head><meta charset='utf-8'><title>BestJobs Document</title>
          <style>body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; }</style>
          </head>
          <body>${paragraphs}</body>
          </html>
        `;
        const blob = new Blob(['\ufeff', docContent], { type: 'application/msword' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `bestjobs-doc-${Date.now()}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      });
    }

    // 4. Print Clean Text Only
    if (btnPrint) {
      btnPrint.addEventListener('click', (e) => {
        e.preventDefault();
        const text = getText();
        if (!text) { alert('Draft is empty.'); return; }
        printOnlyDraft(text);
      });
    }

    // 5. Mail via Local Client
    if (btnMail) {
      btnMail.addEventListener('click', (e) => {
        e.preventDefault();
        const text = getText();
        if (!text) { alert('Draft is empty.'); return; }
        const subject = encodeURIComponent('BestJobs Dispatch \u2022 Executive Document');
        const body = encodeURIComponent(text);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      });
    }

    // 6. Clear Buffer
    if (btnClear) {
      btnClear.addEventListener('click', (e) => {
        e.preventDefault();
        editor.value = '';
        if (counter) counter.textContent = '0 words';
      });
    }
  }

  // 6. B2B MALL SECTOR FILTER ENGINE (Floor 100 Instant Sharding)
  function initMallFilter() {
    const chips = Array.from(document.querySelectorAll('.filter-box .chip-btn[data-sector]'));
    const cards = Array.from(document.querySelectorAll('#mall-showcase-grid .portal-card[data-sector]'));
    if (chips.length === 0 || cards.length === 0) return;

    chips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSector = chip.getAttribute('data-sector') || 'all';

        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        let matched = 0;
        cards.forEach(card => {
          const cardSector = card.getAttribute('data-sector') || '';
          if (targetSector === 'all' || cardSector === targetSector) {
            card.removeAttribute('hidden');
            matched++;
          } else {
            card.setAttribute('hidden', '');
          }
        });
        announce(`Showcases displayed: ${matched}`);
      });
    });
  }

  // 7. 28 ELEVATOR SHAFTS & DUAL-SPEED ENGINE
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

  function playElevatorSound(isInstant) {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [261.63, 329.63, 392.00];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.001, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.12 + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 1.3);
    });

    const dingDelay = isInstant ? 350 : 1800;
    setTimeout(() => {
      const dingOsc = ctx.createOscillator();
      const dingGain = ctx.createGain();
      dingOsc.type = 'triangle';
      dingOsc.frequency.setValueAtTime(880, ctx.currentTime);
      dingOsc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.0);

      dingGain.gain.setValueAtTime(0.2, ctx.currentTime);
      dingGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);

      dingOsc.connect(dingGain);
      dingGain.connect(ctx.destination);

      dingOsc.start(ctx.currentTime);
      dingOsc.stop(ctx.currentTime + 1.0);
    }, dingDelay);
  }

  function initElevatorSystem() {
    const readout = document.getElementById('flight-readout');
    const bufferDisplay = document.getElementById('keypad-buffer');
    const isBg = (document.documentElement.lang || '').toLowerCase().startsWith('bg');
    let currentBuffer = '';

    const knownFloors = {
      '7777': { name: isBg ? 'Пентхаус Мобиком' : 'Mobikom Penthouse', url: 'https://mobikom.bg' },
      '100':  { name: isBg ? 'Етаж 100 • B2B Мол Витрини' : 'Floor 100 • B2B Trade Mall', url: isBg ? '/mall/bg/' : '/mall/' },
      '50':   { name: isBg ? 'Етаж 50 • Енергетика & BESS' : 'Floor 50 • Energy & BESS', url: '/floor/50/' },
      '20':   { name: isBg ? 'Етаж 20 • Кариерен борд' : 'Floor 20 • Career Board', url: isBg ? '/bestjobs/bg/' : '/bestjobs/' },
      '10':   { name: isBg ? 'Етаж 10 • Тото & Игри' : 'Floor 10 • Lotteries & Fun', url: '/floor/10/' },
      '1':    { name: isBg ? 'Етаж 1 • Централно фоайе' : 'Floor 1 • Grand Lobby', url: isBg ? '/bg/' : '/' },
      '0':    { name: isBg ? 'Етаж 0 • Каса & IBAN' : 'Floor 0 • Cashier & IBAN', url: '/floor/0/' },
      '-1':   { name: isBg ? 'Етаж -1 • Дигитален гардероб' : 'Floor -1 • Digital Wardrobe', url: '/floor/-1/' },
      '-2':   { name: isBg ? 'Етаж -2 • Централен Гараж' : 'Floor -2 • Central Garage', url: '/floor/-2/' },
      '-3':   { name: isBg ? 'Етаж -3 • Загубени вещи & Архив' : 'Floor -3 • Lost & Found Archives', url: '/floor/-3/' }
    };

    function executeTransit(targetFloorStr) {
      const targetNum = parseInt(targetFloorStr, 10);
      const isInstant = targetNum > 100 || targetFloorStr === '7777';

      playElevatorSound(isInstant);

      const destination = knownFloors[targetFloorStr] || { 
        name: isBg ? `Етаж ${targetFloorStr}` : `Floor ${targetFloorStr}`, 
        url: `/floor/${targetFloorStr}/` 
      };

      if (isInstant) {
        if (readout) {
          readout.style.color = 'var(--console-green)';
          readout.textContent = isBg ? `МИГНОВЕН СКОК • ${destination.name.toUpperCase()}` : `INSTANT EXPRESS • ${destination.name.toUpperCase()}`;
        }
        announce(isBg ? `Мигновен скок до ${destination.name}` : `Instant arrival at ${destination.name}`);
        setTimeout(() => {
          window.location.href = destination.url;
        }, 800);
        return;
      }

      let simulatedFloor = 1;
      const step = targetNum >= 1 ? 1 : -1;
      const intervalTime = 100;

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

    // Keypad Handlers
    document.querySelectorAll('.num-key').forEach(key => {
      key.addEventListener('click', (e) => {
        e.preventDefault();
        getAudioContext();
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

    // Intercept Vertical Floor Portal Anchors
    document.querySelectorAll('.floor-portal-anchor[data-floor], nav a[data-floor]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const fl = link.getAttribute('data-floor');
        if (fl) executeTransit(fl);
      });
    });
  }

  // 8. GLOBAL ARTICLE VOICE READER
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

      const contentBox = document.querySelector('.lobby-hero, article.audit-box, main .shell-grand');
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

  // 9. WEB SHARE API
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

  // 10. PRINT SLIP
  function initPrintSlip() {
    const printBtn = document.getElementById('btn-print-slip');
    if (printBtn) printBtn.addEventListener('click', (e) => { e.preventDefault(); window.print(); });
  }

  // 11. ANTI-BOT MATH GATE
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

  // 12. STREAM AUDIO PLAYER
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

  // 13. FILTER SYSTEM (Floor 20 Multi-Filter)
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

  // 14. VIEW SWITCHER
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

  // 15. LOAD MORE PAGINATION
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
