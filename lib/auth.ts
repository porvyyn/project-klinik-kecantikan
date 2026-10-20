import { api, clearSession, TOKEN_KEY, USER_KEY } from "./api";

export interface SessionUser {
  id: string; fullName: string; email: string;
  role: "Admin" | "Doctor" | "Patient"; doctorId?: string | null;
}

export async function login(email: string, password: string): Promise<SessionUser> {
  const res = await api<{ token: string; user: SessionUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: email.trim(), password }),
  });
  if (res.user.role === "Patient") throw new Error("Akun pasien tidak bisa masuk dashboard web.");
  localStorage.setItem(TOKEN_KEY, res.token);
  localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  return res.user;
}

export const logout = () => clearSession();

export function getUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as SessionUser) : null;
}