import React, { useState } from 'react';
import { getLanguage } from './languageDetection';

// Developer language icons loaded from Devicon's public asset library.
// A visible text fallback is shown if the icon cannot be loaded.
const iconNames = {
  javascript: 'javascript/javascript-original',
  typescript: 'typescript/typescript-original',
  python: 'python/python-original',
  java: 'java/java-original',
  c: 'c/c-original',
  cpp: 'cplusplus/cplusplus-original',
  csharp: 'csharp/csharp-original',
  dart: 'dart/dart-original',
  php: 'php/php-original',
  go: 'go/go-original',
  ruby: 'ruby/ruby-original',
};
const root = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';

export default function LanguageIcon({ language, size = 'md', className = '' }) {
  const [failedIcon, setFailedIcon] = useState(null);
  const meta = getLanguage(language);
  const icon = iconNames[language];
  const failed = failedIcon === language;
  const compact = size === 'sm';
  return (
    <span
      role="img"
      aria-label={meta ? `${meta.label} icon` : 'Unknown programming language'}
      className={`inline-flex shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] shadow-inner shadow-white/5 ${compact ? 'h-8 w-8' : 'h-12 w-12'} ${className}`}
    >
      {icon && !failed ? (
        <img
          src={`${root}${icon}.svg`}
          alt=""
          loading="lazy"
          onError={() => setFailedIcon(language)}
          className={compact ? 'h-5 w-5 object-contain' : 'h-8 w-8 object-contain'}
        />
      ) : (
        <span className={`${compact ? 'text-[10px]' : 'text-xs'} font-mono font-extrabold text-emerald-200`}>
          {meta?.short ?? '?'}
        </span>
      )}
    </span>
  );
}
