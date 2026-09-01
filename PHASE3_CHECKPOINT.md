# Checkpoint V2 — Phase 3

Date: 2026-08-31

## Objet
Branchement du moteur du portfolio sur les collections V2 après reconstruction des ateliers depuis PUBLISHED.

## État
- `app.js` charge `config/site.json` puis toutes les collections V2 déclarées.
- Les données legacy ne sont pas supprimées ; l’ancien moteur est conservé sous `app.legacy.js`.
- Les ateliers utilisent leurs `glossaryIds`, `artistIds`, `mediaIds` et `missingMediaIds`.
- Les artistes et œuvres utilisent des relations par ID.
- Les images sont résolues depuis `media.v2.json` vers `assets/*.webp`.
- Recherche globale : glossaire, artistes, œuvres et ateliers.
- Navigation détaillée : glossaire, artistes, œuvres, ateliers et objets culturels.
- Intégrité des relations V2 : 0 erreur.
- Une seule image d’atelier reste signalée manquante dans le checkpoint d’assets : `28d53ec50b9839c3e4119669a4c7d87e`. Elle n’est pas remplacée artificiellement.

## Tests réalisés
- `node --check app.js` : OK.
- Serveur HTTP local : `config/site.json`, collections V2, `index.html`, `app.js` et `styles.css` accessibles en HTTP 200.
- `tools/validate-v2.py` : 0 erreur de relation.

## Prochaine étape
Tester visuellement chaque route et chaque atelier, puis décider de la stratégie finale de récupération/classement des médias encore non classés avant publication.
