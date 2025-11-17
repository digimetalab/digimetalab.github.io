// Navbar scroll effect
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

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
const numberOfParticles = 80;

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
        // Alternate between purple and green particles
        const isPurple = Math.random() > 0.5;
        ctx.fillStyle = isPurple 
            ? `rgba(139, 92, 246, ${this.opacity})` 
            : `rgba(16, 185, 129, ${this.opacity})`;
        
        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = isPurple ? 'rgba(139, 92, 246, 0.8)' : 'rgba(16, 185, 129, 0.8)';
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                const opacity = (1 - distance / 120) * 0.5;
                // Create gradient for connection lines
                const gradient = ctx.createLinearGradient(
                    particlesArray[a].x, particlesArray[a].y,
                    particlesArray[b].x, particlesArray[b].y
                );
                gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity})`);
                gradient.addColorStop(1, `rgba(16, 185, 129, ${opacity})`);
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1.5;
                ctx.shadowBlur = 5;
                ctx.shadowColor = 'rgba(139, 92, 246, 0.5)';
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    
    connectParticles();
    requestAnimationFrame(animate);
}

init();
animate();

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.service-card, .process-step, .case-card, .benefit-item, .stat-card, .tech-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add hover effect to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

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
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(stat => {
    statObserver.observe(stat);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// Add glow effect on mouse move for hero section
const hero = document.querySelector('.hero');
hero.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    hero.style.background = `
        radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(139, 92, 246, 0.2), transparent 40%),
        radial-gradient(circle at ${(1-x) * 100}% ${(1-y) * 100}%, rgba(16, 185, 129, 0.15), transparent 50%)
    `;
});

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

// Add animation to elements on scroll
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe testimonials and FAQ items
document.querySelectorAll('.testimonial-card, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateOnScroll.observe(el);
});

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

// Track scroll depth
let scrollDepth = 0;
window.addEventListener('scroll', function() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const currentDepth = Math.round((scrollTop + windowHeight) / documentHeight * 100);
    
    // Track at 25%, 50%, 75%, 100%
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
});
