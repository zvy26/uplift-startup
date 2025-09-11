export interface Plan {
  _id: string;
  icon?: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  durationInDays: number;
  trialCount: number;
  features: string[];
  isActive: boolean;
  billingCycle: string;
  type: string;
  status: string;
  tags: string[];
  maxUsers: number;
  maxSubmissions: number;
  isPopular: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
