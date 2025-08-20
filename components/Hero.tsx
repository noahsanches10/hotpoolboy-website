import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';

interface HeroProps {
  content: any;
  siteConfig?: any;
  pageType?: string;
}

export default function Hero({ content, siteConfig, pageType = 'home' }: HeroProps) {
  const getPageHeroBackground = () => {
    const pageBackground = siteConfig?.heroBackgrounds?.[pageType];
    // Only return if it's actually set and not empty
    return pageBackground && pageBackground.trim() !== '' ? pageBackground : null;
  };

  const getPageOverlaySettings = () => {
    const pageBackground = getPageHeroBackground();
    if (!pageBackground) return {};
    
    // Extract filename from the background image path and remove any query parameters
    const pathParts = pageBackground.split('/');
    const filename = pathParts[pathParts.length - 1]?.split('?')[0];
    if (!filename) return {};
    
    return siteConfig?.heroOverlays?.[`image-${filename}`] || {};
  };

  const getHeroClasses = () => {
    const pageBackground = getPageHeroBackground();
    const baseClasses = "relative overflow-hidden";
    
    // Only use background image styling if there's actually a background set for this page
    if (pageBackground) {
      return `${baseClasses} bg-cover bg-center bg-no-repeat`;
    }
    
    // Fallback to global hero styling for pages without specific backgrounds
    const heroStyling = siteConfig?.heroStyling;
    switch (heroStyling?.backgroundType) {
      case 'primary':
        return `${baseClasses} bg-primary`;
      case 'secondary':
        return `${baseClasses} bg-secondary`;
      case 'accent':
        return `${baseClasses}`;
      case 'white':
        return `${baseClasses} bg-white`;
      case 'gray':
        return `${baseClasses} bg-gray-100`;
      case 'gradient':
      default:
        return `${baseClasses} bg-gradient-to-br from-primary-light to-secondary-light`;
    }
  };

  const getHeroStyle = () => {
    const pageBackground = getPageHeroBackground();
    let style: any = {};
    
    // Only set background image if there's actually a background set for this page
    if (pageBackground) {
      style.backgroundImage = `url(${pageBackground})`;
      return style;
    }
    
    // Fallback to design manager settings only if no page-specific background
    const heroStyling = siteConfig?.heroStyling;
    if (heroStyling?.backgroundType === 'accent') {
      style.backgroundColor = 'hsl(var(--accent))';
    }
    
    return style;
  };

  const getOverlayClasses = () => {
    const pageBackground = getPageHeroBackground();
    const overlaySettings = getPageOverlaySettings();
    
    // Only show overlay if there's a page-specific background image
    if (!pageBackground || overlaySettings.overlayType === 'none') {
      return '';
    }
    
    const overlayType = overlaySettings.overlayType || 'none';
    
    switch (overlayType) {
      case 'dark':
        return `absolute inset-0 bg-black`;
      case 'light':
        return `absolute inset-0 bg-white`;
      case 'primary':
        return `absolute inset-0 bg-primary`;
      case 'secondary':
        return `absolute inset-0 bg-secondary`;
      case 'accent':
        return `absolute inset-0`;
      default:
        return '';
    }
  };

  const getOverlayStyle = () => {
    const pageBackground = getPageHeroBackground();
    const overlaySettings = getPageOverlaySettings();
    
    // Only apply overlay styles if there's a page-specific background image
    if (!pageBackground || overlaySettings.overlayType === 'none') {
      return {};
    }
    
    const opacity = (overlaySettings.overlayOpacity || 50) / 100;
    const overlayType = overlaySettings.overlayType;
    
    if (overlayType === 'accent') {
      return { 
        backgroundColor: 'hsl(var(--accent))',
        opacity 
      };
    }
    
    if (overlayType === 'custom') {
      return { 
        backgroundColor: overlaySettings.overlayColor || '#000000',
        opacity 
      };
    }
    
    return { opacity };
  };

  const getTextClasses = () => {
    const pageBackground = getPageHeroBackground();
    const overlaySettings = getPageOverlaySettings();
    
    // Only use image-specific text styling if there's actually a page background
    if (pageBackground && overlaySettings.overlayType !== 'none') {
      return 'text-white';
    }
    
    // For page backgrounds without overlays, use white text with shadow
    if (pageBackground) {
      return 'text-white drop-shadow-lg';
    }
    
    // Fallback to design manager settings for text color
    const heroStyling = siteConfig?.heroStyling;
    switch (heroStyling?.backgroundType) {
      case 'primary':
      case 'secondary':
      case 'accent':
        return 'text-white';
      case 'white':
      case 'gray':
        return 'text-gray-900';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <section className={getHeroClasses()} style={getHeroStyle()}>
      {/* Overlay */}
      {getOverlayClasses() && (
        <div className={getOverlayClasses()} style={getOverlayStyle()}></div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className={`${content.hero.image ? 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center' : 'text-center max-w-4xl mx-auto'}`}>
          {/* Content */}
          <div className="space-y-8 relative z-10">
            <div className="space-y-4">
              
              <h1 className={`text-4xl lg:text-6xl font-bold leading-tight ${getTextClasses()}`}>
                {content.hero.title}
              </h1>
              
              <p className={`text-xl leading-relaxed ${getTextClasses().includes('white') ? 'text-white/90' : 'text-gray-600'}`}>
                {content.hero.subtitle}
              </p>
            </div>

            <div className={`flex flex-col sm:flex-row gap-4 ${!content.hero.image ? 'justify-center' : ''}`}>
              {content.hero.cta?.primary?.enabled !== false && (
                <Button size="lg" asChild className="group">
                  <Link href={content.hero.cta?.primary?.link || content.hero.ctaLink || '/contact'}>
                    {content.hero.cta?.primary?.text || content.hero.ctaText || 'Get Free Quote'}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              )}
              {content.hero.cta?.secondary?.enabled !== false && (
                <Button variant="outline" size="lg" asChild>
                  <Link href={content.hero.cta?.secondary?.link || '/contact'}>
                    {content.hero.cta?.secondary?.text || 'Contact Us'}
                  </Link>
                </Button>
              )}
            </div>

            {/* Trust Indicators */}
            {content.hero.trustIndicators && content.hero.trustIndicators.length > 0 && (
              <div className={`flex flex-wrap items-center gap-6 pt-4 ${!content.hero.image ? 'justify-center' : ''}`}>
                {content.hero.trustIndicators
                  .map((indicator: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                      <span className={`text-sm ${getTextClasses().includes('white') ? 'text-white/80' : 'text-gray-600'}`}>{indicator.text}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Hero Image */}
          {content.hero.image && (
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src={content.hero.image}
                  alt="Professional home service technician"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl object-cover"
                  priority
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary-light rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-accent-light rounded-full blur-3xl"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}