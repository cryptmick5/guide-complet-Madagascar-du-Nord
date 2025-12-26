
/* THEME LOGIC - ROBUSTE */
document.addEventListener('DOMContentLoaded', () => {
    console.log("🌓 Init Thème...");
    const themeBtn = document.getElementById('theme-toggle') || document.querySelector('.theme-btn');
    const body = document.body;
    
    // 1. Charger la préférence
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if(themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // 2. Gestion du Click
    if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            body.classList.toggle('dark-mode');
            
            // Sauvegarde et Icône
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                localStorage.setItem('theme', 'light');
                themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
        console.log("✅ Bouton Thème connecté.");
    } else {
        console.warn("❌ Bouton Thème introuvable (ID='theme-toggle' ou class='theme-btn').");
    }
});
