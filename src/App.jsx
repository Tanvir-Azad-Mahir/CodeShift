import React, { useRef, useState } from 'react';
import LandingPage, { Footer } from './LandingPage';
import CodeConverter from './CodeConverter';

function App() {
  const converterRef = useRef(null);
  const [theme, setTheme] = useState('light');

  const openConverter = () => {
    converterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      id="app"
      data-theme={theme}
      className={theme === 'dark' ? 'bg-[#07111f] text-slate-100' : 'bg-[#eff8ff] text-slate-900'}
    >
      <LandingPage onOpenConverter={openConverter} theme={theme} onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} />
      <div id="converter" ref={converterRef} className="scroll-mt-6">
        <CodeConverter theme={theme} />
      </div>
      <Footer onOpenConverter={openConverter} theme={theme} />
    </div>
  );
}

export default App;