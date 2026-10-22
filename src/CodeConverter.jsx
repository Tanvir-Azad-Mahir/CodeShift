import React, { useMemo, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { detectLanguage, getLanguage, LANGUAGE_OPTIONS } from './languageDetection';
import LanguageIcon from './LanguageIcon';

const examples = [
  { title:'JavaScript', code:'const greet = (name) => {\n  return `Hello, ${name}!`;\n};\nconsole.log(greet("CodeShift"));' },
  { title:'Python', code:'def fibonacci(n):\n    a, b = 0, 1\n    for i in range(n):\n        print(a)\n        a, b = b, a + b\n\nfibonacci(8)' },
  { title:'C', code:'#include <stdio.h>\nint main(void) {\n    printf("Hello CodeShift\\n");\n    return 0;\n}' },
  { title:'C++', code:'#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello CodeShift";\n    return 0;\n}' },
  { title:'TypeScript', code:'interface User { name: string; age: number; }\nconst greet = (user: User): string => {\n  return `Hi ${user.name}`;\n};' },
  { title:'Go', code:'package main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello CodeShift")\n}' },
];
function LangBadge({ language, size='md' }) {
  return <LanguageIcon language={language} size={size} />;
}
const labelOf = id => getLanguage(id)?.label || id;
const fieldStyle='min-h-12 w-full appearance-none rounded-xl border border-white/15 bg-[#14233a] px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300';
const iconButton='rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-white/25 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40';
const countLines = text => text ? text.split('\n').length : 0;
// Monaco uses a few different identifiers from the CodeShift language keys.
const monacoLanguage = (language) => ({
  csharp: 'csharp', cpp: 'cpp', c: 'c', javascript: 'javascript',
  typescript: 'typescript', python: 'python', java: 'java', dart: 'dart',
  php: 'php', go: 'go', ruby: 'ruby'
}[language] || 'plaintext');
const monacoOptions = {
  automaticLayout: true, minimap: { enabled: false }, fontSize: 14,
  lineHeight: 24, fontFamily: 'Consolas, Menlo, Monaco, monospace',
  scrollBeyondLastLine: false, wordWrap: 'on',
  bracketPairColorization: { enabled: true },
  guides: { bracketPairs: true, indentation: true },
  padding: { top: 18, bottom: 18 }, tabSize: 2,
  insertSpaces: true, smoothScrolling: true,
  renderWhitespace: 'selection', overviewRulerLanes: 0,
  scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
};

// Retry only temporary upstream failures. Invalid model names and API keys fail immediately.
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function getApiErrorCode(error) {
  const direct = Number(error?.status || error?.code || error?.error?.code);
  if (Number.isFinite(direct) && direct > 0) return direct;
  const raw = String(error?.message || '');
  try {
    const parsed = JSON.parse(raw);
    return Number(parsed?.error?.code || parsed?.code) || null;
  } catch {
    return Number(raw.match(/(?:code|status)["'\s:]+(429|500|502|503|504)/i)?.[1]) || null;
  }
}
async function generateWithRetry(ai, model, prompt, onRetry) {
  const maxAttempts = 3;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await ai.models.generateContent({ model, contents: prompt });
    } catch (err) {
      const code = getApiErrorCode(err);
      const msg = String(err?.message || '');
      const temporary = [429, 500, 502, 503, 504].includes(code) ||
        /(?:UNAVAILABLE|RESOURCE_EXHAUSTED|high demand)/i.test(msg);
      if (!temporary || attempt === maxAttempts - 1) throw err;
      const delay = 1000 * (2 ** attempt) + Math.floor(Math.random() * 400);
      onRetry?.(attempt + 2, maxAttempts);
      await wait(delay);
    }
  }
}

export default function CodeConverter() {
  const [sourceCode,setSourceCode]=useState(examples[0].code);
  const sourceEditorRef = useRef(null);
  const [autoDetect,setAutoDetect]=useState(true);
  const [manualFrom,setManualFrom]=useState('javascript');
  const [to,setTo]=useState('python');
  const [output,setOutput]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  const [retryStatus,setRetryStatus]=useState('');
  const [copied,setCopied]=useState(false);
  const [example,setExample]=useState('JavaScript');
  const detection=useMemo(()=>detectLanguage(sourceCode),[sourceCode]);
  const from=autoDetect?detection.language:manualFrom;
  const sameLanguage=Boolean(from && from===to);
  const detectionMessage = autoDetect ? (detection.language ? `${labelOf(detection.language)} · ${detection.confidence} confidence` : detection.reason) : `Manual: ${labelOf(manualFrom)}`;

  function setCode(text) {setSourceCode(text ?? '');setOutput('');setError('');setCopied(false);setExample('');}
  function toggleDetection() {if (autoDetect && detection.language) setManualFrom(detection.language);setAutoDetect(v=>!v);setError('');}
  function swap() {
    const actualFrom=from;
    if (!actualFrom) {setError('Source language is uncertain. Select it manually before swapping.');return;}
    if (output) {setSourceCode(output);setOutput(sourceCode);setManualFrom(to);setTo(actualFrom);setAutoDetect(false);}
    else {setManualFrom(to);setTo(actualFrom);setAutoDetect(false);}
    setError('');setCopied(false);
  }
  async function convert() {
    if(loading)return;
    setError('');setCopied(false);
    if(!sourceCode.trim()){setError('Paste or write source code first.');return;}
    if(!from){setError('Language detection is uncertain. Turn off Auto detect and choose the source language.');return;}
    if(sameLanguage){setError('Source and target are the same. Choose another target language.');return;}
    const apiKey=import.meta.env.VITE_GEMINI_API_KEY;
    if(!apiKey){setError('Missing VITE_GEMINI_API_KEY in .env. Restart Vite after adding it. For a public website, move the Gemini call to a backend.');return;}
    setLoading(true);setOutput('');setRetryStatus('');
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai=new GoogleGenAI({apiKey});
      const prompt=`Translate the following ${labelOf(from)} code into ${labelOf(to)}. Preserve functionality and intention. Return only code without Markdown or explanations.\n\n${sourceCode}`;
      const model=import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.8-flash';
      const result=await generateWithRetry(ai,model,prompt,(attempt,total)=>{
        setRetryStatus(`Gemini is busy. Retrying request (${attempt}/${total})…`);
      });
      const text=(result?.text||'').trim().replace(/^```[^\n]*\n/,'').replace(/\n```$/,'').trim();
      if(!text)throw new Error('Gemini returned an empty translation.');
      setOutput(text);
    } catch(e){
      const code=getApiErrorCode(e);
      const message=String(e?.message || '');
      if(code===503 || /UNAVAILABLE|high demand/i.test(message)) {
        setError('Gemini is temporarily overloaded. Automatic retries were unsuccessful. Please try again later.');
      } else if(code===429 || /RESOURCE_EXHAUSTED/i.test(message)) {
        setError('Gemini rate limit or quota reached. Please check your API limits and try again later.');
      } else if(code===404) {
        setError('The configured Gemini model is unavailable. Verify VITE_GEMINI_MODEL and your API access.');
      } else {
        setError(e instanceof Error ? e.message : 'Conversion failed.');
      }
    } finally {setLoading(false);setRetryStatus('');}
  }
  async function copy(){if(!output)return;try{await navigator.clipboard.writeText(output);setCopied(true);}catch{setError('Unable to copy automatically. Select the output and copy it manually.');}}
  function download(){if(!output)return;const ext=getLanguage(to)?.ext || 'txt';const url=URL.createObjectURL(new Blob([output],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`codeshift.${ext}`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

  return <section id="converter-tool" className="scroll-mt-24 bg-[#080f1d] px-4 py-20 text-slate-100 sm:px-8 sm:py-28" aria-labelledby="cc-title">
    <div className="mx-auto max-w-7xl">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div><p className="text-xs font-bold uppercase tracking-[.22em] text-emerald-300">THE WORKSPACE · LIVE CONVERTER</p><h2 id="cc-title" className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Code without <em className="serif font-normal text-emerald-300">boundaries.</em></h2><p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">Start typing or paste code. CodeShift detects your language as you type, highlights its syntax, and translates it into your chosen target. Press Ctrl/Cmd + Enter to translate.</p></div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-semibold text-emerald-200"><span className="h-2 w-2 rounded-full bg-emerald-300"/> AI-assisted editor</span>
      </div>
      <div className="overflow-hidden rounded-[28px] border border-white/12 bg-[#101b2d] shadow-[0_25px_80px_rgba(0,0,0,.3)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[.025] px-5 py-4 sm:px-7"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-400"/><span className="h-2.5 w-2.5 rounded-full bg-amber-300"/><span className="h-2.5 w-2.5 rounded-full bg-emerald-300"/><span className="ml-3 font-mono text-xs text-slate-400">codeshift / studio</span></div><span className="text-xs text-slate-500">Supports 11 languages</span></div>
        <div className="grid gap-4 border-b border-white/10 p-5 sm:p-7 lg:grid-cols-[1fr_auto_1fr_auto] lg:items-end">
          <div className="min-w-0"><div className="mb-2 flex items-center justify-between gap-3"><label className="text-xs font-semibold uppercase tracking-widest text-slate-400" htmlFor="source-lang">Source language</label><label className="flex cursor-pointer items-center gap-2 text-xs text-emerald-200"><input type="checkbox" checked={autoDetect} onChange={toggleDetection} className="accent-emerald-300"/>Auto detect</label></div>
            <div className="flex items-center gap-2"><LangBadge language={from}/><select id="source-lang" value={from || ''} disabled={autoDetect} onChange={e=>setManualFrom(e.target.value)} className={`${fieldStyle} min-w-0 disabled:cursor-not-allowed disabled:opacity-65`}><option value="">{autoDetect?'Detecting / uncertain':'Select language'}</option>{LANGUAGE_OPTIONS.map(l=><option value={l.value} key={l.value}>{l.label}</option>)}</select></div>
            <p role="status" aria-live="polite" className={`mt-2 min-h-5 text-xs ${from?'text-emerald-300':'text-amber-300'}`}>{autoDetect?'● ':''}{detectionMessage}</p>
          </div>
          <button type="button" onClick={swap} className={`${iconButton} mb-5 min-h-12 px-4 text-xl`} title="Swap source and target" aria-label="Swap source and target">⇄</button>
          <div className="min-w-0"><label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400" htmlFor="target-lang">Target language</label><div className="flex items-center gap-2"><LangBadge language={to}/><select id="target-lang" value={to} onChange={e=>{setTo(e.target.value);setOutput('');setError('')}} className={`${fieldStyle} min-w-0`}>{LANGUAGE_OPTIONS.map(l=><option value={l.value} key={l.value}>{l.label}</option>)}</select></div><p className="mt-2 text-xs text-slate-500">Choose the language for your output.</p></div>
          <button id="codeshift-translate" type="button" onClick={convert} disabled={loading || !sourceCode.trim()} className="min-h-12 rounded-xl bg-emerald-300 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-200 disabled:opacity-50 lg:mb-5">{loading?'Translating…':'✦ Translate code ↗'}</button>
        </div>
        {retryStatus && <p role="status" aria-live="polite" className="border-b border-amber-300/15 bg-amber-300/5 px-5 py-3 text-sm text-amber-200 sm:px-7">{retryStatus}</p>}
        <div className="grid lg:grid-cols-2">
          <div className="min-w-0 border-b border-white/10 lg:border-b-0 lg:border-r"><div className="flex h-15 items-center justify-between gap-2 border-b border-white/10 px-5 sm:px-7"><div className="flex items-center gap-2"><LangBadge language={from} size="sm"/><span className="text-sm font-semibold">Source editor</span></div><button type="button" className={iconButton} onClick={()=>setCode('')}>Clear</button></div>
            <div className="h-[460px] bg-[#0b1525]" aria-label="Source code editor">
              <Editor
                height="100%"
                language={monacoLanguage(from)}
                theme="vs-dark"
                value={sourceCode}
                onChange={setCode}
                onMount={(editor, monaco) => {
                  sourceEditorRef.current = editor;
                  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                    document.getElementById('codeshift-translate')?.click();
                  });
                }}
                options={{ ...monacoOptions, readOnly: loading, ariaLabel: 'Source code' }}
                loading={<div className="p-6 text-slate-400">Loading code editor…</div>}
              />
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4 text-xs text-slate-500"><span>{countLines(sourceCode)} lines · {sourceCode.length} characters</span><span>{from ? labelOf(from) : 'Unknown language'}</span></div>
          </div>
          <div className="min-w-0"><div className="flex h-15 items-center justify-between gap-2 border-b border-white/10 px-5 sm:px-7"><div className="flex items-center gap-2"><LangBadge language={to} size="sm"/><span className="text-sm font-semibold">Translated output</span></div><div className="flex gap-2"><button type="button" disabled={!output} onClick={copy} className={iconButton}>{copied?'Copied ✓':'Copy'}</button><button type="button" disabled={!output} onClick={download} className={iconButton}>Download ↓</button></div></div>
            {error && <div role="alert" className="border-b border-rose-400/20 bg-rose-400/10 px-5 py-3 text-sm text-rose-200">{error}</div>}
            <div className="relative h-[460px] bg-[#091321]" aria-label="Translated code editor">
              <Editor
                height="100%"
                language={monacoLanguage(to)}
                theme="vs-dark"
                value={output || (loading ? '// Generating translation…' : '// Your translated code will appear here.')}
                options={{ ...monacoOptions, readOnly: true, domReadOnly: true, ariaLabel: 'Translated output' }}
                loading={<div className="p-6 text-slate-400">Loading output editor…</div>}
              />
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4 text-xs text-slate-500"><span>{output?`${countLines(output)} lines`:'Awaiting translation'}</span><span>{labelOf(to)}</span></div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/10 bg-white/[.02] p-5 sm:p-7"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-slate-500">Try a sample</p><div className="flex flex-wrap gap-2">{examples.map(ex=><button type="button" key={ex.title} onClick={()=>{setCode(ex.code);setExample(ex.title);setAutoDetect(true)}} className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${example===ex.title?'border-emerald-300/40 bg-emerald-300/10 text-emerald-200':'border-white/15 text-slate-300 hover:bg-white/10'}`}>{ex.title}</button>)}</div></div><p className="max-w-sm text-sm leading-6 text-slate-500">Auto detection is an estimate based on syntax. Review the detected language and always test generated code.</p></div>
      </div>
      <p className="mt-6 rounded-xl border border-amber-300/15 bg-amber-300/5 p-4 text-sm leading-7 text-amber-100/85"><strong>Security:</strong> This prototype sends code to Gemini from the browser. Never paste credentials or private source code. For deployment, put Gemini calls behind a server endpoint; VITE_ variables are public.</p>
    </div>
  </section>;
}
