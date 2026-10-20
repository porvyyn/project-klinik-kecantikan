const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001").replace(/\/$/, "");
export const TOKEN_KEY = "auth_token";
export const USER_KEY = "auth_user";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function api<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/v1${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Tidak dapat terhubung ke server. Cek BE dan NEXT_PUBLIC_API_BASE_URL.", 0);
  }

  const json = await res.json().catch(() => null);

  if (res.status === 401 && token && !path.startsWith("/auth/login")) {
    clearSession();
    window.location.href = "/login";
    throw new ApiError("Sesi berakhir, silakan login kembali.", 401);
  }
  if (!res.ok || !json || json.success === false) {
    throw new ApiError(json?.message || `Permintaan gagal (HTTP ${res.status}).`, res.status);
  }
  return json.data as T;
}