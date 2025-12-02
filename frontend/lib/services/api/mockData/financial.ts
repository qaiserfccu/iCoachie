// Mock data for financial records
import type { Invoice, Payment } from '../types';

export const mockInvoices: Invoice[] = Array.from({ length: 25 }, (_, i) => {
  const dueDate = new Date(Date.now() + (i % 3 === 0 ? -10 : 20) * 24 * 60 * 60 * 1000);
  const isPaid = i % 3 === 2;
  const isOverdue = !isPaid && dueDate < new Date();

  return {
    id: `invoice-${i + 1}`,
    invoiceNumber: `INV-${2024}${String(i + 1).padStart(4, '0')}`,
    userId: `user-${(i % 20) + 1}`,
    userName: ['John Smith', 'Sarah Johnson', 'Mike Williams', 'Emma Brown', 'David Jones', 'Lisa Garcia', 'James Miller'][i % 7],
    items: [
      {
        description: ['Monthly Training Fee', 'Private Coaching Session', 'Equipment Rental', 'Tournament Registration', 'Membership Renewal'][i % 5],
        quantity: 1,
        unitPrice: 100 + (i % 5) * 50,
        total: 100 + (i % 5) * 50,
      },
      ...(i % 2 === 0 ? [{
        description: 'Additional Services',
        quantity: 1,
        unitPrice: 50,
        total: 50,
      }] : []),
    ],
    subtotal: 100 + (i % 5) * 50 + (i % 2 === 0 ? 50 : 0),
    tax: (100 + (i % 5) * 50 + (i % 2 === 0 ? 50 : 0)) * 0.1,
    total: (100 + (i % 5) * 50 + (i % 2 === 0 ? 50 : 0)) * 1.1,
    status: isPaid ? 'paid' : isOverdue ? 'overdue' : i % 5 === 0 ? 'draft' : 'pending',
    dueDate: dueDate.toISOString(),
    paidDate: isPaid ? new Date(dueDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

export const mockPayments: Payment[] = Array.from({ length: 30 }, (_, i) => ({
  id: `payment-${i + 1}`,
  invoiceId: i < 20 ? `invoice-${(i % 10) + 1}` : undefined,
  userId: `user-${(i % 20) + 1}`,
  userName: ['John Smith', 'Sarah Johnson', 'Mike Williams', 'Emma Brown', 'David Jones'][i % 5],
  amount: 100 + Math.floor(Math.random() * 400),
  method: (['credit_card', 'debit_card', 'bank_transfer', 'cash', 'check'] as const)[i % 5],
  status: i % 10 === 0 ? 'pending' : i % 15 === 0 ? 'failed' : 'completed',
  transactionId: `TXN${Date.now()}${i}`,
  createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
}));

export const getInvoiceById = (id: string): Invoice | undefined => {
  return mockInvoices.find(inv => inv.id === id);
};

export const getInvoicesByStatus = (status: Invoice['status']): Invoice[] => {
  return mockInvoices.filter(inv => inv.status === status);
};

export const getPaymentsByUser = (userId: string): Payment[] => {
  return mockPayments.filter(p => p.userId === userId);
};

export const getRecentPayments = (limit: number = 10): Payment[] => {
  return [...mockPayments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};
