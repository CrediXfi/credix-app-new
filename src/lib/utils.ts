import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseStringLiteralToBoolean(value: 'true' | 'false' | undefined) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}
