// Navbar scroll effect
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Throttle function for performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        if (!timeout) {
            timeout = setTimeout(() => {
                func(...args);
                timeout = null;
            }, wait);
        }
    };
}

// Consolidated scroll handler with throttle for performance
let scrollDepth = 0;
const handleScroll = throttle(() => {
    const scrollY = window.pageYOffset;
    
    // Navbar scroll effect
    navbar.classList.toggle('scrolled', scrollY > 50);
    
    // Parallax effect for hero
    if (scrollY < window.innerHeight) {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrollY * 0.5}px)`;
            heroContent.style.opacity = 1 - (scrollY / window.innerHeight);
        }
    }
    
    // Scroll depth tracking
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const currentDepth = Math.round((scrollY + windowHeight) / documentHeight * 100);
    
    if (currentDepth >= 25 && scrollDepth < 25) {
        scrollDepth = 25;
        trackEvent('Scroll', 'depth', '25%');
    } else if (currentDepth >= 50 && scrollDepth < 50) {
        scrollDepth = 50;
        trackEvent('Scroll', 'depth', '50%');
    } else if (currentDepth >= 75 && scrollDepth < 75) {
        scrollDepth = 75;
        trackEvent('Scroll', 'depth', '75%');
    } else if (currentDepth >= 95 && scrollDepth < 100) {
        scrollDepth = 100;
        trackEvent('Scroll', 'depth', '100%');
    }
}, 100);

window.addEventListener('scroll', handleScroll, { passive: true });

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Particle animation for hero section
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
// Reduce particles on mobile for better performance
const numberOfParticles = window.innerWidth < 768 ? 40 : window.innerWidth < 1024 ? 60 : 80;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }
    }

    draw() {
        // Simplified draw without shadow for performance
        const isPrimary = Math.random() > 0.6;
        ctx.fillStyle = isPrimary 
            ? `rgba(99, 102, 241, ${this.opacity})` 
            : `rgba(6, 182, 212, ${this.opacity * 0.8})`;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function connectParticles() {
    const maxDistance = 140;
    for (let a = 0; a < particlesArray.length; a++) {
        let connections = 0;
        for (let b = a + 1; b < particlesArray.length; b++) {
            // Limit connections per particle for performance
            if (connections >= 3) break;
            
            // Early exit optimization
            const dx = particlesArray[a].x - particlesArray[b].x;
            if (Math.abs(dx) > maxDistance) continue;
            
            const dy = particlesArray[a].y - particlesArray[b].y;
            if (Math.abs(dy) > maxDistance) continue;
            
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                connections++;
                const opacity = (1 - distance / maxDistance) * 0.3;
                
                // Simplified stroke without gradient for performance
                ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

let animationId;
let isAnimating = true;

function animate() {
    if (!isAnimating) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    
    connectParticles();
    animationId = requestAnimationFrame(animate);
}

// Pause animation when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        isAnimating = false;
        if (animationId) cancelAnimationFrame(animationId);
    } else {
        isAnimating = true;
        animate();
    }
});

init();
animate();

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Smooth scroll for anchor links (removed duplicate later in code)

// Consolidated Intersection Observer for all animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            animationObserver.unobserve(entry.target); // Stop observing after animation
        }
    });
}, observerOptions);

// Observe all animated elements at once
document.querySelectorAll('.service-card, .process-step, .case-card, .benefit-item, .stat-card, .tech-item, .testimonial-card, .faq-item').forEach(el => {
    el.classList.add('fade-in-element');
    animationObserver.observe(el);
});

// Hover effect moved to CSS for better performance

// Counter animation for stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const isPercentage = element.textContent.includes('%');
    const isPlus = element.textContent.includes('+');
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (isPercentage ? '%' : '') + (isPlus ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (isPercentage ? '%' : '') + (isPlus ? '+' : '');
        }
    }, 16);
};

// Observe stat numbers for counter animation
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            animateCounter(entry.target, number);
            statObserver.unobserve(entry.target); // Stop observing after animation
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(stat => {
    statObserver.observe(stat);
});

// Parallax effect merged with main scroll handler for performance

// Optimized glow effect with throttle
const hero = document.querySelector('.hero');
const handleHeroMouseMove = throttle((e) => {
    const x = (e.clientX / window.innerWidth * 100).toFixed(0);
    const y = (e.clientY / window.innerHeight * 100).toFixed(0);
    hero.style.setProperty('--mouse-x', `${x}%`);
    hero.style.setProperty('--mouse-y', `${y}%`);
}, 50);

if (hero) {
    hero.addEventListener('mousemove', handleHeroMouseMove);
}

console.log('Digimetalab - AI Automation for Modern Business');


// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Create mailto link with form data
        const subject = encodeURIComponent(`New Inquiry from ${data.name}`);
        const body = encodeURIComponent(
            `Name: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Company: ${data.company || 'N/A'}\n` +
            `Phone: ${data.phone || 'N/A'}\n` +
            `Service Interest: ${data.service || 'N/A'}\n\n` +
            `Message:\n${data.message}`
        );
        
        // Open email client
        window.location.href = `mailto:contact@digimetalab.my.id?subject=${subject}&body=${body}`;
        
        // Show success message
        alert('Thank you for your interest! Your email client will open to send the message. We\'ll get back to you within 24 hours.');
        
        // Reset form
        contactForm.reset();
    });
}

// Smooth scroll with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Removed duplicate observer - already handled above

// WhatsApp button entrance animation
window.addEventListener('load', () => {
    setTimeout(() => {
        const whatsappBtn = document.querySelector('.whatsapp-float');
        if (whatsappBtn) {
            whatsappBtn.style.opacity = '0';
            whatsappBtn.style.transform = 'scale(0)';
            whatsappBtn.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                whatsappBtn.style.opacity = '1';
                whatsappBtn.style.transform = 'scale(1)';
            }, 100);
        }
    }, 2000);
});


// Google Analytics Event Tracking
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Track CTA button clicks
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function() {
        const text = this.textContent.trim();
        trackEvent('CTA', 'click', text);
    });
});

// Track navigation clicks
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        const section = this.textContent.trim();
        trackEvent('Navigation', 'click', section);
    });
});

// Track WhatsApp button click
const whatsappBtn = document.querySelector('.whatsapp-float');
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function() {
        trackEvent('Contact', 'click', 'WhatsApp Button');
    });
}

// Track form submission
const contactFormTracking = document.getElementById('contactForm');
if (contactFormTracking) {
    contactFormTracking.addEventListener('submit', function() {
        trackEvent('Form', 'submit', 'Contact Form');
    });
}

// Track service card clicks
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function() {
        const title = this.querySelector('.service-title')?.textContent || 'Service';
        trackEvent('Service', 'view', title);
    });
});

// Track FAQ interactions
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
        const faqTitle = this.querySelector('h3')?.textContent || 'FAQ';
        trackEvent('FAQ', 'expand', faqTitle);
    });
});

// Scroll depth tracking merged with main scroll handler
