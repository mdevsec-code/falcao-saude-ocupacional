import type { CidCategory } from '@/constants/cid';

export interface CidCustomEntry {
  id: string;
  code: string;
  description: string;
  category: CidCategory;
}

/**
 * Códigos CID cadastrados manualmente pela equipe, além do catálogo curado
 * em `constants/cid.ts`. Começa vazio — o catálogo base já cobre os casos
 * mais comuns; este espaço é para complementar quando necessário.
 */
export const CID_CUSTOM_FIXTURE: CidCustomEntry[] = [];
