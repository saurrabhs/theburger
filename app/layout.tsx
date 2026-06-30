import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Burger — Premium Craft Experience",
  description: "Experience the art of burger perfection. Every ingredient, every layer, crafted to excellence.",
  keywords: ["premium burger", "craft burger", "gourmet", "luxury food"],
  openGraph: {
    title: "The Burger — Premium Craft Experience",
    description: "Experience the art of burger perfection.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
