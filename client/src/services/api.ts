import axios, { type AxiosError } from "axios";
import type { ApiResponse } from "../types";

const raw = import.meta.env.VITE_API_URL;
const baseURL =
  typeof raw === "string" && raw.trim()
    ? raw.replace(/\/$/, "")
    : "";

export const api = axios.create({
  baseURL: baseURL || undefined,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

const TOKEN_KEY = "cab_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

export function getApiErrorMessage(err: unknown): string {
  const ax = err as AxiosError<ApiResponse<unknown>>;
  const msg = ax.response?.data?.message;
  if (typeof msg === "string") return msg;
  if (ax.message) return ax.message;
  return "Something went wrong";
}

export async function unwrap<T>(p: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data } = await p;
  if (!data.success || data.data === undefined) {
    throw new Error(data.message || "Request failed");
  }
  return data.data;
}
