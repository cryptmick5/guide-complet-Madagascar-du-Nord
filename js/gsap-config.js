/**
 * 🎬 GSAP CONFIGURATION
 * Global settings, easings, and constants for Gasikara Explorer animations
 */

// ==========================================
// GSAP GLOBAL DEFAULTS
// ==========================================
gsap.defaults({
    ease: 'power2.out',
    duration: 0.4,
    overwrite: 'auto'
});

// Register custom easing for Madagascar vibe
gsap.registerEase('madagascar', 'cubic-bezier(0.34, 1.56, 0.64, 1)');

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger, Flip);

// ==========================================
// ANIMATION CONSTANTS
// ==========================================
const GSAP_CONFIG = {
    // Card Animations
    cards: {
        hoverDuration: 0.25,     // Faster hover response
        hoverEase: 'power2.out',
        hoverLift: -8,          // pixels to lift on hover
        hoverScale: 1.02,
        hoverShadow: '0 20px 60px rgba(0,0,0,0.15)',
        staggerAmount: 0.3,      // REDUCED: 0.8s → 0.3s for faster reveals
        staggerFrom: 'start',
        revealDuration: 0.4,     // REDUCED: 0.5s → 0.4s
        revealY: 40
    },

    // Modal Animations
    modal: {
        openDuration: 0.35,      // REDUCED: 0.6s → 0.35s for snappier feel
        closeDuration: 0.25,     // REDUCED: 0.3s → 0.25s
        backdropFade: 0.2,       // REDUCED: 0.3s → 0.2s
        contentScale: { from: 0.9, to: 1 },  // REDUCED scale from 0.8 → 0.9 for subtler effect
        contentY: 30,            // REDUCED: 50px → 30px for less dramatic entrance
        stagger: 0.05,           // REDUCED: 0.08s → 0.05s
        ease: {
            open: 'power3.out',  // CHANGED: back.out → power3.out for smoother, faster feel
            close: 'power2.in'
        }
    },

    // Filter Transitions
    filters: {
        fadeOutDuration: 0.15,   // REDUCED: 0.2s → 0.15s
        fadeInDuration: 0.3,     // REDUCED: 0.4s → 0.3s
        fadeOutScale: 0.95,
        staggerAmount: 0.25,     // REDUCED: 0.5s → 0.25s (2x faster)
        staggerFrom: 'random',
        badgeBounce: 'back.out(1.1)'
    },

    // Micro-interactions
    buttons: {
        scalePulse: 1.05,
        duration: 0.2,
        ease: 'power2.out'
    },

    // Performance
    performance: {
        force3D: true,
        transformPerspective: 1000
    },

    // Accessibility
    reducedMotion: {
        enabled: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        timeScale: 0 // Disable animations if user prefers reduced motion
    }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Checks if animations should be disabled
 * @returns {boolean}
 */
function shouldReduceMotion() {
    return GSAP_CONFIG.reducedMotion.enabled;
}

/**
 * Gets animation duration with reduced motion fallback
 * @param {number} duration - Normal duration
 * @returns {number} - Duration (0 if reduced motion)
 */
function getDuration(duration) {
    return shouldReduceMotion() ? 0 : duration;
}

/**
 * Apply force 3D for GPU acceleration
 * @param {string} selector - CSS selector
 */
function applyForce3D(selector) {
    gsap.set(selector, {
        force3D: GSAP_CONFIG.performance.force3D,
        transformPerspective: GSAP_CONFIG.performance.transformPerspective
    });
}

// ==========================================
// EXPORT CONFIG
// ==========================================
window.GSAP_CONFIG = GSAP_CONFIG;
window.shouldReduceMotion = shouldReduceMotion;
window.getDuration = getDuration;
window.applyForce3D = applyForce3D;

console.log('🎬 GSAP Config loaded - Version 1.0');
