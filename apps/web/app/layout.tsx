import { auth } from "@/auth";
import "@repo/ui/src/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { cn } from "@repo/lib/utils"; 

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en">
      <body >
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
