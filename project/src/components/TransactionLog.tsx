import React, { useState, useMemo } from 'react';
import { Transaction, Filters } from '../types';
import { Clock, Filter, Calendar, TrendingUp as TrendingRight } from 'lucide-react';

interface TransactionLogProps {
  transactions: Transaction[];
  accounts: { id: string; name: string; currency: string }[];
}

const TransactionLog: React.FC<TransactionLogProps> = ({ transactions, accounts }) => {
  const [filters, setFilters] = useState<Filters>({
    account: '',
    currency: '',
    showFuture: true
  });

  const currencies = Array.from(new Set(accounts.map(acc => acc.currency)));

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        if (filters.account && 
            transaction.fromAccount !== filters.account && 
            transaction.toAccount !== filters.account) {
          return false;
        }
        if (filters.currency && transaction.currency !== filters.currency) {
          return false;
        }
        if (!filters.showFuture && transaction.isFuture) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [transactions, filters]);

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getAccountName = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.name : accountId;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingRight size={20} className="text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Transaction Log</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Account
            </label>
            <select
              value={filters.account}
              onChange={(e) => setFilters({ ...filters, account: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All accounts</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Currency
            </label>
            <select
              value={filters.currency}
              onChange={(e) => setFilters({ ...filters, currency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All currencies</option>
              {currencies.map(currency => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.showFuture}
                onChange={(e) => setFilters({ ...filters, showFuture: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show future transfers</span>
            </label>
          </div>

          <div className="flex items-end justify-end">
            <span className="text-sm text-gray-500">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From Account
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                To Account
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                FX Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Note
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className={`hover:bg-gray-50 ${
                  transaction.isFuture ? 'bg-blue-50/30' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {transaction.isFuture && (
                      <Clock size={14} className="text-blue-500" />
                    )}
                    <span className={`text-sm ${
                      transaction.isFuture ? 'text-blue-700 font-medium' : 'text-gray-900'
                    }`}>
                      {formatDateTime(transaction.timestamp)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {getAccountName(transaction.fromAccount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {getAccountName(transaction.toAccount)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    {transaction.fxRate === 1.0 ? '1:1' : transaction.fxRate.toFixed(4)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 max-w-xs truncate">
                    {transaction.note || '-'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <Filter size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionLog;