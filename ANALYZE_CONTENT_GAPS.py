#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🎯 ANALYSE DE CONTENU PAR PROVINCE - 26/12/2025
Analyse détaillée de la répartition du contenu par province et budget
pour identifier les gaps et créer un plan d'enrichissement.
"""

import json
import re
from pathlib import Path
from collections import defaultdict

PROJECT_ROOT = Path(__file__).parent
LIEUX_FILE = PROJECT_ROOT / 'data' / 'lieux.js'

def load_lieux_data():
    """Charge les données depuis lieux.js"""
    with open(LIEUX_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    match = re.search(r'window\.LIEUX_DATA\s*=\s*(\[.*\]);', content, re.DOTALL)
    if not match:
        raise ValueError("Impossible de trouver window.LIEUX_DATA")
    
    return json.loads(match.group(1))

def analyze_content_distribution():
    """Analyse la répartition du contenu"""
    data = load_lieux_data()
    
    # Provinces principales
    provinces = {
        'Antananarivo': ['Antananarivo', 'Tana', 'Ampefy', 'Antsirabe'],
        'Antsiranana': ['Diego-Suarez', 'Antsiranana', 'Nosy Be', 'Ankarana', 'Sambava', 'Antalaha', 'Vohémar', 'Ambilobe', 'Anivorano', 'Ambanja', 'Ramena', 'Joffreville'],
        'Mahajanga': ['Mahajanga', 'Majunga'],
        'Toamasina': ['Toamasina', 'Tamatave', 'Andasibe', 'Sainte-Marie', 'Mananara'],
        'Fianarantsoa': ['Fianarantsoa', 'Fianar'],
        'Toliara': ['Toliara', 'Tuléar', 'Tulear', 'Isalo', 'Ifaty', 'Anakao']
    }
    
    # Catégories principales
    categories = ['manger', 'dormir', 'explorer', 'sortir', 'spots']
    budgets = ['budget_1', 'budget_2', 'budget_3']
    
    # Structure de données
    stats = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))
    
    # Analyser chaque lieu
    for lieu in data:
        ville = lieu.get('ville', 'Unknown')
        tags = lieu.get('tags', [])
        
        # Trouver la province
        province = 'Autre'
        for prov, villes in provinces.items():
            if ville in villes:
                province = prov
                break
        
        # Catégorie principale
        cat_tag = next((tag for tag in tags if tag in categories), 'autre')
        
        # Budget
        budget_tag = next((tag for tag in tags if tag in budgets), 'budget_1')
        budget_symbol = '€' if budget_tag == 'budget_1' else ('€€' if budget_tag == 'budget_2' else '€€€')
        
        # Compter
        stats[province][cat_tag][budget_symbol] += 1
        stats[province]['TOTAL']['ALL'] += 1
    
    return stats, provinces

def generate_enrichment_plan(stats, provinces):
    """Génère un plan d'enrichissement détaillé"""
    
    print("🎯 ANALYSE DE CONTENU PAR PROVINCE")
    print("=" * 100)
    
    categories = ['manger', 'dormir', 'explorer', 'sortir', 'spots']
    budgets = ['€', '€€', '€€€']
    
    gaps = []
    
    for province in sorted(provinces.keys()):
        print(f"\n📍 {province.upper()}")
        print("-" * 100)
        
        total = stats[province]['TOTAL']['ALL']
        print(f"   Total de fiches: {total}")
        
        # Tableau par catégorie et budget
        print(f"\n   {'Catégorie':<15} {'€':<8} {'€€':<8} {'€€€':<8} {'Total':<8}")
        print(f"   {'-'*15} {'-'*8} {'-'*8} {'-'*8} {'-'*8}")
        
        for cat in categories:
            count_1 = stats[province][cat]['€']
            count_2 = stats[province][cat]['€€']
            count_3 = stats[province][cat]['€€€']
            total_cat = count_1 + count_2 + count_3
            
            print(f"   {cat.capitalize():<15} {count_1:<8} {count_2:<8} {count_3:<8} {total_cat:<8}")
            
            # Identifier les gaps (moins de 5 par catégorie/budget)
            for budget in budgets:
                if budget == '€':
                    current_count = count_1
                elif budget == '€€':
                    current_count = count_2
                else:
                    current_count = count_3
                
                if current_count < 5:
                    gap = 5 - current_count
                    gaps.append({
                        'province': province,
                        'categorie': cat,
                        'budget': budget,
                        'current': current_count,
                        'needed': gap,
                        'priority': 'HAUTE' if current_count == 0 else 'MOYENNE'
                    })
    
    # Résumé des gaps
    print("\n" + "=" * 100)
    print("📊 RÉSUMÉ DES GAPS À COMBLER")
    print("=" * 100)
    
    total_needed = sum(g['needed'] for g in gaps)
    print(f"\n   Total de fiches à créer: {total_needed}")
    
    # Par priorité
    high_priority = [g for g in gaps if g['priority'] == 'HAUTE']
    medium_priority = [g for g in gaps if g['priority'] == 'MOYENNE']
    
    print(f"   • Priorité HAUTE (0 fiche): {len(high_priority)} gaps à combler")
    print(f"   • Priorité MOYENNE (<5 fiches): {len(medium_priority)} gaps à combler")
    
    # Détails par province
    print("\n📋 PLAN D'ENRICHISSEMENT DÉTAILLÉ:")
    print("-" * 100)
    
    by_province = defaultdict(list)
    for gap in gaps:
        by_province[gap['province']].append(gap)
    
    for province, province_gaps in sorted(by_province.items()):
        total_for_province = sum(g['needed'] for g in province_gaps)
        print(f"\n   {province} - {total_for_province} fiches à créer")
        
        for gap in sorted(province_gaps, key=lambda x: (x['priority'], x['categorie'])):
            priority_icon = '🔴' if gap['priority'] == 'HAUTE' else '🟡'
            print(f"      {priority_icon} {gap['categorie'].capitalize():<12} | {gap['budget']:<4} | Actuel: {gap['current']} → Besoin: +{gap['needed']}")
    
    # Sauvegarder le plan
    plan_file = PROJECT_ROOT / 'ENRICHMENT_PLAN.json'
    with open(plan_file, 'w', encoding='utf-8') as f:
        f.write(json.dumps({
            'date': '26/12/2025',
            'total_needed': total_needed,
            'gaps': gaps,
            'by_province': {k: len(v) for k, v in by_province.items()}
        }, indent=2, ensure_ascii=False))
    
    print(f"\n✅ Plan détaillé sauvegardé: {plan_file}")
    
    return gaps

def main():
    stats, provinces = analyze_content_distribution()
    gaps = generate_enrichment_plan(stats, provinces)
    
    print("\n" + "=" * 100)
    print("🎯 Analyse terminée ! Prochaine étape: Recherche de lieux authentiques à Madagascar")
    print("=" * 100)

if __name__ == '__main__':
    main()
