// lib/auth.ts
import type { NextApiRequest } from "next";

const ADMIN_COOKIE = "peageplus_admin_token";

// Jeton de session généré au démarrage du serveur (en mémoire, perdu au redémarrage).
const validTokens = new Set<string>();

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "peageplus2026",
  };
}

export function creerSessionAdmin(): string {
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  validTokens.add(token);
  return token;
}

export function detruireSessionAdmin(token: string) {
  validTokens.delete(token);
}

export function estAdminValide(token: string | undefined): boolean {
  if (!token) return false;
  return validTokens.has(token);
}

export function tokenDepuisRequete(req: NextApiRequest): string | undefined {
  return req.cookies[ADMIN_COOKIE];
}

export const ADMIN_COOKIE_NAME = ADMIN_COOKIE;
