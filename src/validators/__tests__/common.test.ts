import { describe, expect, it } from 'vitest';
import { cnpjSchema, cpfSchema, emailSchema, passwordSchema, phoneSchema } from '../common';

describe('validators/common', () => {
  describe('emailSchema', () => {
    it('aceita e-mail válido e normaliza', () => {
      const r = emailSchema.safeParse('  ADMIN@FALCAO.COM  ');
      expect(r.success).toBe(true);
      if (r.success) expect(r.data).toBe('admin@falcao.com');
    });

    it('rejeita vazio', () => {
      expect(emailSchema.safeParse('').success).toBe(false);
    });

    it('rejeita sem @', () => {
      expect(emailSchema.safeParse('admin').success).toBe(false);
    });
  });

  describe('passwordSchema', () => {
    it('exige mínimo de 8 caracteres', () => {
      expect(passwordSchema.safeParse('123').success).toBe(false);
      expect(passwordSchema.safeParse('12345678').success).toBe(true);
    });

    it('limita a 72 caracteres (bcrypt)', () => {
      expect(passwordSchema.safeParse('a'.repeat(72)).success).toBe(true);
      expect(passwordSchema.safeParse('a'.repeat(73)).success).toBe(false);
    });
  });

  describe('cpfSchema', () => {
    it('remove caracteres não-numéricos e exige 11 dígitos', () => {
      expect(cpfSchema.safeParse('123.456.789-00').success).toBe(true);
      expect(cpfSchema.safeParse('123').success).toBe(false);
    });
  });

  describe('cnpjSchema', () => {
    it('exige 14 dígitos', () => {
      expect(cnpjSchema.safeParse('12.345.678/0001-99').success).toBe(true);
      expect(cnpjSchema.safeParse('123').success).toBe(false);
    });
  });

  describe('phoneSchema', () => {
    it('aceita 10 (fixo) e 11 (celular) dígitos', () => {
      expect(phoneSchema.safeParse('(11) 3333-4444').success).toBe(true);
      expect(phoneSchema.safeParse('(11) 99999-8888').success).toBe(true);
      expect(phoneSchema.safeParse('123').success).toBe(false);
    });
  });
});
