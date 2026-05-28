import { createMessloSdk } from "@/lib/messlo";

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as { token?: string };
    const token = String(body?.token || "").trim();
    if (!token) {
      return Response.json({ message: "token is required" }, { status: 400 });
    }

    const sdk = createMessloSdk();
    const result = await sdk.verifyWhatsAppToken(token);
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Unable to verify token" },
      { status: 500 }
    );
  }
}
