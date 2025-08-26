import { getSiteConfig, getNavigation, getPageContent } from '@/lib/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CtaBanner from '@/components/CtaBanner';
import Hero from '@/components/Hero';
import Services from '@/components/Services';

export default async function ServicesPage() {
  const siteConfig = getSiteConfig();
  const navigation = getNavigation();
  const homeContent = getPageContent('home');
  const servicesConfig = getPageContent('services');

  // Get enabled services for header dropdown
  const enabledServices =
    servicesConfig.services?.filter((service: any) => service.enabled !== false) || [];

  // Structure content for Hero component (standardize on hero.cta)
  const heroContent = {
    hero: {
      title: servicesConfig.title,
      subtitle: servicesConfig.subtitle,
      cta: servicesConfig.heroCta, // <-- corrected: pass under hero.cta
      image: servicesConfig.image,
    },
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
        <Hero content={heroContent} siteConfig={siteConfig} pageType="services" />
        <div className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Content moved to Hero component */}
          </div>
        </div>
        <Services content={homeContent} servicesConfig={servicesConfig} isHomePage={false} />
      </main>

      {siteConfig.ctaBanner?.showOnPages?.services !== false && (
        <CtaBanner siteConfig={siteConfig} />
      )}

      <Footer siteConfig={siteConfig} navigation={navigation} />
    </div>
  );
}
