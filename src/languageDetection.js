// Fast, local heuristics. Not a parser: ambiguous or tiny snippets remain unclassified.
export const LANGUAGE_OPTIONS = [
  { value:'javascript',label:'JavaScript',short:'JS',ext:'js',tone:'yellow' },
  { value:'typescript',label:'TypeScript',short:'TS',ext:'ts',tone:'blue' },
  { value:'python',label:'Python',short:'Py',ext:'py',tone:'sky' },
  { value:'java',label:'Java',short:'Jv',ext:'java',tone:'orange' },
  { value:'csharp',label:'C#',short:'C#',ext:'cs',tone:'purple' },
  { value:'c',label:'C',short:'C',ext:'c',tone:'sky' },
  { value:'cpp',label:'C++',short:'C++',ext:'cpp',tone:'blue' },
  { value:'dart',label:'Dart',short:'D',ext:'dart',tone:'cyan' },
  { value:'php',label:'PHP',short:'php',ext:'php',tone:'indigo' },
  { value:'go',label:'Go',short:'Go',ext:'go',tone:'cyan' },
  { value:'ruby',label:'Ruby',short:'Rb',ext:'rb',tone:'rose' },
];
const rules = {
  javascript: [ [/\b(const|let|var)\s+\w+\s*=/g,2], [/=>/g,3], [/\b(console\.log|document\.|window\.|require\(|module\.exports|export\s+default)/g,5], [/\bfunction\s+\w+\s*\(/g,3], [/\b(import|export)\s+.*\bfrom\s+['"]/g,2] ],
  typescript: [ [/\b(interface|type)\s+[A-Za-z_][\w]*/g,6], [/\bimplements\s+\w+/g,3], [/:\s*(string|number|boolean|unknown|never|any|void)(?=\s*[,);=]|\s*=>)/g,5], [/\bas\s+(const|string|number|boolean)\b/g,4], [/\b(?:readonly|private|public)\s+\w+/g,3], [/\b(const|let)\b/g,1] ],
  python: [ [/^\s*(def|async def|class)\s+\w+.*:\s*$/gm,6], [/^\s*(from\s+\w+\s+import|import\s+\w+)/gm,2], [/\b(print|len|range|enumerate|self)\s*\(/g,3], [/^\s*(for|if|elif|else|while|with|try|except)\b.*:\s*$/gm,4], [/\b(None|True|False|lambda|yield|pass|self)\b/g,2], [/f['"][^'"]*\{/g,2] ],
  java: [ [/\bpublic\s+static\s+void\s+main\s*\(/g,12], [/\bSystem\.out\.print(?:ln)?\s*\(/g,9], [/\b(import\s+java\.|package\s+com\.)/g,5], [/\b(public|private|protected)\s+(static\s+)?(class|void|int|String|boolean)\b/g,4], [/\bnew\s+ArrayList\s*</g,4] ],
  csharp: [ [/\busing\s+System(?:\.|;)/g,9], [/\bConsole\.Write(Line)?\s*\(/g,9], [/\bnamespace\s+[A-Za-z]/g,5], [/\b(public|private)\s+(static\s+)?(void|string|int|class)\b/g,3], [/\b(var\s+\w+\s*=\s*new|async\s+Task|IEnumerable<)/g,4] ],
  c: [ [/#\s*include\s*[<"](?:stdio\.h|stdlib\.h|string\.h|math\.h|ctype\.h|stdbool\.h|stdint\.h)[>"]/g,9], [/\b(?:printf|scanf|fprintf|fscanf|puts|fgets|malloc|calloc|realloc|free)\s*\(/g,5], [/\bint\s+main\s*\(\s*(?:void)?\s*\)/g,4], [/\bstruct\s+\w+\s*\{/g,2] ],
  cpp: [ [/#\s*include\s*[<"](?:iostream|vector|string|algorithm|memory|map|unordered_map)[>"]/g,12], [/\bstd::/g,9], [/\b(cout|cin)\s*<</g,8], [/\busing\s+namespace\s+std/g,8], [/\bint\s+main\s*\(/g,5], [/\bvector\s*</g,4] ],
  dart: [ [/\bvoid\s+main\s*\(/g,5], [/\b(import\s+['"]package:|import\s+['"]dart:)/g,9], [/\bFuture<|Stream<|Widget\s+build|StatelessWidget|StatefulWidget/g,7], [/\bfinal\s+\w+\s*=/g,3], [/\bprint\s*\(/g,2] ],
  php: [ [/<\?php/g,12], [/\$[A-Za-z_][\w]*\s*=/g,6], [/\b(echo|isset|array_key_exists|function)\b/g,2], [/->\w+/g,3], [/\bnamespace\s+[A-Za-z_]+\\/g,4] ],
  go: [ [/^\s*package\s+main\b/gm,9], [/\bfmt\.(Println|Printf|Print)\s*\(/g,9], [/\bfunc\s+(main|\w+)\s*\(/g,6], [/\b(import\s*\(|:=|go\s+func|defer\s+)/g,4], [/\bmap\[\w+\]/g,5] ],
  ruby: [ [/^\s*def\s+\w+[^\n]*$/gm,5], [/^\s*end\s*$/gm,4], [/\b(puts|attr_accessor|require_relative|unless)\b/g,6], [/\bdo\s*\|[^|]*\|/g,4], [/@[a-z_]\w*/g,2] ],
};
export function detectLanguage(source) {
  const code=String(source||'');
  if (!code.trim() || code.trim().length < 10) return {language:null,confidence:'uncertain',reason:'Enter more code to identify the language',candidates:[]};
  const scores=Object.fromEntries(LANGUAGE_OPTIONS.map(l=>[l.value,0]));
  for (const [lang,patterns] of Object.entries(rules)) for (const [re,weight] of patterns) {
    re.lastIndex=0; let matches=0; while (re.exec(code) && matches < 4) matches++;
    scores[lang] += matches*weight;
  }
  // TypeScript inherits most JS syntax, but strong TS markers outweigh ordinary JS tokens.
  if (scores.typescript >= 5) scores.typescript += Math.floor(scores.javascript*0.55);
  const candidates=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  const [best,runner]=candidates;
  const margin=best[1]-(runner?.[1]||0);
  if (best[1] < 4 || margin < 2) return {language:null,confidence:'uncertain',reason:'Ambiguous snippet — choose the source language manually',candidates:candidates.slice(0,3)};
  return {language:best[0],confidence:best[1]>=9 && margin>=5?'high':'medium',reason:'Detected from syntax patterns',candidates:candidates.slice(0,3)};
}
export const getLanguage = id => LANGUAGE_OPTIONS.find(l=>l.value===id);
