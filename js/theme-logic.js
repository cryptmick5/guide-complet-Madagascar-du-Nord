
/* ============================================
   8. THEME MANAGER (Dark/Light)
   ============================================ */
window.initTheme = function () {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;

    // 1. Check Storage or System Preference
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let currentTheme = savedTheme || (systemDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateIcon(currentTheme);

    // 2. Event Listener
    toggleBtn.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });

    function updateIcon(theme) {
        toggleBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}
