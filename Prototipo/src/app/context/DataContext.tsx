import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import {
  mockResidents,
  mockApartments,
  mockCommonExpenses,
  mockPayments,
  mockClaims,
  mockMessages,
  mockAnnouncements,
} from '../data/mockData';
import {
  Resident,
  Apartment,
  CommonExpense,
  Payment,
  Claim,
  Message,
  Announcement,
} from '../types';

interface DataContextType {
  residents: Resident[];
  apartments: Apartment[];
  expenses: CommonExpense[];
  payments: Payment[];
  claims: Claim[];
  messages: Message[];
  announcements: Announcement[];

  // Residents
  addResident: (r: Omit<Resident, 'id'>) => Resident;
  updateResident: (id: string, data: Partial<Resident>) => void;
  deleteResident: (id: string) => void;

  // Apartments
  addApartment: (a: Omit<Apartment, 'id'>) => Apartment;
  updateApartment: (id: string, data: Partial<Apartment>) => void;
  deleteApartment: (id: string) => void;

  // Claims
  addClaim: (c: Omit<Claim, 'id'>) => Claim;
  updateClaim: (id: string, data: Partial<Claim>) => void;

  // Payments
  addPayment: (p: Omit<Payment, 'id'>) => Payment;
  updatePayment: (id: string, data: Partial<Payment>) => void;

  // Expenses
  addExpense: (e: Omit<CommonExpense, 'id'>) => CommonExpense;
  updateExpense: (id: string, data: Partial<CommonExpense>) => void;
  deleteExpense: (id: string) => void;

  // Messages
  addMessage: (m: Omit<Message, 'id' | 'createdAt' | 'readBy'>) => void;
  markMessageRead: (id: string, readerKey: string) => void;
  getUnreadMessageCount: (readerKey: string, apartment?: string) => number;

