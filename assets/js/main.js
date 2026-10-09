"use strict";
/* ============================================================
   Osorio Lab — logic: i18n (DE/EN), anime.js animations in the
   style of animejs.com (split-text word reveals, scroll-scrubbed,
   staggered lists, signature easings), motion variants, interactions
   ============================================================ */
// TypeScript source — compiled to assets/js/main.js (npm run build).
(function () {
    "use strict";
    var D = window.LAB;
    var I = window.I18N;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var hasAnime = typeof window.anime !== "undefined";
    /* fixed motion profile — animejs.com signature (easeOutExpo) */
    var VP = function () {
        return { dist: 52, rot: 6, wordStagger: 72, listStagger: 56, ease: "easeOutExpo" };
    };
    /* ---------- i18n helpers ---------- */
    function t(key) { return I[key] || key; }
    function pick(v) { return v; }
    function el(tag, cls, html) {
        var n = document.createElement(tag);
        if (cls)
            n.className = cls;
        if (html !== undefined)
            n.innerHTML = html;
        return n;
    }
    function esc(s) {
        return String(s).replace(/[&<>\"]/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
        });
    }
    function safeUrl(u) {
        var s = String(u == null ? "" : u).trim();
        if (!s)
            return "#";
        if (/^https?:\/\//i.test(s) || /^mailto:/i.test(s) || /^tel:/i.test(s))
            return s;
        if (/^[a-z][a-z0-9+.-]*:/i.test(s))
            return "#"; // javascript:, data:, etc. — blocked
        return s;
    }
    function initials(name) {
        var p = name.split(" ").filter(Boolean);
        if (!p.length)
            return "";
        return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
    }
    /* ---------- render functions ---------- */
    function renderMission() {
        var m = D.mission;
        var lead = document.querySelector("[data-mission-lead]");
        var body = document.querySelector("[data-mission-body]");
        if (lead)
            lead.textContent = m[0];
        if (body)
            body.innerHTML = "<p>" + esc(m[1]) + "</p><p>" + esc(m[2]) + "</p>";
    }
    function renderMarquee() {
        var track = document.querySelector(".marquee-track");
        if (!track)
            return;
        var half = D.marquee.map(function (w) { return '<span>' + esc(w) + '<i>✳</i></span>'; }).join("");
        track.innerHTML = half + half;
    }
    function renderStats() {
        var grid = document.querySelector(".stats-grid");
        if (!grid)
            return;
        var stats = [
            { val: D.topics.length, label: t("stats.topics") }
        ];
        grid.innerHTML = stats.map(function (s) {
            return '<div class="stat"><b><span data-count="' + s.val + '">0</span></b><small>' + esc(s.label) + '</small></div>';
        }).join("");
        initCounters();
    }
    function renderAbout() {
        var body = document.querySelector("[data-about]");
        if (body)
            body.innerHTML = D.about.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    }
    function renderAboutProfile() {
        var root = document.querySelector("[data-about-profile]");
        if (!root || !D.aboutProfile)
            return;
        function tlRow(r, first) {
            return '<div class="ptl-row' + (first ? ' ptl-current' : '') + '"><span class="ptl-year">' + esc(r.y) + '</span><span class="ptl-text">' + esc(r.t) + '</span></div>';
        }
        var ap = D.aboutProfile;
        var html = "";
        html += '<div class="profile-head reveal"><b>' + esc(ap.name) + '</b><span>' + esc(ap.role) + '</span></div>';
        html += '<div class="profile-cols">';
        html += '<div class="profile-col">';
        html += '<div class="profile-block reveal order-1"><h3 class="profile-h"><span class="ph-idx">01</span><span class="ph-t">Academic career and education</span></h3><div class="profile-timeline">' + ap.academicCareer.map(function (r, i) { return tlRow(r, i === 0); }).join("") + '</div></div>';
        html += '<div class="profile-block reveal order-3"><h3 class="profile-h"><span class="ph-idx">03</span><span class="ph-t">Scientific memberships</span></h3><ul class="profile-memberships">' + ap.memberships.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") + '</ul></div>';
        html += '</div>';
        html += '<div class="profile-col">';
        html += '<div class="profile-block reveal order-2"><h3 class="profile-h"><span class="ph-idx">02</span><span class="ph-t">Awards and distinctions</span></h3><div class="profile-timeline">' + ap.awards.map(function (r) { return tlRow(r, false); }).join("") + '</div></div>';
        html += '<div class="profile-block reveal order-4"><h3 class="profile-h"><span class="ph-idx">04</span><span class="ph-t">Languages</span></h3><div class="profile-langs">' + ap.languages.map(function (l) { return '<span class="lang-chip">' + esc(l) + '</span>'; }).join("") + '</div></div>';
        html += '</div>';
        html += '</div>';
        root.innerHTML = html;
    }
    function renderTopics() {
        var list = document.querySelector(".topic-list");
        if (!list)
            return;
        list.innerHTML = D.topics.map(function (tp) { return '<span class="topic">' + esc(pick(tp)) + '</span>'; }).join("");
    }
    var pubState = "all";
    function pubItemHTML(p, i, boldAuthors) {
        var title = p.url ? '<a class="pub-title" href="' + esc(safeUrl(p.url)) + '" target="_blank" rel="noopener">' + esc(p.title) + (p.titleEn ? ' <span class="pub-title-en">(' + esc(p.titleEn) + ')</span>' : '') + '</a>' : '<span class="pub-title">' + esc(p.title) + (p.titleEn ? ' <span class="pub-title-en">(' + esc(p.titleEn) + ')</span>' : '') + '</span>';
        var authors = boldAuthors ? esc(p.authors).replace(/(A\.\s?Osorio(?:-Madrazo)?|Anayancy\s+Osorio-Madrazo)/g, '<b class="author-name">$&</b>') : esc(p.authors);
        var meta = '<span class="pub-meta-line">' + authors + ' — <b>' + esc(p.journal) + '</b>' + (p.ref ? ', ' + esc(p.ref) : '') + '</span>';
        var tags = "";
        if (p.oa)
            tags += '<span class="tag-oa">' + t("pubs.oa") + '</span>';
        if (p.lang === "de" && p.titleEn)
            tags += '<span class="tag-lang">' + t("pubs.deen") + '</span>';
        if (p.lang === "es")
            tags += '<span class="tag-lang">' + t("pubs.es") + '</span>';
        if (p.lang === "enes")
            tags += '<span class="tag-lang">' + t("pubs.enes") + '</span>';
        var doi = "";
        if (p.url && p.url.indexOf("doi.") !== -1) {
            doi = p.url.replace(/^https?:\/\/[^\/]+\//, "");
            doi = '<a class="pub-doi" href="' + esc(safeUrl(p.url)) + '" target="_blank" rel="noopener">doi: ' + esc(doi) + ' <span>↗</span></a>';
        }
        return '<div class="pub-item"><div class="pub-num">' + String(i + 1).padStart(2, "0") + '</div><div class="pub-body">' + title + meta + tags + doi + '</div></div>';
    }
    function renderPubs(filter) {
        pubState = filter || pubState;
        var container = document.querySelector(".pubs-list");
        if (!container)
            return;
        var html = "";
        var arts = D.publications.articles.slice().sort(function (a, b) { return b.y - a.y; });
        var showArticles = pubState === "all" || pubState === "articles";
        var showChapters = pubState === "all" || pubState === "chapters";
        var showPatents = pubState === "all" || pubState === "patents";
        if (showArticles) {
            html += '<h3 class="pub-subhead">' + t("pubs.subArticles") + '</h3>';
            var years = {};
            arts.forEach(function (a) { (years[a.y] = years[a.y] || []).push(a); });
            Object.keys(years).sort(function (a, b) { return Number(b) - Number(a); }).forEach(function (y) {
                html += '<div class="pub-year-group"><div class="pub-year">' + y + '</div>';
                years[y].forEach(function (a) { html += pubItemHTML(a, arts.indexOf(a), true); });
                html += '</div>';
            });
        }
        if (showChapters) {
            html += '<h3 class="pub-subhead">' + t("pubs.subChapters") + '</h3><div class="pub-year-group">';
            D.publications.chapters.forEach(function (c, i) { html += pubItemHTML(c, i); });
            html += '</div>';
        }
        if (showPatents) {
            html += '<h3 class="pub-subhead">' + t("pubs.subPatents") + '</h3><div class="pub-year-group">';
            D.publications.patents.forEach(function (p, i) { html += pubItemHTML(p, i); });
            html += '</div>';
        }
        container.innerHTML = html;
        document.querySelectorAll(".pub-filter").forEach(function (b) {
            b.classList.toggle("active", b.getAttribute("data-filter") === pubState);
        });
    }
    function renderTeaching() {
        var wrap = document.querySelector(".teach-list");
        if (!wrap)
            return;
        function fmtItem(s) {
            return esc(s).replace(/&lt;i&gt;([\s\S]*?)&lt;\/i&gt;/g, "<i>$1</i>");
        }
        wrap.innerHTML = D.teaching.map(function (tp) {
            var groups = tp.groups.map(function (g) {
                return '<div class="teach-group"><div class="teach-program">' + esc(g.program) + '</div><ul>' +
                    g.items.map(function (it) { return '<li>' + fmtItem(it) + '</li>'; }).join("") + '</ul></div>';
            }).join("");
            var y = String(tp.period).match(/(\d{4})/);
            return '<div class="timeline-item reveal"><span class="tl-dot"></span><div class="tl-content">' +
                '<div class="tl-year">' + esc(y ? y[1] : "") + '</div>' +
                '<h3 class="tl-period">' + esc(tp.period) + '</h3>' + groups +
                '</div></div>';
        }).join("");
    }
    function renderTeam() {
        var grid = document.querySelector(".team-grid");
        if (!grid)
            return;
        grid.innerHTML = D.team.map(function (m, i) {
            var photo = m.img
                ? '<div class="member-photo"><img src="' + esc(safeUrl(m.img)) + '" alt="' + esc(m.name) + '" "></div>'
                : '<div class="member-photo"><div class="member-avatar"><b>' + esc(initials(m.name)) + '</b></div></div>';
            return '<div class="member" data-index="' + i + '"><span class="glare"></span>' + photo +
                '<div class="member-info"><h3>' + esc(m.name) + '</h3><div class="role">' + esc(pick(m.role)) + '</div>' +
                '<div class="view">' + t("team.view") + ' <span>→</span></div></div></div>';
        }).join("");
    }
    function renderAlumni() {
        var list = document.querySelector(".alumni-list");
        if (!list)
            return;
        list.innerHTML = D.alumni.map(function (n) { return '<li><span class="y">◊</span><span class="n">' + esc(n) + '</span></li>'; }).join("");
    }
    function renderMedia() {
        var grid = document.querySelector(".media-grid");
        if (!grid)
            return;
        grid.innerHTML = D.media.map(function (m) {
            return '<a class="media-item" href="' + esc(safeUrl(m.url)) + '" target="_blank" rel="noopener">' +
                '<div class="media-source">' + esc(m.source) + ' · ' + esc(m.date) + '</div>' +
                '<div class="media-title">' + esc(m.title) + '</div>' +
                '<div class="media-desc">' + esc(m.desc) + '</div>' +
                '<div class="media-date">' + t("media.read") + ' ↗</div></a>';
        }).join("");
    }
    function renderNews() {
        var list = document.querySelector(".news-list");
        var ph = document.querySelector(".news-placeholder");
        if (!ph)
            return;
        var items = D.news || [];
        if (!items.length) {
            ph.style.display = "";
            if (list)
                list.innerHTML = "";
            return;
        }
        ph.style.display = "none";
        if (!list)
            return;
        list.innerHTML = items.map(function (n) {
            var title = n.url ? '<a class="news-title" href="' + esc(safeUrl(n.url)) + '" target="_blank" rel="noopener">' + esc(n.title) + '</a>' : '<span class="news-title">' + esc(n.title) + '</span>';
            return '<article class="news-item reveal"><div class="news-date">' + esc(n.date || "") + '</div>' + title +
                (n.desc ? '<p class="news-desc">' + esc(n.desc) + '</p>' : '') + '</article>';
        }).join("");
    }
    function renderHeroQuote() {
        var bq = document.querySelector(".hero-quote blockquote");
        var fg = document.querySelector(".hero-quote figcaption");
        if (bq && D.heroQuote)
            bq.textContent = D.heroQuote;
        if (fg && D.heroQuoteAttr)
            fg.textContent = D.heroQuoteAttr;
    }
    function renderContact() {
        var addr = document.querySelector("[data-contact-address]");
        if (addr)
            addr.innerHTML = esc(D.contact.address[0]) + "<br />" + esc(D.contact.address[1]) + ", " + esc(D.contact.address[2]);
    }
    /* ---------- split-text (animejs.com signature) ---------- */
    // Wraps every word in a masked <span class="wm"><span class="w">,
    // recursing into inline tags (<em>, <b>…) so emphasis/colour is preserved.
    // Per-word masks keep clipped reveals clean when a heading wraps on mobile.
    function wrapWords(root) {
        Array.prototype.slice.call(root.childNodes).forEach(function (node) {
            if (node.nodeType === 3) {
                var parts = node.textContent.split(/(\s+)/);
                var frag = document.createDocumentFragment();
                parts.forEach(function (p) {
                    if (p === "")
                        return;
                    if (/^\s+$/.test(p)) {
                        frag.appendChild(document.createTextNode(p));
                        return;
                    }
                    var w = document.createElement("span");
                    w.className = "w";
                    w.textContent = p;
                    var m = document.createElement("span");
                    m.className = "wm";
                    m.appendChild(w);
                    frag.appendChild(m);
                });
                node.parentNode.replaceChild(frag, node);
            }
            else if (node.nodeType === 1) {
                wrapWords(node);
            }
        });
    }
    function splitHeading(el) {
        if (!el || el.getAttribute("data-split") === "done")
            return;
        wrapWords(el);
        el.setAttribute("data-split", "done");
    }
    function splitHeadings() {
        if (!hasAnime || reduceMotion)
            return;
        document.querySelectorAll(".hero-title, .h-display").forEach(splitHeading);
    }
    /* ---------- apply i18n (re-renders, re-splits, rebuilds scroll) ---------- */
    function applyI18n() {
        document.querySelectorAll("[data-i18n]").forEach(function (n) {
            n.textContent = t(n.getAttribute("data-i18n"));
        });
        document.querySelectorAll("[data-i18n-html]").forEach(function (n) {
            n.innerHTML = t(n.getAttribute("data-i18n-html"));
        });
        document.querySelectorAll("[data-i18n-aria]").forEach(function (n) {
            n.setAttribute("aria-label", t(n.getAttribute("data-i18n-aria")));
        });
        document.querySelectorAll("[data-i18n-alt]").forEach(function (n) {
            n.setAttribute("alt", t(n.getAttribute("data-i18n-alt")));
        });
        document.documentElement.lang = "en";
        document.title = D.lab.name + " — " + D.lab.shortName + " · " + D.lab.institution;
        renderMission();
        renderMarquee();
        renderStats();
        renderAbout();
        renderAboutProfile();
        renderTopics();
        renderPubs();
        renderTeaching();
        renderTeam();
        renderAlumni();
        renderMedia();
        renderNews();
        renderHeroQuote();
        renderContact();
        splitHeadings();
        buildScrub();
    }
    var scrubUnits = [];
    function scrollProgress(el) {
        var r = el.getBoundingClientRect();
        var vh = window.innerHeight;
        var p = (vh - r.top) / (vh * 0.5);
        return p < 0 ? 0 : p > 1 ? 1 : p;
    }
    function buildScrub() {
        scrubUnits.forEach(function (u) { try {
            u.anim.pause();
        }
        catch (e) { } });
        scrubUnits = [];
        if (!hasAnime || reduceMotion)
            return;
        var P = VP();
        // 1) single reveals (mission, meta, filters, contact, alumni block, team figure, timeline items…)
        document.querySelectorAll(".reveal:not(.section-head)").forEach(function (node) {
            scrubUnits.push({
                el: node,
                anim: anime({ targets: node, opacity: [0, 1], translateY: [P.dist, 0], duration: 850, easing: P.ease, autoplay: false })
            });
        });
        // 2) section headings — eyebrow + split words (masked rise, staggered)
        document.querySelectorAll(".section-head").forEach(function (head) {
            var eyebrow = head.querySelector(".eyebrow");
            var words = head.querySelectorAll(".h-display .w");
            var tl = anime.timeline({ autoplay: false });
            if (eyebrow)
                tl.add({ targets: eyebrow, opacity: [0, 1], translateY: [16, 0], duration: 500, easing: "easeOutCubic" });
            if (words.length)
                tl.add({ targets: words, translateY: ["120%", "0%"], rotate: [P.rot, 0], opacity: [0, 1], duration: 880, delay: anime.stagger(P.wordStagger), easing: P.ease }, "-=260");
            scrubUnits.push({ el: head, anim: tl });
        });
        // 3) staggered lists
        [
            { container: ".topic-list", items: ".topic", stagger: 34 },
            { container: ".team-grid", items: ".member", stagger: 60 },
            { container: ".media-grid", items: ".media-item", stagger: 80 },
            { container: ".pubs-list", items: ".pub-item", stagger: 16 },
            { container: ".profile-timeline", items: ".ptl-row", stagger: 40 }
        ].forEach(function (L) {
            var c = document.querySelector(L.container);
            if (!c)
                return;
            var items = c.querySelectorAll(L.items);
            if (!items.length)
                return;
            var tl = anime.timeline({ autoplay: false });
            tl.add({ targets: items, opacity: [0, 1], translateY: [P.dist, 0], duration: 720, delay: anime.stagger(L.stagger), easing: P.ease });
            scrubUnits.push({ el: c, anim: tl });
        });
        updateScrub();
    }
    function updateScrub() {
        if (!hasAnime)
            return;
        scrubUnits.forEach(function (u) {
            u.anim.seek(scrollProgress(u.el) * u.anim.duration);
        });
    }
    var ticking = false;
    function requestScroll() {
        if (ticking)
            return;
        ticking = true;
        window.setTimeout(function () { ticking = false; updateScrub(); }, 16);
    }
    window.addEventListener("scroll", requestScroll, { passive: true });
    window.addEventListener("resize", requestScroll, { passive: true });
    /* ---------- hero intro (load) — masked word rise + staggered copy ---------- */
    function initHeroIntro() {
        if (!hasAnime || reduceMotion)
            return;
        var P = VP();
        var words = document.querySelectorAll(".hero-title .w");
        var tl = anime.timeline({ easing: P.ease });
        tl.add({ targets: ".hero .eyebrow", opacity: [0, 1], translateY: [20, 0], duration: 600, easing: "easeOutCubic" })
            .add({ targets: words, translateY: ["120%", "0%"], rotate: [P.rot, 0], opacity: [0, 1], duration: 1000, delay: anime.stagger(75), easing: "easeOutExpo" }, "-=350")
            .add({ targets: ".hero-sub", opacity: [0, 1], translateY: [24, 0], duration: 700 }, "-=620")
            .add({ targets: ".hero-quote", opacity: [0, 1], translateY: [20, 0], duration: 600 }, "-=560")
            .add({ targets: ".hero-ctas", opacity: [0, 1], translateY: [20, 0], duration: 600 }, "-=560")
            .add({ targets: ".hero-visual", opacity: [0, 1], translateY: [36, 0], scale: [0.97, 1], duration: 900 }, "-=680");
    }
    /* ---------- signature dot-grid ripple (animejs.com) ---------- */
    function initDotGrid() {
        var grid = document.querySelector(".dot-grid");
        if (!grid || !hasAnime || reduceMotion)
            return;
        var cols = 16, rows = 10, total = cols * rows;
        var frag = document.createDocumentFragment();
        for (var i = 0; i < total; i++) {
            var d = document.createElement("span");
            d.className = "d";
            frag.appendChild(d);
        }
        grid.appendChild(frag);
        anime({
            targets: ".dot-grid .d",
            scale: [0.2, 1.3, 0.5],
            opacity: [0.12, 0.6, 0.18],
            duration: 1700,
            delay: anime.stagger(22, { grid: [cols, rows], from: "center" }),
            easing: "easeInOutQuad",
            loop: true,
            direction: "alternate"
        });
    }
    /* ---------- anime.js ambient (theme-related) ---------- */
    function initCounters() {
        var els = document.querySelectorAll("[data-count]");
        if (!els.length)
            return;
        var countEl = function (target) {
            var end = parseInt(target.getAttribute("data-count"), 10);
            if (reduceMotion || !hasAnime) {
                target.textContent = String(end);
                return;
            }
            anime({ targets: { n: 0 }, n: end, round: 1, duration: 1500, easing: "easeOutCubic", update: function (a) { target.textContent = String(a.animations[0].currentValue); } });
        };
        if (reduceMotion || !("IntersectionObserver" in window)) {
            els.forEach(countEl);
            return;
        }
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) {
                obs.unobserve(e.target);
                countEl(e.target);
            } });
        }, { threshold: 0.5 });
        els.forEach(function (n) { obs.observe(n); });
    }
    function initHeroCounter() {
        var hp = document.querySelector("[data-hero-pub]");
        if (!hp)
            return;
        var total = D.publications.articles.length + D.publications.chapters.length + D.publications.patents.length;
        if (reduceMotion || !hasAnime) {
            hp.textContent = String(total);
            return;
        }
        anime({ targets: { n: 0 }, n: total, round: 1, duration: 1600, easing: "easeOutCubic", update: function (a) { hp.textContent = String(a.animations[0].currentValue); } });
    }
    function initMolecule() {
        if (reduceMotion || !hasAnime)
            return;
        anime({ targets: ".molecule circle", opacity: [1, 0.4], duration: 1500, direction: "alternate", loop: true, easing: "easeInOutSine", delay: anime.stagger(120) });
    }
    function initRings() {
        if (reduceMotion || !hasAnime)
            return;
        anime({ targets: ".rings .ring", scale: [0.2, 1.15], opacity: [0.9, 0], duration: 2600, delay: anime.stagger(700), loop: true, easing: "easeOutCubic" });
    }
    function initBlobs() {
        if (reduceMotion || !hasAnime)
            return;
        if (window.matchMedia("(max-width: 760px)").matches)
            return; // blobs ocultos en móvil (coste de GPU)
        [{ s: ".blob-1", x: 52, y: 36, sc: 1.1, d: 24000 }, { s: ".blob-2", x: -46, y: -32, sc: 1, d: 28000 }, { s: ".blob-3", x: 30, y: -46, sc: 1.12, d: 32000 }].forEach(function (b) {
            var node = document.querySelector(b.s);
            if (!node)
                return;
            anime({ targets: node, translateX: [0, b.x], translateY: [0, b.y], scale: [1, b.sc], duration: b.d, direction: "alternate", loop: true, easing: "easeInOutSine" });
        });
    }
    function initTimeline() {
        if (reduceMotion || !hasAnime)
            return;
        anime({ targets: ".tl-dot", scale: [1, 1.35, 1], duration: 2200, delay: anime.stagger(350), loop: true, easing: "easeInOutSine" });
    }
    /* ---------- scroll progress bar + header ---------- */
    var progress = el("div", "progress");
    document.body.appendChild(progress);
    var header = document.querySelector(".site-header");
    var spySections = ["about", "research", "publications", "teaching", "team", "media", "news", "contact"]
        .map(function (id) { return document.getElementById(id); }).filter(Boolean);
    function updateActiveNav() {
        var y = window.scrollY + 160;
        var current = "";
        spySections.forEach(function (sec) { if (sec.offsetTop <= y)
            current = sec.id; });
        document.querySelectorAll('.nav a[href^="#"], .mobile-nav a[href^="#"]').forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + current);
        });
    }
    function onScrollUI() {
        var y = window.scrollY;
        var h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
        if (header)
            header.classList.toggle("scrolled", y > 40);
        updateActiveNav();
    }
    window.addEventListener("scroll", onScrollUI, { passive: true });
    onScrollUI();
    /* ---------- mobile nav ---------- */
    var burger = document.querySelector(".burger");
    var mobileNav = document.querySelector(".mobile-nav");
    function closeMobileNav() {
        if (!mobileNav)
            return;
        mobileNav.classList.remove("open");
        if (burger) {
            burger.classList.remove("open");
            burger.setAttribute("aria-expanded", "false");
        }
        document.body.classList.remove("nav-open");
    }
    if (burger && mobileNav) {
        burger.setAttribute("aria-expanded", "false");
        burger.addEventListener("click", function () {
            var open = mobileNav.classList.toggle("open");
            burger.classList.toggle("open", open);
            burger.setAttribute("aria-expanded", open ? "true" : "false");
            document.body.classList.toggle("nav-open", open);
        });
        mobileNav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMobileNav); });
    }
    /* ---------- modal ---------- */
    var modal = document.querySelector(".modal");
    var modalBackdrop = document.querySelector(".modal-backdrop");
    var modalClose = document.querySelector(".modal-close");
    var modalBody = document.querySelector(".modal-body");
    var modalPhoto = document.querySelector(".modal-photo");
    var lastFocus = null;
    function openModal(m) {
        if (!modal)
            return;
        modalPhoto.innerHTML = m.img
            ? '<img src="' + esc(safeUrl(m.img)) + '" alt="' + esc(m.name) + '">'
            : '<div class="modal-avatar"><b>' + esc(initials(m.name)) + '</b></div>';
        var bio = pick(m.bio) ? '<div class="bio">' + pick(m.bio).split("\n").map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + '</div>' : '';
        var social = "";
        if (m.linkedin)
            social += '<a href="' + esc(safeUrl(m.linkedin)) + '" target="_blank" rel="noopener">LinkedIn ↗</a>';
        if (m.twitter)
            social += '<a href="' + esc(safeUrl(m.twitter)) + '" target="_blank" rel="noopener">X / Twitter ↗</a>';
        if (social)
            social = '<div class="modal-social">' + social + '</div>';
        modalBody.innerHTML = '<div class="role">' + esc(pick(m.role)) + '</div><h3 id="modal-title">' + esc(m.name) + '</h3>' + bio +
            '<a class="modal-email" href="mailto:' + esc(m.email) + '">' + esc(m.email) + '</a>' + social;
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
        lastFocus = document.activeElement;
        if (modalClose)
            modalClose.focus();
    }
    function closeModal() { if (modal) {
        modal.classList.remove("open");
        document.body.style.overflow = "";
    } if (lastFocus) {
        lastFocus.focus();
        lastFocus = null;
    } }
    document.querySelectorAll(".team-grid").forEach(function (grid) {
        grid.addEventListener("error", function (e) {
            var img = e.target;
            if (!img || img.tagName !== "IMG")
                return;
            if (!img.getAttribute("data-retried")) {
                img.setAttribute("data-retried", "1");
                img.src = img.src.split("?")[0] + "?r=" + Date.now();
                return;
            }
            var photo = img.closest(".member-photo");
            if (!photo)
                return;
            var card = img.closest(".member");
            var name = card ? card.querySelector("h3").textContent : "";
            photo.innerHTML = '<div class="member-avatar"><b>' + esc(initials(name)) + '</b></div>';
        }, true);
        grid.addEventListener("click", function (e) {
            var card = e.target.closest(".member");
            if (!card)
                return;
            var m = D.team[parseInt(card.getAttribute("data-index"), 10)];
            if (m)
                openModal(m);
        });
    });
    if (modalClose)
        modalClose.addEventListener("click", closeModal);
    if (modalBackdrop)
        modalBackdrop.addEventListener("click", closeModal);
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape")
            closeModal();
        else if (e.key === "Tab" && modal && modal.classList.contains("open")) {
            var focusables = modal.querySelectorAll("button, a[href]");
            if (!focusables.length)
                return;
            var first = focusables[0], last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
            else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
    /* ---------- interactions (mouse) ---------- */
    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (finePointer && !reduceMotion) {
        var nMX = 0, nMY = 0, sMX = 0, sMY = 0;
        document.addEventListener("mousemove", function (e) {
            nMX = e.clientX / window.innerWidth - 0.5;
            nMY = e.clientY / window.innerHeight - 0.5;
        });
        var molecule = document.querySelector(".molecule");
        var heroPhoto = document.querySelector(".hero-photo");
        (function interpLoop() {
            sMX += (nMX - sMX) * 0.06;
            sMY += (nMY - sMY) * 0.06;
            if (molecule)
                molecule.style.transform = "translate3d(" + (sMX * 30) + "px," + (sMY * 30) + "px,0)";
            if (heroPhoto)
                heroPhoto.style.transform = "perspective(900px) rotateX(" + (-sMY * 5) + "deg) rotateY(" + (sMX * 7) + "deg)";
            requestAnimationFrame(interpLoop);
        })();
        document.querySelectorAll(".btn, .nav-cta").forEach(function (b) {
            b.addEventListener("mousemove", function (e) {
                var r = b.getBoundingClientRect();
                var x = (e.clientX - r.left - r.width / 2) * 0.28;
                var y = (e.clientY - r.top - r.height / 2) * 0.4;
                b.style.transition = "transform .12s ease-out";
                b.style.transform = "translate(" + x + "px," + y + "px)";
            });
            b.addEventListener("mouseleave", function () { b.style.transition = ""; b.style.transform = ""; });
        });
        document.addEventListener("mousemove", function (e) {
            var card = e.target.closest(".member");
            if (!card)
                return;
            var r = card.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width - 0.5;
            var y = (e.clientY - r.top) / r.height - 0.5;
            card.style.setProperty("--mx", (e.clientX - r.left) + "px");
            card.style.setProperty("--my", (e.clientY - r.top) + "px");
            card.style.transition = "transform .1s ease-out";
            card.style.transform = "perspective(800px) rotateX(" + (-y * 7) + "deg) rotateY(" + (x * 7) + "deg)";
        });
        document.addEventListener("mouseout", function (e) {
            var card = e.target.closest(".member");
            if (card && !card.contains(e.relatedTarget)) {
                card.style.transition = "";
                card.style.transform = "";
            }
        });
    }
    /* ---------- back to top ---------- */
    var toTop = document.querySelector(".to-top");
    if (toTop) {
        window.addEventListener("scroll", function () { toTop.classList.toggle("show", window.scrollY > 700); }, { passive: true });
        toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });
    }
    /* team photo: scale(1.1) zoom lives in CSS (transform: scale(1.1)); the old
       parallax translate was removed (2026-09-30) because on small viewports it
       pushed the crop past the photo's top pad and cut the tallest head. */
    /* ---------- controls ---------- */
    document.querySelectorAll(".pub-filter").forEach(function (b) {
        b.addEventListener("click", function () { renderPubs(b.getAttribute("data-filter")); buildScrub(); });
    });
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener("click", function (e) {
            var id = a.getAttribute("href");
            if (id.length < 2)
                return;
            var target = document.querySelector(id);
            if (!target)
                return;
            e.preventDefault();
            target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
        });
    });
    /* ---------- init ---------- */
    /* content-managed images: hero figure, about portrait, team group photo.
       Keeps the optimized <picture> (webp srcset) while the value is still the
       stock default; once the client uploads another file, swaps in a plain <img>. */
    function applyContentImages() {
        function setPic(sel, src, alt) {
            if (!src)
                return;
            var pic = document.querySelector(sel);
            if (!pic)
                return;
            var cur = pic.querySelector("img");
            var curSrc = cur ? cur.getAttribute("src") : "";
            if (curSrc && String(src).trim() === String(curSrc).trim())
                return;
            pic.innerHTML = '<img src="' + esc(safeUrl(src)) + '"' +
                (alt ? ' alt="' + esc(alt) + '"' : ' alt=""') + ' loading="lazy">';
        }
        setPic(".hero-photo picture", D.lab && D.lab.heroFigure, t("hero.figureAlt"));
        setPic(".about-photo picture", D.aboutProfile && D.aboutProfile.photo, t("about.photoAlt"));
        setPic(".team-group picture", D.teamPhoto, "");
    }
    /* ---------- SEO: publications as JSON-LD (Google renders JS; AI crawlers use llms.txt) ---------- */
    function buildPubsJsonLd() {
        if (!D || !D.publications)
            return;
        var out = { "@context": "https://schema.org", "@graph": [] };
        function push(list, type, pubType) {
            (list || []).forEach(function (p, i) {
                if (!p || !p.title)
                    return;
                var authors = String(p.authors || "").split(/,\s*(?=[A-ZÁÉÍÓÚÑÄÖÜ]\.)/);
                var item = {
                    "@type": type,
                    "@id": "https://osorio-research.com/#publication-" + type.toLowerCase() + "-" + i,
                    "headline": p.title,
                    "author": authors.filter(Boolean).map(function (a) { return { "@type": "Person", "name": a }; }),
                    "isPartOf": { "@id": "https://osorio-research.com/#website" }
                };
                if (p.y)
                    item.datePublished = String(p.y);
                if (p.journal)
                    item.publication = { "@type": pubType, "name": p.journal };
                if (p.url)
                    item.url = safeUrl(p.url);
                if (p.ref)
                    item.pagination = p.ref;
                out["@graph"].push(item);
            });
        }
        push(D.publications.articles, "ScholarlyArticle", "Periodical");
        push(D.publications.chapters, "Chapter", "Book");
        push(D.publications.patents, "CreativeWork", "Periodical");
        if (!out["@graph"].length)
            return;
        var s = document.createElement("script");
        s.type = "application/ld+json";
        s.id = "pubs-jsonld";
        s.textContent = JSON.stringify(out);
        document.head.appendChild(s);
    }
    function initAll() {
        var yearEl = document.getElementById("year");
        if (yearEl)
            yearEl.textContent = String(new Date().getFullYear());
        if (!hasAnime || reduceMotion)
            document.body.classList.add("no-anim");
        applyI18n(); // render + split headings + build scrub
        applyContentImages(); // hero figure / about portrait / team group photo from content.json
        buildPubsJsonLd(); // SEO structured data for publications
        initHeroIntro();
        initDotGrid();
        initHeroCounter();
        initMolecule();
        initRings();
        initBlobs();
        initTimeline();
    }
    // content lives in content.json; data.js is the fallback seed
    fetch("content.json", { cache: "no-store" }).then(function (r) {
        if (!r.ok)
            throw new Error("content.json not ok");
        return r.json();
    }).then(function (j) {
        D = (j && typeof j.content === "object") ? j.content : j;
        // i18n strings are also editable: overlay them onto the seed
        if (D && D.i18n && typeof D.i18n === "object") {
            Object.assign(I, D.i18n);
        }
        initAll();
    }).catch(function () {
        initAll();
    });
})();
