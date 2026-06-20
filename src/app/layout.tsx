import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "ScholarUz: Fund a Student's Future",
    template: "%s · ScholarUz",
  },
  description:
    "ScholarUz is a nonprofit scholarship platform connecting donors with university students in Uzbekistan who need support. Every contribution is tracked transparently, from pledge to disbursement.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "ScholarUz: Fund a Student's Future",
    description:
      "A nonprofit scholarship platform connecting donors with university students in Uzbekistan. Transparent funding, tracked from pledge to disbursement.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
