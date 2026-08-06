import { HttpClient } from "../client/httpClient";
import { AuthApi } from "../endpoints/authApi";
import { AuthService } from "../../services/authService";

const httpClient = new HttpClient({
  baseUrls: [
    import.meta.env.VITE_API_BASE_URL?.trim(),
    import.meta.env.VITE_API_PROXY_TARGET?.trim(),
  ].filter(Boolean) as string[],
  fallbackUrls: import.meta.env.DEV ? ["https://localhost:7160"] : [],
});

const authApi = new AuthApi(httpClient);
export const authService = new AuthService(authApi);
