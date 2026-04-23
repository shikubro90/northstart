import { Lato, Barlow } from "next/font/google";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-lato",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-brix",
});

export const metadata = {
  title: "Northstar",
  description:
    "Northstar is an alternative equity and fixed income strategies manager specializing in diverse arbitrage transactions in the U.S. market.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${barlow.variable} ${lato.className}`}>{children}</body>
    </html>
  );
}
