import { getSiteConfig, getNavigation, getPageContent } from '@/lib/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import Gallery from '@/components/Gallery';
import FAQ from '@/components/FAQ';
import CtaBanner from '@/components/CtaBanner';

export default async function Home() {
  const siteConfig = getSiteConfig();
  const navigation = getNavigation();
  const pageContent = getPageContent('home');
  const servicesConfig = getPageContent('services');
  
  // Get enabled services for header dropdown
  const enabledServices = servicesConfig.services?.filter((service: any) => service.enabled !== false) || [];

  // Get section order and render sections dynamically
  const sections = pageContent.sections || {};
  const sectionOrder = sections.order || ['services', 'whyChooseUs', 'testimonials', 'pricing', 'gallery', 'faq'];
  
  const sectionComponents = {
    services: () => sections.services?.enabled !== false && (
      <Services content={pageContent} servicesConfig={servicesConfig} isHomePage={true} />
    ),
    whyChooseUs: () => sections.whyChooseUs?.enabled !== false && (
      <WhyChooseUs content={pageContent} />
    ),
    testimonials: () => sections.testimonials?.enabled !== false && (
      <Testimonials content={pageContent} />
    ),
    pricing: () => sections.pricing?.enabled === true && (
      <Pricing content={pageContent} />
    ),
    gallery: () => sections.gallery?.enabled === true && (
      <Gallery content={pageContent} />
    ),
    faq: () => sections.faq?.enabled === true && (
      <FAQ content={pageContent} />
    ),
  };

  return (
    <div className="min-h-screen">
      <Header 
        siteConfig={siteConfig} 
        navigation={navigation} 
        servicesConfig={servicesConfig}
        enabledServices={enabledServices}
      />
      <main>
        <Hero content={pageContent} siteConfig={siteConfig} pageType="home" />
        {sectionOrder.map((sectionKey: string) => {
          const component = sectionComponents[sectionKey as keyof typeof sectionComponents];
          return component ? <div key={sectionKey}>{component()}</div> : null;
        })}
      </main>
      {siteConfig.ctaBanner?.showOnPages?.home !== false && (
        <CtaBanner siteConfig={siteConfig} />
      )}
      <Footer siteConfig={siteConfig} navigation={navigation} />
    </div>
  );
}