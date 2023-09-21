# GMO Multipayment Library for React Native

このライブラリは、React Native アプリケーションで GMO ペイメントゲートウェイの Multipayment API を簡単に利用できるように設計されました。通常、Multipayment API はブラウザ環境を対象としていますが、このライブラリを使用することで、React Native アプリケーションから WebView 経由で API を呼び出すことが可能になります。

## インストール

```bash
npm install react-native-gmo-payment
# または
yarn add react-native-gmo-payment
```

## 使い方

### 1. `GMOMultipaymentProvider` の設定

アプリケーションのルートコンポーネントで `GMOMultipaymentProvider` を設定します。このプロバイダーは、GMO Multipayment の環境設定とショップIDを受け取ります。

```jsx
import { GMOMultipaymentProvider } from "react-native-gmo-multipayment";

function App() {
  return (
    <GMOMultipaymentProvider
      env="production"
      shopId="YOUR_SHOP_ID"
      onReady={() => console.log("GMO Multipayment is ready")}
    >
      {/* 他のアプリケーションコンポーネント */}
    </GMOMultipaymentProvider>
  );
}

export default App;
```

### 2. ペイメントトークンの取得

`getMultiPaymentToken` 関数を使用してペイメントトークンを取得します。この関数は、カード情報とトークンの取得数をパラメータとして受け取ります。

```jsx
import { getMultiPaymentToken } from "react-native-gmo-multipayment";

async function fetchPaymentToken() {
  try {
    const paymentData = {
      cardno: "4111111111111111",
      expire: "2302",
      securitycode: "123",
      holdername: "TARO YAMADA",
      tokennumber: 1,
    };

    const result = await getMultiPaymentToken(paymentData);
    console.log("Payment Token Result:", result);
  } catch (error) {
    console.error("Error fetching payment token:", error);
  }
}
```

### 3. クライアント状態の監視

新しい `watchClientState` 関数を使用して GMO Multipayment クライアントの状態を監視できます。この関数はコールバック関数を受け取り、クライアントの状態が変更されるたびに呼び出されます。

```jsx
import { watchClientState } from "react-native-gmo-multipayment";

const subscription = watchClientState((state) => {
  console.log("Client state:", state);
});

// サブスクリプションを後で解除する場合
subscription.unsubscribe();
```

## API ドキュメント

### Types

- `PaymentResultCode`: ペイメント処理の結果コードを表します。
- `PaymentTokenObject`: ペイメントトークンの詳細情報を含むオブジェクトです。
- `PaymentResult`: ペイメントトークン取得の結果を表すオブジェクトです。
- `Payment`: カード情報とトークン取得数を含むオブジェクトです。
- `MultipaymentConfig`: Multipayment API の設定を表すオブジェクトです。
- `State`: クライアントの現在の状態を表します。この型は "loading" または "ready" のいずれかの値を取ります。
- `GMOMultipaymentProviderProps`: `GMOMultipaymentProvider` コンポーネントのプロパティを表します。

### Functions

- `getClientState`: GMO Multipayment クライアントの現在の状態を取得します。この関数は非同期であり、状態を表

す文字列を返します。

- `getMultiPaymentConfig`: 現在の Multipayment API の設定を取得します。
- `getMultiPaymentToken`: カード情報を使用してペイメントトークンを取得します。
- `initMultiPayment`: ショップIDを使用して Multipayment API を初期化します。
- `watchClientState`: クライアントの状態変更を監視する関数です。状態が変更されるたびにコールバック関数が呼び出されます。

詳細な型情報については、ソースコードを参照してください。

## ライセンス

MIT
