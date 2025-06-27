import React, { useState } from 'react';
import { Account, Transaction, TransferFormData } from './types';
import { mockAccounts, mockTransactions, fxRates } from './data/mockData';
import AccountCard from './components/AccountCard';
import TransferForm from './components/TransferForm';
import TransactionLog from './components/TransactionLog';
import Summary from './components/Summary';
import { Building2, Shield } from 'lucide-react';

function App() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  const handleTransfer = async (transferData: TransferFormData): Promise<boolean> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const sourceAccount = accounts.find(acc => acc.id === transferData.sourceAccount);
      const destinationAccount = accounts.find(acc => acc.id === transferData.destinationAccount);
      
      if (!sourceAccount || !destinationAccount) {
        return false;
      }

      const amount = parseFloat(transferData.amount);
      
      // Check if sufficient balance
      if (sourceAccount.balance < amount) {
        return false;
      }

      // Calculate FX rate
      let fxRate = 1.0;
      if (sourceAccount.currency !== destinationAccount.currency) {
        const fxKey = `${sourceAccount.currency}-${destinationAccount.currency}` as keyof typeof fxRates;
        fxRate = fxRates[fxKey] || 1.0;
      }

      // Create new transaction
      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        fromAccount: sourceAccount.name,
        toAccount: destinationAccount.name,
        amount: amount,
        currency: sourceAccount.currency,
        fxRate: fxRate,
        note: transferData.note || '',
        timestamp: transferData.futureDate ? new Date(transferData.futureDate) : new Date(),
        isFuture: !!transferData.futureDate
      };

      // If not a future transfer, update balances immediately
      if (!transferData.futureDate) {
        const convertedAmount = amount * fxRate;
        
        setAccounts(prevAccounts =>
          prevAccounts.map(acc => {
            if (acc.id === transferData.sourceAccount) {
              return { ...acc, balance: acc.balance - amount };
            }
            if (acc.id === transferData.destinationAccount) {
              return { ...acc, balance: acc.balance + convertedAmount };
            }
            return acc;
          })
        );
      }

      // Add transaction to log
      setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);

      return true;
    } catch (error) {
      console.error('Transfer failed:', error);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Building2 size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Treasury Management</h1>
                <p className="text-sm text-gray-500">Financial Operations Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Summary Section */}
          <Summary accounts={accounts} />

          {/* Account Cards Grid */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Treasury Accounts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {accounts.map(account => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          </div>

          {/* Transfer Form */}
          <TransferForm accounts={accounts} onTransfer={handleTransfer} />

          {/* Transaction Log */}
          <TransactionLog transactions={transactions} accounts={accounts} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              © 2025 Treasury Management System. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>FX Rates Updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;