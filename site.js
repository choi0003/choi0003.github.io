/* 도미초이 사이트 공용 스크립트 — SPA 내비게이션 + 계속 재생되는 음악 플레이어 */
(function () {
  'use strict';

  /* ---------- 영속 음악 플레이어 ---------- */
  var player = document.createElement('div');
  player.id = 'mini-player';
  player.innerHTML =
    '<button id="mp-toggle" aria-label="재생/일시정지">▶</button>' +
    '<div id="mp-info"><div id="mp-title">—</div>' +
    '<div id="mp-progress"><div id="mp-bar"></div></div></div>' +
    '<button id="mp-close" aria-label="닫기">✕</button>' +
    '<audio id="mp-audio" preload="none"></audio>';
  document.body.appendChild(player);

  var audio = document.getElementById('mp-audio');
  var btnToggle = document.getElementById('mp-toggle');
  var btnClose = document.getElementById('mp-close');
  var elTitle = document.getElementById('mp-title');
  var elBar = document.getElementById('mp-bar');
  var elProgress = document.getElementById('mp-progress');

  function showPlayer() { player.classList.add('visible'); }
  function updateToggle() { btnToggle.textContent = audio.paused ? '▶' : '⏸'; }

  window.DomiPlayer = {
    play: function (src, title) {
      if (audio.src !== src && audio.getAttribute('data-src') !== src) {
        audio.src = src;
        audio.setAttribute('data-src', src);
      }
      elTitle.textContent = title || '—';
      showPlayer();
      audio.play();
      updateToggle();
      syncSongButtons();
    },
    toggle: function () {
      if (!audio.getAttribute('data-src')) return;
      if (audio.paused) audio.play(); else audio.pause();
      updateToggle();
      syncSongButtons();
    },
    stop: function () {
      audio.pause();
      audio.removeAttribute('src');
      audio.removeAttribute('data-src');
      audio.load();
      player.classList.remove('visible');
      updateToggle();
      syncSongButtons();
    },
    isPlayingSrc: function (src) {
      return audio.getAttribute('data-src') === src && !audio.paused;
    }
  };

  btnToggle.addEventListener('click', function () { window.DomiPlayer.toggle(); });
  btnClose.addEventListener('click', function () { window.DomiPlayer.stop(); });
  audio.addEventListener('play', updateToggle);
  audio.addEventListener('pause', function () { updateToggle(); syncSongButtons(); });
  audio.addEventListener('ended', function () { updateToggle(); syncSongButtons(); });
  audio.addEventListener('timeupdate', function () {
    if (audio.duration) elBar.style.width = (audio.currentTime / audio.duration * 100) + '%';
  });
  elProgress.addEventListener('click', function (e) {
    if (!audio.duration) return;
    var r = elProgress.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  });

  /* 음악 페이지의 곡별 재생 버튼 동기화 */
  function syncSongButtons() {
    document.querySelectorAll('[data-song-src]').forEach(function (btn) {
      var src = btn.getAttribute('data-song-src');
      btn.textContent = window.DomiPlayer.isPlayingSrc(src) ? '⏸ 일시정지' : '▶ 재생';
    });
  }

  function bindSongButtons(root) {
    (root || document).querySelectorAll('[data-song-src]').forEach(function (btn) {
      if (btn.getAttribute('data-bound')) return;
      btn.setAttribute('data-bound', '1');
      btn.addEventListener('click', function () {
        var src = btn.getAttribute('data-song-src');
        var title = btn.getAttribute('data-song-title') || '';
        if (window.DomiPlayer.isPlayingSrc(src)) window.DomiPlayer.toggle();
        else window.DomiPlayer.play(src, title);
      });
    });
  }

  /* ---------- SPA 내비게이션 ---------- */
  function isInternalLink(a) {
    if (!a || !a.href) return false;
    if (a.target === '_blank' || a.hasAttribute('download')) return false;
    try {
      var u = new URL(a.href, location.href);
      return u.origin === location.origin && u.pathname.endsWith('.html');
    } catch (e) { return false; }
  }

  function getContentNodes(doc) {
    // </nav> 와 <footer> 사이의 모든 노드를 수집
    var nodes = [];
    var nav = doc.querySelector('nav');
    var footer = doc.querySelector('footer');
    if (!nav || !footer) return null;
    var n = nav.nextSibling;
    while (n && n !== footer) {
      nodes.push(n);
      n = n.nextSibling;
    }
    return nodes;
  }

  function swapPage(html, url, push) {
    var doc = new DOMParser().parseFromString(html, 'text/html');

    // 본문 교체: </nav> 와 <footer> 사이의 모든 내용
    var newNodes = getContentNodes(doc);
    var nav = document.querySelector('nav');
    var footer = document.querySelector('footer');
    if (!newNodes || !nav || !footer) {
      location.href = url; // 구조가 다르면 일반 이동
      return;
    }
    // 기존 내용 제거
    var cur = nav.nextSibling;
    while (cur && cur !== footer) {
      var next = cur.nextSibling;
      cur.remove();
      cur = next;
    }
    // 새 내용 삽입
    newNodes.forEach(function (n) {
      footer.parentNode.insertBefore(n, footer);
    });

    // 페이지별 <style> 교체
    document.querySelectorAll('style[data-page]').forEach(function (s) { s.remove(); });
    doc.querySelectorAll('head style').forEach(function (s) {
      var c = s.cloneNode(true);
      c.setAttribute('data-page', '1');
      document.head.appendChild(c);
    });

    document.title = doc.title || document.title;
    if (push) history.pushState({ url: url }, '', url);
    window.scrollTo(0, 0);
    bindSongButtons(document);
    resetDisqusIfNeeded();
    initGuestbook();
  }

  function navigate(url) {
    fetch(url, { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw 0; return r.text(); })
      .then(function (html) { swapPage(html, url, true); })
      .catch(function () { location.href = url; });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a || !isInternalLink(a)) return;
    // 음악 재생 중이 아니면 SPA 불필요 — 일반 이동도 괜찮지만 일관되게 처리
    e.preventDefault();
    navigate(a.getAttribute('href'));
  });

  window.addEventListener('popstate', function (e) {
    if (e.state && e.state.url) {
      fetch(e.state.url, { credentials: 'same-origin' })
        .then(function (r) { if (!r.ok) throw 0; return r.text(); })
        .then(function (html) { swapPage(html, e.state.url, false); })
        .catch(function () { location.href = e.state.url; });
    }
  });

  /* ---------- Disqus ---------- */
  function resetDisqusIfNeeded() {
    var thread = document.getElementById('disqus_thread');
    if (!thread) return;
    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.url = location.href;
          this.page.identifier = location.pathname;
        }
      });
    } else {
      // Disqus 스크립트가 아직 로드 안 됐으면 새로 삽입
      var d = document, s = d.createElement('script');
      s.src = 'https://choi0003.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    }
  }

  /* ---------- 사람들의 방 (자체 방명록) ---------- */
  var GB_API = 'https://yoons-mac-mini.tail24550d.ts.net/guestbook/comments';

  function gbFormatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

  function initGuestbook() {
    var list = document.getElementById('gb-list');
    var form = document.getElementById('gb-form');
    if (!list || !form) return;
    if (form.getAttribute('data-gb-bound')) return;
    form.setAttribute('data-gb-bound', '1');

    var status = document.getElementById('gb-status');

    function setNote(text) {
      list.textContent = '';
      var p = document.createElement('p');
      p.className = 'gb-note';
      p.textContent = text;
      list.appendChild(p);
    }

    function setClosedNote() {
      list.textContent = '';
      var p = document.createElement('p');
      p.className = 'gb-note';
      p.appendChild(document.createTextNode('지금은 방이 잠시 닫혀 있어요. 이메일('));
      var a = document.createElement('a');
      a.href = 'mailto:domichoi2026@gmail.com';
      a.textContent = 'domichoi2026@gmail.com';
      p.appendChild(a);
      p.appendChild(document.createTextNode(')로 보내 주셔도 됩니다.'));
      list.appendChild(p);
    }

    function render(comments) {
      if (!comments.length) {
        setNote('아직 글이 없어요. 첫 한 줄을 남겨 주세요.');
        return;
      }
      list.textContent = '';
      comments.forEach(function (c) {
        var item = document.createElement('div');
        item.className = 'gb-item';
        var head = document.createElement('div');
        var name = document.createElement('span');
        name.className = 'gb-name';
        name.textContent = c.name;
        head.appendChild(name);
        var date = document.createElement('span');
        date.className = 'gb-date';
        date.textContent = gbFormatDate(c.created_at);
        head.appendChild(date);
        var msg = document.createElement('p');
        msg.className = 'gb-msg';
        msg.textContent = c.message;
        item.appendChild(head);
        item.appendChild(msg);
        list.appendChild(item);
      });
    }

    function loadList() {
      fetch(GB_API)
        .then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .then(render)
        .catch(setClosedNote);
    }
    loadList();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameEl = document.getElementById('gb-name');
      var msgEl = document.getElementById('gb-message');
      var btn = document.getElementById('gb-submit');
      var name = nameEl.value.trim();
      var message = msgEl.value.trim();
      if (!name || !message) {
        status.textContent = '이름과 글을 모두 적어 주세요.';
        return;
      }
      btn.disabled = true;
      status.textContent = '보내는 중입니다…';
      fetch(GB_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, message: message })
      })
        .then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .then(function () {
          status.textContent = '글이 올라갔어요.';
          form.reset();
          loadList();
        })
        .catch(function () {
          status.textContent = '지금은 글을 보낼 수 없어요. 잠시 뒤에 다시 시도해 주세요.';
        })
        .then(function () { btn.disabled = false; });
    });
  }

  /* ---------- 초기화 ---------- */
  bindSongButtons(document);
  resetDisqusIfNeeded();
  initGuestbook();
  // 첫 페이지 상태를 히스토리에 기록 (뒤로가기 대응)
  if (!history.state) history.replaceState({ url: location.pathname.split('/').pop() || 'index.html' }, '', location.href);
})();
