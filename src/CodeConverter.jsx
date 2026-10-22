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
const fieldStyle='min-h-12 w-full appearance-none rounded-xl border border-slate-300/70 px-4 py-3 text-sm outline-none transition focus:border-sky-500';
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

export default function CodeConverter({ theme = 'light' }) {
  const [sourceCode,setSourceCode]=useState(examples[0].code);
  const sourceEditorRef = useRef(null);
  const [autoDetect,setAutoDetect]=useState(true);
  const [manualFrom,setManualFrom]=useState('javascript');
  const [to,setTo]=useState('python');
  const [output,setOutput]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
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
    if (loading) return;
    setError('');
    setCopied(false);

    if (!sourceCode.trim()) {
      setError('Paste or write source code first.');
      return;
    }
    if (!from) {
      setError('Language detection is uncertain. Turn off Auto detect and select a source language.');
      return;
    }
    if (sameLanguage) {
      setError('Source and target languages must be different.');
      return;
    }

    setLoading(true);
    setOutput('');
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceCode,
          sourceLanguage: from,
          targetLanguage: to,
        }),
      });

      // Handle both expected API JSON errors and unexpected HTML/empty responses.
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error ||
          `Translation service returned HTTP ${response.status}.`);
      }
      if (typeof data?.translatedCode !== 'string' || !data.translatedCode.trim()) {
        throw new Error('The translation service returned an empty result.');
      }
      setOutput(data.translatedCode.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reach the translation service.');
    } finally {
      setLoading(false);
    }
  }
  async function copy(){if(!output)return;try{await navigator.clipboard.writeText(output);setCopied(true);}catch{setError('Unable to copy automatically. Select the output and copy it manually.');}}
  function download(){if(!output)return;const ext=getLanguage(to)?.ext || 'txt';const url=URL.createObjectURL(new Blob([output],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`codeshift.${ext}`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

  const isDark = theme === 'dark';
  const shellBg = isDark ? 'bg-[#07111f] text-slate-100' : 'bg-[#eff8ff] text-slate-900';
  const panelBg = isDark ? 'bg-[#0b1628] border-slate-700/80' : 'bg-white border-slate-300/70';
  const softPanel = isDark ? 'bg-[#101e32] border-slate-700/80' : 'bg-sky-50/80 border-slate-300/70';
  const muted = isDark ? 'text-slate-300' : 'text-slate-600';
  const subtle = isDark ? 'text-slate-400' : 'text-slate-500';
  const fieldBg = isDark ? 'bg-[#101d2d] text-slate-100' : 'bg-white text-slate-900';
  const editorBg = isDark ? 'bg-[#071827]' : 'bg-[#f2f8ff]';
  const outputBg = isDark ? 'bg-[#071827]' : 'bg-[#f8fbff]';
  const themedField = `${fieldStyle} ${fieldBg}`;
  const iconButton = `rounded-lg border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
    isDark
      ? 'border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-700 hover:text-white'
      : 'border-slate-300/70 bg-sky-100/70 text-slate-600 hover:border-slate-300 hover:bg-sky-100/80 hover:text-slate-900'
  }`;

  return <section id="converter-tool" className={`scroll-mt-24 px-4 py-20 sm:px-8 sm:py-28 ${shellBg}`} aria-labelledby="cc-title">
    <div className="mx-auto max-w-7xl">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div><p className="text-xs font-bold uppercase tracking-[.22em] text-sky-700">THE WORKSPACE · LIVE CONVERTER</p><h2 id="cc-title" className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Code without <em className="serif font-normal text-sky-700">boundaries.</em></h2><p className={`mt-5 max-w-2xl text-base leading-7 ${muted}`}>Start typing or paste code. CodeShift detects your language as you type, highlights its syntax, and translates it into your chosen target. Press Ctrl/Cmd + Enter to translate.</p></div>
        <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${isDark ? 'border-sky-500/40 bg-sky-950/50 text-sky-300' : 'border-sky-300/50 bg-sky-100/70 text-sky-700'}`}><span className="h-2 w-2 rounded-full bg-sky-600"/> AI-assisted editor</span>
      </div>
      <div className={`overflow-hidden rounded-[28px] border shadow-[0_25px_80px_rgba(0,0,0,.3)] ${panelBg}`}>
        <div className={`flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-7 ${softPanel}`}><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-400"/><span className="h-2.5 w-2.5 rounded-full bg-amber-300"/><span className="h-2.5 w-2.5 rounded-full bg-sky-600"/><span className={`ml-3 font-mono text-xs ${subtle}`}>codeshift / studio</span></div><span className={`text-xs ${subtle}`}>Supports 11 languages</span></div>
        <div className={`grid gap-4 border-b p-5 sm:p-7 lg:grid-cols-[1fr_auto_1fr_auto] lg:items-end ${isDark ? 'border-slate-700/80' : 'border-slate-300/70'}`}>
          <div className="min-w-0"><div className="mb-2 flex items-center justify-between gap-3"><label className="text-xs font-semibold uppercase tracking-widest text-slate-600" htmlFor="source-lang">Source language</label><label className="flex cursor-pointer items-center gap-2 text-xs text-sky-700"><input type="checkbox" checked={autoDetect} onChange={toggleDetection} className="accent-sky-600"/>Auto detect</label></div>
            <div className="flex items-center gap-2"><LangBadge language={from}/><select id="source-lang" value={from || ''} disabled={autoDetect} onChange={e=>setManualFrom(e.target.value)} className={`${themedField} min-w-0 disabled:cursor-not-allowed disabled:opacity-65`}><option value="">{autoDetect?'Detecting / uncertain':'Select language'}</option>{LANGUAGE_OPTIONS.map(l=><option value={l.value} key={l.value}>{l.label}</option>)}</select></div>
            <p role="status" aria-live="polite" className={`mt-2 min-h-5 text-xs ${from?'text-sky-700':'text-amber-700'}`}>{autoDetect?'● ':''}{detectionMessage}</p>
          </div>
          <button type="button" onClick={swap} className={`${iconButton} mb-5 min-h-12 px-4 text-xl`} title="Swap source and target" aria-label="Swap source and target">⇄</button>
          <div className="min-w-0"><label className={`mb-2 block text-xs font-semibold uppercase tracking-widest ${muted}`} htmlFor="target-lang">Target language</label><div className="flex items-center gap-2"><LangBadge language={to}/><select id="target-lang" value={to} onChange={e=>{setTo(e.target.value);setOutput('');setError('')}} className={`${themedField} min-w-0`}>{LANGUAGE_OPTIONS.map(l=><option value={l.value} key={l.value}>{l.label}</option>)}</select></div><p className={`mt-2 text-xs ${subtle}`}>Choose the language for your output.</p></div>
          <button id="codeshift-translate" type="button" onClick={convert} disabled={loading || !sourceCode.trim()} className="min-h-12 rounded-xl bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-700 disabled:opacity-50 lg:mb-5">{loading?'Translating…':'✦ Translate code ↗'}</button>
        </div>
        <div className="grid lg:grid-cols-2">
          <div className={`min-w-0 border-b lg:border-b-0 lg:border-r ${isDark ? 'border-slate-700/80' : 'border-slate-300/70'}`}><div className={`flex h-15 items-center justify-between gap-2 border-b px-5 sm:px-7 ${isDark ? 'border-slate-700/80' : 'border-slate-300/70'}`}><div className="flex items-center gap-2"><LangBadge language={from} size="sm"/><span className="text-sm font-semibold">Source editor</span></div><button type="button" className={iconButton} onClick={()=>setCode('')}>Clear</button></div>
            <div className={`h-[460px] ${editorBg}`} aria-label="Source code editor">
              <Editor
                height="100%"
                language={monacoLanguage(from)}
                theme={isDark ? 'vs-dark' : 'vs'}
                value={sourceCode}
                onChange={setCode}
                onMount={(editor, monaco) => {
                  sourceEditorRef.current = editor;
                  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                    document.getElementById('codeshift-translate')?.click();
                  });
                }}
                options={{ ...monacoOptions, readOnly: loading, ariaLabel: 'Source code' }}
                loading={<div className={`p-6 ${muted}`}>Loading code editor…</div>}
              />
            </div>
            <div className={`flex items-center justify-between gap-3 border-t px-5 py-4 text-xs ${subtle} ${isDark ? 'border-slate-700/80' : 'border-slate-300/70'}`}><span>{countLines(sourceCode)} lines · {sourceCode.length} characters</span><span>{from ? labelOf(from) : 'Unknown language'}</span></div>
          </div>
          <div className="min-w-0"><div className={`flex h-15 items-center justify-between gap-2 border-b px-5 sm:px-7 ${isDark ? 'border-slate-700/80' : 'border-slate-300/70'}`}><div className="flex items-center gap-2"><LangBadge language={to} size="sm"/><span className="text-sm font-semibold">Translated output</span></div><div className="flex gap-2"><button type="button" disabled={!output} onClick={copy} className={iconButton}>{copied?'Copied ✓':'Copy'}</button><button type="button" disabled={!output} onClick={download} className={iconButton}>Download ↓</button></div></div>
            {error && <div role="alert" className="border-b border-rose-400/20 bg-rose-400/10 px-5 py-3 text-sm text-rose-700">{error}</div>}
            <div className={`relative h-[460px] ${outputBg}`} aria-label="Translated code editor">
              <Editor
                height="100%"
                language={monacoLanguage(to)}
                theme={isDark ? 'vs-dark' : 'vs'}
                value={output || (loading ? '// Generating translation…' : '// Your translated code will appear here.')}
                options={{ ...monacoOptions, readOnly: true, domReadOnly: true, ariaLabel: 'Translated output' }}
                loading={<div className="p-6 text-slate-600">Loading output editor…</div>}
              />
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-slate-300/70 px-5 py-4 text-xs text-slate-500"><span>{output?`${countLines(output)} lines`:'Awaiting translation'}</span><span>{labelOf(to)}</span></div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-slate-300/70 bg-sky-50/80 p-5 sm:p-7"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-slate-500">Try a sample</p><div className="flex flex-wrap gap-2">{examples.map(ex=><button type="button" key={ex.title} onClick={()=>{setCode(ex.code);setExample(ex.title);setAutoDetect(true)}} className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${example===ex.title?'border-sky-400/60 bg-sky-100/70 text-sky-700':'border-slate-300/70 text-slate-600 hover:bg-sky-100/80'}`}>{ex.title}</button>)}</div></div><p className="max-w-sm text-sm leading-6 text-slate-500">Auto detection is an estimate based on syntax. Review the detected language and always test generated code.</p></div>
      </div>
    </div>
  </section>;
}
