import React, { useState } from 'react';
import { Account, TransferFormData } from '../types';
import { ArrowRight, Send, AlertCircle, CheckCircle } from 'lucide-react';

interface TransferFormProps {
  accounts: Account[];
  onTransfer: (transfer: TransferFormData) => Promise<boolean>;
}

const TransferForm: React.FC<TransferFormProps> = ({ accounts, onTransfer }) => {
  const [formData, setFormData] = useState<TransferFormData>({
    sourceAccount: '',
    destinationAccount: '',
    amount: '',
    note: '',
    futureDate: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    // Validation
    if (!formData.sourceAccount || !formData.destinationAccount || !formData.amount) {
      setFeedback({ type: 'error', message: 'Please fill in all required fields' });
      setLoading(false);
      return;
    }

    if (formData.sourceAccount === formData.destinationAccount) {
      setFeedback({ type: 'error', message: 'Source and destination accounts must be different' });
      setLoading(false);
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setFeedback({ type: 'error', message: 'Please enter a valid amount' });
      setLoading(false);
      return;
    }

    // Check balance
    const sourceAccount = accounts.find(acc => acc.id === formData.sourceAccount);
    if (sourceAccount && sourceAccount.balance < amount) {
      setFeedback({ type: 'error', message: 'Insufficient balance in source account' });
      setLoading(false);
      return;
    }

    try {
      const success = await onTransfer(formData);
      if (success) {
        setFeedback({ type: 'success', message: 'Transfer completed successfully' });
        setFormData({
          sourceAccount: '',
          destinationAccount: '',
          amount: '',
          note: '',
          futureDate: ''
        });
      } else {
        setFeedback({ type: 'error', message: 'Transfer failed. Please try again.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Transfer failed. Please try again.' });
    }

    setLoading(false);
  };

  const getSourceBalance = () => {
    const account = accounts.find(acc => acc.id === formData.sourceAccount);
    return account ? account.balance : 0;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <Send size={20} className="text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Transfer Funds</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source Account *
            </label>
            <select
              value={formData.sourceAccount}
              onChange={(e) => setFormData({ ...formData, sourceAccount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="">Select source account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.currency})
                </option>
              ))}
            </select>
            {formData.sourceAccount && (
              <p className="text-xs text-gray-500 mt-1">
                Available: {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: accounts.find(acc => acc.id === formData.sourceAccount)?.currency || 'USD'
                }).format(getSourceBalance())}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination Account *
            </label>
            <select
              value={formData.destinationAccount}
              onChange={(e) => setFormData({ ...formData, destinationAccount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="">Select destination account</option>
              {accounts
                .filter(account => account.id !== formData.sourceAccount)
                .map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.currency})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Future Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={formData.futureDate}
              onChange={(e) => setFormData({ ...formData, futureDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note (Optional)
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            rows={3}
            placeholder="Add a note for this transfer..."
          />
        </div>

        {feedback && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            feedback.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {feedback.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span className="text-sm">{feedback.message}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>{loading ? 'Processing...' : 'Transfer Funds'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransferForm;