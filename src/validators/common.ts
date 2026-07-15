import { z } from 'zod';

/**
 * Schemas Zod compartilhados. Cada schema é exportado junto de seu
 * tipo inferido (`infer<typeof schema>`), mantendo fonte única de verdade.
 */

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Informe o e-mail')
  .email('E-mail inválido')
  .transform((s) => s.toLowerCase());

export const passwordSchema = z
  .string()
  .min(1, 'Informe a senha')
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .max(72, 'A senha deve ter no máximo 72 caracteres'); // Limite do bcrypt

export const cpfSchema = z
  .string()
  .transform((s) => s.replace(/\D/g, ''))
  .refine((s) => s.length === 11, 'CPF deve ter 11 dígitos');

export const cnpjSchema = z
  .string()
  .transform((s) => s.replace(/\D/g, ''))
  .refine((s) => s.length === 14, 'CNPJ deve ter 14 dígitos');

export const phoneSchema = z
  .string()
  .transform((s) => s.replace(/\D/g, ''))
  .refine((s) => s.length === 10 || s.length === 11, 'Telefone inválido');

export const isoDateSchema = z
  .string()
  .refine((s) => !Number.isNaN(new Date(s).getTime()), 'Data inválida')
  .transform((s) => new Date(s).toISOString());

export const nonEmptyString = z.string().min(1, 'Campo obrigatório');
export const optionalString = z
  .string()
  .max(500, 'Tamanho máximo excedido')
  .optional()
  .or(z.literal(''));
