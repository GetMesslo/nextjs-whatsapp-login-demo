import { nextAdapter } from "messlo-node-sdk";
import { createMessloSdk } from "@/lib/messlo";

export async function POST(): Promise<Response> {
  try {
    const sdk = createMessloSdk();
    const handler = nextAdapter.startRoute(sdk);
    return await handler();
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Unable to start WhatsApp login" },
      { status: 500 }
    );
  }
}
