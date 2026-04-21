import "./globals.css";

export const metadata = {
  title: "Northstar",
  description: "Alternative equity and fixed income strategies manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black">{children}</body>
    </html>
  );
}