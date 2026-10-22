import React, { useRef } from 'react';
import LandingPage, { Footer } from './LandingPage';
import CodeConverter from './CodeConverter';

function App() {
  const converterRef = useRef(null);

  const openConverter = () => {
    converterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <LandingPage onOpenConverter={openConverter} />
      <div id="converter" ref={converterRef} className="scroll-mt-6">
        <CodeConverter />
      </div>
      <Footer onOpenConverter={openConverter} />
    </>
  );
}

export default App;