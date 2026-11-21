import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Refill — The self-resetting puzzle feeder for dogs",
    template: "%s | Refill",
  },
  description:
    "Refill is a self-resetting puzzle feeder for dogs. A sealed kibble hopper, a rotating tray that reshuffles itself after every level, and scheduled sessions that keep your dog engaged all day without overeating.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
