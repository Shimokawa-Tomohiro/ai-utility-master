import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-sm rounded-xl border border-slate-200 p-8 md:p-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">
          プライバシーポリシー
        </h1>
        <div className="prose prose-slate prose-sm max-w-none">
          <p>
            AI Utility Master（以下、「当サイト」）は、以下のとおり個人情報保護方針を定め、個人情報保護の仕組みを構築し、個人情報の保護を推進致します。
          </p>

          <h3 className="font-bold text-lg mt-8 mb-3 text-slate-900">1. 個人情報の定義</h3>
          <p>
             本ポリシーにおいて「個人情報」とは、個人を識別できる情報（メールアドレス）を指します。
          </p>

          <h3 className="font-bold text-lg mt-8 mb-3 text-slate-900">2. 取得する情報</h3>
          <p>
            当サイトでは、サービスの提供（PINコードの送付）にあたり、以下の情報のみを取得します。
          </p>
          <ul className="list-disc pl-5 my-2 text-slate-600">
             <li>メールアドレス</li>
          </ul>
          <p className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100 text-slate-700">
            <strong>※クレジットカード情報について</strong><br />
            決済代行会社（Stripe）が管理しており、当サイト運営者が閲覧・保存することはありません。<br /><br />
            <strong>※AI機能への入力データ（プロンプト等）および利用ログについて</strong><br />
            当サイト運営者は一切の保存・閲覧を行いません。
          </p>

          <h3 className="font-bold text-lg mt-8 mb-3 text-slate-900">3. 利用目的</h3>
          <p>取得したメールアドレスは、以下の目的のためにのみ利用します。</p>
          <ul className="list-disc pl-5 my-2 text-slate-600">
            <li>購入されたPINコードの送付</li>
            <li>本サービスに関する重要なお知らせ、またはお問い合わせへの対応</li>
          </ul>
          
          <h3 className="font-bold text-lg mt-8 mb-3 text-slate-900">4. 個人情報の第三者提供</h3>
          <p>
            法令に基づく場合、および決済処理のために決済代行会社へ提供する場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
          </p>

          <h3 className="font-bold text-lg mt-8 mb-3 text-slate-900">5. 個人情報の管理</h3>
          <p>
            取得したメールアドレスは、漏洩、滅失の防止に努め、厳重に管理いたします。
          </p>

          <h3 className="font-bold text-lg mt-8 mb-3 text-slate-900">6. お問い合わせ</h3>
          <p>
            本ポリシーや個人情報の取り扱いに関するお問い合わせは、下記までご連絡ください。<br />
            shimotomo16@gmail.com
          </p>

          <p className="mt-8 text-xs text-slate-400 text-right">
            制定日：{new Date().getFullYear()}年{new Date().getMonth() + 1}月{new Date().getDate()}日
          </p>
        </div>
      </div>
    </div>
  );
};