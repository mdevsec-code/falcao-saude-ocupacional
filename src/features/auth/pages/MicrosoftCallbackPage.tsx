import { useEffect, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { LoadingState } from '@/components/feedback/LoadingState';
import { ROUTE_PATHS } from '@/constants/routes';
import { useAuth } from '../hooks/useAuth';

/**
 * Destino do redirect feito pelo backend após `/auth/microsoft/callback`
 * (`GET /auth/microsoft`, ver `server/src/auth/auth.controller.ts`). O token
 * chega no fragmento da URL (`#token=...&expiresAt=...`), não na query
 * string, para não ficar em logs de acesso do servidor/proxy.
 */
export function MicrosoftCallbackPage(): ReactNode {
  const navigate = useNavigate();
  const { completeSsoLogin } = useAuth();
  const { t } = useTranslation('auth');
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const token = params.get('token');
    const expiresAt = params.get('expiresAt');

    async function finish() {
      if (!token || !expiresAt) {
        navigate(`${ROUTE_PATHS.LOGIN}?error=sso_failed`, { replace: true });
        return;
      }
      const result = await completeSsoLogin(token, expiresAt);
      if (!result.ok) {
        toast.error(result.error);
        navigate(`${ROUTE_PATHS.LOGIN}?error=sso_failed`, { replace: true });
        return;
      }
      navigate(ROUTE_PATHS.DASHBOARD, { replace: true });
    }

    void finish();
  }, [navigate, completeSsoLogin]);

  return <LoadingState label={t('auth:login.sso.finishing')} className="min-h-screen" />;
}

export default MicrosoftCallbackPage;
