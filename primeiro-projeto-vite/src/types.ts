export type Category =
  | "moradia"
  | "alimento"
  | "transporte"
  | "lazer"
  | "saúde"
  | "outros";

export interface Expense {
  id: string;
  titulo: string;
  valor: number;
  categoria: Category;
}

export interface CategoryOption {
  value: Category;
  label: string;
}

export type TotalsByCategory = Record<Category, number>;
