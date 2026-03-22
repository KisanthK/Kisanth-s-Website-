(function () {
    'use strict';

    // ── Page reveal ───────────────────────────────────────────────
    document.body.classList.add('loaded');

    // ── Lenis smooth scroll ───────────────────────────────────────
    const lenis = new Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // ── Register ScrollTrigger ────────────────────────────────────
    gsap.registerPlugin(ScrollTrigger);

    // ── Custom Cursor ─────────────────────────────────────────────
    const cursorOuter = document.querySelector('.cursor-outer');
    const cursorInner = document.querySelector('.cursor-inner');

    if (window.innerWidth > 768 && cursorOuter && cursorInner) {
        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let ox = mx, oy = my;

        document.addEventListener('mousemove', (e) => {
            mx = e.clientX; my = e.clientY;
            gsap.to(cursorInner, { x: mx, y: my, duration: 0.07, ease: 'none', overwrite: 'auto' });
        });

        gsap.ticker.add(() => {
            ox += (mx - ox) * 0.1; oy += (my - oy) * 0.1;
            gsap.set(cursorOuter, { x: ox, y: oy });
        });

        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOuter.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursorOuter.classList.remove('hovered'));
        });

        document.addEventListener('mouseleave', () => gsap.to([cursorOuter, cursorInner], { opacity: 0, duration: 0.3 }));
        document.addEventListener('mouseenter', () => gsap.to([cursorOuter, cursorInner], { opacity: 1, duration: 0.3 }));
    }

    // ── Nav: hide on scroll down, reveal on scroll up ─────────────
    const nav = document.getElementById('nav');
    let lastY = 0, navHidden = false;

    ScrollTrigger.create({
        start: 'top top',
        onUpdate: () => {
            const currentY = window.scrollY;
            const goingDown = currentY > lastY;
            if (goingDown && currentY > 120 && !navHidden) {
                gsap.to(nav, { y: '-110%', duration: 0.5, ease: 'power3.in' });
                navHidden = true;
            } else if (!goingDown && navHidden) {
                gsap.to(nav, { y: '0%', duration: 0.48, ease: 'power3.out' });
                navHidden = false;
            }
            lastY = currentY;
        },
    });

    // ── Hero entrance ─────────────────────────────────────────────
    const heroTL = gsap.timeline({ delay: 0.15 });
    heroTL
        .from('.badge', { opacity: 0, y: 18, duration: 0.6, ease: 'power3.out' })
        .from('.h1-inner', { y: '108%', opacity: 0, duration: 0.9, stagger: 0.13, ease: 'power4.out' }, '-=0.3')
        .from('.hero-desc', { opacity: 0, y: 22, duration: 0.7, ease: 'power3.out' }, '-=0.55')
        .from('.hero-btns a', { opacity: 0, y: 14, duration: 0.55, stagger: 0.1, ease: 'power3.out' }, '-=0.4')
        .from('#heroCardWrapper', { opacity: 0, scale: 0.93, y: 28, duration: 1.0, ease: 'power3.out' }, '-=0.9')
        .from('.hero-chip', { opacity: 0, scale: 0.8, y: 10, duration: 0.6, stagger: 0.15, ease: 'back.out(1.4)' }, '-=0.5');

    // ── Hero image parallax on mouse move ─────────────────────────
    const heroCard = document.getElementById('heroCardWrapper');
    if (heroCard && window.innerWidth > 900) {
        document.addEventListener('mousemove', (e) => {
            const xPct = (e.clientX / window.innerWidth - 0.5);
            const yPct = (e.clientY / window.innerHeight - 0.5);
            gsap.to(heroCard, {
                x: xPct * 24, y: yPct * 14,
                rotateY: xPct * 6, rotateX: -yPct * 4,
                duration: 1.8, ease: 'power2.out', transformPerspective: 900,
            });
        });
    }

    // ── Marquee pause on hover (handled via CSS) ──────────────────

    // ── About heading: word-by-word reveal ───────────────────────
    function wrapWords(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const parts = node.textContent.split(/(\s+)/);
            const frag = document.createDocumentFragment();
            parts.forEach(part => {
                if (/^\s*$/.test(part)) {
                    frag.appendChild(document.createTextNode(part));
                } else {
                    const outer = document.createElement('span');
                    outer.className = 'split-word';
                    const inner = document.createElement('span');
                    inner.className = 'split-word-inner';
                    inner.textContent = part;
                    outer.appendChild(inner);
                    frag.appendChild(outer);
                }
            });
            return frag;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const clone = node.cloneNode(false);
            node.childNodes.forEach(child => clone.appendChild(wrapWords(child)));
            return clone;
        }
        return node.cloneNode(true);
    }

    const aboutHeading = document.querySelector('.about-heading');
    if (aboutHeading) {
        const tmp = document.createElement('div');
        tmp.innerHTML = aboutHeading.innerHTML;
        const frag = document.createDocumentFragment();
        tmp.childNodes.forEach(c => frag.appendChild(wrapWords(c)));
        aboutHeading.innerHTML = '';
        aboutHeading.appendChild(frag);

        gsap.from('.about-heading .split-word-inner', {
            scrollTrigger: { trigger: aboutHeading, start: 'top 83%' },
            y: '108%', opacity: 0, duration: 0.75, stagger: 0.045, ease: 'power4.out',
        });
    }

    // ── About section animations ──────────────────────────────────
    gsap.from('.about-text > p', {
        scrollTrigger: { trigger: '.about-text', start: 'top 82%' },
        opacity: 0, y: 28, duration: 0.8, ease: 'power3.out',
    });

    gsap.from('.skill-item', {
        scrollTrigger: { trigger: '.skills-grid', start: 'top 85%' },
        opacity: 0, y: 36, duration: 0.7, stagger: 0.14, ease: 'power3.out',
    });

    gsap.from('.opportunity-card', {
        scrollTrigger: { trigger: '.opportunity-card', start: 'top 88%' },
        opacity: 0, y: 28, duration: 0.8, ease: 'power3.out',
    });

    // ── Stats: count up animation ─────────────────────────────────
    gsap.from('.stat-row', {
        scrollTrigger: { trigger: '.about-stats', start: 'top 80%' },
        opacity: 0, x: 30, duration: 0.75, stagger: 0.12, ease: 'power3.out',
    });

    // ── Work section ──────────────────────────────────────────────
    gsap.from('.section-header', {
        scrollTrigger: { trigger: '.section-header', start: 'top 88%' },
        opacity: 0, y: 24, duration: 0.8, ease: 'power3.out',
    });

    gsap.from('.bento-item', {
        scrollTrigger: { trigger: '.bento-grid', start: 'top 80%' },
        opacity: 0, y: 55, scale: 0.96, duration: 0.85,
        stagger: { each: 0.1, from: 'start' }, ease: 'power3.out',
    });

    // ── Footer reveal ─────────────────────────────────────────────
    gsap.from('.contact-footer h3', {
        scrollTrigger: { trigger: '.contact-footer', start: 'top 88%' },
        opacity: 0, y: 36, duration: 0.9, ease: 'power3.out',
    });
    gsap.from('.footer-btn', {
        scrollTrigger: { trigger: '.contact-footer', start: 'top 82%' },
        opacity: 0, y: 18, duration: 0.7, delay: 0.2, ease: 'power3.out',
    });

    // ── Mobile menu toggle ────────────────────────────────────────
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks   = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            });
        });
    }

})();
