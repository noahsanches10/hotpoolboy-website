import Image from 'next/image';
import Link from 'next/link';
import { Wrench, Zap, Thermometer, Hammer, ArrowRight, Settings, Wifi, Shield, PenTool as Tool, Home, Car, Paintbrush, Scissors, Droplets, Wind, Lightbulb, Drill, Gauge, Flame, Snowflake, Lock, Key, Camera, Antenna, Router, Battery, Plug, Cable, Cpu, HardDrive, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ServicesProps {
  content: any;
  servicesConfig?: any;
  isHomePage?: boolean;
}

const iconMap = {
  wrench: Wrench,
  zap: Zap,
  thermometer: Thermometer,
  hammer: Hammer,
  settings: Settings,
  wifi: Wifi,
  shield: Shield,
  tool: Tool,
  home: Home,
  car: Car,
  paintbrush: Paintbrush,
  scissors: Scissors,
  droplets: Droplets,
  wind: Wind,
  lightbulb: Lightbulb,
  drill: Drill,
  gauge: Gauge,
  flame: Flame,
  snowflake: Snowflake,
  lock: Lock,
  key: Key,
  camera: Camera,
  antenna: Antenna,
  router: Router,
  battery: Battery,
  plug: Plug,
  cable: Cable,
  cpu: Cpu,
  harddrive: HardDrive,
  monitor: Monitor,
  smartphone: Smartphone,
};

export default function Services({ content, servicesConfig, isHomePage = false }: ServicesProps) {
  // Get services from servicesConfig
  const services = servicesConfig?.services || [];
  const isMultiPage = servicesConfig?.pageType === 'multiple';
  const displayType = servicesConfig?.displayType || 'icons';
  
  // Filter services for home page based on hiddenServices
  const displayedServices = isHomePage 
    ? services.filter((service: any) => 
        service.enabled !== false && !content.services?.hiddenServices?.includes(service.slug)
      )
    : services.filter((service: any) => service.enabled !== false);

  // Determine link behavior based on services config
  const getServiceLink = (service: any) => {
    if (isMultiPage) {
      return `/services/${service.slug}`;
    }
    return '/services';
  };

  const sectionTitle = isHomePage 
    ? content.services?.title || 'Our Services'
    : servicesConfig?.title || 'Our Services';
    
  const sectionSubtitle = isHomePage 
    ? content.services?.subtitle || 'Comprehensive home services'
    : servicesConfig?.subtitle || 'Professional home services delivered with expertise and care';

  // Determine grid columns based on number of services
  const getGridCols = (count: number) => {
    if (count === 1) return 'grid-cols-1 max-w-md mx-auto';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto';
    if (count === 3) return 'grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
  };

  return (
    <section className={`py-20 ${isHomePage ? getBackgroundClass(content.services?.background || 'white') : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - only show on home page */}
        {isHomePage && (
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {sectionTitle}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {sectionSubtitle}
            </p>
          </div>
        )}

        {/* Services Grid */}
        <div className={`grid gap-8 ${getGridCols(displayedServices.length)} ${!isHomePage ? 'mt-0' : ''}`}>
          {displayedServices.map((service: any, index: number) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Wrench;
            const serviceLink = getServiceLink(service);
            
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="relative mb-6">
                    {displayType === 'images' ? (
                      <div className="w-full h-32 bg-gray-100 rounded-2xl overflow-hidden mb-4">
                        <Image
                          src={service.image}
                          alt={service.title}
                          width={200}
                          height={128}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 group-hover:shadow-md" 
                      asChild
                    >
                    <Link href={serviceLink}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}

function getBackgroundClass(background: string) {
  switch (background) {
    case 'gray':
      return 'bg-gray-50';
    case 'primary-light':
      return 'bg-primary-light';
    case 'secondary-light':
      return 'bg-secondary-light';
    case 'accent-light':
      return 'bg-accent-light';
    default:
      return 'bg-white';
  }
}