export function renderMarkdownToSections(md: any, markdown: string): { sectionsHtml: string } {
  const H = '__SPLIT__';
  const V = '__VSPLIT__';
  const replaced = markdown
    .replace(/^---$/gm, H)
    .replace(/^--$/gm, V);

  const html = md.render(replaced);
  const horizontal = html.split(H);
  const sections = horizontal.map(block => {
    const vertical = block.split(V).map(inner => `<section>${inner}</section>`).join('');
    return `<section>${vertical}</section>`;
  }).join('');

  return { sectionsHtml: sections };
}


