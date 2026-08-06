export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string {
  if (!value) return "Email is required";
  if (!EMAIL_REGEX.test(value)) return "Please enter a valid email address";
  return "";
}
