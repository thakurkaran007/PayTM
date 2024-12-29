import "@repo/ui/src/styles/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        {children}
      </body>
    </html>
  );
}
