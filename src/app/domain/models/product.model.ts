export interface Product {
  id: string;
  title: string;
  price: number;
  quickDescription?: string;
  fullDescription?: string;
  image?: string;
  downloadUrl?: string;
}
