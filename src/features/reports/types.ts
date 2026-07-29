/**
 * Tipos do módulo Relatórios. Em produção, viriam da API;
 * mantemos a forma aqui para que o módulo seja tipável de ponta a ponta.
 */

export type ReportKind = 'agendamentos' | 'atendimentos' | 'aso' | 'aso_a_ptos' | 'aso_periodicos';

export interface ReportRecord {
  id: string;
  date: string; // ISO
  patient: string;
  company: string;
  sector: string;
  exam: string;
  status: 'agendado' | 'realizado' | 'cancelado' | 'faltou' | 'apto' | 'inapto' | 'apto_restricao';
  professional: string;
  notes?: string;
}

export interface ReportFilters {
  /** Data inicial (ISO). */
  from?: string;
  /** Data final (ISO). */
  to?: string;
  /** Empresa (nome). */
  company?: string;
  /** Tipo de relatório. */
  kind: ReportKind;
}
