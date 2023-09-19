# GMO Multipayment Library for React Native

このライブラリは、React Native アプリケーションで GMO ペイメントゲートウェイの Multipayment API を簡単に利用できるように設計されました。通常、Multipayment API はブラウザ環境を対象としていますが、このライブラリを使用することで、React Native アプリケーションから WebView 経由で API を呼び出すことが可能になります。

## インストール

```bash
# 使用しているパッケージマネージャーに応じて以下のコマンドのいずれかを実行します
npm install react-native-gmo-multipayment
# または
yarn add react-native-gmo-multipayment
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

### 3. 他のユーティリティ関数

- `getClientState`: GMO Multipayment クライアントの現在の状態を取得します。
- `getMultiPaymentConfig`: 現在の Multipayment API の設定を取得します。
- `initMultiPayment`: ショップIDを使用して Multipayment API を初期化します。

## API ドキュメント

### Types

- `PaymentResultCode`: ペイメント処理の結果コードを表します。
- `PaymentTokenObject`: ペイメントトークンの詳細情報を含むオブジェクトです。
- `PaymentResult`: ペイメントトークン取得の結果を表すオブジェクトです。
- `Payment`: カード情報とトークン取得数を含むオブジェクトです。
- `MultipaymentConfig`: Multipayment API の設定を表すオブジェクトです。
- `State`: クライアントの現在の状態を表します。
- `GMOMultipaymentProviderProps`: `GMOMultipaymentProvider` コンポーネントのプロパティを表します。

詳細な型情報については、ソースコードを参照してください。

## ライセンス

MIT
