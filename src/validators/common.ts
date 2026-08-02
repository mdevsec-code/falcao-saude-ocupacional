import { z } from 'zod';
import i18n from '@/i18n';

/**
 * Schemas Zod compartilhados. Cada schema é exportado junto de seu
 * tipo inferido (`infer<typeof schema>`), mantendo fonte única de verdade.
 *
 * As mensagens usam o singleton `i18n` (não o hook `useTranslation`) porque
 * estes schemas são construídos uma vez, no carregamento do módulo — fora
 * de qualquer componente React. Isso resolve a mensagem no idioma ativo no
 * momento em que a tela que usa o formulário é carregada (cobre o caso real:
 * o usuário escolhe o idioma e usa o app), mas não re-traduz mensagens de
 * validação já construídas se o idioma for trocado em uma sessão já aberta
 * na mesma tela — nesse caso específico, um recarregamento da página resolve.
 */

export const emailSchema = z
  .string()
  .trim()
  .min(1, i18n.t('validation:required'))
  .email(i18n.t('validation:email'))
  .transform((s) => s.toLowerCase());

export const passwordSchema = z
  .string()
  .min(1, i18n.t('validation:required'))
  .min(8, i18n.t('validation:minPassword'))
  .max(72, i18n.t('validation:maxPassword')); // Limite do bcrypt

export const cpfSchema = z
  .string()
  .transform((s) => s.replace(/\D/g, ''))
  .refine((s) => s.length === 11, i18n.t('validation:cpf'));

export const cnpjSchema = z
  .string()
  .transform((s) => s.replace(/\D/g, ''))
  .refine((s) => s.length === 14, i18n.t('validation:cnpj'));

export const phoneSchema = z
  .string()
  .transform((s) => s.replace(/\D/g, ''))
  .refine((s) => s.length === 10 || s.length === 11, i18n.t('validation:phone'));

export const isoDateSchema = z
  .string()
  .refine((s) => !Number.isNaN(new Date(s).getTime()), i18n.t('validation:date'))
  .transform((s) => new Date(s).toISOString());

export const nonEmptyString = z.string().min(1, i18n.t('validation:required'));
export const optionalString = z
  .string()
  .max(500, i18n.t('validation:maxLength', { count: 500 }))
  .optional()
  .or(z.literal(''));
