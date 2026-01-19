export interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  description: string;
  stripeUrl: string;
  isPopular?: boolean;
  creditDisplay: string;
}

export interface BalanceResponse {
  valid: boolean;
  credits?: number;
  plan?: string;
  message?: string;
}

export enum RoutePath {
  HOME = '/',
  LEGAL_TOKUSHO = '/legal/tokusho',
  PRIVACY = '/legal/privacy',
}

export const PLANS: Plan[] = [
  {
    id: 'light',
    name: 'ライト',
    price: 500,
    credits: 500,
    description: 'お試し利用や少量のリスト処理に最適',
    stripeUrl: 'https://buy.stripe.com/test_8x23coecJfeUay7aSCfbq00',
    creditDisplay: '500回分（クレジット）'
  },
  {
    id: 'standard',
    name: 'スタンダード',
    price: 2000,
    credits: 3000,
    description: '一般的な業務利用におすすめ',
    stripeUrl: 'https://buy.stripe.com/test_cNi7sE1pX9UA6hR7Gqfbq02',
    isPopular: true,
    creditDisplay: '3,000回分（クレジット）'
  },
  {
    id: 'business',
    name: 'ビジネス',
    price: 5000,
    credits: 10000,
    description: '大規模なリスト処理を行うプロ向け',
    stripeUrl: 'https://buy.stripe.com/test_6oUbIU9Wt3wc35F6Cmfbq03',
    creditDisplay: '10,000回分（クレジット）'
  }
];