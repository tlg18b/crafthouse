// Fallback page-fade for browsers without native cross-document View Transitions
// (Safari, Firefox). Chromium browsers already get a smooth built-in crossfade
// via the `@view-transition { navigation: auto; }` rule in the CSS, so this
// script does nothing there — it only runs when that API is unavailable.

(function () {
    var root = document.documentElement;
    var usingFallback = root.classList.contains('js-fade');

    if (usingFallback) {
        // Wait two frames so the browser actually paints the opacity:0 state
        // before transitioning to 1 — otherwise the fade-in can get skipped.
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                document.body.classList.add('is-visible');
            });
        });
    }

    document.addEventListener('click', function (e) {
        if (!usingFallback) return; // let the native transition handle it

        var link = e.target.closest('.nav-link');
        if (!link) return;

        var href = link.getAttribute('href') || link.dataset.href;
        if (!href || href === '#') return;

        e.preventDefault();
        document.body.classList.remove('is-visible');
        setTimeout(function () {
            window.location.href = href;
        }, 380); // matches the CSS fade duration below
    });
})();