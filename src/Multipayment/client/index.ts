import { makeSubject, pipe, subscribe, toPromise } from "wonka";

import type { Multipayment, MultipaymentConfig, Payment, PaymentResult } from "./types";
import type { Subscription } from "wonka";

export type { Multipayment };

type State = "loading" | "ready";
let client: Multipayment | undefined;
const state = makeSubject<State>();
let config: MultipaymentConfig | undefined;

export const initializeApp = (init: { client: Multipayment; config: MultipaymentConfig }) => {
  client = init.client;
  config = init.config;
};

export const updateState = (newState: State) => {
  state.next(newState);
};

export const watchClientState = (callback: (state: State) => void): Subscription => {
  return pipe(state.source, subscribe(callback));
};

export const getClientState = (): Promise<State> => {
  return toPromise(state.source);
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

export const initMultiPayment = (shopId: string): void => {
  if (client !== undefined) {
    client.init(shopId);
  } else {
    throw new Error("Multipayment is not initialized");
  }
};
