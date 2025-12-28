/* ═══════════════════════════════════════════════════════════
 * MAIN LOGIC CORE
 * ═══════════════════════════════════════════════════════════ */

let activeSwiper = null;
let gameInstance = null;
let timerInterval = null;

// --- 1. PIN CHECK ---
function checkPin() {
    const input = document.getElementById('pinInput');
    if(input.value === CONFIG.MAIN_PIN) {
        document.getElementById('lockScreen').classList.add('hidden');
        document.getElementById('galleryView').classList.remove('hidden');
    } else {
        input.style.borderColor = 'red';
        setTimeout(() => input.style.borderColor = '', 500);
        input.value = '';
    }
}

// --- 2. NAVIGATION ---
function openCollection(type) {
    document.getElementById('galleryView').classList.add('hidden');
    const id = type === 'august' ? 'augustCollection' : 'christmasCollection';
    const el = document.getElementById(id);
    el.classList.remove('hidden');
    
    setTimeout(() => {
        activeSwiper = new CardSwiper(el.querySelector('.swiper-container'));
        
        // If Christmas, check if Game was already won to show Timer directly
        if(type === 'christmas' && localStorage.getItem('clawGameWon') === 'true') {
           // We let the swiper load, but logic in HTML will hide Game Card based on class toggle if needed
           // For now, user swipes to Game Card, we will handle "Already Won" in the Game Card logic below
           setupPostGameView();
        }
    }, 100);
}

function backToGallery() {
    document.querySelectorAll('.card-collection').forEach(e => e.classList.add('hidden'));
    document.getElementById('galleryView').classList.remove('hidden');
    if(timerInterval) clearInterval(timerInterval);
}

// --- 3. SWIPER CLASS ---
class CardSwiper {
    constructor(container) {
        this.container = container;
        this.wrapper = container.querySelector('.card-wrapper');
        this.cards = Array.from(this.wrapper.querySelectorAll('.card:not(.hidden)'));
        this.index = 0;
        this.isAnim = false;
        this.update();
    }
    
    update() {
        this.cards.forEach(c => c.classList.remove('active', 'prev', 'next'));
        if(this.cards[this.index]) this.cards[this.index].classList.add('active');
        const prev = (this.index - 1 + this.cards.length) % this.cards.length;
        const next = (this.index + 1) % this.cards.length;
        this.cards[prev].classList.add('prev');
        this.cards[next].classList.add('next');
    }

    move(dir) {
        if(this.isAnim) return;
        this.isAnim = true;
        
        // Prevent moving past Game Card if not won
        const currentCard = this.cards[this.index];
        if(currentCard.id === 'gameCard' && dir === 1 && localStorage.getItem('clawGameWon') !== 'true') {
            alert("You must win the prize to continue!");
            this.isAnim = false;
            return;
        }

        let nextIndex = this.index + dir;
        if(nextIndex < 0) nextIndex = this.cards.length - 1;
        if(nextIndex >= this.cards.length) nextIndex = 0;
        
        this.index = nextIndex;
        this.update();
        setTimeout(() => this.isAnim = false, 400);
    }
    
    refresh() {
        this.cards = Array.from(this.wrapper.querySelectorAll('.card:not(.hidden)'));
        this.update();
    }
}

function nextCard() { if(activeSwiper) activeSwiper.move(1); }
function prevCard() { if(activeSwiper) activeSwiper.move(-1); }

// --- 4. CLAW MACHINE GAME ---
function openGame() {
    if(localStorage.getItem('clawGameWon') === 'true') {
        setupPostGameView(); // Skip game if won
        return;
    }
    document.getElementById('gameModal').classList.remove('hidden');
    gameInstance = new ClawGame('gameCanvas', onGameWin);
}

function closeGame() {
    document.getElementById('gameModal').classList.add('hidden');
    if(gameInstance) gameInstance.stop();
}

class ClawGame {
    constructor(id, onWin) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.onWin = onWin;
        this.width = 300; this.height = 400;
        this.canvas.width = this.width; this.canvas.height = this.height;
        this.claw = { x: 150, y: 40, state: 'IDLE' }; 
        this.toys = [];
        this.caught = null;
        this.running = true;
        this.initToys();
        this.loop();
        
