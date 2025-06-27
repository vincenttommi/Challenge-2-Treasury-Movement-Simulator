import React, { useMemo } from 'react';
import { Account } from '../types';
import { PieChart, TrendingUp } from 'lucide-react';

interface SummaryProps {
  accounts: Account[];
}

const Summary: React.FC<SummaryProps> = ({ accounts }) => {
  const totals = useMemo(() => {
    const currencyTotals: Record<string, number> = {};
    
    accounts.forEach(account => {
      if (!currencyTotals[account.currency]) {
        currencyTotals[account.currency] = 0;
      }
      currencyTotals[account.currency] += account.balance;
    });
    
    return currencyTotals;
  }, [accounts]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCurrencyColor = (currency: string) => {
    switch (currency) {
      case 'USD': return 'bg-green-100 text-green-800 border-green-200';
      case 'KES': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'NGN': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <PieChart size={20} className="text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-900">Portfolio Summary</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(totals).map(([currency, total]) => (
          <div
            key={currency}
            className={`border rounded-lg p-4 ${getCurrencyColor(currency)}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{currency}</h3>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(total, currency)}
                </p>
              </div>
              <TrendingUp size={24} className="opacity-60" />
            </div>
            <p className="text-sm mt-2 opacity-75">
              {accounts.filter(acc => acc.currency === currency).length} account
              {accounts.filter(acc => acc.currency === currency).length !== 1 ? 's' : ''}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;