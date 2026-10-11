const DEFAULT_PUBLIC_APP_URL = "https://www.thehomefront.ai";

function normalizeBaseUrl(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.replace(/\/$/, "");
}

function getBrowserOrigin() {
  if (typeof window === "undefined" || !window.location?.origin) return null;
  return normalizeBaseUrl(window.location.origin);
}

function normalizePath(path: string) {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function getPublicAppUrl() {
  return (
    normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL) ||
    getBrowserOrigin() ||
    DEFAULT_PUBLIC_APP_URL
  );
}

export function getPublicApiBaseUrl() {
  return (
    normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL) ||
    getBrowserOrigin() ||
    normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL) ||
    DEFAULT_PUBLIC_APP_URL
  );
}

export function buildAppUrl(path = "/") {
  return new URL(normalizePath(path), `${getPublicAppUrl()}/`).toString();
}

export function buildApiUrl(path: string) {
  return new URL(normalizePath(path), `${getPublicApiBaseUrl()}/`).toString();
}

export function buildReferralUrl(refCode: string) {
  const url = new URL("/", `${getPublicAppUrl()}/`);
  url.searchParams.set("ref", refCode);
  return url.toString();
}