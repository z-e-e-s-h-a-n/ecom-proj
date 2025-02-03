"use client";

import Footer from "@/components/constant/Footer";
import Header from "@/components/constant/Header";
import useAuth from "@/hooks/useAuth";
import { useCurrency } from "@/hooks/useCurrency";
import { syncLocalToServer } from "@/hooks/useStorage";
import React, { useEffect } from "react";

function RootLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const { currencyInfo, refetchCurrency } = useCurrency();

  useEffect(() => {
    if (!currencyInfo) {
      refetchCurrency();
    }
  }, [currencyInfo, refetchCurrency]);

  useEffect(() => {
    if (currentUser && !sessionStorage.getItem("synced")) {
      syncLocalToServer(currentUser).then(() => {
        sessionStorage.setItem("synced", "true");
      });
    }
  }, [currentUser]);

  if (!currencyInfo) return;

  return (
    <div className="space-y-12">
      <Header currentUser={currentUser} />
      <main className="container min-h-screen space-y-16 pb-8 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;
