// app/layout.js
import "./globals.css";
import "./form.css";
import { Inter, Poppins } from "next/font/google";
import ClientProvider from "./ClientProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Fieldwire",
  description:
    "Experience the future of navigation with dimension transformation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body suppressHydrationWarning className="testts">
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
