import React from 'react';
import { Link } from 'react-router-dom';
import { RoutePath } from '../types';
import { Sparkles, Scale, ShieldCheck } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={RoutePath.HOME} className="flex items-center gap-2 group">
              <div className="bg-brand-600 p-1.5 rounded-lg group-hover:bg-brand-700 transition-colors">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">AI Utility Master</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-brand-500" />
              <span className="font-bold text-lg text-white">AI Utility Master</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              スプレッドシートでの作業をAIで自動化。<br />
              姓名分割からリスト整形まで、あなたの業務効率を劇的に改善します。
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">サービス</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to={RoutePath.HOME} className="hover:text-brand-400 transition-colors">ホーム</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">法務・規約</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to={RoutePath.LEGAL_TOKUSHO} className="flex items-center gap-2 hover:text-brand-400 transition-colors">
                  <Scale className="w-4 h-4" />
                  特定商取引法に基づく表記
                </Link>
              </li>
              <li>
                <Link to={RoutePath.PRIVACY} className="flex items-center gap-2 hover:text-brand-400 transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} AI Utility Master. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
