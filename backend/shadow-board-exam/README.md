# Shadow study backend

This small Node.js service keeps the Gemini API key off the frontend and returns validated structured question sets for Shadow Board Exam and Shadow Plus3. It uses one Gemini configuration for both projects.

## Run locally

1. Install Node.js 18 or later.
2. Copy `.env.example` to `.env` and set `GEMINI_API_KEY`.
3. Run `npm start` in this folder.
4. Serve the project root with a static server, then open `projects/shadow-board-exam/`.

Do not open either project HTML file by double-clicking it. Their curriculum selectors use browser modules and must be accessed through a web server. From the project root, a simple option is:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/projects/shadow-board-exam/` (or `/projects/shadow-plus3/`).

The frontends expect this API at `http://127.0.0.1:3002` during local development. For deployment, set `ALLOWED_ORIGINS` and configure each project's `data-api-base` value to the deployed backend URL. Plus3 routes are `/api/plus3/questions` and `/api/plus3/assist`. Shadow AI uses `/api/shadow-ai/chat` for text, bounded chat context, and an optional PNG/JPEG/WebP image reference up to 3 MB.

Shadow AI voice input is browser speech recognition: the browser transcribes speech before the user sends the resulting text. Its chat history is stored locally in the browser; uploaded image previews are not persisted to history after a page reload.

## Development mode

Set `DEMO_MODE=true` only for interface testing when an API key is unavailable. It produces clearly labelled catalog-based demo responses, not AI-authored study questions.

## Board Exam response time

Board Exam stops a stalled AI request after 20 seconds and makes one request by default, so students are not left waiting through repeated minute-long retries. Set `BOARD_AI_TIMEOUT_MS` (minimum `5000`) or `BOARD_AI_ATTEMPTS` when a deployment needs different limits.

## Safety

- Never commit `.env` or API keys.
- Curriculum data is shared with the frontend in `projects/shadow-board-exam/data/curriculum/`.
- The server validates the selection, generated JSON shape, question count, and type-specific requirements before returning it.
