import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tareas",
  description: "Lista de tareas con Next.js, NestJS y PostgreSQL",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
