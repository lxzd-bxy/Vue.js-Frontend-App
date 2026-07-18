import { AuthError } from './AuthError';

export class ValidationError extends AuthError {
    constructor(message: string) {
        super(message, 400)
        this.name = 'ValidationError'
    }
}