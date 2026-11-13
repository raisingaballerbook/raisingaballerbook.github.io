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
