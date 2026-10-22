<div align="center">

# CodeShift

### AI-Powered Code Translation & Developer Tools

Translate code between programming languages and explore AI-assisted explanations, debugging suggestions, optimization, and documentation — all in a modern developer workspace.

**React · Vite · Tailwind CSS · Monaco Editor · Node.js · Express · Google Gemini**

</div>

---

## Overview

**CodeShift** is a web application for translating source code across **11 programming languages** using Google's Gemini API. It combines a Monaco-based code editor, automatic language detection, and a secure Express backend that keeps API credentials off the client.

An AI developer toolkit is also being added, with backend endpoints for explaining code, suggesting bug fixes, optimizing code, and generating documentation.

> **Project status:** Code translation is implemented. The AI analysis backend has been added, but frontend integration of its four tools is in progress. Gemini responses are subject to the selected model's availability and quota limits.

## Features

### Code translation

- **11 supported languages** — JavaScript, TypeScript, Python, Java, C, C++, C#, Dart, PHP, Go, and Ruby.
- **Automatic language detection** with manual language selection.
- **Monaco Editor** for editing and syntax highlighting.
- **AI-powered translation** via Google Gemini.
- **Copy and download** translated code.
- **Sample code snippets** for quick experimentation.
- **Responsive interface** with a modern dark visual style.

### AI Developer Toolkit (in progress)

The backend supports four analysis actions through `POST /api/analyze`:

| Action | Purpose |
| --- | --- |
| `explain` | Explain code structure and logic in Markdown. |
| `debug` | Identify potential bugs and suggest corrections. |
| `optimize` | Suggest improvements to readability and performance. |
| `document` | Generate Markdown documentation. |

These are **AI-generated suggestions**; they are not a substitute for running tests, profiling, or reviewing generated code.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS v4 |
| Code editing | Monaco Editor (`@monaco-editor/react`) |
| Backend | Node.js, Express |
| AI | Google Gemini via `@google/genai` |
| Security and configuration | `dotenv`, `express-rate-limit` |

## Project Structure

```text
codeshift/
├── server/
│   ├── index.js            # Express API
│   └── .env                # Local secrets (do not commit)
├── src/
│   ├── App.jsx
│   ├── LandingPage.jsx
│   ├── CodeConverter.jsx
│   ├── LanguageIcon.jsx
│   ├── languageDetection.js
│   ├── index.css
│   └── main.jsx
├── vite.config.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- A recent supported version of **Node.js** and npm.
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey).
- Access to a Gemini model enabled for your API project.

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
npm install
```

Replace `YOUR_USERNAME/YOUR_REPOSITORY` with your GitHub repository path.

### 2. Configure the backend

Create `server/.env`:

```dotenv
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=your_available_gemini_model
PORT=3001
```

Choose a model that is available to your account and supported by your API project. Do not put the key in a `VITE_` environment variable; Vite exposes those values to browser code.

> **Never commit `server/.env` or an API key.** If both `GOOGLE_API_KEY` and `GEMINI_API_KEY` are present in your environment, check which credential your SDK is actually using.

Recommended `.gitignore` entries:

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
server/.env
```

### 3. Start the backend

In one terminal:

```bash
npm run server
```

The API should run on `http://localhost:3001` by default.

### 4. Start the frontend

In a second terminal:

```bash
npm run dev
```

Open the local URL printed by Vite. During development, the Vite proxy forwards `/api` requests to the Express server.

## API Reference

### `GET /api/health`

Returns basic service status.

```json
{
  "status": "ok",
  "service": "CodeShift API"
}
```

### `POST /api/convert`

Translate source code into a different language.

**Request**

```json
{
  "sourceCode": "print('Hello, world!')",
  "sourceLanguage": "python",
  "targetLanguage": "javascript"
}
```

**Example response**

```json
{
  "success": true,
  "translatedCode": "console.log('Hello, world!');",
  "sourceLanguage": "python",
  "targetLanguage": "javascript"
}
```

### `POST /api/analyze`

Ask Gemini to explain, debug, optimize, or document code.

**Request**

```json
{
  "action": "explain",
  "sourceLanguage": "python",
  "sourceCode": "def square(x): return x * x"
}
```

Valid values for `action`: `explain`, `debug`, `optimize`, `document`.

**Example response shape**

```json
{
  "success": true,
  "action": "explain",
  "sourceLanguage": "python",
  "result": "## Overview\n...",
  "explanation": "## Overview\n..."
}
```

`result` contains the generated Markdown. `explanation` is also returned for compatibility with the Explain Code client.

### Supported language identifiers

```text
javascript, typescript, python, java, c, cpp,
csharp, dart, php, go, ruby
```

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| `Cannot POST /api/analyze` | Restart the backend and confirm the route exists in `server/index.js`. |
| `GEMINI_API_KEY is missing` | Check `server/.env` and the exact variable name. |
| `429 Too Many Requests` | Check Gemini quota and rate limits in [Google AI Studio](https://aistudio.google.com/usage). |
| `503` from Gemini | The upstream service may be overloaded; retry later. |
| `Configured Gemini model was not found` | Verify `GEMINI_MODEL` is available for your account and API version. |
| Frontend cannot reach `/api` | Confirm both processes are running and the Vite proxy targets port `3001`. |

## Security Notes

- Keep the Gemini API key **server-side only**.
- Configure request size limits and API rate limiting before public deployment.
- For production, add appropriate authentication or abuse controls, monitoring, and cost safeguards.
- Review AI-generated code before running or publishing it.
- Avoid sending secrets or confidential source code to external AI services without authorization.

## Roadmap

- [x] Monaco-based code editor
- [x] Automatic language detection
- [x] Gemini-powered translation endpoint
- [x] Server-side API key handling
- [x] AI analysis backend actions
- [ ] Frontend tabs for Explain, Debug, Optimize, and Documentation
- [ ] Side-by-side comparison and accepting suggested changes
- [ ] Conversion history
- [ ] Improved production deployment and monitoring

## License

No license has been specified yet. Add a `LICENSE` file if you want to define how others may use, modify, or redistribute the project.

---

<div align="center">

**CodeShift — Translate. Understand. Improve.**

</div>
