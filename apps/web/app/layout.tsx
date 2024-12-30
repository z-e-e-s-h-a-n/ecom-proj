import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@workspace/ui/globals.css";
import Provider from "@/providers";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Krist - the Ecom Platform",
  description:
    "Krist is an ecommerce platform that empowers businesses to create and sell digital products.",
};

function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}

export default Layout;
