# CATALANISH

Traductor comercial castellà → català amb dos modes:
- **Traducció simple**: traducció directa.
- **Traducció avançada**: traducció + revisió automàtica amb la skill de correcció catalana (barbarismes, ortotipografia, gramàtica, estil).

## Estructura

```
catalanish/
├── server.js          # backend Express: intermediari amb l'API d'Anthropic
├── package.json
├── .env.example        # plantilla de variables d'entorn (NO conté la clau real)
├── public/
│   └── index.html      # frontend (dos panells, dos botons)
```

## Executar en local

1. Instal·la dependències:
   ```bash
   npm install
   ```
2. Copia `.env.example` a `.env` i posa la teva clau real:
   ```bash
   cp .env.example .env
   # edita .env i posa ANTHROPIC_API_KEY=sk-ant-...
   ```
3. Arrenca el servidor:
   ```bash
   npm start
   ```
4. Obre http://localhost:3000

## Desplegar a Render

1. Puja aquest projecte a un repositori de GitHub (**sense** el fitxer `.env`, ja està al `.gitignore`).
2. A [dashboard.render.com](https://dashboard.render.com) → **New** → **Web Service** (no "Static Site", perquè necessitem el backend).
3. Connecta el teu compte de GitHub i selecciona el repositori.
4. Configuració:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. A la secció **Environment**, afegeix la variable:
   - `ANTHROPIC_API_KEY` = la teva clau real (mai la posis al codi ni al repo)
   - opcionalment `ANTHROPIC_MODEL` (per defecte `claude-haiku-4-5-20251001`, el model més econòmic; si vols més qualitat de matís lingüístic pots provar `claude-sonnet-5`, més car)
6. Clic a **Create Web Service**. Render construirà i desplegarà automàticament.
7. Cada `git push` a la branca configurada torna a desplegar sol.

## Cost i control de despesa

- Per defecte el projecte usa **Claude Haiku 4.5** ($1 / $5 per milió de tokens d'entrada/sortida), el model més econòmic. Una traducció avançada típica (traducció + revisió amb la skill) sol costar cèntims de dòlar.
- Recomanat: a [console.anthropic.com](https://console.anthropic.com) → **Settings → Limits**, configura un límit de despesa mensual perquè mai es pugui superar un import determinat.
- El compte funciona amb crèdits prepagats (des de $5): si s'esgoten, l'API simplement deixa de respondre fins que recarreguis, sense facturació sorpresa.

## Notes de seguretat

- La clau d'Anthropic només viu al servidor (variable d'entorn), mai al navegador.
- El frontend (`public/index.html`) crida `/api/translate`, mai directament `api.anthropic.com`.
