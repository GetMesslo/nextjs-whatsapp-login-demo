import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Messlo WhatsApp Login Demo",
  description: "Demo app for @getmesslo/messlo-whatsapp-login + @getmesslo/messlo-node-sdk"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
