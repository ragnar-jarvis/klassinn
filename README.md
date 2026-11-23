# Klassinn

Kennaraapp fyrir þjálfara: tímar, æfingasafn, einkatímar og nótur. Á íslensku.

- **Í notkun:** https://ragnar-jarvis.github.io/klassinn/ (GitHub Pages, birtist sjálfkrafa við ýtingu á `main`)
- Gamla slóðin klassinn-preview.vercel.app er föst á eldri útgáfu (Vercel-aðgangur á óvirku netfangi).
- **Allt í einni skrá:** `index.html` (HTML + CSS + JS, engin smíði). `sw.js` er service worker, `hreinsa.html` hreinsar skyndiminni.
- **Gögnin** eru bara í síma notandans (localStorage). Lyklarnir mega ekki breytast, annars týnast gögnin:
  `klassinn.preview.data.v1` (tímar + æfingar), `klassinn.preview.notes.v3`, `klassinn.preview.clients.v1`,
  `klassinn.preview.profile.v1`, `klassinn.preview.comments.v2`. Afrit: Prófíll → Vista afrit / Setja inn afrit.
- **Slóðin verður að haldast** (ragnar-jarvis.github.io/klassinn): localStorage fylgir léninu.
- **Ný útgáfa:** hækka `CACHE` í `sw.js`, `?v=` við skráningu SW og `klassinn.sw.vNN` efst í `index.html`.


## Ský (Firebase)

- Verkefni `klassinn-442d5` (Spark, ókeypis) á Google-aðgangi eigandans. Innskráning: netfang + lykilorð,
  nýskráning opin í appinu („Búa til aðgang“). Firestore í `eur3`.
- Gögn: `users/{uid}/items/{kind_id}` = `{ kind, json, updatedAt, deleted }`. Appið vistar fyrst í tækinu
  (localStorage) og samstillir svo; nýrra vinnur; eyðingar sem `deleted: true`.
- Deiling: `shares/{id}` = `{ fromUid, fromName, kind, json, createdAt }`, hlekkur `#deila=<id>`.
- Reglur: notandi les/skrifar bara `users/{eigið uid}`; `shares` má sækja eitt í einu (ekki lista),
  aðeins eigandi býr til/eyðir.
- Prufuaðgangur fyrir prófanir er í `.env.prufa` (fer ekki á GitHub).

## Prófa á Mac

```bash
python3 -m http.server 8796 --directory .
```
