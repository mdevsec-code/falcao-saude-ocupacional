import { describe, expect, it } from 'vitest';
import { loginSchema } from '../auth';

describe('loginSchema', () => {
  it('aceita credenciais válidas', () => {
    const result = loginSchema.safeParse({
      email: 'admin@falcao.com',
      password: 'admin123',
    });
    expect(result.success).toBe(true);
  });

  it('normaliza o e-mail (trim + lowercase)', () => {
    const result = loginSchema.safeParse({
      email: '  ADMIN@FALCAO.COM  ',
      password: 'admin123',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('admin@falcao.com');
    }
  });

  it('rejeita e-mail vazio', () => {
    const result = loginSchema.safeParse({ email: '', password: 'admin123' });
    expect(result.success).toBe(false);
  });

  it('rejeita e-mail inválido', () => {
    const result = loginSchema.safeParse({ email: 'não-é-email', password: 'admin123' });
    expect(result.success).toBe(false);
  });

  it('rejeita senha curta', () => {
    const result = loginSchema.safeParse({ email: 'admin@falcao.com', password: '123' });
    expect(result.success).toBe(false);
  });

  it('rejeita senha vazia', () => {
    const result = loginSchema.safeParse({ email: 'admin@falcao.com', password: '' });
    expect(result.success).toBe(false);
  });
});
