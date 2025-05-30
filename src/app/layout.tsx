import type { Metadata } from "next";

import { Poppins } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";

import "../styles/globals.css";
import "../styles/layout.css";
import "../styles/animations.css";

const poppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
    subsets: ["latin"],
    display: "swap"
});

export const metadata: Metadata = {
    title: "AdVerb",
    description: "Lightweight AI-powered editor that helps marketers craft high-performing SMS and ad copies",
    keywords: "sms, ad, copy, ai, marketing, editor, writing, tool"
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${poppins.variable} flex touch-pan-x touch-pan-y touch-pinch-zoom flex-col overflow-x-hidden scroll-smooth antialiased`}
            >
                <Suspense
                    fallback={
                        <div className="loadingGlow flex h-screen w-screen flex-col items-center justify-center text-[var(--color-foreground)]">
                            <LoaderCircle size={50} className="-mt-[25vh] animate-spin" />
                        </div>
                    }
                >
                    <div className="flex min-h-screen">
                        {/* Sidebar (hidden on mobile) */}
                        <Sidebar className="not-lg:hidden" />

                        {/* Content Container */}
                        <div className="flex w-full flex-col">
                            {/* Navbar (hidden on desktop) */}
                            <Navbar className="mb-12 lg:hidden" />
                            {/* Top Spacing (for desktop only) */}
                            <div className="mb-24 hidden lg:block" />

                            {/* Main Content */}
                            <div className="contentFadeIn flex-1 lg:mb-24">{children}</div>

                            {/* Footer (hidden on desktop) */}
                            <Footer className="mt-12 lg:hidden" />
                        </div>
                    </div>
                </Suspense>
            </body>
        </html>
    );
}
