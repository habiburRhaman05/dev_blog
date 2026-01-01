export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER"
}
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: string; // or UserRole
  status?: string | null;
  phone?: string | null;
}