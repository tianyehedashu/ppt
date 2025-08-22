export function applyHighlightHook() {
  return function highlight(code: string, lang: string) {
    // Let RevealHighlight handle actual highlighting; return raw code
    return code;
  };
}


