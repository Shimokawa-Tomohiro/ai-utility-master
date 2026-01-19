import React from 'react';

export const LegalTokusho: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-sm rounded-xl border border-slate-200 p-8 md:p-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">
          特定商取引法に基づく表記
        </h1>

        <div className="space-y-6 text-sm">
          <p className="text-slate-600 mb-8">
            AI Utility Master（以下、「当サイト」といいます。）は、特定商取引法に基づき、以下の通り表示します。
          </p>

          <dl className="divide-y divide-slate-100">
            <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <dt className="font-bold text-slate-900">販売者</dt>
              <dd className="md:col-span-2 text-slate-600">下川智大 </dd>
            </div>
            
            <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <dt className="font-bold text-slate-900">所在地・電話番号</dt>
              <dd className="md:col-span-2 text-slate-600">
                請求があったら遅滞なく開示します。
              </dd>
            </div>

            <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <dt className="font-bold text-slate-900">メールアドレス</dt>
              <dd className="md:col-span-2 text-slate-600">
                shimotomo16@gmail.com
              </dd>
            </div>

            <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <dt className="font-bold text-slate-900">販売価格</dt>
              <dd className="md:col-span-2 text-slate-600">各購入ページに表示された価格（表示価格は消費税込み）に基づきます。</dd>
            </div>

            <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <dt className="font-bold text-slate-900">商品代金以外の必要料金</dt>
              <dd className="md:col-span-2 text-slate-600">
                サイトの閲覧、コンテンツのダウンロード、お問い合わせ等の際の電子メールの送受信時などに、所定の通信料が発生いたします。
              </dd>
            </div>

            <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <dt className="font-bold text-slate-900">お支払い方法</dt>
              <dd className="md:col-span-2 text-slate-600">
                クレジットカード決済（Stripe）<br />
                ※代金の支払時期は、各カード会社の引き落とし日に準じます。
              </dd>
            </div>

            <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <dt className="font-bold text-slate-900">商品の引渡時期</dt>
              <dd className="md:col-span-2 text-slate-600">
                決済完了後、直ちにメールにてPINコードを送付いたします。
              </dd>
            </div>

            <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <dt className="font-bold text-slate-900">返品・キャンセルについて</dt>
              <dd className="md:col-span-2 text-slate-600">
                デジタルコンテンツの性質上、購入後の返品・キャンセル・返金はお受けできません。<br />
                万が一、発行されたPINコードが機能しない等の不具合があった場合は、上記メールアドレスまでご連絡ください。代替コードの発行等で対応いたします。
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};