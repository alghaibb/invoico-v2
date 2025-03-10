export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="w-full max-w-3xl p-6 space-y-8 rounded-lg shadow-lg md:p-8 bg-background">
        {children}
      </div>
    </div>
  );
}
