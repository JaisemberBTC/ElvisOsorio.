import { BlockItem, BlockEditorDocument } from '../../types';

/**
 * Converts an array of BlockItems into clean, semantic, ready-to-render HTML.
 */
export const blocksToHTML = (blocks: BlockItem[], title: string = 'Documento'): string => {
  const contentHTML = blocks.map((block) => {
    switch (block.type) {
      case 'heading-1':
        return `<h1 style="font-size: 2rem; font-weight: 800; margin-top: 1.5rem; margin-bottom: 0.75rem; color: inherit; line-height: 1.2;">${block.content || ''}</h1>`;
      
      case 'heading-2':
        return `<h2 style="font-size: 1.5rem; font-weight: 700; margin-top: 1.25rem; margin-bottom: 0.5rem; color: inherit; line-height: 1.3;">${block.content || ''}</h2>`;
      
      case 'heading-3':
        return `<h3 style="font-size: 1.25rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; color: inherit; line-height: 1.4;">${block.content || ''}</h3>`;
      
      case 'paragraph':
        return `<p style="font-size: 1rem; line-height: 1.7; margin-bottom: 0.85rem; color: inherit;">${block.content || '<br/>'}</p>`;
      
      case 'quote':
        return `<blockquote style="border-left: 4px solid #f59e0b; padding-left: 1.25rem; margin: 1rem 0; font-style: italic; opacity: 0.95; font-size: 1.05rem;">
          ${block.content || ''}
          ${block.caption ? `<footer style="font-size: 0.85rem; margin-top: 0.4rem; opacity: 0.75; font-style: normal;">— ${block.caption}</footer>` : ''}
        </blockquote>`;
      
      case 'scripture-callout':
        return `<div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 1rem 1.25rem; margin: 1rem 0;">
          <div style="font-weight: 700; color: #f59e0b; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.25rem;">🕊️ Versículo / Palabra Sagrada</div>
          <p style="font-style: italic; font-size: 1.05rem; margin: 0; line-height: 1.6;">"${block.content || ''}"</p>
          ${block.caption ? `<div style="font-weight: 600; font-size: 0.9rem; margin-top: 0.5rem; color: #f59e0b;">— ${block.caption}</div>` : ''}
        </div>`;
      
      case 'todo-list':
        return `<div style="display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.5rem;">
          <input type="checkbox" ${block.checked ? 'checked' : ''} disabled style="margin-top: 0.3rem; accent-color: #f59e0b;" />
          <span style="font-size: 1rem; ${block.checked ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${block.content || ''}</span>
        </div>`;
      
      case 'bullet-list':
        return `<ul style="margin: 0.5rem 0; padding-left: 1.5rem; list-style-type: disc;">
          <li style="margin-bottom: 0.35rem; line-height: 1.6;">${block.content || ''}</li>
        </ul>`;
      
      case 'numbered-list':
        return `<ol style="margin: 0.5rem 0; padding-left: 1.5rem; list-style-type: decimal;">
          <li style="margin-bottom: 0.35rem; line-height: 1.6;">${block.content || ''}</li>
        </ol>`;
      
      case 'code':
        return `<pre style="background: #0f172a; color: #38bdf8; padding: 1rem; border-radius: 10px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.9rem; overflow-x: auto; margin: 1rem 0; border: 1px solid rgba(255,255,255,0.1);"><code>${escapeHtml(block.content || '')}</code></pre>`;
      
      case 'callout':
        return `<div style="display: flex; align-items: flex-start; gap: 0.75rem; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 12px; padding: 1rem; margin: 1rem 0;">
          <span style="font-size: 1.25rem;">${block.calloutIcon || '💡'}</span>
          <div style="font-size: 0.95rem; line-height: 1.6; color: inherit;">${block.content || ''}</div>
        </div>`;
      
      case 'image':
        return `<figure style="margin: 1.5rem 0; text-align: center;">
          <img src="${block.imageUrl || ''}" alt="${block.caption || 'Imagen'}" style="max-width: 100%; border-radius: 12px; display: inline-block; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />
          ${block.caption ? `<figcaption style="font-size: 0.85rem; opacity: 0.7; margin-top: 0.5rem;">${block.caption}</figcaption>` : ''}
        </figure>`;
      
      case 'divider':
        return `<hr style="border: none; border-top: 1px solid rgba(148, 163, 184, 0.2); margin: 2rem 0;" />`;
      
      default:
        return `<p>${block.content || ''}</p>`;
    }
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      max-width: 780px;
      margin: 2rem auto;
      padding: 0 1.5rem;
      color: #1e293b;
      line-height: 1.6;
    }
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #0b0f19;
        color: #f1f5f9;
      }
    }
  </style>
</head>
<body>
  <article>
    ${contentHTML}
  </article>
</body>
</html>`;
};

/**
 * Converts blocks to clean Markdown format
 */
export const blocksToMarkdown = (blocks: BlockItem[], title: string = ''): string => {
  const lines: string[] = [];
  if (title) {
    lines.push(`# ${title}\n`);
  }

  blocks.forEach((b) => {
    switch (b.type) {
      case 'heading-1':
        lines.push(`# ${b.content}\n`);
        break;
      case 'heading-2':
        lines.push(`## ${b.content}\n`);
        break;
      case 'heading-3':
        lines.push(`### ${b.content}\n`);
        break;
      case 'paragraph':
        lines.push(`${b.content}\n`);
        break;
      case 'quote':
        lines.push(`> ${b.content}${b.caption ? `\n> — *${b.caption}*` : ''}\n`);
        break;
      case 'scripture-callout':
        lines.push(`> 🕊️ **${b.caption || 'Versículo'}**: "${b.content}"\n`);
        break;
      case 'todo-list':
        lines.push(`- [${b.checked ? 'x' : ' '}] ${b.content}`);
        break;
      case 'bullet-list':
        lines.push(`* ${b.content}`);
        break;
      case 'numbered-list':
        lines.push(`1. ${b.content}`);
        break;
      case 'code':
        lines.push(`\`\`\`${b.language || ''}\n${b.content}\n\`\`\`\n`);
        break;
      case 'callout':
        lines.push(`> ${b.calloutIcon || '💡'} ${b.content}\n`);
        break;
      case 'image':
        lines.push(`![${b.caption || 'Imagen'}](${b.imageUrl})\n*${b.caption || ''}*\n`);
        break;
      case 'divider':
        lines.push(`---\n`);
        break;
    }
  });

  return lines.join('\n');
};

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
