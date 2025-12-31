// PIN Lock functionality
function checkPin() {
    const pinInput = document.getElementById('pinInput');
    const errorMessage = document.getElementById('errorMessage');
    const lockScreen = document.getElementById('lockScreen');
    const mainContent = document.getElementById('mainContent');
    const pin = pinInput.value;

    if (pin === '2266') {
        lockScreen.style.display = 'none';
        const galleryView = document.getElementById('galleryView');
        if (galleryView) {
            galleryView.style.display = 'flex';
        }
    } else {
        errorMessage.textContent = 'Incorrect PIN. Try again.';
        pinInput.value = '';
        pinInput.classList.add('shake');
        setTimeout(() => {
            pinInput.classList.remove('shake');
            errorMessage.textContent = '';
        }, 2000);
    }
}

// Gallery Navigation Functions
function openCardCollection(type) {
    const galleryView = document.getElementById('galleryView');
    galleryView.style.display = 'none';

    if (type === 'august') {
        const augustCollection = document.getElementById('augustCollection');
        augustCollection.style.display = 'block';
        setTimeout(() => {
            window.cardSwiper = new CuteCardSwiper();
        }, 200);
    } else if (type === 'christmas') {
        const christmasCollection = document.getElementById('christmasCollection');
        christmasCollection.style.display = 'block';

        setTimeout(() => {
            window.cardSwiper = new CuteCardSwiper();

            // Force first card to be visible
            setTimeout(() => {
                const firstCard = document.querySelector('.christmas-collection .card.active');
                if (firstCard) {
                    firstCard.style.display = 'flex';
                    firstCard.style.visibility = 'visible';
                    firstCard.style.opacity = '1';
                    firstCard.style.zIndex = '100';
                }
            }, 100);

            // Start countdown timer automatically
            setTimeout(() => {
                startCountdownTimer();
            }, 500);
        }, 200);
    }
}

function backToGallery() {
    const augustCollection = document.getElementById('augustCollection');
    const christmasCollection = document.getElementById('christmasCollection');
    const galleryView = document.getElementById('galleryView');

    augustCollection.style.display = 'none';
    christmasCollection.style.display = 'none';
    galleryView.style.display = 'flex';

    // Destroy current swiper
    if (window.cardSwiper) {
        window.cardSwiper = null;
    }
}

// Christmas Game Functions
function openChristmasGame() {
    const modal = document.getElementById('christmasGameModal');
    modal.classList.add('show');
    modal.style.display = 'flex';
    initChristmasGame();
}

function closeChristmasGame() {
    const modal = document.getElementById('christmasGameModal');
    modal.classList.remove('show');
    modal.style.display = 'none';
    if (window.christmasGame) {
        window.christmasGame.stop();
        window.christmasGame = null;
    }
}

// Initialize global state variables
window.timerFinished = false;
window.codeUnlocked = false;
window.countdownInterval = null;

// Show Timer Card - navigates to the timer card
function showTimerCard() {
    const timerCard = document.getElementById('timerCard');
    const codeLockCard = document.getElementById('codeLockCard');

    // Show the timer card (remove hidden-card class)
    if (timerCard) {
        timerCard.classList.remove('hidden-card');
    }

    // Navigate to timer card using the swiper
    if (window.cardSwiper) {
        // Find the timer card index
        const visibleCollection = document.querySelector('.card-collection[style*="display: flex"]') ||
                                  document.querySelector('.card-collection[style*="display: block"]') ||
                                  document.querySelector('.card-collection:not([style*="display: none"])');
        if (visibleCollection) {
            const allCards = visibleCollection.querySelectorAll('.card');
            const cards = Array.from(allCards).filter(card => !card.classList.contains('hidden-card') || card === timerCard);

            // Update total cards count
            window.cardSwiper.totalCards = cards.length;

            // Find timer card position and navigate
            const timerIndex = cards.findIndex(card => card.id === 'timerCard');
            if (timerIndex !== -1) {
                window.cardSwiper.isTransitioning = false;
                window.cardSwiper.goToCard(timerIndex + 1);
            }
        }
    }

    // Start the countdown timer
    startCountdownTimer();
}

