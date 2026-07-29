import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { ALL_ROLES, ROLE_LABELS } from '@/constants/roles';
import { ALL_PERMISSIONS, ROLE_PERMISSIONS, type Permission } from '@/constants/permissions';

const PERMISSION_LABELS: Record<Permission, string> = {
  'appointment:read': 'Ver agendamentos',
  'appointment:write': 'Criar/editar agendamentos',
  'appointment:delete': 'Excluir agendamentos',
  'patient:read': 'Ver pacientes',
  'patient:write': 'Criar/editar pacientes',
  'employee:read': 'Ver colaboradores',
  'employee:write': 'Criar/editar colaboradores',
  'aso:read': 'Ver ASO',
  'aso:write': 'Emitir ASO',
  'exam:read': 'Ver exames',
  'exam:write': 'Criar/editar exames',
  'report:read': 'Ver relatórios',
  'report:write': 'Gerar relatórios',
  'users:manage': 'Gerenciar usuários',
  'settings:manage': 'Gerenciar configurações',
  'audit:read': 'Ver auditoria',
};

export function PermissionsPage() {
  const { t } = useTranslation('permissions');

  return (
    <>
      <PageHeader
        eyebrow={t('permissions:page.eyebrow')}
        title={t('permissions:page.title')}
        description={t('permissions:page.description')}
      />

      <div className="px-6 py-8 sm:px-8">
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-gold-50/60 text-ink">
              <tr>
                <th className="sticky left-0 bg-brand-gold-50/60 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Permissão
                </th>
                {ALL_ROLES.map((role) => (
                  <th
                    key={role}
                    className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider text-ink-soft"
                  >
                    {ROLE_LABELS[role]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {ALL_PERMISSIONS.map((permission) => (
                <tr key={permission} className="hover:bg-hover">
                  <td className="sticky left-0 bg-surface px-3 py-2 font-medium text-ink">
                    {PERMISSION_LABELS[permission]}
                  </td>
                  {ALL_ROLES.map((role) => {
                    const granted = ROLE_PERMISSIONS[role].includes(permission);
                    return (
                      <td key={role} className="px-3 py-2 text-center">
                        {granted ? (
                          <Check
                            className="mx-auto h-4 w-4 text-success"
                            aria-label="Permitido"
                          />
                        ) : (
                          <span className="text-muted" aria-label="Não permitido">
                            —
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-ink-soft">
          {t('permissions:page.footnote')}
        </p>
      </div>
    </>
  );
}

export default PermissionsPage;
