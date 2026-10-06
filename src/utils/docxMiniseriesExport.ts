import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export async function downloadMiniseriesWordDoc(series: any): Promise<void> {
  const title = series?.seriesTitle || 'Miniserie de Fe';
  const logline = series?.logline || '';
  const episodes = series?.episodes || [];

  const children: Paragraph[] = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Sinopsis: ", bold: true }),
        new TextRun(logline)
      ]
    }),
    new Paragraph({ text: "" })
  ];

  episodes.forEach((ep: any) => {
    children.push(
      new Paragraph({
        text: `${ep.episodeTitle || `Capítulo ${ep.episodeNumber}`}`,
        heading: HeadingLevel.HEADING_1
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Gancho: ", bold: true }),
          new TextRun(ep.hook || '')
        ]
      })
    );

    (ep.scenes || []).forEach((sc: any) => {
      children.push(
        new Paragraph({
          text: `Escena ${sc.sceneNumber} (${sc.timeframe || '10s'})`,
          heading: HeadingLevel.HEADING_2
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Acción: ", bold: true }),
            new TextRun(sc.action || '')
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Narración: ", bold: true }),
            new TextRun(sc.narration || '')
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Prompt Visual: ", bold: true }),
            new TextRun(sc.englishPromptWithSpanishDialogue || sc.imageToVideoPrompt || '')
          ]
        }),
        new Paragraph({ text: "" })
      );
    });
  });

  const doc = new Document({
    sections: [{ children }]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_')}_Guion_Completo.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
