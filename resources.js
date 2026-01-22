/* 2379 BURLINGTON ARMY CADETS - UNIFIED CORE LOGIC */
document.addEventListener('DOMContentLoaded', () => {
    // Select elements once (Standardization)
    const nav = document.querySelector('.navbar');
    const mobileToggle = document.getElementById('hammy'); // Using 'hammy' from your HTML
    const navMenu = document.getElementById('nav-menu');
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    const parentLi = document.querySelector('.nav-dropdown');

    // 1. NAV MANAGEMENT: Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });

    // 2. MOBILE MENU & BODY LOCK
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active'); // Animates Hamburger to 'X'
            
            // 5S UX: Lock body scroll when menu is open to prevent background scrolling
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    // 3. MOBILE DROPDOWN TOGGLE
    if (dropdownTrigger && parentLi) {
        dropdownTrigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault(); // Stop navigation to allow dropdown to open
                parentLi.classList.toggle('active');
            }
        });
    }

    // 4. AUTO-CLOSE MENU (When clicking any link)
    document.querySelectorAll('.nav-links a:not(.dropdown-trigger)').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = ''; // Always unlock scroll
        });
    });

    // 5. REVEAL ENGINE: Tactical Entrance Animations
    const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.info-card, .info-block, .reveal').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.8s cubic-bezier(0.23, 1, 0.32, 1)";
        revealObserver.observe(el);
    });
});