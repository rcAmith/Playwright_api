export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export class TokenManager {
  private session: AuthSession | null = null;

  setSession(session: AuthSession) {
    this.session = session;
  }

  getAccessToken() {
    return this.session?.accessToken ?? null;
  }

  getRefreshToken() {
    return this.session?.refreshToken ?? null;
  }

  clear() {
    this.session = null;
  }

  hasToken() {
    return !!this.session?.accessToken;
  }
}
