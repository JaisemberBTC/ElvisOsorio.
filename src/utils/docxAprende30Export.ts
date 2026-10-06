import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export async function downloadAprende30WordDoc(item: any): Promise<void> {
  const title = item?.titulo || 'Aprende en 30 Segundos';
  const hook = item?.gancho_inicial || '';
  const scenes = item?.escenas || [];

  const children: Paragraph[] = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Gancho: ", bold: true }),
        new TextRun(hook)
      ]
    }),
    new Paragraph({ text: "" })
  ];

  scenes.forEach((sc: any, idx: number) => {
    children.push(
      new Paragraph({
        text: `Escena ${idx + 1} (${sc.durationSec || 10}s)`,
        heading: HeadingLevel.HEADING_2
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Texto en pantalla: ", bold: true }),
          new TextRun(sc.onScreenText || '')
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
          new TextRun({ text: "Prompt visual: ", bold: true }),
          new TextRun(sc.visualPrompt || '')
        ]
      }),
      new Paragraph({ text: "" })
    );
  });

  const doc = new Document({
    sections: [{ children }]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_')}_30s.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
