/* Mobile project carousel.
   On small screens the project list is a horizontal swipe carousel showing one
   project at a time. The visible project becomes "active": its still fades in
   behind the panel (body[data-active="..."], see style.css) and its dot is
   filled. On desktop this does nothing and the original hover interaction is
   used. */
(function () {
    var mq = window.matchMedia('(max-width: 768px)');
    var list = document.querySelector('.projects');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.project'));
    var dotsWrap = document.querySelector('.carousel-dots');
    var dots = [];
    var active = null;
    var ticking = false;

    // Safety net for the js-fade fallback in style.css: guarantees the page
    // becomes visible even if transition.js isn't loaded on this page.
    document.body.classList.add('is-visible');

    // One dot per project; tapping a dot jumps to that project
    if (dotsWrap) {
        cards.forEach(function (card, i) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', card.querySelector('.project-header span').textContent);
            dot.addEventListener('click', function () {
                card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            });
            dotsWrap.appendChild(dot);
            dots.push(dot);
        });
    }

    function setActive(card) {
        if (card === active) return;
        active = card;
        var idx = cards.indexOf(card);
        cards.forEach(function (c) { c.classList.toggle('is-active', c === card); });
        dots.forEach(function (d, i) {
            d.classList.toggle('is-active', i === idx);
            d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
        });
        document.body.setAttribute('data-active', card.getAttribute('data-bg'));
    }

    function clearActive() {
        active = null;
        cards.forEach(function (c) { c.classList.remove('is-active'); });
        dots.forEach(function (d) { d.classList.remove('is-active'); });
        document.body.removeAttribute('data-active');
    }

    function update() {
        ticking = false;
        if (!mq.matches) { clearActive(); return; }

        var rect = list.getBoundingClientRect();
        var mid = rect.left + rect.width / 2;
        var best = null, bestDist = Infinity;

        cards.forEach(function (c) {
            var r = c.getBoundingClientRect();
            var d = Math.abs(r.left + r.width / 2 - mid);
            if (d < bestDist) { bestDist = d; best = c; }
        });

        if (best) setActive(best);
    }

    function requestUpdate() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    }

    list.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    if (mq.addEventListener) { mq.addEventListener('change', requestUpdate); }
    else if (mq.addListener) { mq.addListener(requestUpdate); }

    update();
    window.addEventListener('load', update);
})();
