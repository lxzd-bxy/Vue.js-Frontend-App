import { AuthError } from "./AuthError"
export class NetworkError extends AuthError {
    constructor(message: string) {
        super(message, 0)
        this.name = 'NetworkError'
    }
}