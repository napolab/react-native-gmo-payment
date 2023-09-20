import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { filter, makeSubject, map, pipe } from "wonka";

import type { JavaScriptSource as JavaScriptCode } from "./types";
import type { FC, ReactNode } from "react";
import type { WebViewMessageEvent } from "react-native-webview";
import type { WebViewSource } from "react-native-webview/lib/WebViewTypes";

type Action<T extends string, P = unknown> = {
  type: T
  payload: P
}

export const createBrowserRuntime = <Global, >() => {
  const count = 0
  const message = makeSubject<string>()
  const action = pipe(
    message.source,
    map(msg => JSON.parse(msg)),
    filter((value): value is Action<string> => "type" in value && typeof value.type === "string" && "payload" in value),
  )

  const run = <T, >(fn: (g: Global) => T, variables?: Record<string, unknown>) => {
    console.log(
      `
        ${Object.entries(variables ?? {}).map(([key, value]) => `const ${key} = ${JSON.stringify(value)}`).join("\n")}
        ${fn.toString()}
      `
    )
  }

  return {
    onMessage: (msg: string) => message.next(msg),
    run,
  }
}


const scriptTag = (script: JavaScriptCode) => {
  if ("uri" in script) return `<script src="${script.uri}"></script>`;

  return `<script>${script.source}</script>`;
}

type Props = {
  children: ReactNode;
  scripts?: JavaScriptCode[];
  runtime: ReturnType<typeof createBrowserRuntime>
};
export const BrowserScript: FC<Props> = ({ children, scripts, runtime }) => {
  const ref = useRef<WebView>(null);
  const html = scripts?.map(scriptTag).join("\n") ?? "";
  const source = useMemo<WebViewSource>(() => ({ html }), [html]);
  const originWhitelist = useMemo(() => ["*"], []);
  
  const handleMessage = useCallback((e: WebViewMessageEvent) => {
    runtime.onMessage(e.nativeEvent.data)
  }, [runtime])

  return (
    <>
      <View style={styles.root}>
        <WebView source={source} ref={ref} key={html} originWhitelist={originWhitelist} onMessage={handleMessage}/>
      </View>

      {children}
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
  },
});
