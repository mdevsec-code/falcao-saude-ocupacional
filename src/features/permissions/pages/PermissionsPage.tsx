import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { ALL_ROLES, ROLE_LABELS } from '@/constants/roles';
import { ALL_PERMISSIONS, ROLE_PERMISSIONS, type Permission } from '@/constants/permissions';

/** Chaves de tradução (`permissions:labels.*`) para cada permissão do RBAC. */
const PERMISSION_LABEL_KEYS: Record<Permission, string> = {
  'appointment:read': 'appointmentRead',
  'appointment:write': 'appointmentWrite',
  'appointment:delete': 'appointmentDelete',
  'patient:read': 'patientRead',
  'patient:write': 'patientWrite',
  'employee:read': 'employeeRead',
  'employee:write': 'employeeWrite',
  'aso:read': 'asoRead',
  'aso:write': 'asoWrite',
  'exam:read': 'examRead',
  'exam:write': 'examWrite',
  'report:read': 'reportRead',
  'report:write': 'reportWrite',
  'users:manage': 'usersManage',
  'settings:manage': 'settingsManage',
  'audit:read': 'auditRead',
  'deviation:read': 'deviationRead',
  'deviation:write': 'deviationWrite',
  'atestado:write': 'atestadoWrite',
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
                  {t('permissions:table.permissionColumn')}
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
                    {t(`permissions:labels.${PERMISSION_LABEL_KEYS[permission]}`)}
                  </td>
                  {ALL_ROLES.map((role) => {
                    const granted = ROLE_PERMISSIONS[role].includes(permission);
                    return (
                      <td key={role} className="px-3 py-2 text-center">
                        {granted ? (
                          <Check
                            className="mx-auto h-4 w-4 text-success"
                            aria-label={t('permissions:table.allowed')}
                          />
                        ) : (
                          <span
                            className="text-muted"
                            aria-label={t('permissions:table.notAllowed')}
                          >
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
        <p className="mt-4 text-xs text-ink-soft">{t('permissions:page.footnote')}</p>
      </div>
    </>
  );
}

export default PermissionsPage;
