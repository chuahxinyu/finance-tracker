export interface Row {
  date: Date;
  amount: number;
  description: string;
  subcategory?: string;
}

export interface Category {
  name: string;
  rows: Row[];
}