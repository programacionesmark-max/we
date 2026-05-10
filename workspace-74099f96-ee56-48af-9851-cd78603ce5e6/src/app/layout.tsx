import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Webnox — Diseño y desarrollo web que funciona",
  description: "Creamos páginas web y aplicaciones a medida. Desde landing pages hasta plataformas con CMS, e-commerce y APIs. Sin humo, sin letras pequeñas.",
  keywords: ["Webnox", "desarrollo web", "diseño UI/UX", "conversión", "Next.js", "React", "markestein", "acontrabarra", "landing page", "e-commerce", "web development Netherlands"],
  authors: [{ name: "Webnox Studio" }],
  creator: "Webnox Studio",
  publisher: "Webnox Studio",
  metadataBase: new URL("https://webnox.studio"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: ["en_US", "nl_NL"],
    title: "Webnox — Diseño y desarrollo web que funciona",
    description: "Creamos páginas web y aplicaciones a medida. Landing pages, CMS, e-commerce y APIs. Proyectos reales: markestein.es, acontrabarra.es.",
    siteName: "Webnox Studio",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Webnox Studio — Web Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Webnox — Diseño y desarrollo web que funciona",
    description: "Creamos páginas web y aplicaciones a medida. Sin humo, sin letras pequeñas.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.svg",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
