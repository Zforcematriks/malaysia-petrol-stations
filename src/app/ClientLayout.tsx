"use client";
import dynamic from "next/dynamic";
import React from "react";

const BottomNav = dynamic(() => import("../components/BottomNav"), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
} 