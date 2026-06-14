document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. Sticky Navigation Scroll Effect
    // ==========================================================================
    const header = document.getElementById('main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on load

    // ==========================================================================
    // 2. Mobile Drawer Navigation Toggle
    // ==========================================================================
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-item, .mobile-cta-btn');

    const toggleMenu = () => {
        const isOpen = mobileMenu.classList.contains('open');
        if (isOpen) {
            mobileMenu.classList.remove('open');
            mobileNavToggle.classList.remove('open');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Unlock background scrolling
        } else {
            mobileMenu.classList.add('open');
            mobileNavToggle.classList.add('open');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Lock background scrolling
        }
    };

    mobileNavToggle.addEventListener('click', toggleMenu);
    
    // Close drawer when any mobile nav link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // ==========================================================================
    // 3. Tab Package Filtering with CSS Animation
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const packageCards = document.querySelectorAll('.package-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active states on buttons
            tabButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const selectedCategory = btn.getAttribute('data-category');

            // Filter package cards
            packageCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Reset classes & display
                card.style.display = 'none';
                card.classList.remove('fade-in');

                if (selectedCategory === cardCategory) {
                    // Show matching cards
                    card.style.display = 'flex';
                    // Trigger reflow to restart CSS animation
                    void card.offsetWidth;
                    card.classList.add('fade-in');
                }
            });
        });
    });

    // ==========================================================================
    // 4. Native Touch-Swipe Gallery Dot Synchronization
    // ==========================================================================
    const swipeGalleries = document.querySelectorAll('.swipe-gallery');

    swipeGalleries.forEach(gallery => {
        const wrapper = gallery.querySelector('.gallery-wrapper');
        const dots = gallery.querySelectorAll('.gallery-dots .dot');

        if (wrapper && dots.length > 0) {
            // Monitor scroll positions inside the swipe wrapper
            wrapper.addEventListener('scroll', () => {
                const containerWidth = wrapper.clientWidth;
                const scrollOffset = wrapper.scrollLeft;
                
                // Find nearest slide index based on current scroll offset
                const activeIndex = Math.round(scrollOffset / containerWidth);

                // Update active classes on dot indicators
                dots.forEach((dot, idx) => {
                    if (idx === activeIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            });

            // Tap support on dots to jump directly to specific image slide
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    const slideWidth = wrapper.clientWidth;
                    wrapper.scrollTo({
                        left: index * slideWidth,
                        behavior: 'smooth'
                    });
                });
            });
        }
    });

    // ==========================================================================
    // 5. Dynamic Quote Form WhatsApp Redirect Integration
    // ==========================================================================
    const quoteForm = document.getElementById('quote-form');

    // Automatically set default minimum date to today
    const dateInput = document.getElementById('form-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Fetch user form entries
        const name = document.getElementById('form-name').value.trim();
        const phone = document.getElementById('form-phone').value.trim();
        const category = document.getElementById('form-type').value;
        const destination = document.getElementById('form-destination').value.trim();
        const travelDate = document.getElementById('form-date').value;
        const duration = document.getElementById('form-days').value.trim();
        const guests = document.getElementById('form-guests').value.trim();

        // Destination Hotline number (Default: +919999999999)
        const travelDeskNumber = '919999999999';

        // Compose structured readable text layout for travel desk operators
        const rawMessage = `✈️ *ASvybe Travels - Booking Inquiry* 🚗\n` +
                           `----------------------------------------\n` +
                           `👤 *Customer Name:* ${name}\n` +
                           `📞 *WhatsApp Number:* ${phone}\n` +
                           `🏷️ *Inquiry Type:* ${category}\n` +
                           `📍 *Route/Destination:* ${destination}\n` +
                           `📅 *Travel Date:* ${travelDate}\n` +
                           `⏱️ *Trip Duration:* ${duration} Days\n` +
                           `👥 *Number of Guests:* ${guests} Person(s)\n` +
                           `----------------------------------------\n` +
                           `Please provide the best custom quote and itinerary breakdown. Thank you!`;

        // Encode parameters safely for HTTP URL redirects
        const encodedText = encodeURIComponent(rawMessage);
        const whatsAppUrl = `https://wa.me/${travelDeskNumber}?text=${encodedText}`;

        // Redirect to WhatsApp interface in a clean separate window
        window.open(whatsAppUrl, '_blank');
    });
});
