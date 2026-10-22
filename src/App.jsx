import React, { lazy, Suspense, useRef } from 'react';
import LandingPage, { Footer } from './LandingPage';

const CodeConverter = lazy(() => import('./CodeConverter'));

function App() {
  const converterRef = useRef(null);

  const openConverter = () => {
    converterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <LandingPage onOpenConverter={openConverter} />
      <div id="converter" ref={converterRef} className="scroll-mt-6">
        <Suspense fallback={<div className="bg-[#080f1d] px-4 py-20 text-center text-slate-400" role="status">Loading converter…</div>}>
          <CodeConverter />
        </Suspense>
      </div>
      <Footer onOpenConverter={openConverter} />
    </>
  );
}

export default App;