// Start Countdown Timer
function startCountdownTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (!timerDisplay) return;

    // Check if countdown is disabled
    if (!GAME_CONFIG.COUNTDOWN_ENABLED) {
        // Countdown disabled - skip directly to unlocked state
        window.timerFinished = true;
        timerDisplay.innerHTML = '🎉 Surprise Ready! 🎉';
        timerDisplay.classList.add('timer-complete');

        // Show the code lock card immediately
        const codeLockCard = document.getElementById('codeLockCard');
        if (codeLockCard) {
            codeLockCard.classList.remove('hidden-card');
        }
        return;
    }

    // Get target date from config
    const targetDate = new Date(GAME_CONFIG.COUNTDOWN_DATE).getTime();

    // Clear any existing interval
    if (window.countdownInterval) {
        clearInterval(window.countdownInterval);
    }

    function updateTimer() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
            // Timer finished!
            window.timerFinished = true;
            timerDisplay.innerHTML = '🎉 Time\'s up! 🎉';
            timerDisplay.classList.add('timer-complete');

            // Show the code lock card
            const codeLockCard = document.getElementById('codeLockCard');
            if (codeLockCard) {
                codeLockCard.classList.remove('hidden-card');
            }

            clearInterval(window.countdownInterval);
            return;
        }

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the countdown
        timerDisplay.innerHTML = `
            <div class="countdown-units">
                <div class="countdown-unit"><span class="countdown-number">${days}</span><span class="countdown-label">days</span></div>
                <div class="countdown-unit"><span class="countdown-number">${hours}</span><span class="countdown-label">hrs</span></div>
                <div class="countdown-unit"><span class="countdown-number">${minutes}</span><span class="countdown-label">min</span></div>
                <div class="countdown-unit"><span class="countdown-number">${seconds}</span><span class="countdown-label">sec</span></div>
            </div>
        `;
    }

    // Update immediately and then every second
    updateTimer();
    window.countdownInterval = setInterval(updateTimer, 1000);
}

// Check Secret Code
function checkSecretCode() {
    const codeInput = document.getElementById('secretCodeInput');
    const codeError = document.getElementById('codeError');

    if (!codeInput || !codeError) return;

    const enteredCode = codeInput.value.trim().toUpperCase();
    const correctCode = GAME_CONFIG.SECRET_CODE.toUpperCase();

    if (enteredCode === correctCode) {
        // Code is correct!
        window.codeUnlocked = true;
        codeError.textContent = '🎉 Code correct! Cards unlocked!';
        codeError.style.color = '#90EE90';

        // Unlock all reveal cards
        const revealCards = document.querySelectorAll('.reveal-card.locked-card');
        revealCards.forEach(card => {
            card.classList.remove('locked-card');
        });

        // Update total cards count
        if (window.cardSwiper) {
            const visibleCollection = document.querySelector('.card-collection[style*="display: flex"]') ||
                                      document.querySelector('.card-collection[style*="display: block"]') ||
                                      document.querySelector('.card-collection:not([style*="display: none"])');
            if (visibleCollection) {
                const cards = Array.from(visibleCollection.querySelectorAll('.card')).filter(
                    card => !card.classList.contains('hidden-card')
                );
                window.cardSwiper.totalCards = cards.length;
            }
        }

        // Clear success message after delay
        setTimeout(() => {
            codeError.textContent = '';
        }, 3000);
    } else {
        // Wrong code
        codeError.textContent = GAME_CONFIG.WRONG_CODE_MESSAGE;
        codeError.style.color = '#ff8a8a';
        codeInput.value = '';
        codeInput.classList.add('shake');

        setTimeout(() => {
            codeInput.classList.remove('shake');
            codeError.textContent = '';
        }, 2000);
    }
}

// Initialize Christmas Game (placeholder - simple animation)
function initChristmasGame() {
    const canvas = document.getElementById('christmasGameCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 500;

    // Simple snowfall animation as placeholder
    const snowflakes = [];
    for (let i = 0; i < 50; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 2 + 1
        });
    }

    let animationId = null;

    function animate() {
        ctx.fillStyle = '#1a3a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snowflakes
        ctx.fillStyle = '#fff';
        snowflakes.forEach(flake => {
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            ctx.fill();

            flake.y += flake.speed;
            if (flake.y > canvas.height) {
                flake.y = 0;
                flake.x = Math.random() * canvas.width;
            }
        });

        // Draw tree
        ctx.fillStyle = '#2d5a2d';
        ctx.beginPath();
        ctx.moveTo(200, 100);
        ctx.lineTo(100, 350);
        ctx.lineTo(300, 350);
        ctx.closePath();
        ctx.fill();

        // Draw star
        ctx.fillStyle = '#ffd700';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⭐', 200, 90);

        // Draw message
        ctx.fillStyle = '#fff';
        ctx.font = '16px "Press Start 2P"';
        ctx.fillText('Merry Christmas!', 200, 420);
        ctx.font = '12px "Press Start 2P"';
        ctx.fillText('Click anywhere to close', 200, 460);

        animationId = requestAnimationFrame(animate);
    }

    animate();

    // Store for cleanup
    window.christmasGame = {
        stop: function() {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        }
    };

    // Close on click
    canvas.onclick = closeChristmasGame;
}

// Allow Enter key to submit PIN
document.addEventListener('DOMContentLoaded', function() {
    const pinInput = document.getElementById('pinInput');
    if (pinInput) {
        pinInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPin();
            }
        });
    }

    // Add click-to-zoom for all card images
    setupImageLightbox();
});

// Image Lightbox/Zoom functionality
function setupImageLightbox() {
    // Add click listeners to all card images
    document.querySelectorAll('.card-image').forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            openLightbox(this.src);
        });
    });
}

