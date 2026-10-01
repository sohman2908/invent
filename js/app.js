// Smart Reader Kids: read-along reader, sight word game and reading log.
(function () {
  'use strict';

  var STORIES = window.STORIES;
  var WORD_LISTS = window.WORD_LISTS;
  var storyArt = window.storyArt;

  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

  // Progress lives only in this browser. Every access is guarded so the page
  // still works in private windows or when storage is blocked.
  var store = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem('srk.' + key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem('srk.' + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    }
  };

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Speech ---------------- */

  var synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  var voice = null;
  var runId = 0;

  function pickVoice() {
    if (!synth) return;
    var voices = synth.getVoices().filter(function (v) { return /^en([-_]|$)/i.test(v.lang); });
    voice = voices.filter(function (v) { return /samantha|google us english|aria|jenny|karen|moira/i.test(v.name); })[0] ||
      voices.filter(function (v) { return /en[-_]US/i.test(v.lang); })[0] ||
      voices[0] || null;
  }

  if (synth) {
    pickVoice();
    synth.onvoiceschanged = pickVoice;
  }

  // Speak text and report start, word boundaries and end. Returns false when
  // the browser cannot speak. Stale callbacks from cancelled speech are ignored.
  function speak(text, rate, on) {
    on = on || {};
    if (!synth) return false;
    synth.cancel();
    var id = ++runId;
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    if (voice) u.voice = voice;
    u.rate = rate;
    u.pitch = 1.05;
    u.onstart = function () { if (id === runId && on.start) on.start(); };
    u.onboundary = function (e) { if (id === runId && on.boundary) on.boundary(e); };
    u.onend = function () { if (id === runId && on.end) on.end(); };
    u.onerror = function () { if (id === runId && on.end) on.end(); };
    synth.speak(u);
    return true;
  }

  function stopSpeech() {
    runId++;
    if (synth) synth.cancel();
  }

  var speechNote = $('#speechNote');
  function showNoSpeech() {
    speechNote.textContent = 'This browser can’t read aloud, so the words light up one at a time for your child to read.';
    speechNote.hidden = false;
  }
  if (!synth) showNoSpeech();

  /* ---------------- Reader ---------------- */

  var artEl = $('#bookArt');
  var textEl = $('#storyText');
  var levelEl = $('#bookLevel');
  var titleEl = $('#bookTitle');
  var countEl = $('#pageCount');
  var dotsEl = $('#pageDots');
  var prevBtn = $('#prevBtn');
  var nextBtn = $('#nextBtn');
  var readBtn = $('#readBtn');
  var readLabel = $('#readLabel');
  var finishBox = $('#finishBox');
  var finishMsg = $('#finishMsg');
  var askText = $('#askText');

  var bookmark = store.get('bookmark', null);
  var storyIdx = 0;
  var pageIdx = 0;
  if (bookmark) {
    var found = STORIES.findIndex(function (s) { return s.id === bookmark.story; });
    if (found >= 0) {
      storyIdx = found;
      pageIdx = Math.min(Math.max(0, bookmark.page | 0), STORIES[found].pages.length - 1);
    }
  }

  var rate = store.get('rate', 0.85);
  var reading = false;
  var tokens = [];
  var timers = [];

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function every(fn, ms) { timers.push(setInterval(fn, ms)); }
  function clearTimers() {
    timers.forEach(function (t) { clearTimeout(t); clearInterval(t); });
    timers = [];
  }

  function highlight(i) {
    tokens.forEach(function (t, j) { t.el.classList.toggle('on', j === i); });
  }

  function renderPage() {
    var st = STORIES[storyIdx];
    var text = st.pages[pageIdx];
    var last = st.pages.length - 1;

    artEl.innerHTML = storyArt(st.id, pageIdx);
    levelEl.textContent = 'Level ' + st.level;
    titleEl.textContent = st.title;

    tokens = [];
    var frag = document.createDocumentFragment();
    var re = /\S+/g;
    var m;
    var end = 0;
    while ((m = re.exec(text))) {
      if (m.index > end) frag.appendChild(document.createTextNode(text.slice(end, m.index)));
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'w';
      b.textContent = m[0];
      b.dataset.i = String(tokens.length);
      frag.appendChild(b);
      tokens.push({ el: b, start: m.index, end: m.index + m[0].length, word: m[0] });
      end = m.index + m[0].length;
    }
    textEl.replaceChildren(frag);

    countEl.textContent = 'Page ' + (pageIdx + 1) + ' of ' + st.pages.length;
    prevBtn.disabled = pageIdx === 0;
    nextBtn.disabled = pageIdx === last;

    dotsEl.innerHTML = st.pages.map(function (_, i) {
      return '<span' + (i === pageIdx ? ' class="cur"' : '') + '></span>';
    }).join('');

    finishBox.hidden = pageIdx !== last;
    askText.textContent = st.ask;
    finishMsg.textContent = '';

    store.set('bookmark', { story: st.id, page: pageIdx });
  }

  function tokenAt(charIndex) {
    for (var i = 0; i < tokens.length; i++) {
      if (charIndex < tokens[i].end) return i;
    }
    return tokens.length - 1;
  }

  // Light up words in time with speech. Word-boundary events drive the
  // highlight when the browser sends them; otherwise a steady timer does.
  function readPage() {
    clearTimers();
    var text = STORIES[storyIdx].pages[pageIdx];
    var perWord = Math.round(430 / rate);
    var gotBoundary = false;
    var started = false;

    function timedHighlight(from, silent) {
      var i = from;
      highlight(i);
      every(function () {
        i++;
        if (i >= tokens.length) {
          clearTimers();
          if (silent) later(pageDone, perWord);
          return;
        }
        highlight(i);
      }, perWord);
    }

    var spoke = speak(text, rate, {
      start: function () {
        started = true;
        highlight(0);
        later(function () { if (!gotBoundary) timedHighlight(1, false); }, perWord);
      },
      boundary: function (e) {
        if (e.name && e.name !== 'word') return;
        if (!gotBoundary) clearTimers();
        gotBoundary = true;
        highlight(tokenAt(e.charIndex));
      },
      end: function () {
        clearTimers();
        highlight(-1);
        pageDone();
      }
    });

    if (!spoke) {
      timedHighlight(0, true);
      return;
    }

    // Some systems have the API but no voices; fall back to a silent read.
    later(function () {
      if (!started && reading) {
        stopSpeech();
        clearTimers();
        showNoSpeech();
        timedHighlight(0, true);
      }
    }, 2000);
  }

  function pageDone() {
    if (!reading) return;
    highlight(-1);
    var st = STORIES[storyIdx];
    if (pageIdx < st.pages.length - 1) {
      pageIdx++;
      renderPage();
      later(readPage, 700);
    } else {
      stopReading();
    }
  }

  function setReadButton() {
    readBtn.classList.toggle('playing', reading);
    readLabel.textContent = reading ? 'Stop' : (pageIdx === 0 ? 'Read to me' : 'Read from here');
    readBtn.setAttribute('aria-pressed', reading ? 'true' : 'false');
  }

  function startReading() {
    reading = true;
    setReadButton();
    readPage();
  }

  function stopReading() {
    reading = false;
    stopSpeech();
    clearTimers();
    highlight(-1);
    setReadButton();
  }

  function goTo(i) {
    var st = STORIES[storyIdx];
    if (i < 0 || i >= st.pages.length) return;
    stopReading();
    pageIdx = i;
    renderPage();
    setReadButton();
  }

  function openStory(i) {
    stopReading();
    storyIdx = i;
    pageIdx = 0;
    renderPage();
    setReadButton();
    renderShelf();
    $('#book').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  readBtn.addEventListener('click', function () {
    if (reading) stopReading(); else startReading();
  });
  prevBtn.addEventListener('click', function () { goTo(pageIdx - 1); });
  nextBtn.addEventListener('click', function () { goTo(pageIdx + 1); });

  $('#book').addEventListener('keydown', function (e) {
    if (e.target && e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowLeft') { goTo(pageIdx - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { goTo(pageIdx + 1); e.preventDefault(); }
  });

  textEl.addEventListener('click', function (e) {
    var b = e.target.closest('.w');
    if (!b) return;
    if (reading) stopReading();
    var word = b.textContent.replace(/[^A-Za-z0-9'’-]/g, '').replace(/’/g, "'");
    b.classList.remove('pop');
    void b.offsetWidth;
    b.classList.add('pop');
    if (!speak(word, Math.max(0.6, rate - 0.1))) showNoSpeech();
  });

  function setRate(r) {
    rate = r;
    store.set('rate', r);
    $$('[data-rate]').forEach(function (b) {
      b.setAttribute('aria-pressed', Math.abs(parseFloat(b.dataset.rate) - r) < 0.01 ? 'true' : 'false');
    });
  }
  $$('[data-rate]').forEach(function (b) {
    b.addEventListener('click', function () { setRate(parseFloat(b.dataset.rate)); });
  });

  $('#finishBtn').addEventListener('click', function () {
    var st = STORIES[storyIdx];
    log.finished.push({ id: st.id, date: ymd(new Date()) });
    log.stickers += 1;
    saveLog();
    renderLog();
    renderShelf();
    finishMsg.textContent = 'Added to your reading log. You earned a sticker!';
    if (synth) speak('Great reading! You finished ' + st.title + '.', rate);
  });

  /* ---------------- Shelf ---------------- */

  var shelfEl = $('#shelf');

  function renderShelf() {
    var done = {};
    log.finished.forEach(function (f) { done[f.id] = true; });
    shelfEl.innerHTML = STORIES.map(function (st, i) {
      var now = i === storyIdx;
      return '<button type="button" class="shelf-book' + (now ? ' current' : '') + '" data-story="' + i + '" aria-label="Read ' + st.title + ', level ' + st.level + '">' +
        '<span class="shelf-cover">' + storyArt(st.id, st.pages.length - 1) +
          (done[st.id] ? '<span class="badge badge-done">Finished</span>' : (now ? '<span class="badge badge-now">Reading</span>' : '')) +
        '</span>' +
        '<span class="shelf-title">' + st.title + '</span>' +
        '<span class="shelf-meta"><span class="chip">' + st.level + '</span>' + st.pages.length + ' pages · ages ' + st.ages + '</span>' +
      '</button>';
    }).join('');
  }

  shelfEl.addEventListener('click', function (e) {
    var b = e.target.closest('.shelf-book');
    if (b) openStory(parseInt(b.dataset.story, 10));
  });

  /* ---------------- Sight word game ---------------- */

  var cardsEl = $('#cards');
  var feedbackEl = $('#feedback');
  var targetBox = $('#targetBox');
  var targetWordEl = $('#targetWord');
  var starsEl = $('#stars');
  var starsLabel = $('#starsLabel');
  var listNote = $('#listNote');

  var listKey = store.get('wordList', 'preprimer');
  if (!WORD_LISTS[listKey]) listKey = 'preprimer';
  var target = null;
  var stars = store.get('stars', 0) | 0;
  var gameStarted = false;
  var locked = false;

  var STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2l-5.9 3.2 1.3-6.5L2.5 9.3l6.6-.8z"/></svg>';
  starsEl.innerHTML = Array.apply(null, Array(10)).map(function () { return '<span>' + STAR + '</span>'; }).join('');

  function renderStars() {
    $$('#stars span').forEach(function (s, i) { s.classList.toggle('lit', i < stars); });
    starsLabel.textContent = stars + ' of 10 stars to the next sticker';
  }

  function sayTarget() {
    if (!speak(target, Math.max(0.6, rate - 0.05))) {
      targetBox.hidden = false;
    }
  }

  function newRound() {
    var words = WORD_LISTS[listKey].words;
    var t;
    do { t = words[Math.floor(Math.random() * words.length)]; } while (t === target && words.length > 1);
    target = t;

    // Distractors that look alike are better practice: same first letter or similar length.
    var others = words.filter(function (w) { return w !== t; }).map(function (w) {
      var score = (w[0].toLowerCase() === t[0].toLowerCase() ? 2 : 0) + (Math.abs(w.length - t.length) <= 1 ? 1 : 0) + Math.random() * 2;
      return { w: w, score: score };
    }).sort(function (a, b) { return b.score - a.score; }).slice(0, 3).map(function (o) { return o.w; });

    cardsEl.innerHTML = shuffle([t].concat(others)).map(function (w) {
      return '<button type="button" class="card" data-word="' + w + '">' + w + '</button>';
    }).join('');

    targetWordEl.textContent = t;
    targetBox.hidden = !!synth;
    locked = false;
    if (gameStarted) sayTarget();
  }

  function setList(key) {
    listKey = key;
    store.set('wordList', key);
    $$('[data-list]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.list === key ? 'true' : 'false'); });
    var n = WORD_LISTS[key].words.length;
    listNote.textContent = n + ' words from the Dolch ' + WORD_LISTS[key].label.toLowerCase() + ' list';
    newRound();
  }

  $$('[data-list]').forEach(function (b) {
    b.addEventListener('click', function () { setList(b.dataset.list); });
  });

  $('#hearBtn').addEventListener('click', function () {
    gameStarted = true;
    sayTarget();
    if (!synth) feedbackEl.innerHTML = 'Find the word <b>' + target + '</b> and tap it.';
  });

  $('#hintBtn').addEventListener('click', function () {
    targetBox.hidden = false;
    if (synth) sayTarget();
  });

  cardsEl.addEventListener('click', function (e) {
    var c = e.target.closest('.card');
    if (!c || locked || c.classList.contains('wrong')) return;
    gameStarted = true;
    var w = c.dataset.word;
    if (w === target) {
      locked = true;
      c.classList.add('right');
      stars += 1;
      feedbackEl.className = 'feedback good';
      if (stars >= 10) {
        stars = 0;
        log.stickers += 1;
        saveLog();
        renderLog();
        feedbackEl.textContent = 'Ten stars! You earned a sticker for your library card.';
        speak('Ten stars! You earned a sticker.', rate);
      } else {
        feedbackEl.innerHTML = 'Yes! That says “' + w + '.”';
        speak('Yes! ' + w + '.', rate);
      }
      store.set('stars', stars);
      renderStars();
      setTimeout(newRound, 1400);
    } else {
      c.classList.add('wrong');
      feedbackEl.className = 'feedback';
      feedbackEl.innerHTML = 'That one says “' + w + '.” Listen again and find <b>' + (synth && targetBox.hidden ? 'the word' : target) + '</b>.';
      speak('That says ' + w + '. Find ' + target + '.', rate);
    }
  });

  /* ---------------- Reading log ---------------- */

  var DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var DAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var GOAL = 140;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function mondayOf(d) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
    return x;
  }
  function todayIndex() { return (new Date().getDay() + 6) % 7; }

  function freshLog(prev) {
    return {
      week: ymd(mondayOf(new Date())),
      minutes: [0, 0, 0, 0, 0, 0, 0],
      history: [],
      finished: prev && Array.isArray(prev.finished) ? prev.finished : [],
      stickers: prev && prev.stickers ? prev.stickers : 0,
      name: prev && prev.name ? prev.name : ''
    };
  }

  var log = store.get('log', null);
  if (!log || !Array.isArray(log.minutes) || log.minutes.length !== 7) log = freshLog(log);
  else if (log.week !== ymd(mondayOf(new Date()))) log = freshLog(log);
  if (!Array.isArray(log.history)) log.history = [];

  function saveLog() { store.set('log', log); }

  var daysEl = $('#days');
  var toastEl = $('#logToast');
  var justStamped = -1;

  function renderLog() {
    var monday = new Date(log.week + 'T00:00:00');
    $('#weekLabel').textContent = 'Week of ' + monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    var today = todayIndex();
    daysEl.innerHTML = log.minutes.map(function (m, i) {
      var cls = 'day' + (i === today ? ' today' : '') + (i === justStamped ? ' just' : '');
      return '<div class="' + cls + '">' +
        '<span class="day-name">' + DAY_NAMES[i] + '</span>' +
        '<span class="day-min">' + m + '</span>' +
        '<span class="day-unit">min</span>' +
        (m >= 20 ? '<span class="stamp">READ</span>' : '') +
        '<span class="sr-only">' + DAY_FULL[i] + (m >= 20 ? ', goal met' : '') + '</span>' +
      '</div>';
    }).join('');
    justStamped = -1;

    var total = log.minutes.reduce(function (a, b) { return a + b; }, 0);
    $('#goalMinutes').textContent = total;
    $('#goalFill').style.width = Math.min(100, total / GOAL * 100) + '%';
    $('#goalBar').setAttribute('aria-valuenow', String(Math.min(total, GOAL)));
    $('#goalNote').textContent = total >= GOAL ? '· Goal met!' : '';
    $('#undoBtn').disabled = log.history.length === 0;

    var nameInput = $('#readerName');
    if (document.activeElement !== nameInput) nameInput.value = log.name || '';

    var counts = {};
    var order = [];
    log.finished.forEach(function (f) {
      if (!counts[f.id]) { counts[f.id] = 0; order.push(f.id); }
      counts[f.id]++;
    });
    var list = $('#finishedList');
    if (!order.length) {
      list.innerHTML = '<li class="empty">No books yet. Finish a story and tap “I finished this book.”</li>';
    } else {
      list.innerHTML = order.map(function (id) {
        var st = STORIES.filter(function (s) { return s.id === id; })[0];
        if (!st) return '';
        return '<li><span class="chip">' + st.level + '</span><span>' + st.title + '</span>' +
          (counts[id] > 1 ? '<span class="times">read ' + counts[id] + ' times</span>' : '') + '</li>';
      }).join('');
    }

    var stickersEl = $('#stickers');
    if (!log.stickers) {
      stickersEl.innerHTML = '<span class="empty">Earn stickers by finishing books and collecting ten stars in the word game.</span>';
    } else {
      var shown = Math.min(log.stickers, 12);
      var colors = ['#FFCB2F', '#4FC48D', '#7FAEF5', '#F27D95', '#F28C28', '#A98BE0'];
      var html = '';
      for (var i = 0; i < shown; i++) {
        html += '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="' + colors[i % colors.length] + '"/>' +
          '<path d="M20 9l3.2 6.6 7.3.9-5.4 5 1.4 7.2L20 25.2l-6.5 3.5 1.4-7.2-5.4-5 7.3-.9z" fill="#FFFFFF"/></svg>';
      }
      if (log.stickers > shown) html += '<span class="more">+' + (log.stickers - shown) + '</span>';
      html += '<span class="sr-only">' + log.stickers + ' stickers</span>';
      stickersEl.innerHTML = html;
    }
  }

  $$('[data-add]').forEach(function (b) {
    b.addEventListener('click', function () {
      var n = parseInt(b.dataset.add, 10);
      var d = todayIndex();
      var before = log.minutes[d];
      log.minutes[d] += n;
      log.history.push({ day: d, add: n });
      if (before < 20 && log.minutes[d] >= 20) justStamped = d;
      saveLog();
      renderLog();
      toastEl.textContent = 'Added ' + n + ' minutes to ' + DAY_FULL[d] + '.';
    });
  });

  $('#undoBtn').addEventListener('click', function () {
    var last = log.history.pop();
    if (!last) return;
    log.minutes[last.day] = Math.max(0, log.minutes[last.day] - last.add);
    saveLog();
    renderLog();
    toastEl.textContent = 'Removed ' + last.add + ' minutes from ' + DAY_FULL[last.day] + '.';
  });

  $('#readerName').addEventListener('input', function (e) {
    log.name = e.target.value.slice(0, 24);
    saveLog();
  });

  var resetConfirm = $('#resetConfirm');
  $('#resetBtn').addEventListener('click', function () { resetConfirm.hidden = false; $('#resetNo').focus(); });
  $('#resetNo').addEventListener('click', function () { resetConfirm.hidden = true; });
  $('#resetYes').addEventListener('click', function () {
    log.minutes = [0, 0, 0, 0, 0, 0, 0];
    log.history = [];
    saveLog();
    renderLog();
    resetConfirm.hidden = true;
    toastEl.textContent = 'This week’s minutes are cleared.';
  });

  /* ---------------- Start ---------------- */

  var heroArt = $('#heroArt');
  if (heroArt) heroArt.innerHTML = storyArt('garden', 3);

  setRate(rate);
  renderPage();
  setReadButton();
  renderShelf();
  renderStars();
  setList(listKey);
  renderLog();

  window.addEventListener('pagehide', stopSpeech);
})();