  // Announcements
  addAnnouncement: (a: Omit<Announcement, 'id' | 'createdAt' | 'readBy'>) => void;
  updateAnnouncement: (id: string, data: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  markAnnouncementRead: (id: string, readerKey: string) => void;
  getUnreadAnnouncementCount: (readerKey: string) => number;
}

const DataContext = createContext<DataContextType | null>(null);

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function syncResidentInApartments(
  apartments: Apartment[],
  nextResident: Resident | null,
  previousResident?: Resident
) {
  return apartments.map((apartment) => {
    let updated = { ...apartment };

    if (previousResident) {
      const wasOwner =
        previousResident.role === 'owner' &&
        updated.ownerId === previousResident.id;
      const wasTenant =
        previousResident.role === 'tenant' &&
        (updated.tenantId === previousResident.id ||
          (updated.number === previousResident.apartmentNumber &&
            updated.tenantName === previousResident.name));

      if (wasOwner) {
        const { ownerId, ownerName, ...rest } = updated;
        updated = rest;
      }

      if (wasTenant) {
        const { tenantId, tenantName, ...rest } = updated;
        updated = rest;
      }
    }

    if (nextResident && updated.number === nextResident.apartmentNumber) {
      if (nextResident.role === 'owner') {
        updated.ownerId = nextResident.id;
        updated.ownerName = nextResident.name;
      } else {
        updated.tenantId = nextResident.id;
        updated.tenantName = nextResident.name;
      }
    }

    if (updated.status !== 'maintenance') {
      updated.status = updated.ownerName || updated.tenantName ? 'occupied' : 'vacant';
    }

    return updated;
  });
}

function getResidentSyncedApartments(apartments: Apartment[], residents: Resident[]) {
  return apartments.map((apartment) => {
    const owner = residents.find(
      (resident) =>
        resident.role === 'owner' &&
        resident.apartmentNumber === apartment.number &&
        resident.status === 'active'
    );
    const tenant = residents.find(
      (resident) =>
        resident.role === 'tenant' &&
        resident.apartmentNumber === apartment.number &&
        resident.status === 'active'
    );

    const syncedApartment: Apartment = {
      ...apartment,
      ownerId: owner?.id ?? apartment.ownerId,
      ownerName: owner?.name ?? apartment.ownerName,
      tenantId: tenant?.id ?? apartment.tenantId,
      tenantName: tenant?.name ?? apartment.tenantName,
    };

    if (syncedApartment.status !== 'maintenance') {
      syncedApartment.status =
        syncedApartment.ownerName || syncedApartment.tenantName ? 'occupied' : 'vacant';
    }

    return syncedApartment;
  });
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [residents, setResidents] = useState<Resident[]>(mockResidents);
  const [apartments, setApartments] = useState<Apartment[]>(mockApartments);
  const [expenses, setExpenses] = useState<CommonExpense[]>(mockCommonExpenses);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [claims, setClaims] = useState<Claim[]>(mockClaims);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const residentSyncedApartments = useMemo(
    () => getResidentSyncedApartments(apartments, residents),
    [apartments, residents]
  );

  // --- Residents ---
  const addResident = (r: Omit<Resident, 'id'>): Resident => {
    const newR: Resident = { ...r, id: uid() };
    setResidents((prev) => [...prev, newR]);
    setApartments((prev) => syncResidentInApartments(prev, newR));
    return newR;
  };
  const updateResident = (id: string, data: Partial<Resident>) => {
    const previousResident = residents.find((r) => r.id === id);
    const nextResident = previousResident ? { ...previousResident, ...data } : undefined;

    setResidents((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));

    if (nextResident) {
      setApartments((prev) => syncResidentInApartments(prev, nextResident, previousResident));
    }
  };
  const deleteResident = (id: string) => {
    const previousResident = residents.find((r) => r.id === id);

    setResidents((prev) => prev.filter((r) => r.id !== id));
    if (previousResident) {
      setApartments((prev) => syncResidentInApartments(prev, null, previousResident));
    }
  };

  // --- Apartments ---
  const addApartment = (a: Omit<Apartment, 'id'>): Apartment => {
    const newA: Apartment = { ...a, id: uid() };
    setApartments((prev) => [...prev, newA]);
    return newA;
  };
  const updateApartment = (id: string, data: Partial<Apartment>) =>
    setApartments((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
  const deleteApartment = (id: string) =>
    setApartments((prev) => prev.filter((a) => a.id !== id));

  // --- Claims ---
  const addClaim = (c: Omit<Claim, 'id'>): Claim => {
    const newC: Claim = { ...c, id: uid() };
    setClaims((prev) => [newC, ...prev]);
    return newC;
  };
  const updateClaim = (id: string, data: Partial<Claim>) =>
    setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));

  // --- Payments ---
  const addPayment = (p: Omit<Payment, 'id'>): Payment => {
    const newP: Payment = { ...p, id: uid() };
    setPayments((prev) => [newP, ...prev]);
    return newP;
  };
  const updatePayment = (id: string, data: Partial<Payment>) =>
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));

  // --- Expenses ---
  const addExpense = (e: Omit<CommonExpense, 'id'>): CommonExpense => {
    const newE: CommonExpense = { ...e, id: uid() };
    setExpenses((prev) => [newE, ...prev]);
    return newE;
  };
  const updateExpense = (id: string, data: Partial<CommonExpense>) =>
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
  const deleteExpense = (id: string) =>
    setExpenses((prev) => prev.filter((e) => e.id !== id));

  // --- Messages ---
  const addMessage = (m: Omit<Message, 'id' | 'createdAt' | 'readBy'>) => {
    const newM: Message = { ...m, id: uid(), createdAt: new Date(), readBy: [m.fromRole] };
    setMessages((prev) => [newM, ...prev]);
  };
  const markMessageRead = (id: string, readerKey: string) =>
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id && !m.readBy.includes(readerKey)
          ? { ...m, readBy: [...m.readBy, readerKey] }
          : m
      )
    );

  const getUnreadMessageCount = (readerKey: string, apartment?: string): number => {
    return messages.filter((m) => {
      if (m.readBy.includes(readerKey)) return false;
      if (readerKey === 'admin') return m.toRole === 'admin';
      if (readerKey === 'owner') {
        return (
          m.toRole === 'all' ||
          m.toRole === 'owner' ||
          (m.toRole === 'owner' && m.toApartment === apartment)
        );
      }
      if (readerKey === 'tenant') {
        return (
          m.toRole === 'all' ||
          m.toRole === 'tenant' ||
          (m.toRole === 'tenant' && m.toApartment === apartment)
        );
      }
      return false;
    }).length;
  };

  // --- Announcements ---
  const addAnnouncement = (a: Omit<Announcement, 'id' | 'createdAt' | 'readBy'>) => {
    const newA: Announcement = { ...a, id: uid(), createdAt: new Date(), readBy: ['admin'] };
    setAnnouncements((prev) => [newA, ...prev]);
  };
  const updateAnnouncement = (id: string, data: Partial<Announcement>) =>
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
  const deleteAnnouncement = (id: string) =>
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  const markAnnouncementRead = (id: string, readerKey: string) =>
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === id && !a.readBy.includes(readerKey)
          ? { ...a, readBy: [...a.readBy, readerKey] }
          : a
      )
    );
  const getUnreadAnnouncementCount = (readerKey: string): number =>
    announcements.filter((a) => !a.readBy.includes(readerKey)).length;

  return (
    <DataContext.Provider
      value={{
        residents,
        apartments: residentSyncedApartments,
        expenses,
        payments,
        claims,
        messages,
        announcements,
        addResident,
        updateResident,
        deleteResident,
        addApartment,
        updateApartment,
        deleteApartment,
        addClaim,
        updateClaim,
        addPayment,
        updatePayment,
        addExpense,
        updateExpense,
        deleteExpense,
        addMessage,
        markMessageRead,
        getUnreadMessageCount,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        markAnnouncementRead,
        getUnreadAnnouncementCount,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
