// Mobile menu
    const menuBtn = document.getElementById('menuBtn');
    const mobilePanel = document.getElementById('mobilePanel');

    menuBtn?.addEventListener('click', () => {
        const isOpen = !mobilePanel.classList.contains('hidden');
        mobilePanel.classList.toggle('hidden');
        menuBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    // Close mobile panel on navigation
    mobilePanel?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        mobilePanel.classList.add('hidden');
        menuBtn?.setAttribute('aria-expanded', 'false');
    }));

    // Typewriter effect for hero title (respects reduced motion)
    (function typeTitle() {
        const title = document.getElementById('heroTitle');
        if (!title) return;

        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return;

        const original = title.textContent.trim();
        title.textContent = '';
        let i = 0;
        const tick = () => {
            if (i < original.length) {
                title.textContent += original.charAt(i);
                i++;
                setTimeout(tick, 35);
            }
        };
        setTimeout(tick, 600);
    })();

    // Reveal animation on scroll
    (function reveal() {
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return;

        const targets = document.querySelectorAll('.menu-item, .photo-frame, #achievements, #gallery');
        targets.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
        });

        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                e.target.style.transition = 'opacity 600ms ease, transform 600ms ease';
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
                io.unobserve(e.target);
            });
        }, { threshold: 0.12 });

        targets.forEach(el => io.observe(el));
    })();

    // Photo upload + drag & drop preview
    const dropZone = document.getElementById('dropZone');
    const photoInput = document.getElementById('photoInput');
    const img = document.getElementById('modelPhoto');
    const placeholder = document.getElementById('placeholder');

    function setPreview(file) {
        if (!file) return;
        if (!file.type || !file.type.startsWith('image/')) return;

        const url = URL.createObjectURL(file);
        img.src = url;
        img.classList.remove('hidden');
        placeholder.classList.add('hidden');

        // Revoke later
        img.onload = () => URL.revokeObjectURL(url);
    }

    dropZone?.addEventListener('click', () => photoInput?.click());

    photoInput?.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        setPreview(file);
    });

    ;['dragenter', 'dragover'].forEach(evt => {
        dropZone?.addEventListener(evt, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('ring-4', 'ring-amber-300/70');
        });
    });

    ;['dragleave', 'drop'].forEach(evt => {
        dropZone?.addEventListener(evt, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('ring-4', 'ring-amber-300/70');
        });
    });

    dropZone?.addEventListener('drop', (e) => {
        const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        setPreview(file);
    });