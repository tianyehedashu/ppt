import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import 'reveal.js/plugin/highlight/monokai.css';
import Reveal from 'reveal.js';
import Markdown from 'markdown-it';
import mermaid from 'mermaid';

// Reveal plugins (highlight, notes, zoom)
// TS types are not required for dynamic import of plugin JS
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import RevealHighlight from 'reveal.js/plugin/highlight/highlight.esm.js';
// @ts-ignore
import RevealNotes from 'reveal.js/plugin/notes/notes.esm.js';
// @ts-ignore
import RevealZoom from 'reveal.js/plugin/zoom/zoom.esm.js';

import { renderMarkdownToSections } from './lib/markdown/splitter';
import { useImageRenderer } from './lib/markdown/image';
import { applyHighlightHook } from './lib/highlight';
import { renderD3Blocks } from './lib/d3';
import './styles/theme.css';
import './styles/mermaid.css';

async function bootstrap() {
  const slidesRoot = document.getElementById('slides-root')!;

  const url = new URL(location.href);
  const src = url.searchParams.get('src') || '/slides/demo.md';
  const mdText = await fetch(src).then(r => r.text());

  const md = new Markdown({
    html: false,
    linkify: true,
    highlight: applyHighlightHook()
  });
  useImageRenderer(md, { basePath: '/assets' });

  const { sectionsHtml } = renderMarkdownToSections(md, mdText);
  slidesRoot.innerHTML = sectionsHtml;

  const deck = new Reveal({
    hash: true,
    plugins: [RevealHighlight, RevealNotes, RevealZoom],
    viewDistance: 3
  });
  await deck.initialize();

  mermaid.initialize({ startOnLoad: false });
  await mermaid.run({ querySelector: '.reveal .slides' });

  renderD3Blocks(document);

  deck.on('slidechanged', () => {
    renderD3Blocks(document);
  });
}

bootstrap().catch(console.error);


