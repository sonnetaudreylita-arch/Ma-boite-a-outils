# Checkpoint V2 — Phase 2

Date: 2026-08-31

## Objet
Reconstruction des 6 ateliers depuis l'export PUBLISHED de la page `Ateliers d'expérimentations.html`.

## État
- 6 ateliers reconstruits dans `data/workshops.v2.json`.
- 83 images source distinctes référencées par les ateliers.
- Les références d'images sont conservées dans l'ordre d'apparition du source HTML.
- Les images sont liées à un atelier uniquement lorsqu'elles sont explicitement référencées par cet atelier dans le HTML PUBLISHED.
- Les termes du glossaire ne reçoivent un `glossaryId` que lorsqu'une correspondance existe dans le glossaire V2.
- Les artistes sont liés à partir des blocs d'artistes explicitement présents dans le source.
- L'image `28d53ec50b9839c3e4119669a4c7d87e.jpg` est explicitement référencée dans PUBLISHED mais n'est pas présente dans le checkpoint d'assets actuel. Elle est signalée et non remplacée.
- Les données legacy restent intactes.
- `app.js` n'est pas basculé vers les nouvelles données : ce checkpoint est une étape de migration des données, pas une mise en ligne.
