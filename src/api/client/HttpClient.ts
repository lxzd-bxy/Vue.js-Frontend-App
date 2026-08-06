import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { AuthError } from "../errors/authError";
import { NetworkError } from "../errors/networkError";
import type { HttpClientConfig } from "./interfaces/httpClientConfig";
import type { HttpRequestOptions } from "./interfaces/httpRequestOptions";
import { useAuthStore } from "../../stores/authStore";

export class HttpClient {
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig) {
    this.config = config;
  }

  async request<T>(path: string, options: HttpRequestOptions = {}): Promise<T> {
    const urls = this.buildUrlCandidates(path);
    let lastError: unknown = null;

    for (const url of urls) {
      try {
        let headers = this.normalizeHeaders(options.headers);

        const authStore = useAuthStore();
        headers = {
          ...headers,
          Authorization: `Bearer ${authStore.accessToken}`,
        };

        const axiosConfig: AxiosRequestConfig = {
          method: options.method || "GET",
          headers: headers,
          data: options.body,
          withCredentials: options.credentials === "omit" ? false : true,
          validateStatus: () => true,
        };

        const response: AxiosResponse = await axios(url, axiosConfig);
        const data = this.parseResponse<T>(response);

        if (
          response.status < 400 ||
          [400, 401, 403, 409].includes(response.status)
        ) {
          return data ?? ({} as T);
        }

        throw new AuthError(
          `Request failed with status ${response.status}`,
          response.status,
        );
      } catch (error) {
        lastError = error;
      }
    }

    if (lastError instanceof TypeError) {
      throw new NetworkError(
        `Network error – check HTTPS backend availability. ${lastError.message}`,
      );
    }

    if (axios.isAxiosError(lastError) && lastError.response) {
      throw new AuthError(
        `Request failed with status ${lastError.response.status}`,
        lastError.response.status,
      );
    }

    if (lastError instanceof AuthError) {
      throw lastError;
    }

    throw new AuthError(
      (lastError as Error)?.message || "Unknown error occurred",
    );
  }

  private buildUrlCandidates(path: string): string[] {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    const candidates = new Set<string>();

    this.config.baseUrls.forEach((base) => {
      candidates.add(`${base.replace(/\/$/, "")}${normalized}`);
    });

    candidates.add(normalized);
    return Array.from(candidates);
  }

  private normalizeHeaders(headers?: HeadersInit): Record<string, string> {
    if (!headers) return {};
    if (headers instanceof Headers) {
      const result: Record<string, string> = {};
      headers.forEach((value, key) => {
        result[key] = value;
      });
      return result;
    }
    if (Array.isArray(headers)) {
      return Object.fromEntries(headers);
    }

    return headers as Record<string, string>;
  }

  private parseResponse<T>(response: AxiosResponse): T | null {
    const contentTypeHeader = response.headers["content-type"];
    const contentType = contentTypeHeader ? String(contentTypeHeader) : "";
    const data = response.data;

    if (contentType.includes("application/json")) {
      return data as T;
    }

    if (data === undefined || data === null) {
      return null;
    }

    if (typeof data === "string") {
      try {
        return JSON.parse(data) as T;
      } catch {
        return { message: data } as T;
      }
    }

    return data as T;
  }
}
