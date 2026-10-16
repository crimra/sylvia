# Site Sylvia Grace — maquilleuse professionnelle (Brazzaville)

Site vitrine + réservation pour Sylvia Grace (@sylviaa_grace_, marque « NGBeauty »).
Prestations : mariée, anniversaire & soirée, shooting, clip & tournage, makeup artistique.
Langue du site : français (tutoiement). Monnaie : FCFA.

## Stack
HTML / CSS / JS natif, sans framework ni build. Ouvrir `site/index.html` dans le navigateur.
Polices Google Fonts : Anton (titres), Outfit, Archivo, Space Mono.

## Structure
- `site/` — le site déployé (`index.html`, `css/style.css`, `js/main.js`, `images/`)
- `contenu/instagram/` — fiche profil, `publications.csv/json` ; photos/vidéos brutes en local uniquement
- `design/` — maquette d'inspiration et captures du rendu
- `archives/` — anciennes versions monofichier (non versionnées)

## Règles médias
- Seules les images optimisées du site (`site/images/`, < 300 Ko chacune, idéalement WebP) vont dans Git.
- Les médias bruts et les vidéos ne sont jamais commités (voir `.gitignore`).

## À compléter (placeholders dans le code)
- `[PRIX]`, `[DURÉE]` des prestations — `js/main.js`
- `[NUMERO]` WhatsApp (`wa.me/...`) — `js/main.js`
- `[DÉLAI]` de réponse — `index.html`

## Git
- Pas de ligne `Co-Authored-By` ni de mention de Claude dans les commits ou PR.
