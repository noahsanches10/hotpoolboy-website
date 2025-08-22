import { notFound } from 'next/navigation';
import { getSiteConfig, getNavigation, getPageContent } from '@/lib/content';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import CtaBanner from '@/components/CtaBanner';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Metadata } from 'next';

interface Service {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  contentImage?: string;
  showHeroImage?: boolean;
  enabled: boolean;
  showOtherServices?: boolean;
  benefits?: Array<{ title: string; description: string; }>;
  features?: string[];
}

interface ServicesPageData {
  heroCta: {
    primary?: {
      enabled: boolean;
      text: string;
      link: string;
    };
    secondary?: {
      enabled: boolean;
      text: string;
      link: string;
    };
  };
  services: Service[];
}

interface ServicePageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const servicesConfig = getPageContent('services');
    const services = servicesConfig.services || [];
    return services
      .filter((service: any) => service.enabled !== false)
      .map((service: any) => ({
        slug: service.slug,
      }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  try {
    const servicesConfig = getPageContent('services');
    const siteConfig = getSiteConfig();
    const service = servicesConfig.services?.find((s: any) => s.slug === params.slug);
    
    if (!service) {
      return { title: 'Service Not Found' };
    }
    
    return {
      title: `${service.title} Services | ${siteConfig.siteName}`,
      description: service.longDescription || service.description,
      openGraph: {
        title: `${service.title} Services`,
        description: service.longDescription || service.description,
        images: service.contentImage ? [{ url: service.contentImage }] : [],
      },
    };
  } catch {
    return {
      title: 'Service Not Found',
    };
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const siteConfig = getSiteConfig();
  const navigation = getNavigation();
  const servicesConfig = getPageContent('services');
  
  // Get enabled services for header dropdown
  const enabledServices = servicesConfig.services?.filter((service: any) => service.enabled !== false) || [];
  
  // Find the specific service
  const service = servicesConfig.services?.find((s: any) => s.slug === params.slug);
  
  if (!service || service.enabled === false) {
    notFound();
  }

  // Get other services for "Other Services" section
  const otherServices = enabledServices.filter((s: any) => s.slug !== params.slug);

  // Construct hero content structure that Hero component expects
  const heroContent = {
    hero: {
      title: service.title,
      subtitle: service.description,
      image: service.showThumbnailInHero === true ? service.image : 
             service.showContentInHero === true ? service.contentImage : 
             null,
      showThumbnailInHero: service.showThumbnailInHero,
      showContentInHero: service.showContentInHero,
      heroCta: servicesConfig.heroCta
    }
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
        {/* Hero Section */}
        <Hero content={heroContent} siteConfig={siteConfig} pageType={`service-${params.slug}`} />
        <div className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Content moved to Hero component */}
          </div>
        </div>

        {/* Long Description Section */}
        {service.longDescription && (
          <section className="py-10 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`${!service.showThumbnailInHero && !service.showContentInHero && service.contentImage ? 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center' : ''}`}>
                <div className={!service.showThumbnailInHero && !service.showContentInHero && service.contentImage ? '' : 'max-w-4xl mx-auto text-center'}>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {service.longDescription}
                  </p>
                </div>
                
                {/* Content Image (if not shown in hero) */}
                {!service.showThumbnailInHero && !service.showContentInHero && service.contentImage && (
                  <div>
                    <Image
                      src={service.contentImage}
                      alt={service.title}
                      width={600}
                      height={400}
                      className="rounded-2xl shadow-xl object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Service Benefits - only show if benefits exist */}
        {service.benefits && service.benefits.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Why Choose Our {service.title} Services?
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {service.benefits.map((benefit: any, index: number) => (
                  <Card key={index} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {benefit.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Other Services */}
        {service.showOtherServices !== false && otherServices.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Other Services We Offer
                </h2>
              </div>
              
              <div className="flex flex-wrap justify-center gap-8">
                {otherServices.slice(0, 3).map((otherService: any) => (
                  <Card key={otherService.slug} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg w-full max-w-sm">
                    <CardContent className="p-6">
                      <div className="w-full h-32 bg-gray-100 rounded-2xl overflow-hidden mb-4">
                        <Image
                          src={otherService.image}
                          alt={otherService.title}
                          width={200}
                          height={128}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {otherService.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {otherService.description}
                      </p>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 group-hover:shadow-md" 
                        asChild
                      >
                        <Link href={`/services/${otherService.slug}`}>
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      {siteConfig.ctaBanner?.showOnPages?.servicePages !== false && (
        <CtaBanner siteConfig={siteConfig} />
      )}
      
      <Footer siteConfig={siteConfig} navigation={navigation} />
    </div>
  );
}