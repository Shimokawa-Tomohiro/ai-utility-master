import React, { useState } from 'react';
import { Search, Loader2, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { BalanceResponse } from '../types';

export const BalanceChecker: React.FC = () => {
  const [pin, setPin] = useState('');
  const [result, setResult] = useState<BalanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const checkBalance = async () => {
    if (!pin.trim()) return;
    
    setLoading(true);
    setResult(null);
    setError(false);

    try {
      // In a real scenario, this connects to the backend API provided by the user
      // Assuming relative path /api/balance works via proxy or same-domain hosting
      const response = await fetch(`/api/balance?pin=${encodeURIComponent(pin)}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: BalanceResponse = await response.json();
      setResult(data);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="check-balance" className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">残高・有効性チェック</h3>
        <p className="text-slate-500">メールで届いたPINコードを入力して、残りのクレジットを確認できます。</p>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CreditCard className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="例: AI-ABCD1234..."
            className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-shadow"
            onKeyDown={(e) => e.key === 'Enter' && checkBalance()}
          />
        </div>
        <button
          onClick={checkBalance}
          disabled={loading || !pin}
          className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          確認
        </button>
      </div>

      {result && (
        <div className={`rounded-lg p-4 flex items-start gap-3 ${result.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          {result.valid ? (
            <>
              <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-green-900">有効なPINコードです</h4>
                <p className="text-green-800 mt-1">
                  残り回数: <span className="font-bold text-lg">{result.credits?.toLocaleString()}</span> 回
                </p>
                <p className="text-green-700 text-sm">プラン: {result.plan}</p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-6 h-6 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-900">無効なPINコードです</h4>
                <p className="text-red-800 mt-1">入力をお確かめの上、再度お試しください。</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700 font-medium">通信エラーが発生しました。しばらくしてから再度お試しください。</span>
        </div>
      )}
    </div>
  );
};