export function resetAuthStorage(): void {
  try {
    localStorage.removeItem('falcao-auth');
    localStorage.removeItem('falcao-ui');
  } catch {
    // ignore — ambiente sem localStorage
  }
}
