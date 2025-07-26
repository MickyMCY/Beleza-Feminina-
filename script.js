// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

function showSlide(index) {
    const carousel = document.getElementById('carousel');
    if (carousel) {
        carousel.style.transform = `translateX(-${index * 100}%)`;

        // Update active class
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// Auto-advance carousel every 7 seconds
function startCarousel() {
    setInterval(() => {
        nextSlide();
    }, 7000);
}

// FAQ functionality
function toggleFaq(index) {
    const faqItems = document.querySelectorAll('.faq-item');
    const currentItem = faqItems[index];
    const isActive = currentItem.classList.contains('active');

    // Close all FAQ items
    faqItems.forEach(item => {
        item.classList.remove('active');
        const icon = item.querySelector('.faq-icon');
        if (icon) {
            icon.textContent = '+';
        }
    });

    // If the clicked item wasn't active, open it
    if (!isActive) {
        currentItem.classList.add('active');
        const icon = currentItem.querySelector('.faq-icon');
        if (icon) {
            icon.textContent = '-';
        }
    }
}

// Smooth scrolling for anchor links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Scroll suave controlado pelo botão do cabeçalho, com possibilidade de interrupção pelo usuário
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('headerBtn'); // Botão do header
    const targetSection = document.querySelector('.ambassador'); // Seção da embaixadora
    let scrollAnimationId = null;
    let isScrolling = false;

    if (!btn || !targetSection) return;

    function smoothScrollTo(element, duration = 10000) { // duração 10 segundos
        const start = window.pageYOffset;
        const end = element.getBoundingClientRect().top + start;
        const distance = end - start;
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;

            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Função de easing easeInOutQuad
            const ease = progress < 0.5
                ? 2 * progress * progress
                : -1 + (4 - 2 * progress) * progress;

            window.scrollTo(0, start + distance * ease);

            if (progress < 1) {
                scrollAnimationId = requestAnimationFrame(step);
            } else {
                isScrolling = false;
            }
        }

        scrollAnimationId = requestAnimationFrame(step);
        isScrolling = true;
    }

    // Cancela scroll suave se o usuário interagir
    function cancelScrollOnUserInteraction() {
        if (isScrolling) {
            cancelAnimationFrame(scrollAnimationId);
            isScrolling = false;
        }
    }

    // Escuta eventos de interação que interrompem o scroll
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(eventType => {
        window.addEventListener(eventType, cancelScrollOnUserInteraction, { passive: true });
    });

    // Quando o botão for clicado, inicia o scroll suave só se não estiver rolando ainda
    btn.addEventListener('click', () => {
        if (!isScrolling) {
            smoothScrollTo(targetSection, 10000);
        }
    });
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel
    if (document.getElementById('carousel')) {
        showSlide(0);
        startCarousel();

        // Add event listeners for carousel buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }
    }

    // Add touch/swipe support for carousel
    let startX = 0;
    let isDragging = false;

    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        // Mouse events
        carouselContainer.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
        });

        carouselContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        carouselContainer.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;

            const deltaX = e.clientX - startX;
            if (Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
        });

        // Touch events
        carouselContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        carouselContainer.addEventListener('touchend', (e) => {
            const deltaX = e.changedTouches[0].clientX - startX;
            if (Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
        });
    }

    // Add click handlers for CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Você pode colocar lógica de compra ou redirecionamento aqui
            console.log('CTA button clicked');
        });
    });

    // Add fade-in animation for sections as they come into view
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

    // Observe all sections for fade-in animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });

        // Set initial state
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';

        // If image is already loaded (cached)
        if (img.complete) {
            img.style.opacity = '1';
        }
    });

    // Add pulse effect to important buttons
    const pulseButtons = document.querySelectorAll('.btn-pulse');
    pulseButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });

        button.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    });

    // Add scroll-to-top functionality
    let scrollToTopButton = null;

    function createScrollToTopButton() {
        scrollToTopButton = document.createElement('button');
        scrollToTopButton.innerHTML = '↑';
        scrollToTopButton.className = 'scroll-to-top';
        scrollToTopButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: #FF1B8D;
            color: white;
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transform: translateY(100px);
            transition: all 0.3s ease;
            z-index: 1000;
        `;

        scrollToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        document.body.appendChild(scrollToTopButton);
    }

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (!scrollToTopButton) {
            createScrollToTopButton();
        }

        if (window.scrollY > 300) {
            scrollToTopButton.style.opacity = '1';
            scrollToTopButton.style.transform = 'translateY(0)';
        } else {
            scrollToTopButton.style.opacity = '0';
            scrollToTopButton.style.transform = 'translateY(100px)';
        }
    });

    // Add click tracking for analytics (opcional)
    document.addEventListener('click', function(e) {
        const target = e.target;

        // Track button clicks
        if (target.classList.contains('btn')) {
            console.log('Button clicked:', target.textContent.trim());
        }

        // Track image clicks
        if (target.tagName === 'IMG') {
            console.log('Image clicked:', target.alt || target.src);
        }

        // Track FAQ clicks
        if (target.classList.contains('faq-question') || target.closest('.faq-question')) {
            const question = target.closest('.faq-question') || target;
            console.log('FAQ clicked:', question.querySelector('span').textContent);
        }
    });

    // Prevent right-click context menu on images (optional protection)
    document.addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });

    // Add keyboard navigation for carousel
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // Performance optimization: Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Global functions for HTML onclick handlers
window.toggleFaq = toggleFaq;
window.smoothScroll = smoothScroll;
