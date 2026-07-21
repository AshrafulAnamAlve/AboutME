import type { Metadata, Viewport } from "next";
import {
  Cinzel,
  Cormorant_Garamond,
  Inter,
  Noto_Sans_Egyptian_Hieroglyphs,
} from "next/font/google";
import "./globals.css";
import { identity } from "@/lib/data";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Real hieroglyphs (U+13000–U+1342F) exist in almost no system font — without
 * this they render as tofu boxes. It sits *after* the Latin faces in every
 * stack, so per-character fallback picks it up only for the glyphs.
 */
const glyphs = Noto_Sans_Egyptian_Hieroglyphs({
  subsets: ["egyptian-hieroglyphs"],
  weight: "400",
  variable: "--font-glyph",
  display: "swap",
});

const SITE_URL = "https://ashrafulanamalve.github.io";
const DESCRIPTION =
  "Ashraful Anam Alve — .NET Developer and full-stack engineer in Dhaka, building secure web systems with C#, ASP.NET Core, Web API and Angular.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${identity.name} — ${identity.role}`,
    template: `%s · ${identity.name}`,
  },
  description: DESCRIPTION,
  applicationName: `${identity.name} Portfolio`,
  authors: [{ name: identity.name, url: "https://github.com/AshrafulAnamAlve" }],
  creator: identity.name,
  keywords: [
    "Ashraful Anam Alve",
    ".NET Developer",
    "ASP.NET Core Developer",
    "Angular Developer",
    "Full Stack Developer Bangladesh",
    "C# Developer Dhaka",
    "Web API",
    "SQL Server",
    "QA Engineer",
    "Portfolio",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: `${identity.name} — Portfolio`,
    title: `${identity.name} — ${identity.role}`,
    description: DESCRIPTION,
    images: [
      {
        url: "/images/profile.jpg",
        width: 1200,
        height: 630,
        alt: `${identity.name}, ${identity.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${identity.name} — ${identity.role}`,
    description: DESCRIPTION,
    images: ["/images/profile.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#0F0E0B",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

/** Structured data so search engines read this as a person, not a poster. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  jobTitle: identity.role,
  email: `mailto:${identity.email}`,
  url: SITE_URL,
  image: `${SITE_URL}/images/profile.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Bangladesh University of Business and Technology (BUBT)",
    },
    { "@type": "EducationalOrganization", name: "Barguna Polytechnic Institute" },
  ],
  knowsAbout: [
    "C#",
    "ASP.NET Core",
    "ASP.NET MVC",
    "Web API",
    "Angular",
    "TypeScript",
    "SQL Server",
    "MySQL",
    "Java",
    "Quality Assurance",
  ],
  sameAs: [
    "https://github.com/AshrafulAnamAlve",
    "https://www.linkedin.com/in/asraful-anam-alve/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${inter.variable} ${glyphs.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* `as="audio"` is not a valid preload destination — the browser rejects
            it. The track is fetched on the enter gesture instead. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className="grain vignette antialiased">
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:border focus:border-gold focus:bg-void-900 focus:px-4 focus:py-2 focus:text-sm focus:text-gold"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
