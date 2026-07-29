import { describe, expect, it } from 'vitest';

import { buildWhatsappUrl, encodeWhatsappMessage, normalizeBrazilPhone } from '../whatsapp';

describe('normalizeBrazilPhone', () => {
  it('adiciona DDI 55 quando o número tem 11 dígitos (celular)', () => {
    expect(normalizeBrazilPhone('11987654321')).toBe('5511987654321');
  });

  it('adiciona DDI 55 quando o número tem 10 dígitos (fixo)', () => {
    expect(normalizeBrazilPhone('1133334444')).toBe('551133334444');
  });

  it('preserva DDI 55 já presente', () => {
    expect(normalizeBrazilPhone('5511987654321')).toBe('5511987654321');
  });

  it('limpa máscara (parênteses, espaços, traço)', () => {
    expect(normalizeBrazilPhone('(11) 98765-4321')).toBe('5511987654321');
    expect(normalizeBrazilPhone('+55 11 9 8765-4321')).toBe('5511987654321');
  });

  it('retorna null para entradas inválidas', () => {
    expect(normalizeBrazilPhone('')).toBeNull();
    expect(normalizeBrazilPhone('abc')).toBeNull();
    expect(normalizeBrazilPhone('123')).toBeNull(); // muito curto
    expect(normalizeBrazilPhone('123456789012')).toBeNull(); // muito longo
  });
});

describe('encodeWhatsappMessage', () => {
  it('codifica quebras de linha como %0A', () => {
    expect(encodeWhatsappMessage('olá\ntudo bem?')).toBe('ol%C3%A1%0Atudo%20bem%3F');
  });

  it('codifica acentos e espaços', () => {
    const encoded = encodeWhatsappMessage('Falcão Construções');
    expect(encoded).toContain('Falc%C3%A3o');
    expect(encoded).toContain('Constru%C3%A7%C3%B5es');
  });
});

describe('buildWhatsappUrl', () => {
  it('monta a URL no formato wa.me', () => {
    const url = buildWhatsappUrl({ phone: '(11) 98765-4321', name: 'Maria' }, 'Bom dia!');
    expect(url).not.toBeNull();
    expect(url).toMatch(/^https:\/\/wa\.me\/5511987654321\?text=Ol%C3%A1/);
  });

  it('retorna null quando o número é inválido', () => {
    expect(buildWhatsappUrl({ phone: '123' }, 'oi')).toBeNull();
  });
});
