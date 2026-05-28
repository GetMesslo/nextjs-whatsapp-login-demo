"use client";

import { useState } from "react";
import {
  getWhatsAppQrCodeUrl,
  type StartSessionResponse
} from "@getmesslo/messlo-whatsapp-login";
import {
  MessloWhatsAppLoginButton,
  useMessloWhatsAppLogin
} from "@getmesslo/messlo-whatsapp-login/react";

type Mode = "link" | "qr" | "both";

export default function DemoPage() {
  const [mode, setMode] = useState<Mode>("both");
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<StartSessionResponse | null>(null);
  const [verifiedProfile, setVerifiedProfile] = useState<{
    name?: string;
    phone?: string;
  } | null>(null);
  const webhookMode = process.env.NEXT_PUBLIC_MESSLO_WEBHOOK_MODE || "self_hosted";
  const hostedWebhookUrl = process.env.NEXT_PUBLIC_MESSLO_HOSTED_WEBHOOK_URL || "";

  const hookDemo = useMessloWhatsAppLogin({
    basePath: "/api/auth/whatsapp-login",
    onVerified: async (token, session) => {
      setVerificationToken(token);
      setSessionInfo(session);
      const res = await fetch("/api/auth/whatsapp-login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
      const data = (await res.json()) as {
        valid?: boolean;
        user?: { name?: string; phone?: string };
      };
      if (res.ok && data.valid) {
        setVerifiedProfile(data.user || null);
      } else {
        setVerifiedProfile(null);
      }
    }
  });

  const qrUrl =
    hookDemo.session?.waLink && mode !== "link"
      ? getWhatsAppQrCodeUrl(hookDemo.session.waLink, 260)
      : null;

  return (
    <main className="container stack">
      <section className="card stack">
        <h1 style={{ margin: 0 }}>Messlo WhatsApp Login Demo</h1>
        <p className="muted" style={{ marginTop: 0 }}>
          This demo shows both package usage styles:
          <br />
          1) prebuilt component and 2) custom UI with hook.
        </p>
        <div className="row">
          <span className="pill">Frontend: <code>@getmesslo/messlo-whatsapp-login</code></span>
          <span className="pill">Backend: <code>@getmesslo/messlo-node-sdk</code></span>
          <span className="pill">Base path: <code>/api/auth/whatsapp-login</code></span>
          <span className="pill">
            Webhook mode: <code>{webhookMode}</code>
          </span>
        </div>
        {webhookMode === "messlo_hosted" && hostedWebhookUrl ? (
          <p className="muted" style={{ marginBottom: 0 }}>
            Using Messlo hosted webhook. Set this in Meta callback URL:
            <br />
            <code>{hostedWebhookUrl}</code>
          </p>
        ) : null}
      </section>

      <section className="card stack">
        <h2 style={{ margin: 0 }}>A) Prebuilt Button Component</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Change how the session action is shown: link, QR, or both.
        </p>
        <div className="row">
          <button onClick={() => setMode("link")} disabled={mode === "link"}>
            Link Only
          </button>
          <button onClick={() => setMode("qr")} disabled={mode === "qr"}>
            QR Only
          </button>
          <button onClick={() => setMode("both")} disabled={mode === "both"}>
            Both
          </button>
        </div>

        <MessloWhatsAppLoginButton
          basePath="/api/auth/whatsapp-login"
          displayMode={mode}
          onVerified={async (token, session) => {
            setVerificationToken(token);
            setSessionInfo(session);
            const res = await fetch("/api/auth/whatsapp-login/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token })
            });
            const data = (await res.json()) as {
              valid?: boolean;
              user?: { name?: string; phone?: string };
            };
            if (res.ok && data.valid) {
              setVerifiedProfile(data.user || null);
            } else {
              setVerifiedProfile(null);
            }
          }}
        />
      </section>

      <section className="card stack">
        <h2 style={{ margin: 0 }}>B) Custom UI with Hook</h2>
        <div className="row">
          <button
            className="primary"
            onClick={() => void hookDemo.start()}
            disabled={hookDemo.isStarting || hookDemo.isWaiting}
          >
            {hookDemo.isStarting ? "Preparing..." : "Start WhatsApp Login"}
          </button>
          <button onClick={() => void hookDemo.retry()}>Retry</button>
          <button onClick={hookDemo.reset}>Reset</button>
        </div>

        {hookDemo.session?.waLink && mode !== "qr" ? (
          <div>
            <a href={hookDemo.session.waLink} target="_blank" rel="noreferrer">
              Open WhatsApp Link
            </a>
          </div>
        ) : null}

        {qrUrl ? (
          <img
            src={qrUrl}
            alt="WhatsApp login QR"
            width={260}
            height={260}
            style={{ borderRadius: 10, border: "1px solid #e2e8f0" }}
          />
        ) : null}

        {hookDemo.isWaiting ? <p className="muted">Waiting for WhatsApp verification...</p> : null}
        {hookDemo.error ? <p className="error">{hookDemo.error}</p> : null}
      </section>

      <section className="card stack">
        <h2 style={{ margin: 0 }}>Verification Output</h2>
        {verificationToken ? (
          <>
            <p className="success">Verified successfully.</p>
            <p className="muted" style={{ margin: 0 }}>
              Verification token (demo): <code>{verificationToken.slice(0, 24)}...</code>
            </p>
            {sessionInfo ? (
              <p className="muted" style={{ margin: 0 }}>
                Session: <code>{sessionInfo.sessionId}</code>
              </p>
            ) : null}
            {verifiedProfile?.name ? (
              <p className="muted" style={{ margin: 0 }}>
                Name: <code>{verifiedProfile.name}</code>
              </p>
            ) : null}
            {verifiedProfile?.phone ? (
              <p className="muted" style={{ margin: 0 }}>
                Phone: <code>{verifiedProfile.phone}</code>
              </p>
            ) : null}
          </>
        ) : (
          <p className="muted">No verification completed yet.</p>
        )}
      </section>
    </main>
  );
}
