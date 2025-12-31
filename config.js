/*
 * ═══════════════════════════════════════════════════════════
 * CONFIGURATION FILE - Edit these values to customize
 * ═══════════════════════════════════════════════════════════
 */

const GAME_CONFIG = {
    // ═══════════════════════════════════════════════════════
    // COUNTDOWN SETTINGS
    // ═══════════════════════════════════════════════════════

    // Set to false to DISABLE countdown and show secret cards immediately
    // Set to true to ENABLE countdown (cards hidden until timer ends)
    COUNTDOWN_ENABLED: true,

    // Countdown timer - Set your target date here
    // Format: 'YYYY-MM-DD HH:MM:SS' (24-hour format)
    // Example: '2026-01-03 00:00:00' for January 3rd, 2026 at midnight
    COUNTDOWN_DATE: '2026-01-03 00:00:00',

    // ═══════════════════════════════════════════════════════
    // SECRET CODE SETTINGS
    // ═══════════════════════════════════════════════════════

    // Secret code to unlock final cards after countdown ends
    // Can be letters, numbers, or both (case-insensitive when checking)
    // Example: 'LOVE2025', 'ILOVEYOU', 'OURDAY'
    SECRET_CODE: 'LOVE2026',

    // ═══════════════════════════════════════════════════════
    // MESSAGES
    // ═══════════════════════════════════════════════════════
    WIN_MESSAGE: 'You won the prize! 🎉',
    COUNTDOWN_TITLE: 'Your prize will be revealed in:',
    CODE_PROMPT: 'Enter the secret code to unlock your surprise:',
    WRONG_CODE_MESSAGE: 'Wrong code! Try again 💝',

    // ═══════════════════════════════════════════════════════
    // GAME SETTINGS
    // ═══════════════════════════════════════════════════════
    GLOW_INTERVAL: 15000, // Time in milliseconds (15000 = 15 seconds)
};
