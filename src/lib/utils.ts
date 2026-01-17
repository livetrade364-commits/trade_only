import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Automatically use the production URL when built, unless VITE_API_URL is explicitly set
export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://trade-only-api.onrender.com' : 'http://127.0.0.1:8000');