function openLightbox(imageSrc) {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImage');

    if (lightbox && lightboxImg) {
        lightboxImg.src = imageSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close lightbox with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Anniversary Card Swiper
class CuteCardSwiper {
    constructor() {
        this.currentCard = 1;
        this.totalCards = 12; // Will be updated dynamically
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.minSwipeDistance = 50;

        this.init();
    }

    init() {
        // Dynamically count cards in the currently visible collection (excluding hidden-card class)
        const visibleCollection = document.querySelector('.card-collection[style*="display: block"]') ||
                                  document.querySelector('.card-collection:not([style*="display: none"])');

        if (visibleCollection) {
            const allCards = visibleCollection.querySelectorAll('.card');
            const visibleCards = Array.from(allCards).filter(card => !card.classList.contains('hidden-card'));
            this.totalCards = visibleCards.length;
        } else {
            const allCards = document.querySelectorAll('.card');
            const visibleCards = Array.from(allCards).filter(card => !card.classList.contains('hidden-card'));
            this.totalCards = visibleCards.length;
        }

        this.bindEvents();
        this.updateCardPositions();
        this.preloadImages();

        // Ensure first card is visible
        setTimeout(() => {
            this.updateCardPositions();
        }, 50);
    }
    
    bindEvents() {
        // Find the visible collection
        const visibleCollection = document.querySelector('.card-collection[style*="display: block"]') ||
                                  document.querySelector('.card-collection:not([style*="display: none"])');

        if (!visibleCollection) {
            return;
        }

        // Touch events for swipe functionality
        const cardWrapper = visibleCollection.querySelector('.card-wrapper');
        if (cardWrapper) {
            cardWrapper.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            cardWrapper.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });

            // Mouse events for desktop dragging
            cardWrapper.addEventListener('mousedown', this.handleMouseDown.bind(this));
            cardWrapper.addEventListener('mouseup', this.handleMouseUp.bind(this));

            // Prevent context menu on long touch
            cardWrapper.addEventListener('contextmenu', (e) => e.preventDefault());
        }

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyPress.bind(this));

        // Navigation buttons in the visible collection
        const prevBtn = visibleCollection.querySelector('.prev-btn');
        const nextBtn = visibleCollection.querySelector('.next-btn');

        if (prevBtn) prevBtn.addEventListener('click', () => this.previousCard());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextCard());

        // Dot navigation in the visible collection
        const dots = visibleCollection.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToCard(index + 1));
        });
    }
    
    handleTouchStart(e) {
        if (this.isTransitioning) return;
        this.touchStartX = e.touches[0].clientX;
    }
    
    handleTouchEnd(e) {
        if (this.isTransitioning) return;
        this.touchEndX = e.changedTouches[0].clientX;
        this.handleSwipe();
    }
    
    handleMouseDown(e) {
        if (this.isTransitioning) return;
        this.touchStartX = e.clientX;
        
        const handleMouseMove = (moveEvent) => {
            // Optional: Add visual feedback during drag
        };
        
        const handleMouseUpTemp = (upEvent) => {
            this.touchEndX = upEvent.clientX;
            this.handleSwipe();
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUpTemp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUpTemp);
    }
    
    handleMouseUp(e) {
        if (this.isTransitioning) return;
        this.touchEndX = e.clientX;
        this.handleSwipe();
    }
    
    handleSwipe() {
        const swipeDistance = this.touchStartX - this.touchEndX;

        if (Math.abs(swipeDistance) < this.minSwipeDistance) {
            return;
        }

        if (swipeDistance > 0) {
            // Swipe left - next card
            this.nextCard();
        } else {
            // Swipe right - previous card
            this.previousCard();
        }
    }

    handleKeyPress(e) {
        if (this.isTransitioning) return;

        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousCard();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextCard();
                break;
            case ' ':
                e.preventDefault();
                this.nextCard();
                break;
            case 'Home':
                e.preventDefault();
                this.goToCard(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToCard(this.totalCards);
                break;
        }
    }
    
    nextCard() {
        if (this.isTransitioning) return;

        // Check if we're on timer card and timer hasn't finished
        const visibleCollection = document.querySelector('.card-collection[style*="display: block"]') ||
                                  document.querySelector('.card-collection:not([style*="display: none"])');

        if (visibleCollection) {
            const allCards = visibleCollection.querySelectorAll('.card');
            const cards = Array.from(allCards).filter(card => !card.classList.contains('hidden-card'));
            const currentCardElement = cards[this.currentCard - 1];

            // Block if on timer card and timer not finished
            if (currentCardElement && currentCardElement.classList.contains('timer-card')) {
                if (!window.timerFinished) {
                    const codeError = document.getElementById('codeError');
                    if (codeError) {
                        codeError.textContent = 'Please wait for the timer to finish ⏳';
                        codeError.style.color = '#ff8a8a';
                        setTimeout(() => {
                            codeError.textContent = '';
                        }, 2000);
                    }
                    return;
                }
            }

            // Block if on code lock card and code not entered
            if (currentCardElement && currentCardElement.classList.contains('code-lock-card')) {
                if (!window.codeUnlocked) {
                    const codeError = document.getElementById('codeError');
                    if (codeError) {
                        codeError.textContent = 'Please enter the correct code first 🔐';
                        codeError.style.color = '#ff8a8a';
                        setTimeout(() => {
                            codeError.textContent = '';
                        }, 2000);
                    }
                    return;
                }
            }
        }

        this.hideSwipeHint();
        this.pulsePageIndicator('next');

        if (this.currentCard < this.totalCards) {
            this.goToCard(this.currentCard + 1);
        } else {
            // Loop back to first card
            this.goToCard(1);
        }
    }

    previousCard() {
        if (this.isTransitioning) return;

        this.hideSwipeHint();
        this.pulsePageIndicator('prev');

        if (this.currentCard > 1) {
            this.goToCard(this.currentCard - 1);
        } else {
            // Loop to last card
            this.goToCard(this.totalCards);
        }
    }
    
    goToCard(cardNumber) {
        if (this.isTransitioning || cardNumber === this.currentCard) {
            return;
        }

        // Check if target card is locked
        const visibleCollection = document.querySelector('.card-collection[style*="display: block"]') ||
                                  document.querySelector('.card-collection:not([style*="display: none"])');

        if (visibleCollection) {
            const allCards = visibleCollection.querySelectorAll('.card');
            const cards = Array.from(allCards).filter(card => !card.classList.contains('hidden-card'));
            const targetCard = cards[cardNumber - 1];

            if (targetCard && targetCard.classList.contains('locked-card')) {
                // Show error message if code lock card exists
                const codeError = document.getElementById('codeError');
                if (codeError) {
                    codeError.textContent = 'Please enter the correct code first 🔐';
                    codeError.style.color = '#ff8a8a';
                    setTimeout(() => {
                        codeError.textContent = '';
                    }, 2000);
                }
                return;
            }
        }

        this.hideSwipeHint();
        this.isTransitioning = true;
        this.currentCard = cardNumber;

        this.updateCardPositions();
        this.addCuteEffects();

        // Check if we landed on timer card and start countdown
        if (visibleCollection) {
            const cards = visibleCollection.querySelectorAll('.card');
            const currentCardElement = cards[cardNumber - 1];

            if (currentCardElement && currentCardElement.classList.contains('timer-card')) {
                // Start countdown timer after a short delay
                setTimeout(() => {
                    if (typeof startCountdownTimer === 'function') {
                        startCountdownTimer();
                    }
                }, 800);
            }
        }

        // Reset transition lock after animation completes (matched to CSS transition time)
        setTimeout(() => {
            this.isTransitioning = false;
        }, 700);
    }
    
    hideSwipeHint() {
        const swipeHint = document.querySelector('.swipe-hint');
        if (swipeHint) {
            swipeHint.style.opacity = '0';
            swipeHint.style.pointerEvents = 'none';
            setTimeout(() => {
                swipeHint.style.display = 'none';
            }, 500);
        }
    }
    
    updateCardPositions() {
        // Only target cards in the currently visible collection
        const visibleCollection = document.querySelector('.card-collection[style*="display: block"]') ||
                                  document.querySelector('.card-collection:not([style*="display: none"])');

        if (!visibleCollection) {
            return;
        }

        // Get all cards and filter out hidden-card class
        const allCards = visibleCollection.querySelectorAll('.card');
        const cards = Array.from(allCards).filter(card => !card.classList.contains('hidden-card'));


        if (cards.length === 0) {
            return;
        }

        cards.forEach((card, index) => {
            const cardNumber = index + 1;
            card.classList.remove('active', 'prev', 'next');

            // Remove any inline styles that might override CSS
            card.style.visibility = '';
            card.style.opacity = '';
            card.style.zIndex = '';

            if (cardNumber === this.currentCard) {
                card.classList.add('active');
                // Reset scroll position for active card
                card.scrollTop = 0;
            } else if (cardNumber < this.currentCard) {
                card.classList.add('prev');
            } else {
                card.classList.add('next');
            }
        });

        // Log the active card content for debugging
        const activeCard = visibleCollection.querySelector('.card.active');
        if (activeCard) {
        } else {
        }
    }

    updateCardDisplay() {
        // Recount cards (excluding hidden-card class) and update display
        const visibleCollection = document.querySelector('.card-collection[style*="display: block"]') ||
                                  document.querySelector('.card-collection:not([style*="display: none"])');

        if (visibleCollection) {
            const allCards = visibleCollection.querySelectorAll('.card');
            const visibleCards = Array.from(allCards).filter(card => !card.classList.contains('hidden-card'));
            this.totalCards = visibleCards.length;
        }

        this.updateCardPositions();
    }
    
    addCuteEffects() {
        // Add sparkle effect when changing cards
        this.createSparkles();

        // Add gentle vibration on mobile (if supported)
        if ('vibrate' in navigator && window.innerWidth <= 768) {
            navigator.vibrate(50);
        }
    }

    pulsePageIndicator(direction) {
        // Pulse the appropriate page indicator
        try {
            const indicator = direction === 'next'
                ? document.getElementById('nextIndicator')
                : document.getElementById('prevIndicator');

            if (indicator) {
                indicator.classList.add('active');
                setTimeout(() => {
                    indicator.classList.remove('active');
                }, 500);
            }
        } catch (error) {
        }
    }
    
    createSparkles() {
        const sparkleContainer = document.querySelector('.swiper-container');
        const sparkles = ['✨', '💫', '⭐', '🌟', '💖', '🦋', '🌸'];
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
                sparkle.style.position = 'absolute';
                sparkle.style.left = Math.random() * 100 + '%';
                sparkle.style.top = Math.random() * 100 + '%';
                sparkle.style.fontSize = (Math.random() * 0.5 + 0.8) + 'rem';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '1000';
                sparkle.style.animation = 'sparkleFloat 1.5s ease-out forwards';
                
                sparkleContainer.appendChild(sparkle);
                
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                }, 1500);
            }, i * 100);
        }
    }
    
    preloadImages() {
        // Preload images for better performance
        const imageSources = ['1.PNG', '2.JPG'];
        imageSources.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
}

