import { jwtDecode } from "jwt-decode";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

interface JwtPayload {
  sub?: string;
  exp?: number;
  iat?: number;
}

export function saveAuth(token: string, user: User): void {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  setupTokenExpiry(token);
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function getUser(): User | null {
  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    return JSON.parse(user) as User;
  } catch {
    logout();
    return null;
  }
}

export function isTokenValid(): boolean {
  const token = getToken();
  if (!token) return false;

  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return !!exp && exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function setupTokenExpiry(token = getToken()): void {
  if (!token) return;

  try {
    const { exp } = jwtDecode<JwtPayload>(token);

    if (!exp) {
      logout();
      return;
    }

    const remainingTime = exp * 1000 - Date.now();

    if (remainingTime <= 0) {
      handleLogout();
      return;
    }

    window.setTimeout(() => {
      if (getToken() === token) handleLogout();
    }, remainingTime);
  } catch {
    handleLogout();
  }
}

function handleLogout(): void {
  logout();
  window.location.replace("/login");
}