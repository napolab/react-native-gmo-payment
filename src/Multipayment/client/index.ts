import type { Multipayment, MultipaymentConfig, Payment, PaymentResult } from "./types";

export type { Multipayment };

type State = "loading" | "ready";
let client: Multipayment | undefined;
let state: State = "loading";
let config: MultipaymentConfig | undefined;

export const initializeApp = (init: { client: Multipayment; config: MultipaymentConfig }) => {
  client = init.client;
  config = init.config;
};
export const updateState = (newState: State) => {
  state = newState;
};

export const getClientState = (): State => {
  return state;
};
export const getMultiPaymentConfig = (): MultipaymentConfig => {
  if (config !== undefined) {
    return config;
  } else {
    throw new Error("Multipayment is not initialized");
  }
};
export const getMultiPaymentToken = async (payment: Payment): Promise<PaymentResult> => {
  return new Promise<PaymentResult>((resolve, reject) => {
    if (client !== undefined) {
      client.getToken(payment, resolve);
    } else {
      reject(new Error("Multipayment is not initialized"));
    }
  });
};

export const initMultiPayment = (shopId: string) => {
  if (client !== undefined) {
    client.init(shopId);
  } else {
    throw new Error("Multipayment is not initialized");
  }
};
