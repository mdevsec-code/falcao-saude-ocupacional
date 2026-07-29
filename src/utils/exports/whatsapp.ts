import type { PhoneContact } from './types';

/**
 * Normaliza um telefone BR para o formato usado por `wa.me`:
 *   55 + DDD (2) + número (8 ou 9 dígitos).
 * Remove tudo que não é dígito. Se o número já começar com `55`, mantém.
 */
export function normalizeBrazilPhone(raw: string): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');
  if (!digits) return null;

  // Já veio com DDI 55.
  if (digits.startsWith('55') && digits.length >= 12) {
    return digits;
  }

  // Sem DDI: precisa ter DDD + número (10 ou 11 dígitos).
  if (digits.length < 10 || digits.length > 11) {
    return null;
  }
  return `55${digits}`;
}

/**
 * Codifica uma mensagem para uso em URL. Encoda espaços, quebras de linha
 * e caracteres especiais — preservando a legibilidade do wa.me.
 */
export function encodeWhatsappMessage(message: string): string {
  // `wa.me` aceita `?text=` cru (com %0A para \n). Usamos encodeURIComponent
  // para garantir compatibilidade com web e mobile.
  return encodeURIComponent(message);
}

interface OpenWhatsappOptions {
  /** Abre em nova aba (`_blank`). Padrão: `true`. */
  newTab?: boolean;
}

/**
 * Abre uma conversa de WhatsApp com o número informado e a mensagem pré-preenchida.
 *
 * Usa o deep link universal `https://wa.me/<numero>?text=<msg>`, suportado
 * pelo app mobile e pela versão web. Não retorna Promise — a abertura da
 * URL é síncrona e o consumidor pode envolver em try/catch se necessário.
 */
export function openWhatsappChat(
  contact: PhoneContact,
  message: string,
  options: OpenWhatsappOptions = {},
): void {
  const number = normalizeBrazilPhone(contact.phone);
  if (!number) {
    throw new Error(`Número de WhatsApp inválido: "${contact.phone}"`);
  }

  const text = contact.name ? `Olá, ${contact.name}!\n\n${message}` : message;
  const url = `https://wa.me/${number}?text=${encodeWhatsappMessage(text)}`;

  if (typeof window === 'undefined') {
    // SSR: nada a fazer.
    return;
  }

  if (options.newTab === false) {
    window.location.href = url;
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Constrói a URL sem abrir — útil para testes ou para colocar em um `<a>`.
 */
export function buildWhatsappUrl(contact: PhoneContact, message: string): string | null {
  const number = normalizeBrazilPhone(contact.phone);
  if (!number) return null;
  const text = contact.name ? `Olá, ${contact.name}!\n\n${message}` : message;
  return `https://wa.me/${number}?text=${encodeWhatsappMessage(text)}`;
}
