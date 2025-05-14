import type { Metadata } from "next";

import { Poppins } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import "../styles/globals.css";
import "../styles/layout.css";
import "../styles/animations.css";
import { Sidebar } from "@/components/Sidebar";

const poppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
    subsets: ["latin"],
    display: "swap"
});

export const metadata: Metadata = {
    title: "AdVerb",
    description: ""
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
                <div className="flex min-h-screen">
                    <Sidebar />
                    <div className="flex w-full flex-col">
                        {/* <Navbar className="mb-12" /> */}
                        <div className="mb-24" />
                        <div className="flex-1">{children}</div>
                        {/* <Footer className="mt-12" /> */}
                    </div>
                </div>
            </body>
        </html>
    );
}
