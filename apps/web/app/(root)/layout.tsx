import Footer from "@/components/constant/Footer";
import Header from "@/components/constant/Header";
import { Separator } from "@workspace/ui/components/separator";
 import React from "react";

function RootLayout({ children }: { children: React.ReactNode }) {
  const currentUser = null;

  return (
    <>
      <Header currentUser={currentUser!} />
      <Separator className="mt-2" />
      <main className="container min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

export default RootLayout;
