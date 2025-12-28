/* ═══════════════════════════════════════════════════════════
 * CONFIGURATION
 * ═══════════════════════════════════════════════════════════ */
const CONFIG = {
    // 1. MAIN PIN to enter the website
    MAIN_PIN: "2266",

    // 2. CHRISTMAS SECRET CODE (Unlocks the final letter)
    SECRET_CODE: "LOVE2026",

    // 3. TARGET DATE (When the countdown ends and code entry appears)
    // Format: YYYY-MM-DDTHH:MM:SS
    // To test the code input immediately, set this to a PAST date.
    // To test the timer, set this to a FUTURE date.
    UNLOCK_DATE: "2025-12-25T00:00:00", 

    // 4. CLAW GAME SETTINGS
    CLAW_SPEED: 3,         // Higher = Faster claw
    WIN_CHANCE: 0.6,       // 60% chance to grab if aligned correctly
};