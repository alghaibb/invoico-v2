export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-muted">
      <div className="w-full max-w-3xl p-8 space-y-8 rounded-lg shadow-lg bg-background">
        {children}
      </div>
    </div>
  );
}
