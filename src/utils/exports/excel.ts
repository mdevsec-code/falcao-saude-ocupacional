import * as ExcelJS from 'exceljs';

import { brand } from '@/config/brand';
import { formatDateTime } from '@/utils/format';
import type { ExportDocument } from './types';

interface ExportExcelOptions {
  /** Nome da planilha (aba). Padrão: `Dados`. */
  sheetName?: string;
  /** Cor do cabeçalho em ARGB hex (ex.: `FFAC7E06`). */
  headerColor?: string;
}

/**
 * Gera um arquivo `.xlsx` a partir de um documento tabular e dispara o
 * download. Usa ExcelJS (browser bundle) — funciona 100% client-side.
 */
export async function exportToExcel<T>(
  document: ExportDocument<T>,
  options: ExportExcelOptions = {},
): Promise<void> {
  const sheetName = options.sheetName ?? 'Dados';
  const headerColor = options.headerColor ?? 'FFAC7E06'; // gold-500

  const workbook = new ExcelJS.Workbook();
  workbook.creator = brand.legalName;
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(sheetName, {
    views: [{ state: 'frozen', ySplit: 3 }],
  });

  // Título
  sheet.mergeCells(1, 1, 1, document.columns.length);
  const titleCell = sheet.getCell('A1');
  titleCell.value = document.title;
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF1F2937' } };
  titleCell.alignment = { vertical: 'middle' };
  sheet.getRow(1).height = 26;

  // Subtítulo / linha de metadados
  const metaParts: string[] = [];
  if (document.subtitle) metaParts.push(document.subtitle);
  metaParts.push(`Gerado em ${formatDateTime(new Date()) ?? ''}`);
  metaParts.push(`${document.rows.length} registros`);
  sheet.mergeCells(2, 1, 2, document.columns.length);
  const subtitleCell = sheet.getCell('A2');
  subtitleCell.value = metaParts.join('  ·  ');
  subtitleCell.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF6B7280' } };
  sheet.getRow(2).height = 18;

  // Cabeçalho
  const headerRow = sheet.getRow(3);
  headerRow.values = document.columns.map((c) => c.header);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: headerColor },
    };
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      right: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    };
  });
  headerRow.height = 22;

  // Larguras
  document.columns.forEach((col, idx) => {
    sheet.getColumn(idx + 1).width = col.width ?? 18;
  });

  // Linhas
  document.rows.forEach((row, rowIdx) => {
    const sheetRow = sheet.getRow(3 + rowIdx + 1);
    document.columns.forEach((col, colIdx) => {
      const raw = (row as Record<string, unknown>)[col.key];
      const value = col.format
        ? col.format(raw, row)
        : raw === null || raw === undefined
          ? ''
          : String(raw);
      const cell = sheetRow.getCell(colIdx + 1);
      cell.value = value;
      cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF1F2937' } };
      cell.alignment = { vertical: 'middle', wrapText: false };
      cell.border = {
        top: { style: 'hair', color: { argb: 'FFE5E7EB' } },
        left: { style: 'hair', color: { argb: 'FFE5E7EB' } },
        right: { style: 'hair', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'hair', color: { argb: 'FFE5E7EB' } },
      };
      // Linhas alternadas
      if (rowIdx % 2 === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFAF7F0' },
        };
      }
    });
  });

  // Auto-filter
  if (document.rows.length > 0) {
    sheet.autoFilter = {
      from: { row: 3, column: 1 },
      to: { row: 3 + document.rows.length, column: document.columns.length },
    };
  }

  // Gera o blob e dispara o download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  triggerDownload(blob, `${document.fileName}.xlsx`);
}

function triggerDownload(blob: Blob, fileName: string): void {
  if (typeof window === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  // Libera a URL no próximo tick (deixa o browser iniciar o download)
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
