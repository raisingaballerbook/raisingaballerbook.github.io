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
    soccer: "<defs><clipPath id=\"rab-sc\"><circle cx=\"16\" cy=\"16\" r=\"15\"/></clipPath></defs><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"#c9a24f\"/><g clip-path=\"url(#rab-sc)\"><path d=\"M16.00 11.40L20.37 14.58L18.70 19.72L13.30 19.72L11.63 14.58Z\" fill=\"#14233f\"/><path d=\"M23.05 6.29L21.46 1.37L25.64 -1.67L29.82 1.37L28.23 6.29Z\" fill=\"#14233f\"/><path d=\"M27.41 19.71L31.60 16.67L35.78 19.71L34.18 24.63L29.01 24.63Z\" fill=\"#14233f\"/><path d=\"M16.00 28.00L20.18 31.04L18.59 35.96L13.41 35.96L11.82 31.04Z\" fill=\"#14233f\"/><path d=\"M4.59 19.71L2.99 24.63L-2.18 24.63L-3.78 19.71L0.40 16.67Z\" fill=\"#14233f\"/><path d=\"M8.95 6.29L3.77 6.29L2.18 1.37L6.36 -1.67L10.54 1.37Z\" fill=\"#14233f\"/><path d=\"M16.00 11.40L16.00 7.40M20.37 14.58L24.18 13.34M18.70 19.72L21.05 22.96M13.30 19.72L10.95 22.96M11.63 14.58L7.82 13.34M16.00 7.40L8.95 6.29M16.00 7.40L23.05 6.29M24.18 13.34L23.05 6.29M24.18 13.34L27.41 19.71M21.05 22.96L27.41 19.71M21.05 22.96L16.00 28.00M10.95 22.96L16.00 28.00M10.95 22.96L4.59 19.71M7.82 13.34L4.59 19.71M7.82 13.34L8.95 6.29\" stroke=\"#14233f\" stroke-width=\"1.4\" fill=\"none\" stroke-linecap=\"round\"/></g>",
    football: '<ellipse cx="16" cy="16" rx="15" ry="9.2" transform="rotate(-35 16 16)" fill="' + G + '"/>' + S.replace('<g ', '<g transform="rotate(-35 16 16)" ') + '<path d="M10.5 16h11M12.5 14v4M15 14v4M17.5 14v4M20 14v4M5.2 12.4v7.2M26.8 12.4v7.2"/></g>',
    tennis: C + S + '<path d="M3.2 9.2C9 10.6 12.3 14.6 12.3 19.6c0 3.5-1.6 6.4-4 8.4"/><path d="M28.8 22.8C23 21.4 19.7 17.4 19.7 12.4c0-3.5 1.6-6.4 4-8.4"/></g>',
    volleyball: "<defs><clipPath id=\"rab-vb\"><circle cx=\"16\" cy=\"16\" r=\"15\"/></clipPath></defs><circle cx=\"16\" cy=\"16\" r=\"15\" fill=\"#c9a24f\"/><g clip-path=\"url(#rab-vb)\" stroke=\"#14233f\" stroke-width=\"1.6\" fill=\"none\" stroke-linecap=\"round\"><g transform=\"rotate(0 16 16)\"><path d=\"M16 16C16.6 10.8 19.6 6 24.6 3.4\"/><path d=\"M11.6 13.4C11.9 8.4 14.4 4.2 18.4 1.6\"/></g><g transform=\"rotate(120 16 16)\"><path d=\"M16 16C16.6 10.8 19.6 6 24.6 3.4\"/><path d=\"M11.6 13.4C11.9 8.4 14.4 4.2 18.4 1.6\"/></g><g transform=\"rotate(240 16 16)\"><path d=\"M16 16C16.6 10.8 19.6 6 24.6 3.4\"/><path d=\"M11.6 13.4C11.9 8.4 14.4 4.2 18.4 1.6\"/></g></g>",
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
