import { auth } from "@/auth";
import "@repo/ui/src/styles/globals.css";
import { SessionProvider } from "next-auth/react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body>
      <SessionProvider session={session} >
        {children}
      </SessionProvider>
      </body>
    </html>
  );
}
