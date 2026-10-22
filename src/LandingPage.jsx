import React, { useState } from 'react';
import LanguageIcon from './LanguageIcon';
const bgVideo =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_123836_11a3c5e0-713f-4bef-a8e9-7dd93bdea3b0.mp4';

const heroPoster =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/693205bf-8048-456a-879e-4e0a1b85a098.webp';

const features = [
  { tag:'01 / TRANSLATION', icon:'⌘', title:'Translate across languages', body:'Move your logic between JavaScript, Python, TypeScript, Java, C, C++ and more — without starting from zero.' },
  { tag:'02 / INTELLIGENCE', icon:'{ }', title:'Preserve the intention', body:'Get an AI-assisted first draft that aims to preserve meaning, structure and behavior in the target language.' },
  { tag:'03 / WORKFLOW', icon:'↗', title:'One focused workspace', body:'Paste a snippet, choose a destination language, review the output, then copy or download your translation.' },
  { tag:'04 / EXPERIMENT', icon:'✦', title:'Explore new ecosystems', body:'Compare syntax and programming patterns while learning how familiar ideas translate into different languages.' },
];
const steps=[['01','Paste your code','Start with a function, utility, algorithm, or a small script.'],['02','Choose languages','Select the source and target languages from the editor.'],['03','Translate and review','Generate a conversion and test the result before using it.']];
const langs=['JavaScript','TypeScript','Python','Java','C#','C','C++','Dart','PHP','Go','Ruby'];
const faqs=[
  ['Does CodeShift run the generated code?','No. It produces text-based code translations through a configured AI API. You must compile, run and test the result yourself.'],
  ['Will translated code always work?','No. AI translations can introduce errors and may require library replacements or manual changes, especially for large projects.'],
  ['What programming languages can I use?','The converter automatically suggests the source language and currently offers JavaScript, TypeScript, Python, Java, C, C#, C++, Dart, PHP, Go and Ruby.'],
  ['Can I paste confidential source code?','Do not paste secrets or proprietary code into this prototype. A production version should use a secured backend and clear data-handling policies.'],
];
const wrap='mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10';
const kicker='text-xs font-bold uppercase tracking-[.22em] text-emerald-300';
const button='inline-flex items-center justify-center gap-3 rounded-full px-7 py-3.5 text-sm font-bold transition duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300';
function Logo(){return <a href="#top" className="group flex items-center gap-3 text-xl font-bold tracking-tight text-white"><span className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-200/25 bg-gradient-to-br from-emerald-300/25 via-sky-300/10 to-indigo-400/20 shadow-[0_4px_22px_rgba(52,211,153,.18)] transition-transform group-hover:rotate-[-5deg]"><svg viewBox="0 0 40 40" className="h-8 w-8" fill="none" aria-hidden="true"><path d="M15 10 6 20l9 10M25 10l9 10-9 10" stroke="#A7F3D0" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/><path d="m23 7-6 26" stroke="#7DD3FC" strokeWidth="3" strokeLinecap="round"/></svg></span><span>Code<span className="text-emerald-300">Shift</span></span></a>}
export default function LandingPage({onOpenConverter}){
  const [menu,setMenu]=useState(false); const [faq,setFaq]=useState(0);
  const open=()=>{setMenu(false);onOpenConverter?.()};
  return <div id="top" className="min-w-0 overflow-x-hidden bg-[#080f1d] text-slate-100">
    {/* Floating glassmorphism navigation */}
    <header className="fixed inset-x-0 top-4 z-50 px-4 sm:top-5 sm:px-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/20 bg-slate-950/40 shadow-[0_12px_42px_rgba(0,0,0,0.22)] backdrop-blur-2xl supports-[backdrop-filter]:bg-slate-950/35 transition-colors duration-300 hover:border-white/30">
        <div className="flex min-h-[72px] items-center justify-between gap-5 px-5 md:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex" aria-label="Main navigation">
            <a className="transition-colors hover:text-emerald-200" href="#features">Features</a>
            <a className="transition-colors hover:text-emerald-200" href="#workflow">How it works</a>
            <a className="transition-colors hover:text-emerald-200" href="#languages">Languages</a>
            <a className="transition-colors hover:text-emerald-200" href="#faq">FAQ</a>
          </nav>
          <button type="button" onClick={open} className="hidden items-center gap-2 rounded-xl border border-white/30 bg-white/90 px-5 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-white hover:shadow-lg md:inline-flex">
            Launch converter <span aria-hidden="true">↗</span>
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-xl text-white transition hover:bg-white/20 md:hidden"
            aria-label={menu ? 'Close navigation menu' : 'Open navigation menu'}
            aria-controls="codeshift-mobile-navigation"
            aria-expanded={menu}
            onClick={() => setMenu(value => !value)}
          >{menu ? '×' : '☰'}</button>
        </div>
        {menu && (
          <nav id="codeshift-mobile-navigation" className="flex flex-col gap-1 border-t border-white/15 bg-slate-950/30 px-5 pb-5 pt-3 text-sm md:hidden" aria-label="Mobile navigation">
            {[[ 'Features', '#features' ], [ 'How it works', '#workflow' ], [ 'Languages', '#languages' ], [ 'FAQ', '#faq' ]].map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMenu(false)} className="rounded-lg px-3 py-3 font-medium text-white/85 transition hover:bg-white/10">{label}</a>
            ))}
            <button type="button" onClick={open} className="mt-3 rounded-xl bg-emerald-300 px-5 py-3 text-left font-bold text-slate-950 transition hover:bg-emerald-200">Launch converter ↗</button>
          </nav>
        )}
      </div>
    </header>
    <main>
      <section className="relative flex min-h-[690px] items-center overflow-hidden sm:min-h-[760px] lg:min-h-[810px]" aria-labelledby="hero-title">
        <video className="absolute inset-0 h-full w-full object-cover object-center" autoPlay muted playsInline loop preload="metadata" poster={heroPoster} aria-hidden="true"><source src={bgVideo} type="video/mp4"/></video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#07101f]/95 via-[#07101f]/70 to-[#07101f]/25"/><div className="absolute inset-0 bg-gradient-to-t from-[#080f1d] via-transparent to-[#080f1d]/35"/>
        <div className={`${wrap} relative z-10 py-28`}><div className="max-w-3xl"><p className={`${kicker} mb-7 flex items-center gap-3`}><span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_15px_#6ee7b7]"/>AI-POWERED CODE CONVERSION</p><h1 id="hero-title" className="text-5xl font-semibold leading-[1.06] tracking-tight sm:text-7xl lg:text-[92px]">Write once.<br/><span className="serif font-normal italic text-emerald-200">Think beyond</span><br/>languages.</h1><p className="mt-8 max-w-xl text-lg leading-8 text-slate-200 sm:text-xl">Translate code across programming languages with an AI-powered workspace built for people who love to create.</p><div className="mt-10 flex flex-wrap gap-4"><button onClick={open} className={`${button} bg-emerald-300 text-slate-950 hover:bg-emerald-200`}>Start translating <span>↗</span></button><a className={`${button} border border-white/35 bg-white/10 text-white hover:bg-white/20`} href="#workflow">Explore how it works ↓</a></div><p className="mt-12 text-xs font-medium uppercase tracking-[.12em] text-slate-300">Built for developers &nbsp; • &nbsp; AI-assisted &nbsp; • &nbsp; Always review output</p></div></div>
      </section>
      <div className="border-y border-white/10 bg-[#101c2c]"><div className={`${wrap} flex flex-wrap items-center justify-center gap-x-9 gap-y-4 py-6 text-sm font-bold text-slate-300`}><span className="text-xs tracking-widest text-emerald-300">BUILT FOR</span>{['JavaScript','Python','TypeScript','C++','Go','Java'].map(x=><span key={x}>{x}</span>)}</div></div>
      <section id="features" className="scroll-mt-32 py-24 sm:py-32"><div className={wrap}><div className="mb-14 grid gap-8 lg:grid-cols-2 lg:items-end"><div><p className={kicker}>01 / WHAT WE DO</p><h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">Less rewriting.<br/><span className="serif italic font-normal text-emerald-300">More creating.</span></h2></div><p className="max-w-lg text-lg leading-8 text-slate-400">Bring ideas into a new stack, understand unfamiliar syntax and spend more time building instead of rewriting boilerplate.</p></div><div className="grid gap-5 md:grid-cols-2">{features.map(f=><article key={f.tag} className="group flex min-h-75 flex-col rounded-3xl border border-white/10 bg-white/[.035] p-8 transition hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-white/[.07]"><div className="flex items-start justify-between"><span className="text-xs font-bold tracking-widest text-slate-500">{f.tag}</span><span className="text-3xl text-emerald-300">{f.icon}</span></div><h3 className="mt-12 text-2xl font-semibold">{f.title}</h3><p className="mt-3 flex-1 leading-7 text-slate-400">{f.body}</p><button type="button" className="mt-7 self-start text-sm font-semibold text-emerald-300 hover:text-emerald-100" onClick={open}>Try it now ↗</button></article>)}</div></div></section>
      <section id="workflow" className="scroll-mt-32 bg-[#111e2e] py-24 sm:py-32"><div className={`${wrap} grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-24`}><div><p className={kicker}>02 / SIMPLE WORKFLOW</p><h2 className="mt-5 text-4xl font-semibold sm:text-6xl">From snippet<br/>to <span className="serif italic font-normal text-emerald-300">solution.</span></h2><p className="mt-7 max-w-md text-lg leading-8 text-slate-400">A focused three-step process from the code you already understand to a new programming language.</p><button className={`${button} mt-9 border border-white/25 text-white hover:bg-white/10`} onClick={open}>Open workspace ↗</button></div><div className="divide-y divide-white/10 border-y border-white/10">{steps.map(([num,title,desc])=><div key={num} className="flex gap-6 py-9"><span className="text-sm font-bold text-emerald-300">{num}</span><div className="flex-1"><h3 className="text-2xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-slate-400">{desc}</p></div><span className="text-2xl text-slate-500">↗</span></div>)}</div></div></section>
      <section id="languages" className="scroll-mt-32 py-24 sm:py-32"><div className={wrap}><div className="mb-12 grid gap-8 lg:grid-cols-2"><div><p className={kicker}>03 / LANGUAGES</p><h2 className="mt-5 text-4xl font-semibold sm:text-6xl">One workspace.<br/><span className="serif italic font-normal text-emerald-300">Many languages.</span></h2></div><p className="self-end text-lg leading-8 text-slate-400">Explore eleven popular programming languages using the same simple conversion workflow.</p></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{langs.map((lang,i)=><button type="button" onClick={open} key={lang} className="group flex min-h-32 flex-col justify-between rounded-2xl border border-white/10 bg-[#111e2e] p-5 text-left transition hover:border-emerald-300/50 hover:bg-[#192b3c]"><span className="flex justify-between text-xs text-slate-500"><span>{String(i+1).padStart(2,'0')}</span><span className="group-hover:text-emerald-300">↗</span></span><div className="flex items-center gap-3"><LanguageIcon language={lang.toLowerCase() === "c++" ? "cpp" : lang.toLowerCase() === "c#" ? "csharp" : lang.toLowerCase()} /><strong className="text-base font-semibold">{lang}</strong></div></button>)}</div><p className="mt-6 text-sm text-slate-500">AI-generated conversions need developer review and testing.</p></div></section>
      <section className="bg-[#101c2c] py-24 sm:py-32"><div className={`${wrap} grid items-center gap-14 lg:grid-cols-2`}><div><p className={kicker}>04 / SEE THE IDEA</p><h2 className="mt-5 text-4xl font-semibold sm:text-6xl">Ideas don't<br/>have <span className="serif italic font-normal text-emerald-300">borders.</span></h2><p className="mt-7 max-w-lg text-lg leading-8 text-slate-400">Keep the algorithm, change the syntax. Get an initial translation and refine it into the right solution for your project.</p><button className={`${button} mt-9 bg-emerald-300 text-slate-950`} onClick={open}>Try the converter ↗</button></div><div className="overflow-hidden rounded-3xl border border-white/15 bg-[#070e1b] shadow-2xl"><div className="flex items-center gap-2 border-b border-white/10 px-6 py-4"><span className="h-2.5 w-2.5 rounded-full bg-rose-400"/><span className="h-2.5 w-2.5 rounded-full bg-amber-300"/><span className="h-2.5 w-2.5 rounded-full bg-emerald-300"/><span className="ml-3 font-mono text-xs text-slate-500">codeshift / preview</span></div><div className="space-y-7 p-6 sm:p-8"><div><p className="mb-3 text-xs font-bold tracking-widest text-emerald-300">JAVASCRIPT</p><pre className="overflow-x-auto font-mono text-sm leading-7 text-blue-200">{'const greet = (name) => {\n  return `Hello, ${name}!`;\n};'}</pre></div><div className="border-y border-white/10 py-4 text-center text-xs tracking-widest text-slate-500">↓ &nbsp; AI-ASSISTED TRANSLATION</div><div><p className="mb-3 text-xs font-bold tracking-widest text-emerald-300">PYTHON</p><pre className="overflow-x-auto font-mono text-sm leading-7 text-blue-200">{'def greet(name):\n    return f"Hello, {name}!"'}</pre></div></div></div></div></section>
      <section id="faq" className="scroll-mt-32 py-24 sm:py-32"><div className={`${wrap} grid gap-14 lg:grid-cols-2`}><div><p className={kicker}>05 / QUESTIONS</p><h2 className="mt-5 text-4xl font-semibold sm:text-6xl">Good questions.<br/><span className="serif italic font-normal text-emerald-300">Clear answers.</span></h2><p className="mt-7 text-slate-400">Understand what CodeShift can and cannot do.</p></div><div className="divide-y divide-white/10 border-y border-white/10">{faqs.map(([q,a],i)=><div key={q} className="py-5"><button type="button" className="flex w-full items-center justify-between gap-5 text-left font-semibold" aria-expanded={faq===i} onClick={()=>setFaq(faq===i?-1:i)}><span>{q}</span><span className="text-2xl text-emerald-300">{faq===i?'−':'+'}</span></button>{faq===i&&<p className="mt-4 max-w-xl leading-7 text-slate-400">{a}</p>}</div>)}</div></div></section>
      <section className="border-y border-white/10 bg-gradient-to-br from-[#173d3b] to-[#112034] py-24 text-center sm:py-32"><div className={wrap}><p className={kicker}>YOUR NEXT BUILD STARTS HERE</p><h2 className="mt-5 text-5xl font-semibold sm:text-7xl">Ready to <span className="serif italic font-normal text-emerald-300">shift?</span></h2><p className="mt-5 text-lg text-slate-300">Your code is the beginning, not the limit.</p><button className={`${button} mt-8 bg-emerald-300 text-slate-950`} onClick={open}>Launch CodeShift ↗</button></div></section>
    </main>
  </div>;
}

