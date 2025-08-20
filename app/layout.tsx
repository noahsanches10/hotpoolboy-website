import './globals.css';
import type { Metadata } from 'next';
import { Inter, Roboto, Open_Sans, Lato, Montserrat, Poppins, Nunito_Sans, Source_Sans_3, Raleway, Work_Sans, Playfair_Display, Merriweather, Crimson_Text } from 'next/font/google';
import { getSiteConfig } from '@/lib/content';
import DynamicStyles from '@/components/DynamicStyles';

const inter = Inter({ subsets: ['latin'] });
const roboto = Roboto({ weight: ['300', '400', '500', '700'], subsets: ['latin'] });
const openSans = Open_Sans({ subsets: ['latin'] });
const lato = Lato({ weight: ['300', '400', '700'], subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });
const poppins = Poppins({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'] });
const nunito = Nunito_Sans({ subsets: ['latin'] });
const sourceSans = Source_Sans_3({ subsets: ['latin'] });
const raleway = Raleway({ subsets: ['latin'] });
const workSans = Work_Sans({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });
const merriweather = Merriweather({ weight: ['300', '400', '700'], subsets: ['latin'] });
const crimson = Crimson_Text({ weight: ['400', '600'], subsets: ['latin'] });

const fontMap = {
  inter: inter.className,
  roboto: roboto.className,
  'open-sans': openSans.className,
  lato: lato.className,
  montserrat: montserrat.className,
  poppins: poppins.className,
  nunito: nunito.className,
  'source-sans': sourceSans.className,
  raleway: raleway.className,
  'work-sans': workSans.className,
  playfair: playfair.className,
  merriweather: merriweather.className,
  crimson: crimson.className,
};

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = getSiteConfig();
  
  return {
    title: siteConfig.siteName,
    description: siteConfig.tagline,
    keywords: 'home services, plumbing, electrical, HVAC, handyman',
    openGraph: {
      title: siteConfig.siteName,
      description: siteConfig.tagline,
      type: 'website',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteConfig = getSiteConfig();
  
  // Determine the correct font class
  const fontClass = siteConfig?.fontFamily && fontMap[siteConfig.fontFamily as keyof typeof fontMap] 
    ? fontMap[siteConfig.fontFamily as keyof typeof fontMap]
    : inter.className;

  return (
    <html lang="en">
      <head>
        {siteConfig.favicon && (
          <link rel="icon" href={siteConfig.favicon} />
        )}
      </head>
      <body className={fontClass}>
        <DynamicStyles siteConfig={siteConfig} />
        {children}
      </body>
    </html>
  );
}
