import { AuthError } from './authError';

export class ValidationError extends AuthError {
    constructor(message: string) {
        super(message, 400)
        this.name = 'ValidationError'
    }
}