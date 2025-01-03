/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Footer from "@/components/constant/Footer";
import Header from "@/components/constant/Header";
import { useAppDispatch } from "@/hooks/useStore";
import { useAuthSelector } from "@/store/features/auth/authSelector";
import { fetchCurrentUser } from "@/store/features/auth/authSlice";
import { Separator } from "@workspace/ui/components/separator";
import React, { useEffect } from "react";

function RootLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { currentUser, isLoading } = useAuthSelector();

  useEffect(() => {
    if (!currentUser && !isLoading) {
      dispatch(fetchCurrentUser());
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
