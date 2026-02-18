"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

type WixSessionResponse = {
  enabled: boolean;
  loggedIn: boolean;
};

export function WixAuthButton() {
  const pathname = usePathname();
  const { refreshCart } = useCart();
  const [session, setSession] = useState<WixSessionResponse | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/wix/session", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          setSession({ enabled: false, loggedIn: false });
          return;
        }

        const data = (await response.json()) as WixSessionResponse;
        setSession(data);

        if (data.enabled) {
          await refreshCart();
        }
      } catch {
        setSession({ enabled: false, loggedIn: false });
      }
    };

    void fetchSession();
  }, [refreshCart]);

  const returnTo = useMemo(() => {
    if (!pathname || !pathname.startsWith("/")) return "/";
    return pathname;
  }, [pathname]);

  if (!session?.enabled) {
    return null;
  }

  if (session.loggedIn) {
    return (
      <a
        href={`/api/auth/wix/logout?returnTo=${encodeURIComponent(returnTo)}`}
        className="rounded-full border border-white/70 bg-white px-3 py-1 text-xs md:text-sm font-medium text-tangerine whitespace-nowrap"
      >
        Logout
      </a>
    );
  }

  return (
    <a
      href={`/api/auth/wix/login?returnTo=${encodeURIComponent(returnTo)}`}
      className="rounded-full border border-white/70 px-3 py-1 text-xs md:text-sm font-medium text-white hover:bg-white/10 transition-colors whitespace-nowrap"
    >
      Login
    </a>
  );
}
