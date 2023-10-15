import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

import {
  initializeApp,
  getMultiPaymentConfig,
  updateState,
  getClientState,
  getMultiPaymentToken,
  initMultiPayment,
} from "./client";
import { script } from "./externals";

import type { Multipayment, watchClientState } from "./client";
import type { FC } from "react";
import type { WebViewMessageEvent } from "react-native-webview";

export type GMOMultipaymentBridgeProps = {
  env: "production" | "staging";
  shopId: string;
  onReady?: () => void;
};

let count = 0;
const GMOMultipaymentBridge: FC<GMOMultipaymentBridgeProps> = ({ env, shopId, onReady }) => {
  const ref = useRef<WebView>(null);
  const html = `<script src="${script(env)}"></script>`;
  const source = useMemo(() => ({ html }), [html]);

  const queue = useRef<Map<string, Parameters<Multipayment["getToken"]>[1]>>(new Map());

  const init = useCallback((shopId: string) => {
    queue.current.clear();
    ref.current?.injectJavaScript(`
      {
        const sdk = window.Multipayment || Multipayment
        sdk.init('${shopId}')
      }
    `);
  }, []);

  const handleQueue = useCallback((key: string, result: Parameters<Parameters<Multipayment["getToken"]>[1]>[0]) => {
    queue.current.get(key)?.(result);
    queue.current.delete(key);
  }, []);
  const getToken: Multipayment["getToken"] = useCallback((payment, callback) => {
    const key = `key__${++count}`;
    queue.current.set(key, callback);

    ref.current?.injectJavaScript(`
      {
        const sdk = window.Multipayment || Multipayment
        sdk.getToken(JSON.parse('${JSON.stringify(payment)}'), result => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'getToken', payload: { key: '${key}', result } }))
        })
      }
    `);
  }, []);

  const injected = `
    {
      const id = setInterval(() => {
        if(window.ReactNativeWebView === undefined) return

        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'loading' }))
        const sdk = window.Multipayment || Multipayment
        if (sdk !== undefined && typeof sdk.init === 'function') {
          sdk.init('${shopId}')
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready', payload: JSON.stringify(sdk.config) }))
          clearInterval(id)
        }
      }, 10)
    }
  `;

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const { type, payload } = JSON.parse(event.nativeEvent.data);

      switch (type) {
        case "loading": {
          updateState("loading");
          break;
        }
        case "ready": {
          updateState("ready");
          initializeApp({ client: { init, getToken }, config: payload });
          onReady?.();
          break;
        }
        case "getToken": {
          handleQueue(payload.key, payload.result);
          break;
        }
      }
    },
    [init, getToken, onReady, handleQueue],
  );

  return (
    <View accessible accessibilityElementsHidden aria-hidden style={styles.visibilityHidden}>
      <WebView
        source={source}
        originWhitelist={["*"]}
        ref={ref}
        injectedJavaScript={injected}
        onMessage={handleMessage}
        key={`${env}:${shopId}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  visibilityHidden: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
  },
});

export {
  GMOMultipaymentBridge,
  initMultiPayment,
  getClientState,
  getMultiPaymentToken,
  getMultiPaymentConfig,
  watchClientState,
};
