export interface Row {
  id: string;
  date: Date;
  amount: number;
  description: string;
  category: string;
  show: boolean;
}

export interface Category {
  name: string;
  rows: Row[];
  isInverted?: boolean;
  subCategories?: Category[];
}

export interface RuleI {
  name: string;
  searchFor: string;
  category: string;
  isRegex?: boolean;
}

export type SortBy = "amount" | "alphabetical";
