import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: 'USD' | 'EUR' | 'GBP' | 'BTC' | 'MXN';
    notation?: Intl.NumberFormatOptions['notation'];
  } = {}
) {
  const { currency = 'MXN', notation = 'standard' } = options;

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    notation,
  }).format(numericPrice);
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function getInitials(name: string) {
  const parts = name.split(' ');
  let initials = '';
  
  for (let i = 0; i < Math.min(2, parts.length); i++) {
    if (parts[i].length > 0) {
      initials += parts[i][0];
    }
  }
  
  return initials.toUpperCase();
}