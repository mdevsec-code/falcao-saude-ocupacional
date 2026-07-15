/**
 * Feature flags tipadas. Centraliza ativações de módulos experimentais
 * sem precisar de bibliotecas externas.
 */
export interface FeatureFlags {
  /** Habilita a UI experimental da agenda (drag-and-drop). */
  agendaRedesign: boolean;
  /** Habilita autenticação biométrica no login. */
  biometricLogin: boolean;
  /** Habilita o command palette (⌘K). */
  commandPalette: boolean;
  /** Habilita telemetria / analytics. */
  telemetry: boolean;
}

export const features: Readonly<FeatureFlags> = Object.freeze({
  agendaRedesign: false,
  biometricLogin: false,
  commandPalette: false,
  telemetry: false,
});

export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  return features[flag];
}
