import { BlockItem } from '../../types';

export function blocksToMarkdown(blocks: BlockItem[], title?: string): string {
  const header = title ? `# ${title}\n\n` : '';
  const body = blocks
    .map(block => {
      switch (block.type) {
        case 'heading-1':
          return `# ${block.content}`;
        case 'heading-2':
          return `## ${block.content}`;
        case 'heading-3':
          return `### ${block.content}`;
        case 'paragraph':
          return block.content;
        case 'bullet-list':
          return `- ${block.content}`;
        case 'numbered-list':
          return `1. ${block.content}`;
        case 'todo-list':
          return `- [${block.checked ? 'x' : ' '}] ${block.content}`;
        case 'quote':
          return `> ${block.content}`;
        case 'scripture-callout':
          return `> **Palabra de Dios:**\n> "${block.content}"`;
        case 'code':
          return `\`\`\`${block.language || ''}\n${block.content}\n\`\`\``;
        case 'callout':
          return `> ${block.calloutIcon || '💡'} **Nota:** ${block.content}`;
        case 'image':
          return `![${block.caption || 'Imagen'}](${block.imageUrl || ''})`;
        case 'divider':
          return `---`;
        default:
          return block.content;
      }
    })
    .join('\n\n');

  return header + body;
}

export function blocksToHTML(blocks: BlockItem[], title?: string): string {
  const escape = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const header = title ? `<h1 style="font-size: 2.25rem; font-weight: bold; margin-bottom: 1.5rem;">${escape(title)}</h1>\n` : '';
  const body = blocks
    .map(block => {
      switch (block.type) {
        case 'heading-1':
          return `<h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">${escape(block.content)}</h1>`;
        case 'heading-2':
          return `<h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.75rem;">${escape(block.content)}</h2>`;
        case 'heading-3':
          return `<h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;">${escape(block.content)}</h3>`;
        case 'paragraph':
          return `<p style="line-height: 1.6; margin-bottom: 1rem;">${escape(block.content)}</p>`;
        case 'bullet-list':
          return `<li style="margin-left: 1.5rem; margin-bottom: 0.5rem;">${escape(block.content)}</li>`;
        case 'numbered-list':
          return `<li style="margin-left: 1.5rem; margin-bottom: 0.5rem;">${escape(block.content)}</li>`;
        case 'todo-list':
          return `<div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;"><input type="checkbox" ${block.checked ? 'checked' : ''} disabled /> <span>${escape(block.content)}</span></div>`;
        case 'quote':
          return `<blockquote style="border-left: 4px solid #f59e0b; padding-left: 1rem; font-style: italic; margin-bottom: 1rem;">${escape(block.content)}</blockquote>`;
        case 'scripture-callout':
          return `<div style="background: rgba(245,158,11,0.1); border-left: 4px solid #f59e0b; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;"><strong>📖 Palabra del Señor:</strong><p style="margin-top: 0.5rem; font-style: italic;">"${escape(block.content)}"</p></div>`;
        case 'code':
          return `<pre style="background: #0f172a; color: #f8fafc; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 1rem;"><code>${escape(block.content)}</code></pre>`;
        case 'callout':
          return `<div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;"><span>${block.calloutIcon || '🕊️'}</span> ${escape(block.content)}</div>`;
        case 'image':
          return `<figure style="margin-bottom: 1rem;"><img src="${block.imageUrl}" alt="${escape(block.caption || '')}" style="max-width: 100%; border-radius: 0.5rem;" /><figcaption style="font-size: 0.85rem; color: #94a3b8; text-align: center; margin-top: 0.5rem;">${escape(block.caption || '')}</figcaption></figure>`;
        case 'divider':
          return `<hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 1.5rem 0;" />`;
        default:
          return `<p>${escape(block.content)}</p>`;
      }
    })
    .join('\n');

  return header + body;
}
