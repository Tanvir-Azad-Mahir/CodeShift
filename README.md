# CodeShift — modern Tailwind version with source-language detection

Copy `App.jsx`, `LandingPage.jsx`, `CodeConverter.jsx`, `languageDetection.js`, `index.css` and `main.jsx` into `src/`. No `App.css`, `LandingPage.css`, or `CodeConverter.css` required.

Dependencies: `npm install @google/genai` and `npm install -D tailwindcss @tailwindcss/vite`. Configure `@tailwindcss/vite` in `vite.config.js` alongside React plugin.

Set `.env` with `VITE_GEMINI_API_KEY=...` for LOCAL testing and optionally `VITE_GEMINI_MODEL=gemini-3.8-flash` or another model available to your key. Restart Vite. The model name is configurable, not independently validated against your account.

Auto-detection occurs on every source edit using synchronous syntax heuristics; this consumes no API quota. Short/ambiguous snippets are intentionally unclassified, and users can disable Auto detect and pick a source language. It is not guaranteed accuracy or a full language parser.

IMPORTANT: Never publicly deploy a `VITE_` Gemini key; browser bundles expose it. Implement a server API proxy for real deployments.

Background video and poster remain external CloudFront URLs from your supplied LandingPage file; update those constants in LandingPage.jsx if desired.

## C language support
Includes C (C11/C17) in source/target menus, C examples, `.c` downloads and heuristic detection of `stdio.h`, `printf`, `scanf`, and `int main(void)`. Short or mixed snippets may be uncertain; use manual source selection.

### Language icons
Programming-language logos are loaded from the Devicon project via jsDelivr. They require an internet connection; readable text badges appear if loading fails. The C language is explicitly mapped. For fully offline delivery, download appropriately licensed icon assets and replace URLs in `LanguageIcon.jsx`.