        this.canvas.onclick = () => { if(this.claw.state==='IDLE') this.claw.state='DROP'; };
    }
    
    initToys() {
        // Create random toys, one is the GLOWING TARGET (Gold)
        for(let i=0; i<6; i++) {
            this.toys.push({
                x: 40 + Math.random()*220, y: 360,
                color: i===0 ? '#ffd700' : `hsl(${Math.random()*360}, 60%, 50%)`, // First one is Gold
                isTarget: i===0,
                size: 25
            });
        }
    }
    
    stop() { this.running = false; }
    
    loop() {
        if(!this.running) return;
        this.update(); this.draw(); requestAnimationFrame(()=>this.loop());
    }
    
    update() {
        if(this.claw.state === 'IDLE') {
            this.claw.x = 150 + Math.sin(Date.now()/500) * 120; // Swing
        } else if(this.claw.state === 'DROP') {
            this.claw.y += CONFIG.CLAW_SPEED;
            if(this.claw.y > 330) this.claw.state = 'RETRACT';
            // Collision
            this.toys.forEach((t,i) => {
                if(Math.abs(t.x - this.claw.x) < 20 && Math.abs(t.y - this.claw.y) < 20 && !this.caught) {
                    if(Math.random() < CONFIG.WIN_CHANCE) {
                        this.caught = t; this.toys.splice(i,1);
                        this.claw.state = 'RETRACT';
                    }
                }
            });
        } else if(this.claw.state === 'RETRACT') {
            this.claw.y -= CONFIG.CLAW_SPEED;
            if(this.caught) { this.caught.x = this.claw.x; this.caught.y = this.claw.y + 20; }
            if(this.claw.y <= 40) {
                this.claw.state = 'IDLE';
                if(this.caught) {
                    if(this.caught.isTarget) {
                        this.running = false;
                        setTimeout(this.onWin, 500);
                    } else {
                        // Caught wrong toy, drop it and continue
                        this.caught = null; 
                        alert("You caught a toy, but not the glowing one! Try again.");
                    }
                }
            }
        }
    }
    
    draw() {
        this.ctx.fillStyle = '#222'; this.ctx.fillRect(0,0,this.width,this.height);
        this.ctx.fillStyle = '#444'; this.ctx.fillRect(0,350,this.width,50);
        
        // Toys
        [...this.toys, this.caught].forEach(t => {
            if(!t) return;
            this.ctx.fillStyle = t.color;
            if(t.isTarget) {
                 this.ctx.shadowBlur = 15; this.ctx.shadowColor = '#fff'; 
                 this.ctx.fillStyle = '#fff'; // Glowing look
            }
            this.ctx.fillRect(t.x-10, t.y-10, 20, 20);
            this.ctx.shadowBlur = 0;
            // Restore color for non-shadow drawing if needed, but fillStyle handles it
            if(t.isTarget) this.ctx.fillStyle = '#ffd700';
            this.ctx.fillRect(t.x-8, t.y-8, 16, 16);
        });
        
        // Claw
        this.ctx.strokeStyle = '#aaa'; this.ctx.beginPath();
        this.ctx.moveTo(this.claw.x, 0); this.ctx.lineTo(this.claw.x, this.claw.y); this.ctx.stroke();
        this.ctx.fillStyle = '#888'; this.ctx.fillRect(this.claw.x-15, this.claw.y, 30, 10);
    }
}

function onGameWin() {
    closeGame();
    localStorage.setItem('clawGameWon', 'true');
    alert("You caught the Glowing Prize! Proceed to the Timer.");
    setupPostGameView();
}

// --- 5. TIMER & CODE LOGIC ---
function setupPostGameView() {
    // Hide Game Card, Show Timer Card
    document.getElementById('gameCard').classList.add('hidden');
    document.getElementById('timerCard').classList.remove('hidden');
    if(activeSwiper) activeSwiper.refresh();
    
    startTimer();
}

function startTimer() {
    const display = document.getElementById('timerDisplay');
    const inputArea = document.getElementById('codeInputArea');
    const target = new Date(CONFIG.UNLOCK_DATE).getTime();
    
    if(timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const diff = target - now;
        
        if(diff <= 0) {
            clearInterval(timerInterval);
            display.innerHTML = "TIME'S UP!";
            inputArea.classList.remove('hidden'); // Show Code Input
        } else {
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            display.innerHTML = `${h}h ${m}m ${s}s`;
            inputArea.classList.add('hidden');
        }
    }, 1000);
}

function checkSecretCode() {
    const val = document.getElementById('secretCodeInput').value;
    if(val === CONFIG.SECRET_CODE) {
        unlockHiddenSequence();
    } else {
        const btn = document.querySelector('#codeInputArea button');
        btn.innerText = "WRONG!";
        btn.style.background = "red";
        setTimeout(() => { btn.innerText = "UNLOCK"; btn.style.background = ""; }, 1000);
    }
}

function unlockHiddenSequence() {
    // Hide Timer Card
    document.getElementById('timerCard').classList.add('hidden');
    
    // Reveal all hidden content cards
    document.querySelectorAll('.locked-content').forEach(el => el.classList.remove('hidden'));
    
    // Refresh Swiper and move to first unlocked card
    if(activeSwiper) {
        activeSwiper.refresh();
        activeSwiper.move(1); // Auto move to next
    }
}