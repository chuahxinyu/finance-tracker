export interface Row {
  date: Date;
  amount: number;
  description: string;
}

export interface Category {
  name: string;
  rows: Row[];
}