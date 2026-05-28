import { MessloNodeSdk } from "messlo-node-sdk";

export function createMessloSdk(): MessloNodeSdk {
  const apiKey = process.env.MESSLO_WA_LOGIN_API_KEY;
  if (!apiKey) {
    throw new Error("Missing MESSLO_WA_LOGIN_API_KEY in environment");
  }
  return new MessloNodeSdk({
    apiKey
  });
}
