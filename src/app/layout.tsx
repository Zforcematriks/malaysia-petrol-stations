import type { Metadata } from "next";
import { Audiowide, Exo } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const audiowide = Audiowide({
  variable: "--font-audiowide",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});
const exo = Exo({
  variable: "--font-exo",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Malaysia Petrol Stations",
  description: "Find petrol stations near you in Malaysia",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Petrol Stations"
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: "no",
};

export const themeColor = "#3B82F6";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${audiowide.variable} ${exo.variable} antialiased`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
