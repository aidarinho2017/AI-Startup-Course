"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/lib/auth";
import { Locale } from "@/lib/locale";
import { LocaleProvider, useLocale } from "@/components/language-switcher";

function AppProviders({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, retry: 1, staleTime: 30_000 },
        },
      })
  );
  const { locale } = useLocale();

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""} locale={locale}>
      <QueryClientProvider client={client}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export function Providers({ children, initialLocale }: { children: React.ReactNode; initialLocale: Locale }) {
  return <LocaleProvider initialLocale={initialLocale}><AppProviders>{children}</AppProviders></LocaleProvider>;
}
