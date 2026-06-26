export type UserRole = 'admin' | 'owner' | 'tenant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  apartmentNumber?: string;
}

export interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  apartmentNumber: string;
  role: 'owner' | 'tenant';
  status: 'active' | 'inactive';
  tenantCode?: string;
}

export interface CommonExpense {
  id: string;
  concept: string;
  amount: number;
  month: string;
  description: string;
  status: 'draft' | 'published';
  createdAt: Date;
}

export interface Payment {
  id: string;
  residentId: string;
  residentName: string;
  apartmentNumber: string;
  concept?: string;
  category?: 'common' | 'basic';
  amount: number;
  month: string;
  status: 'pending' | 'paid' | 'overdue';
  paidAt?: Date;
  method?: 'transfer' | 'cash' | 'check';
  receiptUrl?: string;
}

export interface Claim {
  id: string;
  title: string;
  description: string;
  residentName: string;
  apartmentNumber: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: Date;
  resolvedAt?: Date;
}

export interface Apartment {
  id: string;
  number: string;
  floor: number;
  type: 'studio' | '1br' | '2br' | '3br';
  surface: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  ownerId?: string;
  ownerName?: string;
  tenantName?: string;
  monthlyFee: number;
}

export interface KPI {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}
