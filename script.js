/* --- 2379 BURLINGTON ARMY CADETS: UNIFIED LOGIC V4 --- */

document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECTORS
    const navbar = document.getElementById('navbar');
    const hammy = document.getElementById('hammy');
    const navMenu = document.getElementById('nav-menu');
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    const parentLi = document.querySelector('.nav-dropdown');

    // 2. NAVBAR SCROLL ENGINE
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // 3. MOBILE NAVIGATION & BODY LOCK
    if (hammy && navMenu) {
        hammy.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            hammy.classList.toggle('active');
            
            // 5S UX: Lock body scroll to prevent disorientation while menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    // 4. TACTICAL DROPDOWN (Mobile Logic)
    if (dropdownTrigger && parentLi) {
        dropdownTrigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                // Prevent navigating to resources.html so the dropdown can open
                e.preventDefault(); 
                parentLi.classList.toggle('active');
            }
        });
    }

    // 5. AUTO-CLOSE & CLICK OUTSIDE
    // Close mobile menu when a link is clicked (Except the dropdown trigger)
    document.querySelectorAll('.nav-links a:not(.dropdown-trigger)').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hammy.classList.remove('active');
            document.body.style.overflow = ''; 
        });
    });

    // Close menu if user clicks anywhere outside the navbar
    document.addEventListener('click', (e) => {
        if (navbar && !navbar.contains(e.target)) {
            navMenu?.classList.remove('active');
            hammy?.classList.remove('active');
            parentLi?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // 6. DYNAMIC MAP INJECTION (Fixed URL Structure)
    const mapWrapper = document.querySelector('.map-wrapper');
    if (mapWrapper) {
        const address = encodeURIComponent("3230 Fairview St, Burlington, ON L7N 3L5");
        // Standard Google Maps Embed (No API key required)
        mapWrapper.innerHTML = `
            <iframe width="100%" height="450" frameborder="0" style="border:0"
                src="https://maps.google.com/maps?q=${address}&t=&z=15&ie=UTF8&iwloc=&output=embed"
                allowfullscreen></iframe>`;
    }
});