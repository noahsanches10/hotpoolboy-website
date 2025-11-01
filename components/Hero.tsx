import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  content: any;
  siteConfig?: any;
  pageType?: string;
}

export default function Hero({ content, siteConfig, pageType = 'home' }: HeroProps) {
  const getPageHeroBackground = () => {
    const pageBackground = siteConfig?.heroBackgrounds?.[pageType];
    return pageBackground && pageBackground.trim() !== '' ? pageBackground : null;
  };

  const getPageOverlaySettings = () => {
    const pageBackground = getPageHeroBackground();
    if (!pageBackground) return {};
    // First try overlay settings keyed by the full path (for external videos and URLs)
    const overlayByPath = siteConfig?.heroOverlayByPath?.[pageBackground];
    if (overlayByPath) return overlayByPath;

    // Fallback: derive filename and look up filename-keyed overlay entries
    const pathParts = pageBackground.split('/');
    const filename = pathParts[pathParts.length - 1]?.split('?')[0];
    if (!filename) return {};
    return siteConfig?.heroOverlays?.[`image-${filename}`] || {};
  };

  const getHeroClasses = () => {
    const pageBackground = getPageHeroBackground();
    const baseClasses = 'relative overflow-hidden';
    if (pageBackground) return `${baseClasses} bg-cover bg-center bg-no-repeat`;

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
    if (pageBackground) {
      style.backgroundImage = `url(${pageBackground})`;
      return style;
    }
    const heroStyling = siteConfig?.heroStyling;
    if (heroStyling?.backgroundType === 'accent') {
      style.backgroundColor = 'hsl(var(--accent))';
    }
    return style;
  };

  const getOverlayClasses = () => {
    const pageBackground = getPageHeroBackground();
    const overlaySettings = getPageOverlaySettings();
    if (!pageBackground || overlaySettings.overlayType === 'none') return '';

    const overlayType = overlaySettings.overlayType || 'none';
    switch (overlayType) {
      case 'dark':
        return 'absolute inset-0 bg-black';
      case 'light':
        return 'absolute inset-0 bg-white';
      case 'primary':
        return 'absolute inset-0 bg-primary';
      case 'secondary':
        return 'absolute inset-0 bg-secondary';
      case 'accent':
        return 'absolute inset-0';
      default:
        return '';
    }
  };

  const getOverlayStyle = () => {
    const pageBackground = getPageHeroBackground();
    const overlaySettings = getPageOverlaySettings();
    if (!pageBackground || overlaySettings.overlayType === 'none') return {};
    const opacity = (overlaySettings.overlayOpacity || 50) / 100;
    const overlayType = overlaySettings.overlayType;
    if (overlayType === 'accent') {
      return { backgroundColor: 'hsl(var(--accent))', opacity };
    }
    if (overlayType === 'custom') {
      return { backgroundColor: overlaySettings.overlayColor || '#000000', opacity };
    }
    return { opacity };
  };

  const getTextClasses = () => {
    const pageBackground = getPageHeroBackground();
    const overlaySettings = getPageOverlaySettings();

    if (pageBackground && overlaySettings.overlayType !== 'none') return 'text-white';
    if (pageBackground) return 'text-white drop-shadow-lg';

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

  // Prefer content.hero.cta but support legacy content.hero.heroCta
  const cta = content?.hero?.cta || content?.hero?.heroCta;

  // Map saved color + textColor to Tailwind classes
  function btnClasses(color?: string, textColor?: string) {
    // background / border
    let base = '';
    switch (color) {
      case 'secondary':
        base = 'bg-secondary hover:bg-secondary/90';
        break;
      case 'accent':
        // Keep accent on hover (avoid falling back to primary)
        base = 'bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90';
        break;
      case 'white':
        base = 'bg-white hover:bg-gray-100';
        break;
      case 'outline':
        base = 'border-2 bg-transparent hover:bg-white/10';
        break;
      case 'primary':
      default:
        base = 'bg-primary hover:bg-primary/90';
        break;
    }

    // text color
    let text = '';
    switch (textColor) {
      case 'black':
        text = 'text-gray-900';
        break;
      case 'primary':
        text = 'text-primary';
        break;
      case 'secondary':
        text = 'text-secondary';
        break;
      case 'white':
      default:
        text = 'text-white';
        break;
    }

    return `${base} ${text}`;
  }

  return (
    <section className={getHeroClasses()} style={getHeroStyle()}>
      {/* Background video (external URL) */}
      {(() => {
        const pageBackground = getPageHeroBackground();
        if (pageBackground && /^https?:\/\//.test(pageBackground) && !pageBackground.includes('/uploads/')) {
          // Render a video element as the background
          return (
            <video
              src={pageBackground}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ 
                objectPosition: `center ${getPageOverlaySettings().videoPosition ?? 50}%`
              }}
              muted
              autoPlay
              loop
              playsInline
            />
          );
        }
        return null;
      })()}

      {/* Overlay */}
      {getOverlayClasses() && (
        <div className={getOverlayClasses()} style={getOverlayStyle()}></div>
      )}

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
        pageType === 'home' ? 'py-40 lg:py-64' : 'py-20 lg:py-32'
      }`}>
        <div
          className={
            (content.hero.image || (content.hero.useVideo && content.hero.videoUrl))
              ? 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'
              : 'text-center max-w-4xl mx-auto'
          }
        >
          {/* Content */}
          <div className="space-y-8 relative z-10">
            <div className="space-y-4">
              <h1 className={`text-4xl lg:text-6xl font-bold leading-tight ${getTextClasses()}`}>
                {content.hero.title}
              </h1>

              <p
                className={`text-xl leading-relaxed ${
                  getTextClasses().includes('white') ? 'text-white/90' : 'text-gray-600'
                }`}
              >
                {content.hero.subtitle}
              </p>
            </div>

            <div
              className={`flex flex-col sm:flex-row gap-4 ${
                !(content.hero.image || (content.hero.useVideo && content.hero.videoUrl)) ? 'justify-center' : ''
              }`}
            >
              {cta?.primary?.enabled !== false && (
                <Button
                  size="lg"
                  asChild
                  className={`group ${btnClasses(
                    cta?.primary?.color || 'primary',
                    cta?.primary?.textColor || 'white'
                  )}`}
                >
                  <Link href={cta?.primary?.link || content.hero.ctaLink || '/contact'}>
                    {cta?.primary?.text || content.hero.ctaText || 'Get Free Quote'}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              )}

              {cta?.secondary?.enabled !== false && (
                <Button
                  size="lg"
                  asChild
                  className={btnClasses(
                    cta?.secondary?.color || 'outline',
                    cta?.secondary?.textColor || 'primary'
                  )}
                >
                  <Link href={cta?.secondary?.link || '/contact'}>
                    {cta?.secondary?.text || 'Contact Us'}
                  </Link>
                </Button>
              )}
            </div>

            {/* Trust Indicators */}
            {content.hero.trustIndicators && content.hero.trustIndicators.length > 0 && (
              <div
                className={`flex flex-wrap items-center gap-6 pt-4 ${
                  !(content.hero.image || (content.hero.useVideo && content.hero.videoUrl)) ? 'justify-center' : ''
                }`}
              >
                {content.hero.trustIndicators.map((indicator: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span
                      className={`text-sm ${
                        getTextClasses().includes('white') ? 'text-white/80' : 'text-gray-600'
                      }`}
                    >
                      {indicator.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hero Image/Video */}
          {(content.hero.image || (content.hero.useVideo && content.hero.videoUrl)) && (
            <div className="relative">
              <div className="relative z-10">
                {content.hero.useVideo && content.hero.videoUrl ? (
                  <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: 'auto' }}>
                    {content.hero.videoUrl.includes('youtube.com/embed/') || 
                     content.hero.videoUrl.includes('vimeo.com/') ? (
                      <div className="aspect-video">
                        <iframe
                          src={content.hero.videoUrl}
                          className="w-full h-full"
                          allowFullScreen
                          title="Hero Video"
                        />
                      </div>
                    ) : (
                      <video
                        src={content.hero.videoUrl}
                        className="w-full h-auto object-cover max-h-[600px]"
                        controls
                        muted
                        playsInline
                        style={{ minHeight: '300px' }}
                      />
                    )}
                  </div>
                ) : content.hero.image ? (
                  <Image
                    src={content.hero.image}
                    alt="Professional home service technician"
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl object-cover"
                    priority
                  />
                ) : null}
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
