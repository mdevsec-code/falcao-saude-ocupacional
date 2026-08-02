import { jsPDF } from 'jspdf';

import { brand } from '@/config/brand';
import { APPOINTMENT_CONCLUSION, APPOINTMENT_CONCLUSION_LABELS } from '@/constants/status';
import type { AppointmentConclusion } from '@/constants/status';
import { DUTY_TYPE_LABELS, type DutyType } from '@/constants/duties';
import { formatCPF, formatDate, formatDateTime } from '@/utils/format';

export interface AsoInput {
  patientName: string;
  patientCpf: string;
  patientRole: string;
  patientSector: string;
  examType: string;
  /** Nome do médico, ex.: "Dra. Camila Torres — CRM 45213". */
  doctor: string;
  /** Data do atendimento, ISO (yyyy-MM-dd). */
  attendanceDate: string;
  conclusion: AppointmentConclusion;
  restrictionNotes?: string | null;
  dutyFitness?: { duty: DutyType; fit: boolean }[];
}

const CONCLUSION_RGB: Record<AppointmentConclusion, [number, number, number]> = {
  [APPOINTMENT_CONCLUSION.APTO]: [47, 125, 90],
  [APPOINTMENT_CONCLUSION.APTO_COM_RESTRICAO]: [172, 126, 6],
  [APPOINTMENT_CONCLUSION.INAPTO]: [178, 58, 50],
  [APPOINTMENT_CONCLUSION.ENCAMINHADO]: [44, 93, 138],
};

/**
 * Gera o PDF do ASO (Atestado de Saúde Ocupacional) de um atendimento e
 * dispara o download. Layout de certificado (não tabular) — cabeçalho,
 * dados do colaborador/exame, conclusão em destaque e linhas de assinatura.
 */
export function generateAsoPdf(input: AsoInput): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  const goldRgb: [number, number, number] = [172, 126, 6];

  doc.setFillColor(...goldRgb);
  doc.rect(0, 0, pageWidth, 8, 'F');

  let cursor = 44;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(20, 20, 20);
  doc.text('ATESTADO DE SAÚDE OCUPACIONAL', margin, cursor);

  cursor += 18;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text(brand.legalName, margin, cursor);

  cursor += 28;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, cursor, pageWidth - margin, cursor);
  cursor += 24;

  function sectionTitle(label: string) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...goldRgb);
    doc.text(label.toUpperCase(), margin, cursor);
    cursor += 14;
  }

  function fieldRow(fields: { label: string; value: string }[]) {
    const colWidth = contentWidth / fields.length;
    fields.forEach((field, idx) => {
      const x = margin + idx * colWidth;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(field.label.toUpperCase(), x, cursor);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(20, 20, 20);
      doc.text(field.value || '—', x, cursor + 15);
    });
    cursor += 38;
  }

  sectionTitle('Dados do colaborador');
  fieldRow([
    { label: 'Nome', value: input.patientName },
    { label: 'CPF', value: formatCPF(input.patientCpf) },
  ]);
  fieldRow([
    { label: 'Função', value: input.patientRole },
    { label: 'Setor', value: input.patientSector },
  ]);

  cursor += 6;
  sectionTitle('Dados do exame');
  fieldRow([
    { label: 'Tipo de exame', value: input.examType },
    { label: 'Data', value: formatDate(input.attendanceDate) ?? '—' },
  ]);
  fieldRow([{ label: 'Médico responsável', value: input.doctor }]);

  cursor += 10;

  const conclusionRgb = CONCLUSION_RGB[input.conclusion];
  const conclusionLabel = APPOINTMENT_CONCLUSION_LABELS[input.conclusion];
  const boxHeight = 56;
  doc.setFillColor(conclusionRgb[0], conclusionRgb[1], conclusionRgb[2]);
  doc.roundedRect(margin, cursor, contentWidth, boxHeight, 6, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('CONCLUSÃO', margin + 16, cursor + 20);
  doc.setFontSize(18);
  doc.text(conclusionLabel.toUpperCase(), margin + 16, cursor + 42);
  cursor += boxHeight + 20;

  if (input.dutyFitness && input.dutyFitness.length > 0) {
    sectionTitle('Aptidão por atividade de risco');
    const rowHeight = 18;
    input.dutyFitness.forEach((entry, idx) => {
      const rowY = cursor + idx * rowHeight;
      if (idx % 2 === 0) {
        doc.setFillColor(248, 246, 240);
        doc.rect(margin, rowY - 11, contentWidth, rowHeight, 'F');
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      doc.text(DUTY_TYPE_LABELS[entry.duty], margin + 8, rowY);

      const fitRgb = entry.fit
        ? CONCLUSION_RGB[APPOINTMENT_CONCLUSION.APTO]
        : CONCLUSION_RGB[APPOINTMENT_CONCLUSION.INAPTO];
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(fitRgb[0], fitRgb[1], fitRgb[2]);
      doc.text(entry.fit ? 'APTO' : 'INAPTO', margin + contentWidth - 50, rowY);
    });
    cursor += input.dutyFitness.length * rowHeight + 16;
  }

  if (input.restrictionNotes) {
    doc.setFillColor(250, 243, 225);
    const noteLines = doc.splitTextToSize(input.restrictionNotes, contentWidth - 32);
    const noteHeight = 24 + noteLines.length * 12;
    doc.roundedRect(margin, cursor, contentWidth, noteHeight, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...goldRgb);
    doc.text('RESTRIÇÕES', margin + 16, cursor + 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(noteLines, margin + 16, cursor + 30);
    cursor += noteHeight + 20;
  }

  cursor += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  const legalText = doc.splitTextToSize(
    'Este atestado é emitido em conformidade com a NR-7 (Programa de Controle Médico de ' +
      'Saúde Ocupacional) e demais normas regulamentadoras aplicáveis, para fins de registro ' +
      'do estado de saúde ocupacional do colaborador na data do exame.',
    contentWidth,
  );
  doc.text(legalText, margin, cursor);
  cursor += legalText.length * 11 + 40;

  const signatureWidth = (contentWidth - 24) / 2;
  const signatureY = Math.max(cursor, pageHeight - 140);
  doc.setDrawColor(150, 150, 150);
  doc.line(margin, signatureY, margin + signatureWidth, signatureY);
  doc.line(
    margin + signatureWidth + 24,
    signatureY,
    margin + signatureWidth + 24 + signatureWidth,
    signatureY,
  );
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  doc.text('Assinatura e carimbo do médico', margin, signatureY + 14);
  doc.text('Assinatura do colaborador', margin + signatureWidth + 24, signatureY + 14);

  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text(
    `${brand.shortName} · Gerado em ${formatDateTime(new Date()) ?? ''}`,
    margin,
    pageHeight - 24,
  );

  const fileDate = input.attendanceDate.replaceAll('-', '');
  const safeName = input.patientName.trim().toLowerCase().replace(/\s+/g, '-');
  doc.save(`aso_${safeName}_${fileDate}.pdf`);

  return doc;
}
