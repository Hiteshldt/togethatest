// Anniversary Card Swiper
class CuteCardSwiper {
    constructor() {
        this.currentCard = 1;
        this.totalCards = 12;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.minSwipeDistance = 50;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateCardPositions();
        this.updateDots();
        this.preloadImages();
    }
    
    bindEvents() {
        // Touch events for swipe functionality
        const cardWrapper = document.querySelector('.card-wrapper');
        cardWrapper.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        cardWrapper.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        
        // Mouse events for desktop dragging
        cardWrapper.addEventListener('mousedown', this.handleMouseDown.bind(this));
        cardWrapper.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        
        // Navigation buttons
        document.querySelector('.prev-btn').addEventListener('click', () => this.previousCard());
        document.querySelector('.next-btn').addEventListener('click', () => this.nextCard());
        
        // Dot navigation
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToCard(index + 1));
        });
        
        // Prevent context menu on long touch
        cardWrapper.addEventListener('contextmenu', (e) => e.preventDefault());
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
        
        this.hideSwipeHint();
        
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
        
        if (this.currentCard > 1) {
            this.goToCard(this.currentCard - 1);
        } else {
            // Loop to last card
            this.goToCard(this.totalCards);
        }
    }
    
    goToCard(cardNumber) {
        if (this.isTransitioning || cardNumber === this.currentCard) return;
        
        this.hideSwipeHint();
        this.isTransitioning = true;
        this.currentCard = cardNumber;
        
        this.updateCardPositions();
        this.updateDots();
        this.addCuteEffects();
        
        // Reset transition lock after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
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
        const cards = document.querySelectorAll('.card');
        console.log(`Updating card positions. Current card: ${this.currentCard}, Total cards found: ${cards.length}`);
        
        cards.forEach((card, index) => {
            const cardNumber = index + 1;
            card.classList.remove('active', 'prev', 'next');
            
            if (cardNumber === this.currentCard) {
                card.classList.add('active');
                console.log(`Card ${cardNumber} set as active`);
            } else if (cardNumber < this.currentCard) {
                card.classList.add('prev');
            } else {
                card.classList.add('next');
            }
        });
    }
    
    updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === this.currentCard);
        });
    }
    
    addCuteEffects() {
        // Add sparkle effect when changing cards
        this.createSparkles();
        
        // Add gentle vibration on mobile (if supported)
        if ('vibrate' in navigator && window.innerWidth <= 768) {
            navigator.vibrate(50);
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
    }
}

function previousCard() {
    if (window.cardSwiper) {
        window.cardSwiper.previousCard();
    }
}

function currentCard(cardNumber) {
    if (window.cardSwiper) {
        window.cardSwiper.goToCard(cardNumber);
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
    
    // Initialize the swiper
    window.cardSwiper = new CuteCardSwiper();
    
    // Force first card to be visible as fallback
    setTimeout(() => {
        const firstCard = document.querySelector('.card:first-child');
        if (firstCard && !firstCard.classList.contains('active')) {
            firstCard.classList.add('active');
            console.log('First card made active as fallback');
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
                this.play().catch(console.error);
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
        console.log('💕 Welcome to your cute anniversary website! 💕');
        console.log('✨ Swipe, click, or use arrow keys to navigate ✨');
    }, 1000);
});

// Add service worker registration for offline capability (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Only register service worker if the file exists
        fetch('/sw.js', { method: 'HEAD' })
            .then(() => {
                navigator.serviceWorker.register('/sw.js')
                    .then(() => console.log('🌟 Offline support enabled'))
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

// Super Easy Glitch-Free Flappy Bird Game
class LoveBirdGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;
        
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
            // Clear canvas with sky gradient
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, '#e6f3ff');
            gradient.addColorStop(1, '#f0f8ff');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw pipes first (behind bird)
            this.ctx.fillStyle = '#c19a6b';
            this.ctx.strokeStyle = '#8b7355';
            this.ctx.lineWidth = 2;
            
            for (const pipe of this.pipes) {
                if (!pipe) continue;
                
                // Top pipe
                this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);
                this.ctx.strokeRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);
                
                // Bottom pipe
                this.ctx.fillRect(pipe.x, pipe.bottomY, this.pipeWidth, this.canvas.height - pipe.bottomY);
                this.ctx.strokeRect(pipe.x, pipe.bottomY, this.pipeWidth, this.canvas.height - pipe.bottomY);
            }

            // Draw bird
            if (this.birdImgLoaded && this.birdImg.complete) {
                this.ctx.save();
                this.ctx.translate(this.bird.x + this.bird.size/2, this.bird.y + this.bird.size/2);
                
                // Subtle rotation based on velocity
                const rotation = Math.min(Math.max(this.bird.velocity * 0.05, -0.3), 0.3);
                this.ctx.rotate(rotation);
                
                // Draw bird image with circular clipping
                this.ctx.beginPath();
                this.ctx.arc(0, 0, this.bird.size/2, 0, Math.PI * 2);
                this.ctx.clip();
                
                // Draw the actual bird image
                this.ctx.drawImage(
                    this.birdImg, 
                    -this.bird.size/2, 
                    -this.bird.size/2, 
                    this.bird.size, 
                    this.bird.size
                );
                
                this.ctx.restore();
            } else {
                // Fallback circle
                this.ctx.fillStyle = '#ff69b4';
                this.ctx.beginPath();
                this.ctx.arc(
                    this.bird.x + this.bird.size/2, 
                    this.bird.y + this.bird.size/2, 
                    this.bird.size/2, 
                    0, 
                    Math.PI * 2
                );
                this.ctx.fill();
            }

            // Draw only score
            this.ctx.fillStyle = '#8b7355';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`Score: ${this.score}`, 15, 30);
        } catch (error) {
            console.warn('Render error:', error);
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