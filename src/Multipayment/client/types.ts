type PaymentResultCode =
  | "000"
  | "100"
  | "101"
  | "102"
  | "110"
  | "111"
  | "112"
  | "113"
  | "121"
  | "122"
  | "131"
  | "132"
  | "141"
  | "142"
  | "150"
  | "160"
  | "161"
  | "162"
  | "170"
  | "180"
  | "190"
  | "191"
  | "501"
  | "502"
  | "511"
  | "512"
  | "521"
  | "522"
  | "531"
  | "541"
  | "551"
  | "552"
  | "901"
  | "902";

type PaymentTokenObject = {
  /** 一部マスターされたカード番号 */
  maskedCardNo: string;
  /** 取得タイムスタンプ */
  toBeExpiredAt: string;
  /** セキュリティーコードありなし */
  isSecurityCodeSet: boolean;
  /** 発行したトークン配列 */
  token: string[];
};

export type PaymentResult = {
  resultCode: PaymentResultCode;
  tokenObject: PaymentTokenObject;
};

export type Payment = {
  /** カード番号 */
  cardno: string;
  /** 有効期限 */
  expire: string;
  /** セキュリティーコード */
  securitycode: string;
  /** カード名義 */
  holdername: string;
  /** トークン取得数（1-10 まで設定できる・設定なしは 1 と見なす） */
  tokennumber?: number;
};

export interface Multipayment {
  init(shopId: string): void;
  getToken(payment: Payment, callback: (result: PaymentResult) => void): void;
}

export type MultipaymentConfig = {
  api: {
    context: string;
    host: string;
  };
  key: string;
  test: boolean;
  type: string;
  version: string;
};
