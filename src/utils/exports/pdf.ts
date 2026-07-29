import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { brand } from '@/config/brand';
import { formatDateTime } from '@/utils/format';
import type { ExportDocument } from './types';

interface ExportPdfOptions {
  /** Orientação da página. Padrão: `portrait`. */
  orientation?: 'portrait' | 'landscape';
  /** Cor primária (RGB 0-255) usada no cabeçalho. */
  brandRgb?: readonly [number, number, number];
}

/**
 * Gera um PDF a partir de um documento tabular e dispara o download
 * automaticamente. Retorna o `jsPDF` caso o caller queira manipular
 * o resultado (ex.: merge com outras páginas).
 */
export function exportToPdf<T>(document: ExportDocument<T>, options: ExportPdfOptions = {}): jsPDF {
  const orientation = options.orientation ?? 'landscape';
  const brandRgb = options.brandRgb ?? [172, 126, 6]; // #AC7E06 (Falcão gold)
  const doc = new jsPDF({ orientation, unit: 'pt', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;

  // Faixa colorida no topo
  doc.setFillColor(brandRgb[0], brandRgb[1], brandRgb[2]);
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Cabeçalho
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(20, 20, 20);
  doc.text(document.title, margin, 36);

  if (document.subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(90, 90, 90);
    doc.text(document.subtitle, margin, 54);
  }

  // Linha de metadados
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  const generatedAt = formatDateTime(new Date()) ?? '';
  const metaLine = [
    `${brand.legalName}`,
    `Gerado em ${generatedAt}`,
    `${document.rows.length} registro${document.rows.length === 1 ? '' : 's'}`,
  ]
    .filter(Boolean)
    .join('  ·  ');
  doc.text(metaLine, margin, 72);

  // Tabela
  const head = [document.columns.map((c) => c.header)];
  const body = document.rows.map((row) =>
    document.columns.map((col) => {
      const raw = (row as Record<string, unknown>)[col.key];
      if (col.format) return col.format(raw, row);
      if (raw === null || raw === undefined) return '';
      return String(raw);
    }),
  );

  autoTable(doc, {
    head,
    body,
    startY: 90,
    margin: { left: margin, right: margin },
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 5,
      lineColor: [220, 220, 220],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: brandRgb as [number, number, number],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: [248, 246, 240] },
    didDrawPage: (data) => {
      // Rodapé com numeração de páginas
      const page = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text(`${brand.shortName} · ${brand.tagline}`, margin, pageHeight - 16);
      doc.text(`Página ${data.pageNumber} de ${page}`, pageWidth - margin, pageHeight - 16, {
        align: 'right',
      });
    },
  });

  // Metadados extras como bloco chave/valor
  if (document.meta && Object.keys(document.meta).length > 0) {
    const finalY =
      (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 100;
    let cursor = finalY + 18;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.text('Filtros aplicados', margin, cursor);
    cursor += 14;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(70, 70, 70);
    for (const [k, v] of Object.entries(document.meta)) {
      if (v === null || v === undefined || v === '') continue;
      doc.text(`${k}: ${String(v)}`, margin, cursor);
      cursor += 12;
    }
  }

  doc.save(`${document.fileName}.pdf`);
  return doc;
}
