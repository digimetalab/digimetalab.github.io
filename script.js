// =====================================================
// DIGIMETALAB - Main JavaScript
// =====================================================

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all modules
    initNavbar();
    initSmoothScroll();
    initContactForm();
    initScrollAnimations();
    initAuroraBackground();
});

// =====================================================
// NAVBAR - POLAR STYLE
// =====================================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navDonut = document.getElementById('navDonut');
    const navOverlay = document.getElementById('navOverlay');
    const navLinksFullscreen = document.querySelectorAll('.nav-link-full');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Donut menu toggle
    if (navDonut && navOverlay) {
        navDonut.addEventListener('click', () => {
            navDonut.classList.toggle('active');
            navOverlay.classList.toggle('active');
            document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        navLinksFullscreen.forEach(link => {
            link.addEventListener('click', () => {
                navDonut.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
                navDonut.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-link-full');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link-full[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    allNavLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    });
}

// =====================================================
// SMOOTH SCROLL
// =====================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =====================================================
// CONTACT FORM
// =====================================================
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Simulate form submission (integrate with your backend)
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Success message
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                form.reset();

            } catch (error) {
                showNotification('Something went wrong. Please try again.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// =====================================================
// NOTIFICATION SYSTEM
// =====================================================
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#BFFF00' : '#ef4444'};
        color: ${type === 'success' ? '#0A0A0A' : '#ffffff'};
        border-radius: 12px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 16px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    `;

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });

    // Close button styles
    notification.querySelector('.notification-close').style.cssText = `
        background: transparent;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: inherit;
        opacity: 0.7;
    `;

    // Auto dismiss
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// =====================================================
// SCROLL ANIMATIONS
// =====================================================
function initScrollAnimations() {
    // Create intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll('.service-card, .portfolio-card, .testimonial-card, .process-step, .tech-item, .case-card, .benefit-item');

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// =====================================================
// PARTICLE BACKGROUND (Optional)
// =====================================================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2
        };
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`;
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
    animate();
}

// Initialize particles if canvas exists
if (document.getElementById('particleCanvas')) {
    initParticles();
}

// =====================================================
// COUNTER ANIMATION
// =====================================================
function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target + '+';
        }
    }

    requestAnimationFrame(update);
}

// Observe stat numbers for animation
const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Just add a class for visual effect
            entry.target.style.opacity = '1';
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    stat.style.opacity = '0';
    stat.style.transition = 'opacity 0.5s ease';
    statObserver.observe(stat);
});

// =====================================================
// AURORA BACKGROUND - Scroll-based state changes
// =====================================================
function initAuroraBackground() {
    const auroraBg = document.getElementById('auroraBg');
    if (!auroraBg) return;

    // Define sections to observe
    const sections = [
        { id: 'home', state: 'hero' },
        { id: 'services', state: 'services' },
        { id: 'work', state: 'work' },
        { id: 'portfolio', state: 'work' },
        { id: 'about', state: 'about' },
        { id: 'tech-stack', state: 'about' },
        { id: 'faq', state: 'about' },
        { id: 'contact', state: 'contact' }
    ];

    // Set initial state
    auroraBg.classList.add('state-hero');

    // Create Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const sectionConfig = sections.find(s => s.id === sectionId);

                if (sectionConfig) {
                    // Remove all state classes
                    auroraBg.className = 'aurora-bg';
                    // Add new state class
                    auroraBg.classList.add(`state-${sectionConfig.state}`);
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
            sectionObserver.observe(element);
        }
    });
}
