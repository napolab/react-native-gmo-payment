export const script = (env: "production" | "staging"): string => {
  const domain = env !== "production" ? "stg.static.mul-pay.jp" : "static.mul-pay.jp";

  return `https://${domain}/ext/js/token.js`;
};
