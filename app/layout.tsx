import { Metadata } from "next";
import { 
  Inter, 
  Cormorant_Garamond, 
  IM_Fell_English, 
  Playfair_Display, 
  Lora,
  Italiana,
  Jost
} from "next/font/google"

export const metadata: Metadata = {
  title: "poetik",
  description: "A tool for feeling, not for function.",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'], 
  weight: ['300', '400'], 
  style: ['normal', 'italic'],
  variable: '--font-cormorant' 
})
const fell = IM_Fell_English({ 
  subsets: ['latin'], 
  weight: ['400'], 
  style: ['normal', 'italic'],
  variable: '--font-fell' 
})
const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  weight: ['400'], 
  style: ['normal', 'italic'],
  variable: '--font-playfair' 
})
const lora = Lora({ 
  subsets: ['latin'], 
  weight: ['400'], 
  style: ['normal', 'italic'],
  variable: '--font-lora' 
})
const italiana = Italiana({ 
  subsets: ['latin'], 
  weight: ['400'], 
  variable: '--font-italiana' 
})
const jost = Jost({ 
  subsets: ['latin'], 
  weight: ['200', '300', '400'], 
  variable: '--font-jost' 
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased", 
        inter.variable,
        cormorant.variable,
        fell.variable,
        playfair.variable,
        lora.variable,
        italiana.variable,
        jost.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
