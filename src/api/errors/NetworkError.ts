import { AuthError } from "./authError";
export class NetworkError extends AuthError {
  constructor(message: string) {
    super(message, 0);
    this.name = "NetworkError";
  }
}
