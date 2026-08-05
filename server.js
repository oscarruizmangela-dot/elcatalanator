// CATALANISH — backend mínimo
// Hace de intermediario entre el frontend y la API de Anthropic,
// para que la ANTHROPIC_API_KEY real nunca se exponga en el navegador.

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, hasKey: Boolean(ANTHROPIC_API_KEY) });
});

app.post('/api/translate', async (req, res) => {
  try {
    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({
        error: 'Falta configurar ANTHROPIC_API_KEY en el servidor.'
      });
    }

    const { system, text } = req.body || {};
    if (!system || !text) {
      return res.status(400).json({ error: 'Faltan los campos "system" o "text".' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        system: system,
        messages: [{ role: 'user', content: text }]
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Error de Anthropic:', response.status, errBody);
      return res.status(502).json({ error: 'La API de Anthropic ha devuelto un error.' });
    }

    const data = await response.json();
    const outText = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    if (!outText) {
      return res.status(502).json({ error: 'Resposta buida de l\'API.' });
    }

    res.json({ text: outText });
  } catch (err) {
    console.error('Error inesperado:', err);
    res.status(500).json({ error: 'Error intern del servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`CATALANISH backend escoltant al port ${PORT}`);
});
