import React from 'react';
import { Account } from '../types';
import { Wallet, DollarSign } from 'lucide-react';

interface AccountCardProps {
  account: Account;
}

const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  const formatBalance = (balance: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(balance);
  };

  const getCurrencyColor = (currency: string) => {
    switch (currency) {
      case 'USD': return 'text-green-600 bg-green-50';
      case 'KES': return 'text-blue-600 bg-blue-50';
      case 'NGN': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Wallet size={20} className="text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{account.name}</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCurrencyColor(account.currency)}`}>
              {account.currency}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Current Balance</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {formatBalance(account.balance, account.currency)}
          </p>
        </div>
        <DollarSign size={24} className="text-gray-400" />
      </div>
    </div>
  );
};

export default AccountCard;