/* ==========================================================================
   ASvybe Advocates Premium Interactive Javascript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Configuration
    const WHATSAPP_NUMBER = '919999988888'; // Format: CountryCode + Number (No '+' or spaces)

    /* ==========================================================================
       1. Mobile Navigation Menu Controls
       ========================================================================== */
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerClose = document.getElementById('drawerClose');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-btn');

    const openDrawer = () => {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling under drawer
    };

    const closeDrawer = () => {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (mobileNavToggle) mobileNavToggle.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
    
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });


    /* ==========================================================================
       2. Practice Areas Grid Accordion Behavior
       ========================================================================== */
    const practiceCards = document.querySelectorAll('.practice-card');

    practiceCards.forEach(card => {
        const header = card.querySelector('.card-header-main');
        const accordionContent = card.querySelector('.card-content-accordion');

        header.addEventListener('click', (e) => {
            // Check if user clicked on the inner CTA button (do not toggle accordion if clicking link)
            if (e.target.closest('.card-cta')) return;

            const isActive = card.classList.contains('active');

            // Collapse all other active cards
            practiceCards.forEach(otherCard => {
                if (otherCard !== card && otherCard.classList.contains('active')) {
                    otherCard.classList.remove('active');
                    otherCard.querySelector('.card-content-accordion').style.maxHeight = null;
                }
            });

            // Toggle current card
            if (isActive) {
                card.classList.remove('active');
                accordionContent.style.maxHeight = null;
            } else {
                card.classList.add('active');
                // Calculate scrollHeight dynamically for smooth transition
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
                
                // Optional: scroll card into view on mobile if it opens
                setTimeout(() => {
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            }
        });
    });

    // Auto-update accordion heights on window resize to prevent cutoffs
    window.addEventListener('resize', () => {
        practiceCards.forEach(card => {
            if (card.classList.contains('active')) {
                const accordionContent = card.querySelector('.card-content-accordion');
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            }
        });
    });


    /* ==========================================================================
       3. Auto-Select Case Category from Accordion CTA clicks
       ========================================================================== */
    const accordionCtas = document.querySelectorAll('.card-cta');
    const caseCategoryDropdown = document.getElementById('caseCategory');

    accordionCtas.forEach(cta => {
        cta.addEventListener('click', (e) => {
            const category = cta.getAttribute('data-category');
            if (category && caseCategoryDropdown) {
                caseCategoryDropdown.value = category;
            }
        });
    });


    /* ==========================================================================
       4. Scroll-fade Reveal Animations
       ========================================================================== */
    const revealItems = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once shown to optimize performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12, // Trigger when 12% of card is in viewport
        rootMargin: '0px 0px -50px 0px' // Offset trigger point slightly
    });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });


    /* ==========================================================================
       5. Stats Counter Animation
       ========================================================================== */
    const statsSection = document.getElementById('stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds animation
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out cubic progress
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                const currentValue = Math.floor(easeProgress * target);
                stat.textContent = currentValue;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target; // Ensure it finishes on exact number
                }
            };

            requestAnimationFrame(updateCount);
        });
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    if (statsSection) statsObserver.observe(statsSection);


    /* ==========================================================================
       6. Schedule a Consultation Form (WhatsApp Redirect)
       ========================================================================== */
    const whatsappForm = document.getElementById('whatsappForm');

    if (whatsappForm) {
        whatsappForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Fetch input fields
            const name = document.getElementById('clientName').value.trim();
            const phone = document.getElementById('clientPhone').value.trim();
            const categorySelect = document.getElementById('caseCategory');
            const category = categorySelect.options[categorySelect.selectedIndex].text;
            const description = document.getElementById('caseDesc').value.trim();

            // Form validation fallback
            if (!name || !phone || !categorySelect.value || !description) {
                alert('Please fill out all the fields before submitting.');
                return;
            }

            // Construct WhatsApp pre-filled text with clear styling and linebreaks
            const whatsappMsg = 
`🏛️ *ASVYBE ADVOCATES - CONSULTATION REQUEST*
---------------------------------------------
*Client Name:* ${name}
*Contact Phone:* ${phone}
*Case Category:* ${category}

*Brief Description of Case:*
${description}
---------------------------------------------
_Submitted via ASvybe Web Portal_`;

            // URL Encode the message
            const encodedText = encodeURIComponent(whatsappMsg);
            
            // Build the URL API Link
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;

            // Open in new tab/redirect
            window.open(whatsappUrl, '_blank');
        });
    }

    /* ==========================================================================
       7. Nav Menu Link Highlighting on Scroll
       ========================================================================== */
    const sections = document.querySelectorAll('section[id], header');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // Offset for header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}` || 
                (currentSectionId === '' && link.getAttribute('href') === '#')) {
                link.classList.add('active');
            }
        });
    });

});
