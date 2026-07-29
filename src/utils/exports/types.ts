/**
 * Tipos compartilhados pelos utilitários de exportação (PDF, Excel, WhatsApp).
 * Mantemos um único modelo para evitar drift entre os formatos.
 */

export interface ExportColumn<T> {
  /** Chave do campo no objeto de origem. */
  key: keyof T & string;
  /** Rótulo exibido no cabeçalho. */
  header: string;
  /**
   * Transformador opcional. Recebe o valor cru e devolve o texto que vai
   * para o PDF/Excel. Se omitido, o valor é convertido via `String()`.
   */
  format?: (value: unknown, row: T) => string;
  /** Largura preferencial (apenas Excel, em caracteres). */
  width?: number;
}

export interface ExportDocument<T> {
  /** Título do documento (cabeçalho principal). */
  title: string;
  /** Subtítulo opcional exibido abaixo do título. */
  subtitle?: string;
  /** Linhas a serem exportadas. */
  rows: readonly T[];
  /** Colunas. */
  columns: readonly ExportColumn<T>[];
  /** Nome do arquivo (sem extensão). */
  fileName: string;
  /** Metadados opcionais (empresa, período, autor...). */
  meta?: Readonly<Record<string, string | number | null | undefined>>;
}

export interface PhoneContact {
  /** Telefone no formato livre. Será normalizado para DDI 55 + DDD + número. */
  phone: string;
  /** Nome do destinatário (usado apenas na mensagem). */
  name?: string;
}
