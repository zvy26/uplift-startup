export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum UserRole {
  BASIC = "BASIC",
  MENTOR = "MENTOR",
  SALES = "SALES",
  INSTRUCTOR = "INSTRUCTOR",
  OPERATOR = "OPERATOR",
  COPYWRITER = "COPYWRITER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  SUPPORT = "SUPPORT",
  SELLER = "SELLER",
}

export enum UserStatus {
  Active = "ACTIVE",
  Blocked = "BLOCKED",
  Pending = "PENDING",
  Deleted = "DELETED",
}

interface IPaymentHistory {
  id: string;
}

export interface IUserExperience {
  _id?: string;
  title: string;
  company: string;
  link: string;
  description: string;
  period: {
    from: string | Date | null;
    to: string | Date | null;
  };
}

export interface IUserEducation {
  _id?: string;
  company: string;
  title: string;
  school: string;
  degree: string;
  link: string;
  type: "SCHOOL" | "COLLEGE" | "UNIVERSITY";
  description: string;
  period: {
    from: string | Date | null;
    to: string | Date | null;
  };
}

export interface IUserAddress {
  country?: string;
  region?: {
    id?: number;
    title?: string;
  };
  district?: {
    id?: number;
    title?: string;
  };
  locality?: {
    id?: number;
    title?: string;
  };
}

export type User = {
  search?: string;
  email: string;
  firstName: string;
  username?: string;
  age?: number;
  gender?: Gender;
  reference?: string;
  isPublic?: boolean;
  lastName: string;
  phone: string;
  password?: string;
  avatar: string;
  bio?: string;
  roles: UserRole[];
  status: UserStatus;
  source?: string;
  paymentHistory?: IPaymentHistory[];
  lastSeen: number;
  createdAt: string;
  _id: string;
  experiences?: IUserExperience[];
  educations?: IUserEducation[];
  fullName: string;
  address?: IUserAddress;
  isNonRegistered?: boolean;
  pinfl?: string;
  hasPaid?: boolean;
  freeChecksCount?: number;
};
