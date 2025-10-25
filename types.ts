export enum UserRole {
  Customer = 'Customer',
  Admin = 'Admin',
  Guest = 'Guest',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Court {
  id: number;
  name: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  courtId: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM
  status: 'confirmed' | 'cancelled';
  guestEmail?: string;
}

export type PaymentMethod = 'GCash' | 'Maya' | 'PayMongo';