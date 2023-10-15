import { type FC, useCallback } from "react";
import { Alert, Button, View } from "react-native";
import { GMOMultipaymentBridge, getMultiPaymentConfig, getMultiPaymentToken } from "react-native-gmo-payment";

const App = () => {
  return (
    <>
      <GMOMultipaymentBridge
        env="staging"
        shopId="your-shop-id"
        onReady={() => {
          // eslint-disable-next-line no-console
          console.log(getMultiPaymentConfig());
        }}
      />
      <Screen />
    </>
  );
};
export default App;

const Screen: FC = () => {
  const handlePress = useCallback(async () => {
    const token = await getMultiPaymentToken({
      cardno: "4111111111111111",
      expire: "202612",
      securitycode: "122",
      holdername: "TARO NAMBA",
    });

    Alert.alert(JSON.stringify(token, null, 2));
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="支払い" onPress={handlePress} />
    </View>
  );
};
