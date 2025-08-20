import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CtaBannerProps {
  siteConfig: any;
}

export default function CtaBanner({ siteConfig }: CtaBannerProps) {
  const getBannerClasses = () => {
    const baseClasses = siteConfig.ctaBanner?.layout === 'fullwidth' 
      ? 'mt-0 mb-0' 
      : 'rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-8 mb-8';
    
    switch (siteConfig.ctaBanner?.style) {
      case 'primary':
        return `bg-primary ${baseClasses}`;
      case 'secondary':
        return `bg-secondary ${baseClasses}`;
      case 'accent':
        return `${baseClasses}`;
      case 'gradient':
      default:
        return `bg-gradient-to-r from-primary to-secondary ${baseClasses}`;
    }
  };

  const getBannerStyle = () => {
    if (siteConfig.ctaBanner?.style === 'accent') {
      return { backgroundColor: 'hsl(var(--accent))' };
    }
    return {};
  };

  const getPrimaryButtonClasses = () => {
    switch (siteConfig.ctaBanner?.primaryButtonColor) {
      case 'primary':
        return 'bg-primary hover:bg-primary/90 text-white';
      case 'secondary':
        return 'bg-secondary hover:bg-secondary/90 text-white';
      case 'accent':
        return 'text-white hover:opacity-90 transition-opacity';
      case 'white':
        return 'bg-white text-gray-900 hover:bg-gray-100';
      default:
        return 'text-white hover:opacity-90 transition-opacity';
    }
  };

  const getPrimaryButtonStyle = () => {
    if (siteConfig.ctaBanner?.primaryButtonColor === 'accent') {
      return { backgroundColor: 'hsl(var(--accent))' };
    }
    return {};
  };

  const getSecondaryButtonClasses = () => {
    switch (siteConfig.ctaBanner?.secondaryButtonColor) {
      case 'primary':
        return 'bg-primary hover:bg-primary/90 text-white border-primary';
      case 'secondary':
        return 'bg-secondary hover:bg-secondary/90 text-white border-secondary';
      case 'accent':
        return 'text-white hover:opacity-90 transition-opacity border-transparent';
      case 'white':
        return 'bg-white text-gray-900 hover:bg-gray-100 border-white';
      case 'outline':
      default:
        return 'bg-white/10 border-white/20 text-white hover:bg-white/20';
    }
  };

  const getSecondaryButtonStyle = () => {
    if (siteConfig.ctaBanner?.secondaryButtonColor === 'accent') {
      return { backgroundColor: 'hsl(var(--accent))' };
    }
    return {};
  };

  return (
    <div className={siteConfig.ctaBanner?.layout === 'contained' ? 'my-8' : 'my-0'}>
      <section className={getBannerClasses()} style={getBannerStyle()}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          {siteConfig.ctaBanner?.title || 'Ready to Get Started?'}
        </h2>
        <p className="text-white/90 text-lg mb-8">
          {siteConfig.ctaBanner?.subtitle || 'Contact us today for a free consultation and quote.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {siteConfig.ctaBanner?.primaryEnabled !== false && (
            <Button 
              size="lg" 
              asChild 
              className={getPrimaryButtonClasses()}
              style={getPrimaryButtonStyle()}
            >
              <Link href={siteConfig.ctaBanner?.primaryLink || '/contact'}>
                {siteConfig.ctaBanner?.primaryText || 'Get Free Quote'}
              </Link>
            </Button>
          )}
          {siteConfig.ctaBanner?.secondaryEnabled !== false && (
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className={getSecondaryButtonClasses()}
              style={getSecondaryButtonStyle()}
            >
              <Link href={siteConfig.ctaBanner?.secondaryLink || '/contact'}>
                {siteConfig.ctaBanner?.secondaryText || 'Contact Us'}
              </Link>
            </Button>
          )}
        </div>
      </div>
      </section>
    </div>
  );
}