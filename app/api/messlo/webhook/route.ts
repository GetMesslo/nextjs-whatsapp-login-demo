import { verifyMessloWebhookSignature } from "@getmesslo/messlo-node-sdk";

export async function POST(req: Request): Promise<Response> {
  const webhookMode = process.env.NEXT_PUBLIC_MESSLO_WEBHOOK_MODE || "self_hosted";
  if (webhookMode === "messlo_hosted") {
    return Response.json(
      {
        success: false,
        message:
          "Webhook mode is messlo_hosted. Use Messlo hosted URL in Meta callback; this local endpoint is not used."
      },
      { status: 409 }
    );
  }

  const webhookSecret = process.env.MESSLO_WA_LOGIN_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return Response.json(
      { success: false, message: "Missing MESSLO_WA_LOGIN_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-messlo-signature");

  const valid = verifyMessloWebhookSignature({
    webhookSecret,
    rawBody,
    signatureHeader: signature
  });

  if (!valid) {
    return Response.json(
      { success: false, message: "Invalid signature" },
      { status: 401 }
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // TODO: persist/process webhook payload for your app needs.
  console.log("[Demo] Messlo webhook received:", payload);

  return Response.json({ success: true, received: true });
}
