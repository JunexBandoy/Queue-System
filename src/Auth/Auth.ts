import { api } from "../services/Api";

export const login = async (email: string, password: string) => {
  const res = await api.post("/api/token/login", { email, password });
  const { token, user } = res.data;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  return user;
};

export const logout = async () => {
  try {
    await api.post("/api/token/logout");
  } catch {}
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const getUserRole = () => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;

  const user = JSON.parse(raw);
  return user.role || null;
};
