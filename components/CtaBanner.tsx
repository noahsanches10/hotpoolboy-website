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
    const buttonClasses = ['transition-opacity'];
    
    // Background color classes
    switch (siteConfig.ctaBanner?.primaryButtonColor) {
      case 'primary':
        buttonClasses.push('bg-primary hover:bg-primary/90');
        break;
      case 'secondary':
        buttonClasses.push('bg-secondary hover:bg-secondary/90');
        break;
      case 'accent':
        buttonClasses.push('hover:opacity-90');
        break;
      case 'white':
        buttonClasses.push('bg-white hover:bg-gray-100');
        break;
      default:
        buttonClasses.push('hover:opacity-90');
    }
    
    // Text color classes
    switch (siteConfig.ctaBanner?.primaryButtonTextColor) {
      case 'black':
        buttonClasses.push('text-gray-900');
        break;
      case 'primary':
        buttonClasses.push('text-primary');
        break;
      case 'secondary':
        buttonClasses.push('text-secondary');
        break;
      case 'white':
      default:
        buttonClasses.push('text-white');
        break;
    }
    
    return buttonClasses.join(' ');
  };

  const getPrimaryButtonStyle = () => {
    if (siteConfig.ctaBanner?.primaryButtonColor === 'accent') {
      return { backgroundColor: 'hsl(var(--accent))' };
    }
    return {};
  };

  const getSecondaryButtonClasses = () => {
    const buttonClasses = ['transition-opacity'];
    
    // Background and border color classes
    switch (siteConfig.ctaBanner?.secondaryButtonColor) {
      case 'primary':
        buttonClasses.push('bg-primary hover:bg-primary/90 border-primary');
        break;
      case 'secondary':
        buttonClasses.push('bg-secondary hover:bg-secondary/90 border-secondary');
        break;
      case 'accent':
        buttonClasses.push('hover:opacity-90 border-transparent');
        break;
      case 'white':
        buttonClasses.push('bg-white hover:bg-gray-100 border-white');
        break;
      case 'outline':
      default:
        buttonClasses.push('bg-white/10 border-white/20 hover:bg-white/20');
        break;
    }
    
    // Text color classes
    switch (siteConfig.ctaBanner?.secondaryButtonTextColor) {
      case 'black':
        buttonClasses.push('text-gray-900');
        break;
      case 'primary':
        buttonClasses.push('text-primary');
        break;
      case 'secondary':
        buttonClasses.push('text-secondary');
        break;
      case 'white':
      default:
        buttonClasses.push('text-white');
        break;
    }
    
    return buttonClasses.join(' ');
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