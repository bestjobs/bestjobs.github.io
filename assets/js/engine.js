(() => {
  'use strict';

  let liveAnnouncer = null;
  let audioCtx = null;
  let currentRadioAudio = null;

  document.addEventListener('DOMContentLoaded', () => {
    initLiveAnnouncer();
    initMarketClocks();
    initConciergeDesk();
    initExquisiteChambers();
    initExecutiveWorkbench();
    initElevatorSystem();
    initMediaPavilion();
    initStreamAudioPlayer();
    initArticleVoiceReader();
    initWebShare();
    initPrintSlip();
    initAntiBotGate();
    initFilterSystem();
    initViewSwitcher();
    initLoadMore();
  });

  // 1. A11Y LIVE ANNOUNCER
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

  // 2. FINANCIAL MARKET SESSIONS CLOCKS (Day of Week + Date + Time)
  function initMarketClocks() {
    const elSofia = document.getElementById('clock-sofia');
    const elLondon = document.getElementById('clock-london');
    const elNy = document.getElementById('clock-ny');
    const elTokyo = document.getElementById('clock-tokyo');

    if (!elSofia && !elLondon && !elNy && !elTokyo) return;

    function updateClocks() {
      const now = new Date();
      const fmt = (tz) => new Intl.DateTimeFormat('en-GB', {
        timeZone: tz,
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);

      if (elSofia) elSofia.textContent = fmt('Europe/Sofia');
      if (elLondon) elLondon.textContent = fmt('Europe/London');
      if (elNy) elNy.textContent = fmt('America/New_York');
      if (elTokyo) elTokyo.textContent = fmt('Asia/Tokyo');
    }

    updateClocks();
    setInterval(updateClocks, 1000);
  }

  // 3. HEAD CONCIERGE DESK (VIP Arrangements & Dynamic List)
  function initConciergeDesk() {
    const listEl = document.getElementById('concierge-dynamic-list');
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

    if (listEl) {
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
  }

  // 4. 100 EXQUISITE CONFERENCE CHAMBERS (Instant Transit Generator)
  function initExquisiteChambers() {
    const selectChamber = document.getElementById('select-chamber');
    if (!selectChamber) return;

    const chamberNames = [
      'The Aurum Boardroom', 'Basalt Whisper Suite', 'The Broken Gyroscope', 'Prime Meridian Hub',
      'The Encrypted Oracle', 'Deep Space Chamber', 'Silence of the Penthouse', 'Cold Fusion Lounge',
      'The Cryptic Rose', 'Singularity Executive', 'Event Horizon Red', 'Borealis Council',
      'Solaris Zenith', 'Quantum Solitude', 'The Obsidian Vault', 'Aether Pavilion',
      'Helios Grand Hall', 'Chronos Chamber', 'Hyperion Forum', 'Titan Monolith',
      'Apex Horizon', 'Atlas Assembly', 'Starlight Conclave', 'Vanguard Chamber',
      'The Sovereign Hearth', 'Elysium Gallery', 'The Cobalt Sphere', 'Celestial Sanctum',
      'Zenith Arch', 'Pinnacle Forum', 'Meridian Oasis', 'The Iron Compass',
      'Equinox Pavilion', 'Solstice Retreat', 'The Emerald Atrium', 'Sapphire Council',
      'Marble Bastion', 'Granite Sanctuary', 'Alabaster Lounge', 'Amber Citadel',
      'The Golden Fleece', 'Argonaut Assembly', 'Prometheus Forge', 'Daedalus Workshop',
      'Icarus Crest', 'Orpheus Auditorium', 'Athena Acropolis', 'Spartan Phalanx',
      'Olympus Summit', 'Delphi Portico', 'The Glass Citadel', 'Diamond Horizon',
      'Platinum Spire', 'Velvet Diplomat', 'The Silk Route', 'Ambergris Hall',
      'Tungsten Bunker', 'Graphene Chamber', 'Krypton Gallery', 'Xenon Assembly',
      'Argon Retreat', 'Neon Forum', 'Helium Zenith', 'Hydrogen Core',
      'Perseus Bastion', 'Andromeda Spire', 'Cassiopeia Crown', 'Cygnus Atrium',
      'Orion Belt Council', 'Sirius Bright Hall', 'Vega North Hub', 'Polaris Pivot',
      'Ursa Major Room', 'Centauri Nexus', 'Nebula Chamber', 'Supernova Suite',
      'Pulsar Forum', 'Quasar Assembly', 'Magnetar Core', 'Cosmos Arena',
      'The Silent Treaty', 'Geneva Protocol', 'The Sovereign Round', 'Westphalia Suite',
      'Hanseatic League', 'Venetian Loggia', 'Florentine Salon', 'Castilian Court',
      'Burgundy Forum', 'Bavarian Citadel', 'Nordic Council', 'Baltic Bastion',
      'Danubian Conclave', 'Carpathian Summit', 'Rhodope Sanctuary', 'Balkan Crossroads',
      'Thracian Gold Suite', 'Dobruja Granary', 'Pontic Haven', 'The 7777 Supreme Senate'
    ];

    let optionsHtml = '<option value="">-- Choose Conference Chamber (Instant Jump) --</option>';
    chamberNames.forEach((name, idx) => {
      const chamberNum = idx + 1;
      const floorTarget = 100 + chamberNum * 50;
      optionsHtml += `<option value="${floorTarget}">Chamber #${String(chamberNum).padStart(2, '0')}: ${name} &bull; Fl ${floorTarget}</option>`;
    });

    selectChamber.innerHTML = optionsHtml;

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

  // 5. IN-LOBBY DRAFTING DESK (Safe contenteditable <div> \u2022 Zero <input>/<textarea>)
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

    editor.addEventListener('focus', () => {
      if (editor.textContent.trim() === 'Type or paste document draft here...') {
        editor.textContent = '';
      }
    });

    editor.addEventListener('input', () => {
      const text = editor.innerText.trim();
      const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
      if (counter) counter.textContent = `${words} words`;
    });

    // Download .TXT
    if (btnTxt) {
      btnTxt.addEventListener('click', (e) => {
        e.preventDefault();
        const text = editor.innerText.trim();
        if (!text || text === 'Type or paste document draft here...') { alert('Editor is empty.'); return; }
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `bestjobs-doc-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(a.href);
      });
    }

    // Export PDF via Print Driver
    if (btnPdf) {
      btnPdf.addEventListener('click', (e) => {
        e.preventDefault();
        const text = editor.innerText.trim();
        if (!text || text === 'Type or paste document draft here...') { alert('Editor is empty.'); return; }
        window.print();
      });
    }

    // Export Word (.doc XML standard)
    if (btnDocx) {
      btnDocx.addEventListener('click', (e) => {
        e.preventDefault();
        const text = editor.innerText.trim();
        if (!text || text === 'Type or paste document draft here...') { alert('Editor is empty.'); return; }
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
        a.click();
        URL.revokeObjectURL(a.href);
      });
    }

    // Clean Print
    if (btnPrint) {
      btnPrint.addEventListener('click', (e) => {
        e.preventDefault();
        window.print();
      });
    }

    // Mail Dispatch via Local Client
    if (btnMail) {
      btnMail.addEventListener('click', (e) => {
        e.preventDefault();
        const text = editor.innerText.trim();
        if (!text || text === 'Type or paste document draft here...') { alert('Editor is empty.'); return; }
        const subject = encodeURIComponent('BestJobs Dispatch \u2022 Executive Document');
        const body = encodeURIComponent(text);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      });
    }

    // Clear Workspace
    if (btnClear) {
      btnClear.addEventListener('click', (e) => {
        e.preventDefault();
        editor.textContent = '';
        if (counter) counter.textContent = '0 words';
      });
    }
  }

  // 6. MEDIA PAVILION (Smart Mute: Radio Stops TV, TV Stops Radio, Fullscreen, Video Click Pause)
  function initMediaPavilion() {
    const channelSelect = document.getElementById('tv-channel-select');
    const tvViewport = document.getElementById('tv-viewport');
    const btnTvFullscreen = document.getElementById('btn-tv-fullscreen');
    const btnTvStop = document.getElementById('btn-tv-stop');
    const radioSelect = document.getElementById('radio-station-select');
    const radioStatus = document.getElementById('radio-status-text');
    const btnRadioStop = document.getElementById('btn-radio-stop');

    function stopTv() {
      if (tvViewport) {
        tvViewport.innerHTML = `
          <div id="tv-standby-message">
            <div class="plasma-standby-title">Video Terminal Standby (0 KB)</div>
            <p class="plasma-standby-desc">Select channel above to stream high-definition broadcast.</p>
          </div>
        `;
      }
      if (channelSelect) channelSelect.value = '';
      if (btnTvFullscreen) btnTvFullscreen.style.display = 'none';
      if (btnTvStop) btnTvStop.style.display = 'none';
    }

    function stopRadio() {
      if (currentRadioAudio) {
        currentRadioAudio.pause();
        currentRadioAudio.src = '';
        currentRadioAudio = null;
      }
      if (radioSelect) radioSelect.value = '';
      if (radioStatus) radioStatus.textContent = 'Radio: Standby';
      if (btnRadioStop) btnRadioStop.style.display = 'none';
    }

    // TV Controller
    if (channelSelect && tvViewport) {
      channelSelect.addEventListener('change', (e) => {
        const vid = e.target.value;
        if (!vid) {
          stopTv();
        } else {
          // Starting TV immediately stops Radio
          stopRadio();

          tvViewport.innerHTML = `<iframe id="tv-live-iframe" src="https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&mute=0&rel=0&enablejsapi=1" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen="true" style="width:100%; height:100%; border:none;"></iframe>`;
          if (btnTvFullscreen) btnTvFullscreen.style.display = 'inline-flex';
          if (btnTvStop) btnTvStop.style.display = 'inline-flex';
        }
      });

      // Pause / Stop on Click Outside Video Frame
      tvViewport.addEventListener('click', (e) => {
        if (channelSelect.value && e.target === tvViewport) {
          stopTv();
        }
      });
    }

    if (btnTvStop) {
      btnTvStop.addEventListener('click', (e) => {
        e.preventDefault();
        stopTv();
      });
    }

    if (btnTvFullscreen && tvViewport) {
      btnTvFullscreen.addEventListener('click', (e) => {
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

    // Radio Controller
    if (radioSelect) {
      radioSelect.addEventListener('change', (e) => {
        const url = e.target.value;
        if (!url) {
          stopRadio();
        } else {
          // Starting Radio immediately stops TV
          stopTv();

          if (currentRadioAudio) {
            currentRadioAudio.pause();
            currentRadioAudio = null;
          }

          currentRadioAudio = new Audio(url);
          currentRadioAudio.play().then(() => {
            if (radioStatus) radioStatus.textContent = 'Radio: Live Streaming';
            if (btnRadioStop) btnRadioStop.style.display = 'inline-flex';
            announce('Radio audio relay active.');
          }).catch(() => {
            if (radioStatus) radioStatus.textContent = 'Error connecting to audio stream.';
          });
        }
      });
    }

    if (btnRadioStop) {
      btnRadioStop.addEventListener('click', (e) => {
        e.preventDefault();
        stopRadio();
      });
    }
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
    const freqs = [261.63, 329.63, 392.00]; // Harmonic Triad (C4, E4, G4)

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
      '100':  { name: isBg ? 'Етаж 100 • Казино & Залози' : 'Floor 100 • Gaming & Betting', url: '/floor/100/' },
      '50':   { name: isBg ? 'Етаж 50 • Енергетика & BESS' : 'Floor 50 • Energy & BESS', url: '/floor/50/' },
      '40':   { name: isBg ? 'Етаж 40 • Кариерен борд' : 'Floor 40 • Career Board', url: isBg ? '/bestjobs/bg/' : '/bestjobs/' },
      '30':   { name: isBg ? 'Етаж 30 • B2B Мол Витрини' : 'Floor 30 • B2B Virtual Mall', url: isBg ? '/mall/bg/' : '/mall/' },
      '10':   { name: isBg ? 'Етаж 10 • Тото & Игри' : 'Floor 10 • Lotteries & Fun', url: '/floor/10/' },
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

      // Over Floor 100: Instant Gravity Teleport
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

      // Levels 0 to 100: 10 Floors Per Second Simulation
      let simulatedFloor = 0;
      const step = targetNum >= 0 ? 1 : -1;
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

    // Intercept All Portal and Directory Transit Links
    document.querySelectorAll('.transit-btn[data-floor]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        executeTransit(link.getAttribute('data-floor'));
      });
    });
  }

  // 8. WEB SHARE API
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

  // 9. PRINT SLIP
  function initPrintSlip() {
    const printBtn = document.getElementById('btn-print-slip');
    if (printBtn) printBtn.addEventListener('click', (e) => { e.preventDefault(); window.print(); });
  }

  // 10. ANTI-BOT MATH GATE
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

  // 11. ARTICLE VOICE READER (SpeechSynthesis)
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

      const contentBox = document.querySelector('article.audit-box, main .shell, main .shell-grand');
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

  // 13. FILTER SYSTEM (Floor 40 Multi-Filter)
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
