export interface Plan {
  _id: string;
  icon: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  durationInDays: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
