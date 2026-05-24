document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // ANIMACIONES SCROLL
    // =========================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-card, .stack-item, .section-header')
        .forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });

    // =========================
    // NAV EFFECT
    // =========================
    const nav = document.querySelector('nav');

    window.addEventListener('scroll', () => {
        if (!nav) return;

        if (window.scrollY > 50) {
            nav.style.padding = '0.5rem 0';
            nav.style.backgroundColor = 'rgba(10, 12, 16, 0.95)';
        } else {
            nav.style.padding = '1rem 0';
            nav.style.backgroundColor = 'rgba(10, 12, 16, 0.8)';
        }
    });

    // =========================
    // DROPDOWN IDIOMAS (FIX)
    // =========================
    const langDropdown = document.querySelector('.lang-dropdown');
    const langBtn = document.querySelector('.lang-btn');

    if (langDropdown && langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            langDropdown.classList.remove('active');
        });

        // click en opciones
        document.querySelectorAll('.lang-menu button').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                changeLanguage(lang);

                // opcional: cambiar texto del botón
                langBtn.textContent = `🌐 ${lang.toUpperCase()} ▼`;

                langDropdown.classList.remove('active');
            });
        });
    }

    // =========================
    // INIT
    // =========================
    initCarousels();
    initReadMore();

    // idioma inicial
    const savedLang = localStorage.getItem('language') || 'es';
    changeLanguage(savedLang);
});


// =========================
// READ MORE
// =========================
function initReadMore() {
    document.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.addEventListener('click', () => {

            const container = btn.closest('.expandable-content');
            const extraInfo = container?.querySelector('.extra-info');
            if (!extraInfo) return;

            const isOpen = extraInfo.classList.toggle('active');
            btn.classList.toggle('active');

            updateReadMoreButton(btn, isOpen);
        });
    });
}

function updateReadMoreButton(btn, isOpen) {

    const lang = localStorage.getItem('language') || 'es';

    const texts = {
        es: ["Leer más", "Leer menos"],
        pt: ["Ler mais", "Ler menos"],
        en: ["Read more", "Read less"]
    };

    const t = texts[lang] || texts.es;

    btn.innerHTML = isOpen
        ? `${t[1]} <span class="arrow">▼</span>`
        : `${t[0]} <span class="arrow">▼</span>`;
}


// =========================
// CAROUSEL
// =========================
function initCarousels() {

    document.querySelectorAll('.project-carousel').forEach(carousel => {

        const container = carousel.querySelector('.carousel-container');
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        const currentCounter = carousel.querySelector('.carousel-counter .current');
        const totalCounter = carousel.querySelector('.carousel-counter .total');

        let current = 0;
        const total = slides.length;

        function adjustHeight() {
            const img = slides[current]?.querySelector('img');
            if (!img) return;

            if (img.complete) {
                container.style.height = img.offsetHeight + 'px';
            } else {
                img.onload = () => {
                    container.style.height = img.offsetHeight + 'px';
                };
            }
        }

        function update() {
            track.style.transform = `translateX(-${current * 100}%)`;
            currentCounter.textContent = current + 1;
            adjustHeight();
        }

        if (total <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            carousel.querySelector('.carousel-counter').style.display = 'none';
            adjustHeight();
            return;
        }

        totalCounter.textContent = total;

        prevBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            current = (current - 1 + total) % total;
            update();
        });

        nextBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            current = (current + 1) % total;
            update();
        });

        window.addEventListener('load', adjustHeight);
        window.addEventListener('resize', adjustHeight);

        update();
    });
}


// =========================
// LANGUAGE SYSTEM
// =========================
function changeLanguage(lang) {

    document.querySelectorAll('[data-es]').forEach(el => {
        const value = el.dataset[lang];
        if (value) el.textContent = value;
    });

    localStorage.setItem('language', lang);

    document.querySelectorAll('.read-more-btn').forEach(btn => {
        const container = btn.closest('.expandable-content');
        const extraInfo = container?.querySelector('.extra-info');
        const isOpen = extraInfo?.classList.contains('active');

        updateReadMoreButton(btn, isOpen);
    });
}