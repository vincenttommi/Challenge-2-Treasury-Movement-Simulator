import { Account, Transaction } from '../types';

export const mockAccounts: Account[] = [
  { id: '1', name: 'Mpesa_KES_1', currency: 'KES', balance: 2450000 },
  { id: '2', name: 'Mpesa_KES_2', currency: 'KES', balance: 1890000 },
  { id: '3', name: 'Bank_USD_1', currency: 'USD', balance: 125000 },
  { id: '4', name: 'Bank_USD_2', currency: 'USD', balance: 89500 },
  { id: '5', name: 'Bank_USD_3', currency: 'USD', balance: 234000 },
  { id: '6', name: 'Wallet_NGN_1', currency: 'NGN', balance: 15600000 },
  { id: '7', name: 'Wallet_NGN_2', currency: 'NGN', balance: 8450000 },
  { id: '8', name: 'Reserve_KES_1', currency: 'KES', balance: 5670000 },
  { id: '9', name: 'Reserve_USD_1', currency: 'USD', balance: 456000 },
  { id: '10', name: 'Reserve_NGN_1', currency: 'NGN', balance: 23400000 }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    fromAccount: 'Bank_USD_1',
    toAccount: 'Mpesa_KES_1',
    amount: 1000,
    currency: 'USD',
    fxRate: 150.5,
    note: 'Monthly settlement',
    timestamp: new Date('2024-12-15T10:30:00'),
    isFuture: false
  },
  {
    id: '2',
    fromAccount: 'Wallet_NGN_1',
    toAccount: 'Bank_USD_2',
    amount: 500000,
    currency: 'NGN',
    fxRate: 0.0012,
    note: 'FX conversion',
    timestamp: new Date('2024-12-14T14:20:00'),
    isFuture: false
  },
  {
    id: '3',
    fromAccount: 'Reserve_KES_1',
    toAccount: 'Mpesa_KES_2',
    amount: 750000,
    currency: 'KES',
    fxRate: 1.0,
    note: 'Liquidity provision',
    timestamp: new Date('2024-12-13T09:15:00'),
    isFuture: false
  },
  {
    id: '4',
    fromAccount: 'Bank_USD_3',
    toAccount: 'Wallet_NGN_2',
    amount: 2500,
    currency: 'USD',
    fxRate: 825.0,
    note: 'Cross-border transfer',
    timestamp: new Date('2024-12-20T16:00:00'),
    isFuture: true
  },
  {
    id: '5',
    fromAccount: 'Reserve_USD_1',
    toAccount: 'Bank_USD_1',
    amount: 15000,
    currency: 'USD',
    fxRate: 1.0,
    note: 'Reserve allocation',
    timestamp: new Date('2024-12-25T12:00:00'),
    isFuture: true
  }
];

export const fxRates = {
  'KES-USD': 0.0067,
  'USD-KES': 150.5,
  'NGN-USD': 0.0012,
  'USD-NGN': 825.0,
  'KES-NGN': 5.48,
  'NGN-KES': 0.18
};