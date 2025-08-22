import type MarkdownIt from 'markdown-it';

function isRelativeUrl(src: string): boolean {
  if (!src) return false;
  if (src.startsWith('data:')) return false;
  if (/^https?:\/\//i.test(src)) return false;
  if (src.startsWith('/')) return false;
  return true;
}

export function useImageRenderer(md: MarkdownIt, options?: { basePath?: string }) {
  const base = options?.basePath ?? '/';
  const defaultRender = md.renderer.rules.image || function (tokens, idx, opts, env, self) {
    return self.renderToken(tokens, idx, opts);
  };

  md.renderer.rules.image = function (tokens, idx, opts, env, self) {
    const token = tokens[idx];
    const srcIdx = token.attrIndex('src');
    if (srcIdx >= 0) {
      const src = token.attrs![srcIdx][1];
      const rewritten = isRelativeUrl(src) ? (base.replace(/\/$/, '') + '/' + src.replace(/^\//, '')) : src;
      token.attrs![srcIdx][1] = rewritten;
    }
    // add class for consistent style
    const clsIdx = token.attrIndex('class');
    if (clsIdx >= 0) token.attrs![clsIdx][1] += ' md-image';
    else token.attrPush(['class', 'md-image']);
    return defaultRender(tokens, idx, opts, env, self);
  };
}