export function Footer({ onOpenConverter }) {
  return (
    <footer className="bg-[#070c16] py-16">
      <div className={wrap}>
        <div className="grid gap-10 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs leading-7 text-slate-400">AI-assisted code translation for developers and curious builders. Independent prototype.</p>
          </div>
          <div>
            <h3 className="mb-5 font-bold">Explore</h3>
            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <a href="#features">Features</a>
              <a href="#workflow">Workflow</a>
              <a href="#languages">Languages</a>
            </div>
          </div>
          <div>
            <h3 className="mb-5 font-bold">Product</h3>
            <div className="flex flex-col items-start gap-3 text-sm text-slate-400">
              <button type="button" onClick={onOpenConverter}>Converter</button>
              <a href="#faq">FAQ</a>
              <a href="#top">Back to top ↑</a>
            </div>
          </div>
          <div>
            <h3 className="mb-5 font-bold">Resources</h3>
            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <a href="https://ai.google.dev/gemini-api/docs" target="_blank" rel="noreferrer">Gemini API docs ↗</a>
              <a href="https://react.dev" target="_blank" rel="noreferrer">React ↗</a>
            </div>
          </div>
        </div>
        <p className="pt-8 text-sm text-slate-500">© {new Date().getFullYear()} CodeShift · Independent developer project</p>
      </div>
    </footer>
  );
}
