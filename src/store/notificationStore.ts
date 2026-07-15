import { create } from 'zustand';

/**
 * Store de notificações. Inicialmente expõe apenas a interface —
 * integrações futuras conectarão ao Sonner para disparar toasts globais.
 */
interface NotificationState {
  count: number;
  increment: () => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  clear: () => set({ count: 0 }),
}));
