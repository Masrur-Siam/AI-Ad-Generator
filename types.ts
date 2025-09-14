
export interface Template {
  id: number;
  en: string;
  bn: string;
}

export type Category = string;

export type Language = 'en' | 'bn';

export interface CategoryPrompts {
  [key: Category]: Template[];
}

export interface Ratio {
  id: string;
  label: string;
}
