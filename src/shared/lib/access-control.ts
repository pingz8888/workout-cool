/**
 * Access control utilities for program sessions
 * Determines user access based on authentication status
 */

export interface AccessControlContext {
  isAuthenticated: boolean;
}

export type AccessAction = "allow" | "require_auth";

/**
 * Determines what action should be taken based on user authentication status
 */
export function getSessionAccess(context: AccessControlContext): AccessAction {
  const { isAuthenticated } = context;

  // Not authenticated -> require auth
  if (!isAuthenticated) {
    return "require_auth";
  }

  // Authenticated -> allow
  return "allow";
}

/**
 * Helper to check if user can start the session
 */
export function canStartSession(context: AccessControlContext): boolean {
  return getSessionAccess(context) === "allow";
}
