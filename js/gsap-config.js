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
        hoverDuration: 0.3,
        hoverEase: 'power2.out',
        hoverLift: -8,          // pixels to lift on hover
        hoverScale: 1.02,
        hoverShadow: '0 20px 60px rgba(0,0,0,0.15)',
        staggerAmount: 0.8,      // total time for stagger animation
        staggerFrom: 'start',
        revealDuration: 0.5,
        revealY: 40
    },

    // Modal Animations
    modal: {
        openDuration: 0.6,
        closeDuration: 0.3,
        backdropFade: 0.3,
        contentScale: { from: 0.8, to: 1 },
        contentY: 50,
        stagger: 0.08,
        ease: {
            open: 'back.out(1.2)',
            close: 'power2.in'
        }
    },

    // Filter Transitions
    filters: {
        fadeOutDuration: 0.2,
        fadeInDuration: 0.4,
        fadeOutScale: 0.95,
        staggerAmount: 0.5,
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