// Global functions for inline event handlers
function nextCard() {
    if (window.cardSwiper) {
        window.cardSwiper.nextCard();
    } else {
    }
}

function previousCard() {
    if (window.cardSwiper) {
        window.cardSwiper.previousCard();
    } else {
    }
}

function currentCard(cardNumber) {
    if (window.cardSwiper) {
        window.cardSwiper.goToCard(cardNumber);
    } else {
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add sparkle animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkleFloat {
            0% {
                opacity: 0;
                transform: translateY(0) scale(0);
            }
            50% {
                opacity: 1;
                transform: translateY(-20px) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-40px) scale(0);
            }
        }
        
        .swiper-container {
            overflow: hidden;
        }
        
        /* Improved focus styles for accessibility */
        .nav-btn:focus,
        .dot:focus {
            outline: 3px solid rgba(214, 51, 132, 0.5);
            outline-offset: 3px;
        }
        
        /* Smooth transitions for better UX */
        .card {
            will-change: transform, opacity;
        }
        
        /* Loading state for images */
        .card-image {
            background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                        linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                        linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                        linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
            background-size: 20px 20px;
            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
        
        .card-image.loaded {
            background: none;
        }
    `;
    document.head.appendChild(style);

    // Initialize the swiper - now done after PIN entry in checkPin()
    // window.cardSwiper = new CuteCardSwiper();

    // Force first card to be visible as fallback
    setTimeout(() => {
        const firstCard = document.querySelector('.card:first-child');
        if (firstCard && !firstCard.classList.contains('active')) {
            firstCard.classList.add('active');
        }
    }, 100);
    
    // Add loading effect for images
    document.querySelectorAll('.card-image').forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
            this.style.background = 'linear-gradient(145deg, #fce7f3, #f3e8ff)';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.innerHTML = '<span style="color: #d63384; font-size: 2rem;">📷</span>';
        });
    });
    
    // Add loading effect for video and ensure sound is enabled
    document.querySelectorAll('.card-video').forEach(video => {
        // Ensure video has sound enabled
        video.muted = false;
        video.volume = 0.8; // Set to 80% volume
        
        video.addEventListener('error', function() {
            this.style.background = 'linear-gradient(145deg, #fce7f3, #f3e8ff)';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.innerHTML = '<span style="color: #d63384; font-size: 2rem;">🎥</span>';
        });
        
        // Add click event to ensure video plays with sound
        video.addEventListener('click', function() {
            if (this.paused) {
            } else {
                this.pause();
            }
        });
        
        // Ensure autoplay with sound works when video card is active
        video.addEventListener('loadedmetadata', function() {
            this.muted = false;
        });
    });
    
    // Add cute welcome message
    setTimeout(() => {
    }, 1000);
});

// Add service worker registration for offline capability (optional enhancement)
// Only works on http/https, not file:// protocol
if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', () => {
        // Only register service worker if the file exists
        fetch('/sw.js', { method: 'HEAD' })
            .then(() => {
                navigator.serviceWorker.register('/sw.js')
                    .catch(() => {});
            })
            .catch(() => {});
    });
}

// Performance optimization: Reduce motion for users who prefer it
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
}

// Auto-progress feature (optional - uncomment to enable)
/*
let autoProgressTimer;
let autoProgressDelay = 5000; // 5 seconds

function startAutoProgress() {
    autoProgressTimer = setInterval(() => {
        if (window.cardSwiper && !window.cardSwiper.isTransitioning) {
            window.cardSwiper.nextCard();
        }
    }, autoProgressDelay);
}

function stopAutoProgress() {
    if (autoProgressTimer) {
        clearInterval(autoProgressTimer);
        autoProgressTimer = null;
    }
}

// Start auto-progress after a delay
setTimeout(startAutoProgress, 3000);

// Stop auto-progress on user interaction
['touchstart', 'mousedown', 'keydown'].forEach(event => {
    document.addEventListener(event, stopAutoProgress, { once: true });
});
*/

// Game Functions
function openGame() {
    document.getElementById('gameModal').classList.add('show');
    initGame();
}

function closeGame() {
    document.getElementById('gameModal').classList.remove('show');
    if (window.gameInstance) {
        window.gameInstance.stop();
    }
}

// Super Easy Glitch-Free Flappy Bird Game - PIXEL STYLE
class LoveBirdGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;

        // Enable pixel art rendering
        this.ctx.imageSmoothingEnabled = false;
        this.canvas.style.imageRendering = 'pixelated';
        
        // Game state
        this.isDestroyed = false;
        this.experience = 0; // No localStorage saving
        this.baseBirdSize = 25;
        this.birdSizeIncrease = 4; // Size increases by 4px per experience
        this.maxExperience = 6; // Cap at 6 experiences
        this.currentBirdSize = this.baseBirdSize;
        
        // Bird properties
        this.bird = { x: 80, y: 250, velocity: 0, size: this.currentBirdSize };
        this.pipes = [];
        this.score = 0;
        this.gameRunning = false;
        this.gameStarted = false;
        this.gameOver = false;
        
        // Super easy settings
        this.gravity = 0.4;
        this.jumpPower = -8;
        this.pipeWidth = 60;
        this.pipeGap = 250;
        this.pipeSpeed = 2.5;
        this.pipeFrequency = 350;
        this.animationId = null;
        
        // Timing controls
        this.lastPipeTime = 0;
        this.pipeInterval = 1800; // 1.8 seconds between pipes
        this.lastTime = 0;
        
        // Event handlers
        this.boundHandlers = {
            jump: this.jump.bind(this),
            handleTouch: this.handleTouch.bind(this),
            handleClick: this.handleClick.bind(this),
            handleKey: this.handleKey.bind(this)
        };
        
        // Load bird image
        this.birdImg = new Image();
        this.birdImg.src = 'flappybirdicon.png';
        this.birdImgLoaded = false;
        this.birdImg.onload = () => {
            if (!this.isDestroyed) {
                this.birdImgLoaded = true;
            }
        };
        this.birdImg.onerror = () => {
            this.birdImgLoaded = false;
        };
        
        this.init();
    }
    
    init() {
        if (this.isDestroyed) return;
        this.bindEvents();
        this.updateExperience();
        this.updateBirdSize();
        this.gameLoop();
    }

    bindEvents() {
        if (this.isDestroyed || !this.canvas) return;
        
        // Remove any existing listeners first
        this.removeEvents();
        
        // Mobile touch controls
        this.canvas.addEventListener('touchstart', this.boundHandlers.handleTouch, { passive: false });
        this.canvas.addEventListener('touchend', this.boundHandlers.handleTouch, { passive: false });
        this.canvas.addEventListener('touchmove', this.boundHandlers.handleTouch, { passive: false });
        
        // Desktop click
        this.canvas.addEventListener('click', this.boundHandlers.handleClick);
        
        // Keyboard
        document.addEventListener('keydown', this.boundHandlers.handleKey);
    }
    
    removeEvents() {
        if (!this.canvas) return;
        
        this.canvas.removeEventListener('touchstart', this.boundHandlers.handleTouch);
        this.canvas.removeEventListener('touchend', this.boundHandlers.handleTouch);
        this.canvas.removeEventListener('touchmove', this.boundHandlers.handleTouch);
        this.canvas.removeEventListener('click', this.boundHandlers.handleClick);
        document.removeEventListener('keydown', this.boundHandlers.handleKey);
    }
    
    handleTouch(e) {
        if (this.isDestroyed) return;
        e.preventDefault();
        if (e.type === 'touchstart') {
            this.jump();
        }
    }
    
    handleClick(e) {
        if (this.isDestroyed) return;
        e.preventDefault();
        this.jump();
    }
    
    handleKey(e) {
        if (this.isDestroyed) return;
        if (e.code === 'Space' && document.getElementById('gameModal')?.classList.contains('show')) {
            e.preventDefault();
            this.jump();
        }
    }

    jump() {
        if (this.isDestroyed || this.gameOver) return;
        
        if (!this.gameStarted) {
            this.start();
        } else if (this.gameRunning) {
            this.bird.velocity = this.jumpPower;
        }
    }

    start() {
        if (this.isDestroyed) return;
        
        this.gameStarted = true;
        this.gameRunning = true;
        this.gameOver = false;
        this.bird = { x: 80, y: this.canvas.height / 2, velocity: 0, size: this.currentBirdSize };
        this.pipes = [];
        this.score = 0;
        this.lastPipeTime = 0;
        this.lastTime = performance.now();
        this.showMessage('');
    }

    restart() {
        if (this.isDestroyed) return;
        
        setTimeout(() => {
            if (!this.isDestroyed) {
                this.gameStarted = false;
                this.gameRunning = false;
                this.gameOver = false;
                this.bird = { x: 80, y: this.canvas.height / 2, velocity: 0, size: this.currentBirdSize };
                this.pipes = [];
                this.score = 0;
                this.lastPipeTime = 0;
                this.showMessage('');
            }
        }, 100);
    }

    updateBirdSize() {
        if (this.experience < this.maxExperience) {
            this.currentBirdSize = this.baseBirdSize + (this.experience * this.birdSizeIncrease);
        } else {
            this.currentBirdSize = this.baseBirdSize + (this.maxExperience * this.birdSizeIncrease);
        }
        
        if (this.bird) {
            this.bird.size = this.currentBirdSize;
        }
    }

    stop() {
        this.isDestroyed = true;
        this.gameRunning = false;
        this.gameStarted = false;
        this.gameOver = true;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        this.removeEvents();
    }

    addPipe(currentTime) {
        if (this.isDestroyed || !this.gameRunning) return;
        
        const minGapY = 80;
        const maxGapY = this.canvas.height - this.pipeGap - 80;
        const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
        
        this.pipes.push({
            x: this.canvas.width,
            topHeight: gapY,
            bottomY: gapY + this.pipeGap,
            passed: false,
            id: currentTime // Unique identifier
        });
        
        this.lastPipeTime = currentTime;
    }

    update(currentTime) {
        if (this.isDestroyed || !this.gameRunning || this.gameOver) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Update bird physics with frame-rate independent movement
        this.bird.velocity += this.gravity;
        this.bird.y += this.bird.velocity;

        // Add pipes with time-based spawning
        if (this.pipes.length === 0 || (currentTime - this.lastPipeTime) > this.pipeInterval) {
            this.addPipe(currentTime);
        }

        // Update pipes
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            if (!pipe) continue;
            
            pipe.x -= this.pipeSpeed;

            // Check for score (only once per pipe)
            if (!pipe.passed && pipe.x + this.pipeWidth < this.bird.x) {
                pipe.passed = true;
                this.score++;
            }

            // Remove off-screen pipes
            if (pipe.x + this.pipeWidth < -50) {
                this.pipes.splice(i, 1);
            }
        }

        // Check collisions
        this.checkCollisions();
    }

    checkCollisions() {
        if (this.isDestroyed || !this.gameRunning || this.gameOver) return;
        
        const birdLeft = this.bird.x;
        const birdRight = this.bird.x + this.bird.size;
        const birdTop = this.bird.y;
        const birdBottom = this.bird.y + this.bird.size;

        // Ground and ceiling collision with some margin
        if (birdTop <= 5 || birdBottom >= this.canvas.height - 5) {
            this.crash();
            return;
        }

        // Pipe collision with more forgiving hitbox
        for (const pipe of this.pipes) {
            if (!pipe) continue;
            
            const margin = 2; // Small margin for easier gameplay
            
            // Check if bird is horizontally aligned with pipe
            if (birdRight > pipe.x + margin && birdLeft < pipe.x + this.pipeWidth - margin) {
                // Check if bird hits top or bottom pipe
                if (birdTop < pipe.topHeight - margin || birdBottom > pipe.bottomY + margin) {
                    this.crash();
                    return;
                }
            }
        }
    }

    crash() {
        if (this.isDestroyed || this.gameOver) return;
        
        this.gameRunning = false;
        this.gameOver = true;
        
        // Only increase experience up to max limit
        if (this.experience < this.maxExperience) {
            this.experience++;
            this.updateBirdSize();
        }
        
        this.updateExperience();
        this.showMessage('');
        
        // Auto restart after 1 second
        setTimeout(() => {
            if (!this.isDestroyed) {
                this.restart();
            }
        }, 1000);
    }

    updateExperience() {
        document.getElementById('expCount').textContent = this.experience;
    }

    showMessage(message) {
        const messageEl = document.getElementById('gameMessage');
        messageEl.textContent = message;
        if (message) {
            messageEl.style.animation = 'none';
            setTimeout(() => {
                messageEl.style.animation = 'messageGlow 0.5s ease-in-out';
            }, 10);
        }
    }

    render() {
        if (this.isDestroyed || !this.ctx) return;

        try {
            // Pixel art brown background to match theme
            this.ctx.fillStyle = '#3d2410';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Add pixel stars/dots (simple rectangles)
            this.ctx.fillStyle = '#ffd700';
            const starPositions = [
                {x: 50, y: 40}, {x: 150, y: 80}, {x: 280, y: 50},
                {x: 120, y: 350}, {x: 220, y: 380}, {x: 320, y: 100},
                {x: 80, y: 200}, {x: 250, y: 250}
            ];
            starPositions.forEach(star => {
                this.ctx.fillRect(star.x, star.y, 4, 4);
                this.ctx.fillRect(star.x + 8, star.y + 12, 4, 4);
            });

            // Draw pipes in pixel style - gold/brown theme
            for (const pipe of this.pipes) {
                if (!pipe) continue;

                // Main pipe body - dark gold
                this.ctx.fillStyle = '#b8860b';

                // Top pipe
                this.ctx.fillRect(Math.floor(pipe.x), 0, this.pipeWidth, Math.floor(pipe.topHeight));

                // Top pipe cap (slightly wider) - bright gold
                this.ctx.fillStyle = '#ffd700';
                this.ctx.fillRect(Math.floor(pipe.x - 4), Math.floor(pipe.topHeight - 16), this.pipeWidth + 8, 16);

                // Bottom pipe
                this.ctx.fillStyle = '#b8860b';
                this.ctx.fillRect(Math.floor(pipe.x), Math.floor(pipe.bottomY), this.pipeWidth, this.canvas.height - Math.floor(pipe.bottomY));

                // Bottom pipe cap
                this.ctx.fillStyle = '#ffd700';
                this.ctx.fillRect(Math.floor(pipe.x - 4), Math.floor(pipe.bottomY), this.pipeWidth + 8, 16);

                // Pixel border - dark outline
                this.ctx.strokeStyle = '#1a0f05';
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(Math.floor(pipe.x), 0, this.pipeWidth, Math.floor(pipe.topHeight));
                this.ctx.strokeRect(Math.floor(pipe.x), Math.floor(pipe.bottomY), this.pipeWidth, this.canvas.height - Math.floor(pipe.bottomY));
            }

            // Draw bird in pixel style
            const birdX = Math.floor(this.bird.x);
            const birdY = Math.floor(this.bird.y);

            if (this.birdImgLoaded && this.birdImg.complete) {
                this.ctx.save();

                // No rotation - keep it pixel perfect
                this.ctx.imageSmoothingEnabled = false;

                // Draw the bird image as a square (no circular clipping for pixel art)
                this.ctx.drawImage(
                    this.birdImg,
                    birdX,
                    birdY,
                    this.bird.size,
                    this.bird.size
                );

                this.ctx.restore();
            } else {
                // Fallback pixel bird - bright gold
                this.ctx.fillStyle = '#ffd700';
                this.ctx.fillRect(birdX, birdY, this.bird.size, this.bird.size);

                // Eye
                this.ctx.fillStyle = '#1a0f05';
                this.ctx.fillRect(birdX + this.bird.size - 8, birdY + 6, 4, 4);

                // Wing
                this.ctx.fillStyle = '#ffe066';
                this.ctx.fillRect(birdX + 4, birdY + this.bird.size/2, 8, 6);

                // Pixel border
                this.ctx.strokeStyle = '#1a0f05';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(birdX, birdY, this.bird.size, this.bird.size);
            }

            // Pixel art ground - darker brown
            this.ctx.fillStyle = '#2a1a0a';
            this.ctx.fillRect(0, this.canvas.height - 24, this.canvas.width, 24);

            // Ground pattern - gold highlights
            this.ctx.fillStyle = '#ffd700';
            for (let i = 0; i < this.canvas.width; i += 16) {
                this.ctx.fillRect(i, this.canvas.height - 24, 4, 4);
                this.ctx.fillRect(i + 8, this.canvas.height - 16, 4, 4);
            }

            // Top border line
            this.ctx.fillStyle = '#ffd700';
            this.ctx.fillRect(0, this.canvas.height - 24, this.canvas.width, 2);

            // Scanline effect for retro look
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
            for (let y = 0; y < this.canvas.height; y += 4) {
                this.ctx.fillRect(0, y, this.canvas.width, 2);
            }

            // Draw score in pixel font style - gold
            this.ctx.fillStyle = '#ffd700';
            this.ctx.strokeStyle = '#1a0f05';
            this.ctx.lineWidth = 4;
            this.ctx.font = 'bold 24px "Press Start 2P", monospace';
            this.ctx.textAlign = 'left';
            this.ctx.strokeText(`${this.score}`, 15, 35);
            this.ctx.fillText(`${this.score}`, 15, 35);

            // Draw start message if not started
            if (!this.gameStarted) {
                this.ctx.fillStyle = '#ffd700';
                this.ctx.strokeStyle = '#1a0f05';
                this.ctx.lineWidth = 5;
                this.ctx.font = 'bold 14px "Press Start 2P", monospace';
                this.ctx.textAlign = 'center';
                const msg = 'TAP TO START';
                this.ctx.strokeText(msg, this.canvas.width/2, this.canvas.height/2);
                this.ctx.fillText(msg, this.canvas.width/2, this.canvas.height/2);
            }
        } catch (error) {
        }
    }

    gameLoop() {
        if (this.isDestroyed) return;
        
        const currentTime = performance.now();
        
        this.update(currentTime);
        this.render();
        
        if (!this.isDestroyed) {
            this.animationId = requestAnimationFrame(() => this.gameLoop());
        }
    }
}

function initGame() {
    if (window.gameInstance) {
        window.gameInstance.stop();
    }
    window.gameInstance = new LoveBirdGame();
}