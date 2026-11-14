/* The Thirteen - host shell. Catalog, game view, progress dashboard and
   anonymous sync. No framework, no build step, one small API. */
(function () {
  'use strict';
  var G = window.ARCADE_GAMES, BY = window.ARCADE_BY_ID, TIERS = window.ARCADE_TIERS, A = window.Arcade;
  var KEY = A.PROGRESS_KEY;
  function $(id) { return document.getElementById(id); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function fmt(n) { return Number(n || 0).toLocaleString('en-US'); }
  function starMarks(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }
  function doc() { return A.progress(); }
  function gs(id) { return doc().games[id] || null; }
  function isCleared(id) { var s = gs(id); return !!(s && s.completed); }
  function hasPlayed(id) { var s = gs(id); return !!(s && s.plays > 0); }
  function tierOf(g) { return TIERS.find(function (t) { return t.id === g.tier; }) || TIERS[0]; }

  var els = {
    cards: $('cards'), steps: $('steps'), tierLegend: $('tierLegend'), empty: $('empty'),
    filters: $('filters'), search: $('search'), clearCount: $('clearCount'),
    statCleared: $('statCleared'), statStars: $('statStars'), statPlays: $('statPlays'),
    globalStats: $('globalStats'), footPlayers: $('footPlayers'), globalStatsSafe: true,
    continueBtn: $('continueBtn'), continueSub: $('continueSub'),
    drawer: $('drawer'), scrim: $('scrim'), record: $('record'), tierBars: $('tierBars'),
    recordRows: $('recordRows'), badges: $('badges'), leaderboard: $('leaderboard'),
    playerCode: $('playerCode'), syncCode: $('syncCode'), sync: $('sync'), syncText: $('syncText'),
    restoreInput: $('restoreInput'), restoreStatus: $('restoreStatus'),
    gameview: $('gameview'), frame: $('gameFrame'), gameRank: $('gameRank'),
    gameTitle: $('gameTitle'), gameSub: $('gameSub'), gameHint: $('gameHint'),
    toast: $('hostToast')
  };
  var state = { filter: 'all', query: '', current: null, dirty: false, syncTimer: null, restoreArmed: false, renderQueued: false };
  var posters = {};

  /* ---------------- MCP scene review pictures --------------------------- */
  function buildPosters() {
    G.forEach(function (g) {
      posters[g.id] = 'assets/scenes/' + g.id + '.png';
    });
  }

  /* ---------------- catalog -------------------------------------------- */
  function summary() {
    var d = doc(), cleared = 0, stars = 0, score = 0, plays = 0;
    G.forEach(function (g) {
      var s = d.games[g.id]; if (!s) return;
      if (s.completed) cleared++;
      stars += s.stars || 0; score += s.best || 0; plays += s.plays || 0;
    });
    return { cleared: cleared, stars: stars, score: score, plays: plays, doc: d };
  }
  function renderHeader(s) {
    els.clearCount.textContent = s.cleared + '/13';
    els.statCleared.textContent = s.cleared;
    els.statStars.textContent = s.stars;
    els.statPlays.textContent = fmt(s.plays);
    els.playerCode.textContent = s.doc.playerId ? s.doc.playerId.slice(0, 4) : '····';
    els.syncCode.textContent = (s.doc.playerId || '').replace(/(.{4})/g, '$1 ').trim();
    var next = G.find(function (g) { return hasPlayed(g.id) && !isCleared(g.id); }) ||
      G.find(function (g) { return !hasPlayed(g.id); }) || G[0];
    els.continueSub.textContent = isCleared(next.id) ? 'Game 01' : ('Game ' + pad(next.rank) + ' · ' + next.title);
    els.continueBtn._game = next.id;
  }
  function renderSteps() {
    if (!els.steps.children.length) {
      G.forEach(function (g) {
        var b = document.createElement('button');
        b.className = 'step'; b.type = 'button';
        b.style.setProperty('--h', ((g.rank - 1) * 5) + 'px');
        b.innerHTML = '<span class="bar"></span><span class="dot"></span><span class="num">NO. ' + pad(g.original) + '</span>';
        b.title = 'Rank ' + g.rank + ': ' + g.title + ' · ' + tierOf(g).name;
        b.addEventListener('click', function () {
          var card = $('card-' + g.id);
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        els.steps.appendChild(b);
      });
      TIERS.forEach(function (t) {
        var span = document.createElement('span');
        span.innerHTML = '<b>' + t.id + '</b> ' + t.name + ': ' + t.blurb;
        els.tierLegend.appendChild(span);
      });
    }
    Array.prototype.forEach.call(els.steps.children, function (b, i) {
      b.classList.toggle('cleared', isCleared(G[i].id));
    });
  }
  function renderCards() {
    var q = state.query.trim().toLowerCase();
    var shown = G.filter(function (g) {
      if (state.filter === 'cleared' && !isCleared(g.id)) return false;
      if (state.filter === 'unplayed' && hasPlayed(g.id)) return false;
      if (state.filter === 'playing' && (!hasPlayed(g.id) || isCleared(g.id))) return false;
      if (!q) return true;
      return (g.title + ' ' + g.subtitle + ' ' + g.logline + ' ' + g.controls + ' ' + g.tech).toLowerCase().indexOf(q) >= 0;
    });
    els.empty.hidden = shown.length > 0;
    els.cards.innerHTML = shown.map(function (g) {
      var s = gs(g.id), cleared = isCleared(g.id);
      var meter = '';
      for (var i = 0; i < 5; i++) meter += '<i class="' + (i < Math.ceil(g.rank / 13 * 5) ? 'on' : '') + '"></i>';
      var best = s && s.best ? 'Best ' + fmt(s.best) : (s && s.plays ? 'In progress' : 'Not started');
      var stars = s && s.stars ? ' <span class="stars">' + starMarks(s.stars) + '</span>' : '';
      return '<article class="card' + (cleared ? ' cleared' : '') + '" id="card-' + g.id + '" style="animation-delay:' + (g.rank * 24) + 'ms">' +
        '<div class="poster-wrap"><img class="poster" alt="Card picture for ' + g.title + '" src="' + posters[g.id] + '">' +
        '<span class="card-index">PROMPT ' + pad(g.original) + ' · ' + tierOf(g).name.toUpperCase() + '</span>' +
        '<span class="poster-badge">' + (cleared ? 'Cleared' : 'Rank ' + pad(g.rank)) + '</span></div>' +
        '<div class="card-body"><div class="card-rank"><span>Rank ' + pad(g.rank) + '/13</span><span class="meter">' + meter + '</span></div>' +
        '<h3>' + g.title + '</h3><p class="sub">' + g.subtitle + '</p><p class="log">' + g.logline + '</p>' +
        '<div class="card-facts"><span>Source <b>' + g.minutes + ' min</b></span><span>Source run <b>$' + g.cost.toFixed(2) + '</b></span>' +
        '<span><b>' + g.tech.split(',')[0] + '</b></span></div>' +
        '<div class="card-foot"><span class="card-score">' + best + stars + '</span>' +
        '<button class="play-btn" data-play="' + g.id + '">' + (cleared ? 'Play again' : (s && s.plays ? 'Resume' : 'Play')) + ' <span class="a">→</span></button></div>' +
        '</div></article>';
    }).join('');
    Array.prototype.forEach.call(els.cards.querySelectorAll('[data-play]'), function (b) {
      b.addEventListener('click', function () { openGame(BY[b.getAttribute('data-play')]); });
    });
  }

  /* ---------------- progress drawer ------------------------------------ */
  var BADGES = [
    { id: 'first', name: 'First game', desc: 'Clear one game', test: function (s) { return s.cleared >= 1; } },
    { id: 'cabinet', name: 'Four games', desc: 'Clear four games', test: function (s) { return G.slice(0, 4).every(function (g) { return isCleared(g.id); }); } },
    { id: 'half', name: 'Six games', desc: 'Clear six games', test: function (s) { return s.cleared >= 6; } },
    { id: 'world', name: 'All large games', desc: 'Clear the three largest games', test: function () { return G.filter(function (g) { return g.tier === 'IV'; }).every(function (g) { return isCleared(g.id); }); } },
    { id: 'gold', name: 'Three stars', desc: 'Get three stars on three games', test: function () { return G.filter(function (g) { return (gs(g.id) || {}).stars === 3; }).length >= 3; } },
    { id: 'curious', name: 'All games played', desc: 'Play all thirteen games', test: function () { return G.every(function (g) { return hasPlayed(g.id); }); } },
    { id: 'score', name: '10,000 points', desc: 'Reach 10,000 total points', test: function (s) { return s.score >= 10000; } },
    { id: 'all', name: 'All games cleared', desc: 'Clear all thirteen games', test: function (s) { return s.cleared === 13; } }
  ];
  function renderDrawer(s) {
    els.record.innerHTML = '<div><b>' + s.cleared + '<small>/13</small></b><span>Cleared</span></div>' +
      '<div><b>' + s.stars + '<small>/39</small></b><span>Stars</span></div>' +
      '<div><b>' + fmt(s.score) + '</b><span>Best total</span></div>';
    els.tierBars.innerHTML = TIERS.map(function (t) {
      var list = G.filter(function (g) { return g.tier === t.id; });
      var n = list.filter(function (g) { return isCleared(g.id); }).length;
      return '<div class="row"><span>' + t.id + ' · ' + t.name.toUpperCase() + '</span><div class="track"><i style="width:' + (n / list.length * 100) + '%"></i></div><span>' + n + '/' + list.length + '</span></div>';
    }).join('');
    els.recordRows.innerHTML = G.map(function (g) {
      var x = gs(g.id) || {}, done = !!x.completed;
      return '<div class="rr' + (done ? ' done' : '') + '"><span class="n">' + pad(g.rank) + '</span>' +
        '<span class="nm">' + g.title + '</span><span class="st">' + (x.stars ? starMarks(x.stars) : (done ? 'CLEAR' : (x.plays ? 'PLAYED' : '—'))) + '</span>' +
        '<span class="sc">' + (x.best ? fmt(x.best) : '—') + '</span></div>';
    }).join('');
    els.badges.innerHTML = BADGES.map(function (b) {
      var got = b.test(s);
      return '<div class="badge' + (got ? ' got' : '') + '"><b>' + b.name + '</b><span>' + b.desc + '</span></div>';
    }).join('');
  }
  function openDrawer() {
    renderDrawer(summary());
    els.drawer.classList.add('open'); els.drawer.setAttribute('aria-hidden', 'false'); els.scrim.hidden = false;
    fetchLeaderboard();
  }
  function closeDrawer() {
    els.drawer.classList.remove('open'); els.drawer.setAttribute('aria-hidden', 'true'); els.scrim.hidden = true;
  }

  /* ---------------- the game view -------------------------------------- */
  function openGame(g) {
    if (!g) return;
    state.current = g;
    var url = 'games/' + g.id + '/index.html';
    els.frame.src = url;
    els.gameview.hidden = false;
    document.body.classList.add('playing');
    els.gameRank.textContent = pad(g.rank) + '/13 · ' + tierOf(g).name.toUpperCase();
    els.gameTitle.textContent = g.title;
    els.gameSub.textContent = g.subtitle;
    els.gameHint.textContent = g.controls;
    $('gameOpen').onclick = function () { window.open(url, '_blank', 'noopener'); };
    $('gameRestart').onclick = function () { els.frame.src = url + '?r=' + Date.now(); };
    closeDrawer();
  }
  function closeGame() {
    if (els.gameview.hidden) return;
    els.frame.src = 'about:blank';
    els.gameview.hidden = true;
    document.body.classList.remove('playing');
    state.current = null;
    render();
    flushSync();
  }

  /* ---------------- one small sync service ------------------------------ */
  function setSync(cls, text) {
    els.sync.className = 'sync ' + cls;
    els.syncText.textContent = text;
  }
  function scheduleSync(ms) {
    state.dirty = true;
    clearTimeout(state.syncTimer);
    state.syncTimer = setTimeout(flushSync, ms === undefined ? 1600 : ms);
  }
  function flushSync() {
    clearTimeout(state.syncTimer);
    if (!state.dirty || !navigator.onLine) return;
    var d = doc(), id = (d.playerId || A.player().id).toUpperCase();
    setSync('saving', 'Saving');
    state.dirty = false;
    fetch('/api/progress/' + encodeURIComponent(id), {
      method: 'PUT', headers: { 'content-type': 'application/json' },
      body: JSON.stringify(d), keepalive: true
    }).then(function (res) { if (!res.ok) throw new Error('sync ' + res.status); return res.json(); })
      .then(function (out) {
        setSync('synced', 'Synced');
        if (out && out.doc && out.doc.updatedAt > doc().updatedAt) {
          localStorage.setItem(KEY, JSON.stringify(out.doc)); render();
        }
      })
      .catch(function () { state.dirty = true; setSync('local', 'Saved on this device'); });
  }
  function bootstrapSync() {
    var d = doc(), id = (d.playerId || A.player().id).toUpperCase();
    var started = G.some(function (g) { return (d.games[g.id] || {}).plays > 0; });
    fetch('/api/progress/' + encodeURIComponent(id), { cache: 'no-store' })
      .then(function (res) { return res.ok ? res.json() : (res.status === 404 ? null : Promise.reject(new Error('offline'))); })
      .then(function (out) {
        if (out && out.doc && out.doc.updatedAt > doc().updatedAt) {
          localStorage.setItem(KEY, JSON.stringify(out.doc)); render();
        } else if (started) state.dirty = true;
        setSync('synced', 'Synced');
        if (state.dirty) flushSync();
      })
      .catch(function () { setSync('local', 'Saved on this device'); });
    fetchStats();
  }
  function fetchStats() {
    fetch('/api/stats', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (o) {
      if (!o.ok) return;
      els.globalStats.innerHTML = '<b>' + fmt(o.players) + '</b> players · <b>' + fmt(o.completions) + '</b> games cleared';
      els.footPlayers.textContent = fmt(o.players) + ' players';
    }).catch(function () {
      els.globalStats.textContent = 'This device stores your progress';
      els.footPlayers.textContent = 'Progress on this device';
    });
  }
  function fetchLeaderboard() {
    fetch('/api/leaderboard', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (o) {
      if (!o.ok || !o.rows.length) { els.leaderboard.innerHTML = '<p class="muted">No scores yet. Play a game to add the first score.</p>'; return; }
      els.leaderboard.innerHTML = o.rows.map(function (row, i) {
        return '<div class="lb-row"><span class="who">' + pad(i + 1) + '</span><span class="g">' + (BY[row.game] ? BY[row.game].title : row.game) +
          ' <small>by ' + row.player + '</small></span><span class="v">' + fmt(row.score) + '</span></div>';
      }).join('');
    }).catch(function () { els.leaderboard.innerHTML = '<p class="muted">Top scores appear when the sync service runs.</p>'; });
  }
  async function restore() {
    var code = els.restoreInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length < 8) { els.restoreStatus.textContent = 'The code is too short.'; return; }
    if (!state.restoreArmed) {
      els.restoreStatus.textContent = 'This action replaces the progress on this device. Press Restore again.';
      state.restoreArmed = true; return;
    }
    state.restoreArmed = false;
    els.restoreStatus.textContent = 'Checking code ' + code;
    try {
      var res = await fetch('/api/progress/' + encodeURIComponent(code), { cache: 'no-store' });
      if (!res.ok) { els.restoreStatus.textContent = 'No progress found for that code.'; return; }
      var out = await res.json();
      if (!out.doc) { els.restoreStatus.textContent = 'No progress found for that code.'; return; }
      var remote = out.doc; remote.playerId = code;
      localStorage.setItem(KEY, JSON.stringify(remote));
      A.setPlayerId(code);
      state.dirty = false;
      render(); renderDrawer(summary());
      setSync('synced', 'Synced');
      els.restoreStatus.textContent = 'The site loaded your progress.';
    } catch (e) { els.restoreStatus.textContent = 'The sync service is not available.'; }
  }

  /* ---------------- toasts + wiring ------------------------------------ */
  var toastTimer = null;
  function toast(msg) {
    els.toast.textContent = msg; els.toast.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { els.toast.classList.remove('show'); }, 2600);
  }
  function render() {
    var s = summary();
    renderHeader(s); renderSteps(); renderCards();
    if (els.drawer.classList.contains('open')) renderDrawer(s);
  }
  function scheduleRender() {
    if (state.renderQueued) return;
    state.renderQueued = true;
    requestAnimationFrame(function () { state.renderQueued = false; render(); });
  }

  function wire() {
    els.continueBtn.addEventListener('click', function () { openGame(BY[els.continueBtn._game] || G[0]); });
    $('progressBtn').addEventListener('click', openDrawer);
    $('playerBtn').addEventListener('click', function () { openDrawer(); els.syncCode.scrollIntoView({ block: 'center' }); });
    $('closeDrawer').addEventListener('click', closeDrawer);
    els.scrim.addEventListener('click', closeDrawer);
    els.filters.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-filter]'); if (!chip) return;
      state.filter = chip.getAttribute('data-filter');
      Array.prototype.forEach.call(els.filters.querySelectorAll('.chip'), function (c) { c.classList.toggle('active', c === chip); });
      renderCards();
    });
    els.search.addEventListener('input', function () { state.query = els.search.value; renderCards(); });
    $('gameBack').addEventListener('click', closeGame);
    $('copyCode').addEventListener('click', function () {
      var code = doc().playerId || A.player().id;
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(function () { toast('Code copied'); }).catch(function () { toast('Code: ' + code); });
      else toast('Code: ' + code);
    });
    $('restoreBtn').addEventListener('click', restore);
    els.restoreInput.addEventListener('input', function () { state.restoreArmed = false; els.restoreStatus.textContent = ''; });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { if (!els.gameview.hidden) closeGame(); else closeDrawer(); }
      if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); els.search.focus(); }
    });
    window.addEventListener('message', function (e) {
      var d = e.data;
      if (!d || d.source !== 'fable-arcade-sdk') return;
      if (e.source !== els.frame.contentWindow) return; // only our game iframe
      if (d.type === 'exit') { closeGame(); return; }
      if (d.type !== 'progress') return;
      var payload = d.payload || {};
      if (payload.game && !BY[payload.game]) return;
      scheduleRender();
      scheduleSync(d.event === 'complete' ? 150 : 1800);
      if (d.event === 'complete') {
        toast((BY[payload.game] ? BY[payload.game].title + ' cleared' : 'Game cleared') + ' · ' + fmt(payload.score || 0) + ' points');
        fetchStats();
      } else if (d.event === 'checkpoint') toast('Milestone saved');
    });
    A.onProgress(function () { scheduleRender(); scheduleSync(1800); });
    window.addEventListener('pagehide', flushSync);
    document.addEventListener('visibilitychange', function () { if (document.hidden) flushSync(); });
    window.addEventListener('online', function () { if (state.dirty) flushSync(); });
  }

  buildPosters();
  wire();
  render();
  bootstrapSync();
})();
