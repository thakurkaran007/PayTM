import "@repo/ui/src/styles/globals.css";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
      <SessionProvider>
        {children}
      </SessionProvider>
      </body>
    </html>
  );
}
