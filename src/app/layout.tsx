import "../styles/globals.css";
import "../styles/layout.css";
import "../styles/animations.css";

import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Poppins } from "next/font/google";

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
            <body className={`${poppins.variable} overflow-x-hidden antialiased`}>
                <Navbar className="mb-12" />
                {children}
            </body>
        </html>
    );
}
