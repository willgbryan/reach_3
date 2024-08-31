import {
    Document,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    HeadingLevel,
    TextRun,
    AlignmentType,
    BorderStyle,
    UnderlineType,
    Packer,
    WidthType,
    ExternalHyperlink,
    TableLayoutType,
    ITableRowOptions,
    VerticalAlign,
  } from 'docx';
  import { marked } from 'marked';

const createEditableDocument = async (content: string): Promise<void> => {
    try {
      if (!content || typeof content !== 'string') {
        throw new Error('Invalid content provided');
      }

      marked.setOptions({
        gfm: true
      });
  
      const rawHtml = marked.parse(content, { async: false }) as string;
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');
  
      const children: (Paragraph | Table)[] = [];
  
      const processNode = (node: Node): (Paragraph | Table)[] => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          switch (element.tagName) {
            case 'H1':
            case 'H2':
            case 'H3':
            case 'H4':
            case 'H5':
            case 'H6':
              return [new Paragraph({
                text: element.textContent || '',
                heading: HeadingLevel[`HEADING_${element.tagName.charAt(1)}` as keyof typeof HeadingLevel],
                spacing: { before: 200, after: 100 },
              })];
            case 'P':
              return [new Paragraph({
                children: processTextContent(element),
                spacing: { before: 100, after: 100 },
              })];
            case 'UL':
            case 'OL':
              return Array.from(element.children).flatMap((li) => {
                if (li.tagName === 'LI') {
                  return [new Paragraph({
                    children: processTextContent(li),
                    bullet: { level: 0 },
                    spacing: { before: 50, after: 50 },
                  })];
                }
                return [];
              });
            case 'PRE':
              const codeElement = element.querySelector('code');
              return [new Paragraph({
                text: codeElement ? codeElement.textContent || '' : '',
                style: 'Code',
                spacing: { before: 100, after: 100 },
                shading: { type: 'solid', color: 'F0F0F0' },
              })];
              case 'TABLE':
                const rows = Array.from(element.querySelectorAll('tr')).map((tr, rowIndex) => {
                  const tableCells = Array.from(tr.querySelectorAll('th, td')).map((cell, cellIndex) => {
                    const cellChildren = processTextContent(cell);
                    const cellContent = cellChildren.length > 0
                      ? new Paragraph({ 
                          children: cellChildren,
                          spacing: { before: 60, after: 60 },
                          alignment: AlignmentType.LEFT,
                        })
                      : new Paragraph({ text: '' });
    
                    return new TableCell({
                      children: [cellContent],
                      verticalAlign: VerticalAlign.CENTER,
                      width: { size: 100 / tr.cells.length, type: WidthType.PERCENTAGE },
                      margins: { top: 60, bottom: 60, left: 100, right: 100 },
                    });
                  });
    
                  return new TableRow({
                    tableHeader: rowIndex === 0,
                    height: { value: 0, rule: 'auto' },
                    children: tableCells,
                  });
                });
    
                const columnCount = rows[0]?.cells.length || 0;
    
                return [new Table({
                  rows: rows,
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  layout: TableLayoutType.FIXED,
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' },
                    left: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' },
                    right: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' },
                    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' },
                    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' },
                  },
                  columnWidths: Array(columnCount).fill(100 / columnCount),
                })];
            default:
              return Array.from(element.childNodes).flatMap(processNode);
          }
        }
        return [];
      };
  
      const processTextContent = (node: Node): (TextRun | ExternalHyperlink)[] => {
        return Array.from(node.childNodes).flatMap((child) => {
          if (child.nodeType === Node.ELEMENT_NODE) {
            const element = child as HTMLElement;
            switch (element.tagName) {
              case 'STRONG':
              case 'B':
                return [new TextRun({ text: element.textContent || '', bold: true })];
              case 'EM':
              case 'I':
                return [new TextRun({ text: element.textContent || '', italics: true })];
              case 'A':
                const link = element as HTMLAnchorElement;
                return [new ExternalHyperlink({
                  children: [
                    new TextRun({
                      text: link.textContent || '',
                      style: "Hyperlink",
                    }),
                  ],
                  link: link.href,
                })];
              default:
                return processTextContent(element);
            }
          } else if (child.nodeType === Node.TEXT_NODE) {
            return [new TextRun(child.textContent || '')];
          }
          return [];
        });
      };
  
      children.push(...Array.from(doc.body.childNodes).flatMap(processNode));
  
      const docx = new Document({
        styles: {
          paragraphStyles: [
            {
              id: 'Code',
              name: 'Code',
              basedOn: 'Normal',
              run: {
                font: 'Courier New',
              },
            },
          ],
          characterStyles: [
            {
              id: 'Hyperlink',
              name: 'Hyperlink',
              basedOn: 'Normal',
              run: {
                color: '0000FF',
                underline: {
                  type: UnderlineType.SINGLE,
                },
              },
            },
          ],
        },
        sections: [{
          children: children
        }]
      });
  
      const buffer = await Packer.toBuffer(docx);
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'exported_content.docx';
      link.click();
      URL.revokeObjectURL(link.href);
  
      console.log("Word document created successfully");
    } catch (error) {
      console.error("Error creating Word document:", error);
      if (error instanceof Error) {
        console.error(`Error creating Word document: ${error.message}`);
      } else {
        console.error('An unknown error occurred');
      }
    }
  };

export default createEditableDocument;