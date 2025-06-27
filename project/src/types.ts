export interface Account {
  id: string;
  name: string;
  currency: 'KES' | 'USD' | 'NGN';
  balance: number;
}

export interface Transaction {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  currency: string;
  fxRate: number;
  note: string;
  timestamp: Date;
  isFuture: boolean;
}

export interface TransferFormData {
  sourceAccount: string;
  destinationAccount: string;
  amount: string;
  note: string;
  futureDate: string;
}

export interface Filters {
  account: string;
  currency: string;
  showFuture: boolean;
}