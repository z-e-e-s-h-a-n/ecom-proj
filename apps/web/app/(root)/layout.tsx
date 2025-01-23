"use client";

import Footer from "@/components/constant/Footer";
import Header from "@/components/constant/Header";
import useAuth from "@/hooks/useAuth";
import { syncLocalToServer } from "@/hooks/useStorage";
import { useEffect } from "react";

function RootLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      syncLocalToServer(currentUser).then(() => {
        sessionStorage.setItem("synced", "true");
      });
    }
  }, [currentUser]);

  return (
    <div className="space-y-12">
      <Header currentUser={currentUser} />
      <main className="container min-h-screen space-y-16">{children}</main>
      <Footer />
    </div>
  );
}

export default RootLayout;
