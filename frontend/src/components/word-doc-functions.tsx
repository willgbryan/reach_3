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
  PageOrientation,
  Header,
  Footer,
  TableOfContents,
  PageNumber,
} from 'docx';
import { marked } from 'marked';

interface ReportConfig {
  font: string;
  pageOrientation: 'portrait' | 'landscape';
  marginSize: number;
  documentTitle: string;
  // subject: string;
  // tableOfContents: boolean;
  pageNumbering: boolean;
  headerText: string;
  footerText: string;
}

const createEditableDocument = async (content: string, config: ReportConfig): Promise<void> => {
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
              const tableCells = Array.from(tr.querySelectorAll('th, td')).map((cell) => {
                const cellContent = processTextContent(cell);
                return new TableCell({
                  children: [new Paragraph({
                    children: cellContent,
                    alignment: AlignmentType.CENTER,
                  })],
                  verticalAlign: VerticalAlign.CENTER,
                  width: { size: 2000, type: WidthType.DXA },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                });
              });

              return new TableRow({
                tableHeader: rowIndex === 0,
                height: { value: 300, rule: 'auto' },
                children: tableCells,
              });
            });

            const columnCount = rows[0]?.cells.length || 1;

            return [new Table({
              rows: rows,
              width: { size: 9000, type: WidthType.DXA },
              layout: TableLayoutType.FIXED,
              borders: {
                top: { style: BorderStyle.SINGLE, size: 2, color: '000000' },
                bottom: { style: BorderStyle.SINGLE, size: 2, color: '000000' },
                left: { style: BorderStyle.SINGLE, size: 2, color: '000000' },
                right: { style: BorderStyle.SINGLE, size: 2, color: '000000' },
                insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
                insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
              },
              columnWidths: Array(columnCount).fill(9000 / columnCount),
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
          return [new TextRun({ text: child.textContent || '', font: config.font })];
        }
        return [];
      });
    };

    children.push(...Array.from(doc.body.childNodes).flatMap(processNode));

    // if (config.tableOfContents) {
    //   children.unshift(new TableOfContents());
    // }

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
        properties: {
          page: {
            size: {
              orientation: config.pageOrientation === 'landscape' ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT,
            },
            margin: {
              top: config.marginSize * 72,
              right: config.marginSize * 72,
              bottom: config.marginSize * 72,
              left: config.marginSize * 72,
            },
          },
        },
        headers: {
          default: new Header({
            children: [new Paragraph(config.headerText)],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun(config.footerText),
                  ...(config.pageNumbering ? [
                    new TextRun(" | Page "),
                    new TextRun({
                      children: [PageNumber.CURRENT],
                    }),
                    new TextRun(" of "),
                    new TextRun({
                      children: [PageNumber.TOTAL_PAGES],
                    }),
                  ] : []),
                ],
              }),
            ],
          }),
        },
        children: children,
      }],
      title: config.documentTitle,
      // subject: config.subject,
    });

    const buffer = await Packer.toBuffer(docx);
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${config.documentTitle || 'exported_content'}.docx`;
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