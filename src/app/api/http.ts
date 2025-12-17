export type ApiErrorDetails = {
  status: number;
  statusText: string;
  bodyText?: string;
};

export class ApiError extends Error {
  details: ApiErrorDetails;

  constructor(message: string, details: ApiErrorDetails) {
    super(message);
    this.name = "ApiError";
    this.details = details;
  }
}

function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return (envUrl?.trim() || "http://localhost:8080").replace(/\/+$/, "");
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => undefined);
    throw new ApiError(`API 요청 실패: ${response.status} ${response.statusText}`, {
      status: response.status,
      statusText: response.statusText,
      bodyText,
    });
  }

  return (await response.json()) as T;
}

