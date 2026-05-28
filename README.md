# Next.js WhatsApp Login Demo

Public demo app for:

- [`@getmesslo/messlo-whatsapp-login`](https://www.npmjs.com/package/@getmesslo/messlo-whatsapp-login) (frontend package)
- [`@getmesslo/messlo-node-sdk`](https://www.npmjs.com/package/@getmesslo/messlo-node-sdk) (secure backend package)

## What this demo shows

- Next.js API routes using Node SDK adapters
- React hook usage (`useMessloWhatsAppLogin`)
- Prebuilt button usage (`MessloWhatsAppLoginButton`)
- Display mode options: link / qr / both
- Retry/reset behavior

## Project structure

```txt
app/
  page.tsx
  layout.tsx
  styles.css
  api/auth/whatsapp-login/start/route.ts
  api/auth/whatsapp-login/status/[sessionId]/route.ts
  api/auth/whatsapp-login/events/[sessionId]/route.ts
  api/auth/whatsapp-login/verify/route.ts
  api/messlo/webhook/route.ts
lib/messlo.ts
```

## Setup

1. Copy env:

```bash
cp .env.example .env.local
```

2. Set your real values in `.env.local`:

```env
MESSLO_WA_LOGIN_API_KEY=your_real_key
MESSLO_WA_LOGIN_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_MESSLO_WEBHOOK_MODE=messlo_hosted
NEXT_PUBLIC_MESSLO_HOSTED_WEBHOOK_URL=https://api.messlo.com/api/whatsapp-auth/webhook/<your_auth_app_id>
```

### Webhook mode options

- `messlo_hosted` (recommended for fast setup):
  - Use the URL provided in Messlo app, example:
    - `https://api.messlo.com/api/whatsapp-auth/webhook/6a181b8fab19066efd6f7dae`
  - Set that URL in Meta callback configuration.
  - Local `/api/messlo/webhook` route is not required.

- `self_hosted`:
  - Keep `NEXT_PUBLIC_MESSLO_WEBHOOK_MODE=self_hosted`
  - Set app webhook URL to your own server endpoint:
    - `https://<your-domain>/api/messlo/webhook`
  - Use `MESSLO_WA_LOGIN_WEBHOOK_SECRET` to verify signatures.

3. Install and run:

```bash
npm install
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

## Demo test flow

1. Click start/login button.
2. Open WhatsApp link or scan QR.
3. Send login message.
4. Wait for verification state.
5. Try mode switch: link / qr / both.
6. Trigger retry to confirm fresh session behavior.

## Notes

- API key stays on backend (`lib/messlo.ts`).
- Frontend only talks to `/api/auth/whatsapp-login/*` routes.
- This demo intentionally prints only short token preview in UI.
- For app webhook method, set webhook URL in Messlo app to:
  - `https://<your-domain>/api/messlo/webhook`
