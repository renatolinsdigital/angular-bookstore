export interface Product {
  id: string;
  title: string;
  price: number;
  categories?: string[];
  quickDescription?: string;
  fullDescription?: string;
  image?: string;
  downloadUrl?: string;
}
