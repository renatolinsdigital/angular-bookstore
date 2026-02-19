export interface Product {
  id: string;
  title: string;
  price: number;
  categories?: string[];
  sellingTag?: string;
  author?: string;
  pagesCount?: number;
  quickDescription?: string;
  fullDescription?: string;
  image?: string;
  downloadUrl?: string;
}
