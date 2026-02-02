import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BJJ Technique Tracker",
  description: "Track and rate your Brazilian Jiu Jitsu techniques",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
