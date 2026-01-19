import React, { useState } from 'react';
import { Copy, User, MapPin, Info } from 'lucide-react';
import { PLANS } from '../types';
import { BalanceChecker } from '../components/BalanceChecker';

export const Home: React.FC = () => {
  const [demoMode, setDemoMode] = useState<'name' | 'address'>('name');
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('コピーしました！');
  };

  const nameFormula = '=IMPORTDATA("https://ai-utility-master.vercel.app/api/sheet?name=" & ENCODEURL(A1) & "&pin=AI-XXXX...")';
  const addressFormula = '=IMPORTDATA("https://ai-utility-master.vercel.app/api/sheet?address=" & ENCODEURL(A1) & "&pin=AI-XXXX...")';

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-32 lg:pt-24 lg:pb-40">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            スプレッドシートの作業を<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">AI関数で自動化</span>しよう
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed">
            複雑なマクロやGASはもう不要です。PINコードを購入して、スプレッドシートに簡単な関数を貼り付けるだけ。<br />
            姓名分割も、住所分割もこれひとつで。
          </p>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-30 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-brand-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              データ処理のストレスから解放
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-brand-600">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI姓名分割</h3>
              <p className="text-slate-600 leading-relaxed">
                「山田太郎」→「山田」「太郎」のように、姓と名を高精度に分割。特殊な苗字やスペース無しの名前にも対応しています。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI住所分割</h3>
              <p className="text-slate-600 leading-relaxed">
                住所文字列を「都道府県」「市区町村」「町域・番地」「建物名」の4列に自動分割。表記ゆれにも柔軟に対応します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Section */}
      <section id="usage" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6">
                使い方は驚くほど簡単
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">PINコードを購入</h4>
                    <p className="text-slate-600">必要な処理件数に応じてプランを選択。決済完了後、メールでPINコードが届きます。</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">関数をコピー</h4>
                    <p className="text-slate-600">姓名分割、または住所分割用のIMPORTDATA関数をコピーし、PINコード部分を書き換えます。</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">シートに貼り付け</h4>
                    <p className="text-slate-600">Googleスプレッドシートのセルに貼り付けるだけで、AIが自動的に処理結果を返します。</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 lg:mt-0">
              <div className="bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-2 text-xs text-slate-400 font-mono">spreadsheet-demo</div>
                  </div>
                  
                  {/* Toggle Switch */}
                  <div className="flex bg-slate-900 rounded-lg p-1">
                     <button 
                        onClick={() => setDemoMode('name')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${demoMode === 'name' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
                     >
                       姓名
                     </button>
                     <button 
                        onClick={() => setDemoMode('address')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${demoMode === 'address' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
                     >
                       住所
                     </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-slate-400 text-sm mb-2 font-mono">
                    {demoMode === 'name' ? '# セルA1にある名前を分割' : '# セルA1にある住所を分割'}
                  </p>
                  <div className="relative group">
                    <code className="block bg-slate-950 text-green-400 p-4 rounded-lg font-mono text-sm break-all leading-relaxed border border-slate-800">
                      {demoMode === 'name' ? nameFormula : addressFormula}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(demoMode === 'name' ? nameFormula : addressFormula)}
                      className="absolute top-2 right-2 p-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 hover:text-white transition-colors"
                      title="コピー"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Demo Table */}
                  <div className="mt-6 border border-slate-700 rounded-lg overflow-hidden text-sm">
                    {demoMode === 'name' ? (
                      <div className="grid grid-cols-3 gap-px bg-slate-700">
                        <div className="bg-slate-800 p-2 text-slate-400 font-medium">入力 (A1)</div>
                        <div className="bg-slate-800 p-2 text-slate-400 font-medium">姓 (B1)</div>
                        <div className="bg-slate-800 p-2 text-slate-400 font-medium">名 (C1)</div>
                        
                        <div className="bg-white text-slate-900 p-2">徳川家康</div>
                        <div className="bg-slate-50 text-slate-900 p-2">徳川</div>
                        <div className="bg-slate-50 text-slate-900 p-2">家康</div>
                        
                        <div className="bg-white text-slate-900 p-2">LeonardoDiCaprio</div>
                        <div className="bg-slate-50 text-slate-900 p-2">Leonardo</div>
                        <div className="bg-slate-50 text-slate-900 p-2">DiCaprio</div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-12 gap-px bg-slate-700 text-xs sm:text-sm">
                        <div className="col-span-4 bg-slate-800 p-2 text-slate-400 font-medium">入力 (A1)</div>
                        <div className="col-span-2 bg-slate-800 p-2 text-slate-400 font-medium">都道府県</div>
                        <div className="col-span-2 bg-slate-800 p-2 text-slate-400 font-medium">市区町村</div>
                        <div className="col-span-2 bg-slate-800 p-2 text-slate-400 font-medium">番地</div>
                        <div className="col-span-2 bg-slate-800 p-2 text-slate-400 font-medium">建物</div>
                        
                        <div className="col-span-4 bg-white text-slate-900 p-2 truncate" title="東京都港区麻布台1-3-1麻布台ヒルズ森JPタワー24F">東京都港区...</div>
                        <div className="col-span-2 bg-slate-50 text-slate-900 p-2 truncate">東京都</div>
                        <div className="col-span-2 bg-slate-50 text-slate-900 p-2 truncate">港区</div>
                        <div className="col-span-2 bg-slate-50 text-slate-900 p-2 truncate">麻布台1-3-1</div>
                        <div className="col-span-2 bg-slate-50 text-slate-900 p-2 truncate" title="麻布台ヒルズ森JPタワー 24F">麻布台ヒルズ...</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">料金プラン</h2>
            <p className="mt-4 text-lg text-slate-600">
              必要な分だけ購入できるプリペイド方式。<br />月額費用は一切かかりません。
            </p>
          </div>

          {/* 購入前の確認事項（控えめなデザインに変更） */}
          <div className="max-w-3xl mx-auto mb-16">
             <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row items-start gap-4">
                <div className="flex-shrink-0 bg-slate-100 p-2 rounded-full text-slate-500 mt-1">
                  <Info className="w-5 h-5" />
                </div>
                <div className="text-sm text-slate-600 leading-relaxed">
                  <h3 className="font-bold text-slate-800 mb-1">動作環境に関するご注意</h3>
                  <p>
                    社内セキュリティやネットワーク環境によっては機能が制限される場合があります。
                    法人のネットワーク環境でご利用の場合は、事前に管理者へご確認の上ご購入ください。
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    ※環境起因による動作不良は返金対象外となります。詳細は特定商取引法に基づく表記をご確認ください。
                  </p>
                </div>
             </div>
          </div>

          <div className="flex flex-wrap justify-center gap-8 items-start">
            {PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={`relative w-full max-w-sm bg-white rounded-2xl shadow-xl transition-transform hover:-translate-y-1 ${plan.isPopular ? 'border-2 border-brand-500 ring-4 ring-brand-500/10 z-10' : 'border border-slate-200'}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm">
                    人気 No.1
                  </div>
                )}
                
                <div className="p-8 text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="flex justify-center items-baseline mb-4">
                    <span className="text-4xl font-extrabold text-slate-900">¥{plan.price.toLocaleString()}</span>
                  </div>
                  <p className="text-slate-500 mb-6 text-sm min-h-[40px]">{plan.description}</p>
                  
                  <div className="mb-8 font-bold text-lg text-brand-600">
                    {plan.creditDisplay}
                  </div>

                  <a 
                    href={plan.stripeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`block w-full py-4 px-6 rounded-lg font-bold transition-all shadow-md ${
                      plan.isPopular 
                        ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-200' 
                        : 'bg-slate-800 text-white hover:bg-slate-900 shadow-slate-200'
                    }`}
                  >
                    購入する
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center text-sm text-slate-500">
             ※ 決済はStripeの安全なシステムを通じて行われます。クレジットカード情報は当サイトに保存されません。
          </div>
        </div>
      </section>

      {/* Balance Checker Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <BalanceChecker />
        </div>
      </section>
    </div>
  );
};