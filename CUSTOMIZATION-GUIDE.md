# 🎄 Anniversary Website - Customization Guide 🎄

## Table of Contents
1. [Quick Start](#quick-start)
2. [Customizing Text](#customizing-text)
3. [Adding Media (Images & Videos)](#adding-media)
4. [Customizing Games](#customizing-games)
5. [Timer & Code Lock](#timer--code-lock)
6. [File Structure](#file-structure)

---

## Quick Start

### Changing the PIN Code
**File:** `index.html`
**Line:** Search for `pin === '2266'`

```javascript
if (pin === '2266') {  // Change '2266' to your desired PIN
```

### Changing Names
**File:** `index.html`
**Line:** Search for "doiodoi and hitesh"

---

## Customizing Text

### Editing Card Text

**File:** `index.html`

All card text can be found in the HTML file. Look for `<p class="card-text">`:

```html
<p class="card-text">Your custom message here</p>
```

### Examples of Text Cards:

#### August Collection (Line ~150-210):
```html
<div class="card">
    <div class="card-content">
        <p class="card-text">Your romantic message here 💕</p>
    </div>
</div>
```

#### Christmas Collection (Line ~227-450):
```html
<div class="card christmas-themed">
    <div class="card-content">
        <p class="card-text">Your Christmas message here 🎄</p>
    </div>
</div>
```

---

## Adding Media

### Adding Images

1. **Add your image file** to the project folder (same location as index.html)
2. **Use the image in a card:**

```html
<div class="card christmas-themed">
    <div class="card-content">
        <div class="image-container">
            <img src="your-image.jpg" alt="Description" class="card-image">
        </div>
    </div>
</div>
```

### Adding Videos

```html
<div class="card christmas-themed">
    <div class="card-content">
        <div class="video-container">
            <video controls loop preload="metadata" class="card-video">
                <source src="your-video.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
    </div>
</div>
```

### Adding GIFs

```html
<div class="gif-decoration">
    <img src="your-gif.gif" class="cute-gif" alt="Animated">
</div>
```

### 2x2 Photo Grid

```html
<div class="photo-grid-2x2">
    <img src="photo1.jpg" class="grid-photo" alt="Memory 1">
    <img src="photo2.jpg" class="grid-photo" alt="Memory 2">
    <img src="photo3.jpg" class="grid-photo" alt="Memory 3">
    <img src="photo4.jpg" class="grid-photo" alt="Memory 4">
</div>
```

---

## Customizing Games

### Flappy Bird Game

**File:** `script.js` (Lines 722-1130)

**Change difficulty:**
```javascript
// Line ~748
this.gravity = 0.4;      // Lower = easier (bird falls slower)
this.jumpPower = -8;     // Higher = bird jumps higher
this.pipeGap = 250;      // Larger = easier (more space between pipes)
this.pipeSpeed = 2.5;    // Lower = easier (pipes move slower)
```

### Ornament Catching Game

**File:** `ornament-game.js`

**Change difficulty:**
```javascript
// Line ~23
this.targetScore = 10;           // Change number of ornaments to catch

// Line ~46
this.ornamentSpeed = 2;          // Lower = easier
this.ornamentInterval = 60;      // Higher = more time between ornaments
```

### Claw Machine Game

**File:** `claw-machine.js`

**Change glow interval:**
```javascript
// Line ~54
this.glowInterval = 15000;  // Time in milliseconds (15000 = 15 seconds)
```

**Change items/prizes:**
```javascript
// Line ~47-53
this.items = [
    { x: 50, y: 370, size: 30, emoji: '🎁', glowing: false, id: 1 },
    { x: 120, y: 370, size: 30, emoji: '🎀', glowing: false, id: 2 },
    // Add more items or change emojis here
];
```

---

## Timer & Code Lock

### Customizing the Timer

**File:** `ornament-game.js`
**Line:** 296

```javascript
// Format: 'YYYY-MM-DD HH:MM:SS' (24-hour format)
const targetDate = new Date('2024-12-25 00:00:00').getTime();
```

**Examples:**
- Christmas 2025: `'2025-12-25 00:00:00'`
- New Year 2026: `'2026-01-01 00:00:00'`
- Your Anniversary: `'2025-08-17 20:30:00'`
- Custom time: `'2025-06-15 14:00:00'` (June 15, 2025 at 2:00 PM)

### Customizing the Secret Code

**File:** `ornament-game.js`
**Line:** 350

```javascript
const secretCode = 'LOVE2025';  // Change to your desired code
```

**Tips:**
- Can be letters, numbers, or both
- Case-sensitive (LOVE2025 ≠ love2025)
- Examples: 'ILOVEYOU', 'OURDAY2025', 'FOREVER'

### Customizing the Error Message

**File:** `ornament-game.js`
**Line:** 380

```javascript
errorDisplay.textContent = 'code not correct love 💝';  // Your custom message
```

---

## File Structure

```
your-project/
├── index.html              # Main HTML file - edit text & add media here
├── style.css              # Main styles (pixel art theme)
├── christmas-styles.css   # Christmas theme (dark red/yellow colors)
├── script.js              # Main JavaScript (Flappy Bird game)
├── santa-game.js          # Santa runner game
├── ornament-game.js       # Ornament catching + timer + code lock
├── claw-machine.js        # Claw machine game
├── CUSTOMIZATION-GUIDE.md # This file
│
├── Images/                # Your image files
│   ├── 1.PNG
│   ├── 2.JPG
│   └── your-photo.jpg
│
├── Videos/                # Your video files
│   ├── video1.MP4
│   └── your-video.mp4
│
└── GIFs/                  # Your GIF files
    ├── totoro.gif
    ├── jiji-cat.gif
    └── your-gif.gif
```

---

## Common Tasks

### Adding a New Card

1. Open `index.html`
2. Find the card collection (August or Christmas)
3. Copy an existing card structure
4. Paste it where you want the new card
5. Customize the content

**Example:**
```html
<!-- New Card: Your Custom Card -->
<div class="card christmas-themed">
    <div class="card-content">
        <p class="card-text">Your message here! 💕</p>
        <div class="image-container">
            <img src="your-image.jpg" alt="Memory" class="card-image">
        </div>
    </div>
</div>
```

### Changing Collection Dates

**File:** `index.html`

**August Collection Header (Line ~36):**
```html
<h2 class="love-title">17-08-2025 💕</h2>
<p class="cast-text">Our First Anniversary</p>
```

**Christmas Collection Header (Line ~215):**
```html
<h2 class="love-title christmas-title">17-12-2025 🎄</h2>
<p class="cast-text">Merry Christmas, my love ❄️</p>
```

### Changing Gallery Cards

**File:** `index.html` (Lines ~170-195)

```html
<div class="gallery-card" onclick="openCardCollection('august')">
    <h3 class="gallery-card-date">17-08-2025</h3>
    <p class="gallery-card-subtitle">Our Anniversary</p>
    <div class="gallery-card-emoji">💕</div>
</div>
```

---

## Color Customization

### Christmas Collection Colors

**File:** `christmas-styles.css`

Current theme: Dark Red & Gold

**Main colors:**
```css
/* Dark background */
background: #1a0a0a;  /* Very dark (almost black) */
background: #2d0d0d;  /* Dark red */

/* Accent colors */
border: #8b0000;     /* Dark red */
color: #ffd700;      /* Gold/yellow */
```

**To change colors:**
1. Open `christmas-styles.css`
2. Search for color values (e.g., `#8b0000`)
3. Replace with your preferred colors

**Color suggestions:**
- Dark blue & silver: `#000033` & `#c0c0c0`
- Dark green & red: `#0d3d0d` & `#ff0000`
- Dark purple & pink: `#1a001a` & `#ff69b4`

### August Collection Colors

**File:** `style.css`

Current theme: Warm beige/brown

**Main colors:**
```css
background: #f5ebe0;   /* Beige */
border: #4a2c0f;       /* Dark brown */
color: #4a2c0f;        /* Dark brown text */
```

---

## Tips & Tricks

### Best Image Sizes
- **Card images:** 800x600px or similar aspect ratio
- **Background GIFs:** Small file size (< 1MB) for better performance
- **Videos:** 720p or 1080p, compressed to reduce file size

### Testing Your Changes
1. Save all files
2. Refresh your browser (Ctrl+F5 or Cmd+Shift+R)
3. Clear cache if changes don't appear

### Debugging
- Press F12 in browser to open Developer Tools
- Check Console tab for error messages
- Check if file paths are correct (case-sensitive!)

---

## Questions?

If you need help:
1. Check that file names match exactly (including .jpg vs .JPG)
2. Make sure files are in the same folder as index.html
3. Verify quotes and brackets are properly closed
4. Test in different browsers (Chrome, Firefox, Edge)

---

## Summary of Key Files to Edit

| What to Change | File to Edit | Approximate Line |
|----------------|--------------|------------------|
| PIN Code | index.html | ~9 |
| Card Text | index.html | Throughout |
| Add Images/Videos | index.html | Throughout |
| Timer Date | ornament-game.js | 296 |
| Secret Code | ornament-game.js | 350 |
| Game Difficulty | script.js | 748-753 |
| Colors (Christmas) | christmas-styles.css | Throughout |
| Colors (August) | style.css | Throughout |

---

**Enjoy customizing your romantic anniversary website! 💕🎄**
