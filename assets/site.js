// Menu + year
(function () {
  var btn = document.querySelector('.menu-toggle');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Close' : 'Menu';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { btn.click(); btn.focus(); }
    });
  }
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();

// Latest Substack posts. Keeps the built-in cards if the feed can't load.
(function () {
  var box = document.getElementById('posts');
  if (!box || !window.fetch) return;
  var feed = 'https://raisingaballerbook.substack.com/feed';
  fetch('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feed))
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data || data.status !== 'ok' || !data.items || !data.items.length) return;
      box.innerHTML = '';
      data.items.slice(0, 4).forEach(function (it) {
        if (!/^https:\/\/raisingaballerbook\.substack\.com\//.test(it.link)) return;
        var d = new Date(String(it.pubDate).replace(' ', 'T'));
        var tmp = document.createElement('div');
        tmp.innerHTML = it.description || '';
        var text = (tmp.textContent || '').trim();
        if (text.length > 150) text = text.slice(0, 147).trim() + '…';
        var a = document.createElement('a');
        a.className = 'post'; a.href = it.link; a.target = '_blank'; a.rel = 'noopener';
        var t = document.createElement('time');
        t.textContent = isNaN(d) ? '' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        var h = document.createElement('h3'); h.textContent = it.title;
        var p = document.createElement('p'); p.textContent = text;
        var m = document.createElement('span'); m.className = 'more'; m.textContent = 'Read on Substack';
        a.append(t, h, p, m);
        box.appendChild(a);
      });
    })
    .catch(function () {});
})();

// Contact form (Formspree)
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
      status.textContent = "The contact form isn't connected yet. Please reach us on Instagram or Facebook for now.";
      return;
    }
    status.textContent = 'Sending…';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (r.ok) { form.reset(); status.textContent = 'Message sent. We\'ll get back to you soon.'; }
        else status.textContent = 'Your message didn\'t send. Check your email address and try again.';
      })
      .catch(function () { status.textContent = 'Your message didn\'t send. Check your connection and try again.'; });
  });
})();

// Team Moms bingo
(function () {
  var grid = document.getElementById('bingo');
  if (!grid) return;
  var msg = document.getElementById('bingo-msg');
  var squares = [
    'Someone says "D1"', 'Wine enters the chat', 'A parent yells at the ump', 'Travel ball costs come up',
    'Someone cries in the stands', 'A coach gets questioned', 'A recruiting rumor', 'Matching team mom outfits',
    'Someone mentions "the showcase"', 'A kid looks embarrassed', 'A group chat gets screenshotted', 'Private lessons flex',
    'Dad critiques the swing', 'Playing time drama', '"It\'s not about the money"', 'A parent films everything',
    'Talk of a scholarship', 'New bat costs a fortune', 'Somebody switches teams', 'Snack drama',
    'A walk-off moment', 'Injury scare', '"My son is special"', 'Parent-coach side talk',
    'Kid just wants to have fun', 'Hotel lobby gossip', 'Rankings come up', 'Tears on the ride home'
  ];
  var lines = [];
  for (var i = 0; i < 5; i++) {
    lines.push([0,1,2,3,4].map(function (c) { return i * 5 + c; }));
    lines.push([0,1,2,3,4].map(function (r) { return r * 5 + i; }));
  }
  lines.push([0,6,12,18,24], [4,8,12,16,20]);
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function check() {
    var cells = grid.children;
    var won = lines.some(function (l) { return l.every(function (n) { return cells[n].classList.contains('on'); }); });
    if (msg) msg.textContent = won ? 'Bingo! Screenshot it for the group chat.' : '';
  }
  function build() {
    var picks = shuffle(squares.slice()).slice(0, 24);
    picks.splice(12, 0, 'Free');
    grid.innerHTML = '';
    picks.forEach(function (txt, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = txt;
      if (i === 12) { b.className = 'free on'; b.setAttribute('aria-pressed', 'true'); b.disabled = true; }
      else {
        b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', function () {
          var on = b.classList.toggle('on');
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
          check();
        });
      }
      grid.appendChild(b);
    });
    check();
  }
  build();
  var nb = document.getElementById('newcard');
  if (nb) nb.addEventListener('click', build);
})();

// Logo shows a different sport's ball on each visit
(function () {
  var G = '#c9a24f', N = '#14233f';
  var S = '<g stroke="' + N + '" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">';
  var C = '<circle cx="16" cy="16" r="15" fill="' + G + '"/>';
  var BALLS = {
    basketball: C + S + '<path d="M16 1v30M1 16h30"/><path d="M6.5 4.5c3.8 3 5.8 7 5.8 11.5s-2 8.5-5.8 11.5"/><path d="M25.5 4.5c-3.8 3-5.8 7-5.8 11.5s2 8.5 5.8 11.5"/></g>',
    soccer: C + S + '<path d="M16 11l4.8 3.5-1.8 5.6h-6l-1.8-5.6z" fill="' + N + '"/><path d="M16 11V4.5M20.8 14.5l6-2M19 20.1l3.8 5.2M13 20.1l-3.8 5.2M11.2 14.5l-6-2"/></g>',
    football: '<ellipse cx="16" cy="16" rx="15" ry="9.2" transform="rotate(-35 16 16)" fill="' + G + '"/>' + S.replace('<g ', '<g transform="rotate(-35 16 16)" ') + '<path d="M10.5 16h11M12.5 14v4M15 14v4M17.5 14v4M20 14v4M5.2 12.4v7.2M26.8 12.4v7.2"/></g>',
    tennis: C + S + '<path d="M3.2 9.2C9 10.6 12.3 14.6 12.3 19.6c0 3.5-1.6 6.4-4 8.4"/><path d="M28.8 22.8C23 21.4 19.7 17.4 19.7 12.4c0-3.5 1.6-6.4 4-8.4"/></g>',
    volleyball: C + S + '<path d="M16 16C14.6 10.4 13 5.6 10.9 1.9"/><path d="M16 16c4.9 1 9.3 3.6 13 7.5"/><path d="M16 16c-3.1 3.9-7.6 6.5-13 7.5"/><path d="M5.3 7.4c4.3-.9 8.5 0 11.9 2.7"/><path d="M24.8 3.9c1 3.8.4 7.7-1.8 11.3"/><path d="M22.6 28.3c-3.4-1.6-5.7-4.4-6.6-8"/></g>',
    baseball: C + S + '<path d="M8.5 3.5c3 3.4 4.5 7.6 4.5 12.5s-1.5 9.1-4.5 12.5M23.5 3.5c-3 3.4-4.5 7.6-4.5 12.5s1.5 9.1 4.5 12.5"/></g>'
  };
  var keys = Object.keys(BALLS), last = null;
  try { last = localStorage.getItem('rab-ball'); } catch (e) {}
  var pool = keys.filter(function (k) { return k !== last; });
  var pick = pool[Math.floor(Math.random() * pool.length)];
  try { localStorage.setItem('rab-ball', pick); } catch (e) {}
  document.querySelectorAll('.brand svg').forEach(function (svg) { svg.innerHTML = BALLS[pick]; });
  var icon = document.querySelector('link[rel="icon"]');
  if (icon) {
    icon.type = 'image/svg+xml';
    icon.href = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' + BALLS[pick] + '</svg>');
  }
})();
