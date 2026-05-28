import { nextAdapter } from "messlo-node-sdk";
import { createMessloSdk } from "@/lib/messlo";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ sessionId: string }> }
): Promise<Response> {
  try {
    const sdk = createMessloSdk();
    const handler = nextAdapter.statusRoute(sdk);
    return await handler(req, ctx);
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Unable to check WhatsApp login status" },
      { status: 500 }
    );
  }
}
