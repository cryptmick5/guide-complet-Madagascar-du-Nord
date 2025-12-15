
css_content = """
:root {
    --primary-color: #e67e22;
    --secondary-color: #27ae60;
    --accent-color: #d35400;
    --text-primary: #2c3e50;
    --text-secondary: #7f8c8d;
    --bg-body: #fdfbf7;
    --bg-card: #ffffff;
    --border-color: rgba(0,0,0,0.1);
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.05);
    --shadow-md: 0 8px 24px rgba(0,0,0,0.12);
    --font-heading: 'Playfair Display', serif;
    --font-body: 'Inter', sans-serif;
    --safe-area-inset-bottom: env(safe-area-inset-bottom);
}

[data-theme="dark"] {
    --text-primary: #ecf0f1;
    --text-secondary: #bdc3c7;
    --bg-body: #121212;
    --bg-card: #1e1e1e;
    --border-color: rgba(255,255,255,0.1);
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
    --shadow-md: 0 8px 24px rgba(0,0,0,0.5);
}

body {
    background-color: var(--bg-body);
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
    transition: background-color 0.3s ease, color 0.3s ease;
}

h1, h2, h3, h4 { font-family: var(--font-heading); font-weight: 700; }

.lieu-card {
    background: var(--bg-card);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid var(--border-color);
}

.lieu-info { padding: 16px; }
.lieu-title { font-size: 1.1rem; color: var(--text-primary); margin: 0 0 4px 0; }
.lieu-meta { font-size: 0.9rem; color: var(--text-secondary); display: flex; justify-content: space-between; }

#global-search-results {
    position: fixed; top: 70px; left: 20px; right: 20px; z-index: 10000 !important;
    background-color: var(--bg-card) !important; color: var(--text-primary) !important;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5); border-radius: 12px;
    max-height: 60vh; overflow-y: auto; border: 1px solid var(--primary-color);
}

.search-result-item { padding: 12px 16px; border-bottom: 1px solid var(--border-color); }
.search-result-item:hover { background-color: rgba(230, 126, 34, 0.1); }

.nav-pill { background: var(--bg-card); color: var(--text-secondary); border: 1px solid var(--border-color); padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; }
.nav-pill.active { background: var(--primary-color); color: white; border-color: var(--primary-color); }

.map-filter-btn { background: var(--bg-card) !important; color: var(--text-primary) !important; box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important; }
.map-filter-btn.active { background: var(--primary-color) !important; color: white !important; }

.province-card { height: 200px; border-radius: 16px; overflow: hidden; position: relative; box-shadow: 0 4px 10px rgba(0,0,0,0.15); cursor: pointer; transition: transform 0.3s ease; }
.province-card:hover { transform: translateY(-5px); }
.province-card .card-bg { width: 100%; height: 100%; background-size: cover; background-position: center; transition: transform 0.5s ease; }
.province-card:hover .card-bg { transform: scale(1.05); }
.province-card .card-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); padding: 20px 12px 12px; }
.province-card .card-title { font-family: var(--font-heading); font-size: 1.3rem; color: white; }
.province-card .card-subtitle { font-family: var(--font-body); font-size: 0.85rem; color: rgba(255,255,255,0.9); }

.modal-content { background: var(--bg-card); color: var(--text-primary); }
.close-modal { color: var(--text-primary); background: rgba(0,0,0,0.05); }
"""

with open("css/styles-premium.css", "w", encoding="utf-8") as f:
    f.write(css_content.strip())

print("CSS Fixed via Python.")
