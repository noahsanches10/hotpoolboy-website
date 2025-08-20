'use client';

import Link from 'next/link';
import { Facebook, Instagram, Home, Star } from 'lucide-react';

interface FooterProps {
  siteConfig: any;
  navigation: any;
}

export default function Footer({ siteConfig, navigation }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  // Determine footer styling based on admin settings
  const getFooterClasses = () => {
    switch (siteConfig.footerStyle) {
      case 'primary':
        return 'bg-primary text-white';
      case 'secondary':
        return 'bg-secondary text-white';
      case 'secondary':
        return 'bg-secondary text-white';
      case 'gradient':
        return 'bg-gradient-to-r from-primary to-secondary text-white';
      case 'light':
        return 'bg-gray-100 text-gray-900';
      default:
        return 'bg-gray-900 text-white';
    }
  };
  
  const getTextClasses = () => {
    switch (siteConfig.footerTextColor) {
      case 'white':
        return 'text-white hover:text-white/80';
      case 'dark':
        return 'text-gray-600 hover:text-gray-800';
      case 'primary':
        return 'text-primary hover:text-primary/80';
      case 'secondary':
        return 'text-secondary hover:text-secondary/80';
      case 'accent':
        return 'text-accent hover:text-accent/80';
      case 'auto':
      default:
        return siteConfig.footerStyle === 'light' 
          ? 'text-gray-600 hover:text-primary' 
          : siteConfig.footerStyle === 'primary' || siteConfig.footerStyle === 'secondary' || siteConfig.footerStyle === 'gradient'
            ? 'text-white/80 hover:text-white'
            : 'text-gray-300 hover:text-white';
    }
  };
  
  const getIconClasses = () => {
    switch (siteConfig.footerTextColor) {
      case 'white':
        return 'text-white/60 hover:text-white';
      case 'dark':
        return 'text-gray-400 hover:text-gray-600';
      case 'primary':
        return 'text-primary/60 hover:text-primary';
      case 'secondary':
        return 'text-secondary/60 hover:text-secondary';
      case 'accent':
        return 'text-accent/60 hover:text-accent';
      case 'auto':
      default:
        return siteConfig.footerStyle === 'light' 
          ? 'text-gray-400 hover:text-primary' 
          : siteConfig.footerStyle === 'primary' || siteConfig.footerStyle === 'secondary' || siteConfig.footerStyle === 'gradient'
            ? 'text-white/60 hover:text-white'
            : 'text-gray-400 hover:text-white';
    }
  };
  
  const getServiceAreasTextClasses = () => {
    switch (siteConfig.footerTextColor) {
      case 'white':
        return 'text-white/80';
      case 'dark':
        return 'text-gray-600';
      case 'primary':
        return 'text-primary/80';
      case 'secondary':
        return 'text-secondary/80';
      case 'accent':
        return 'text-accent/80';
      case 'auto':
      default:
        return siteConfig.footerStyle === 'light' ? 'text-gray-600' : 'text-gray-300';
    }
  };
  
  const getCopyrightTextClasses = () => {
    switch (siteConfig.footerTextColor) {
      case 'white':
        return 'text-white/60';
      case 'dark':
        return 'text-gray-500';
      case 'primary':
        return 'text-primary/60';
      case 'secondary':
        return 'text-secondary/60';
      case 'accent':
        return 'text-accent/60';
      case 'auto':
      default:
        return siteConfig.footerStyle === 'light' ? 'text-gray-500' : 'text-gray-400';
    }
  };

  return (
    <footer className={getFooterClasses()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              {siteConfig.showLogoInFooter !== false && siteConfig.logo ? (
                <img 
                  src={siteConfig.logo} 
                  alt={siteConfig.siteName}
                  className="object-contain"
                  style={{ height: `${siteConfig.logoSize || 48}px` }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <>
                  <span className={`font-bold text-xl ${getTextClasses()}`}>
                    {siteConfig.siteName}
                  </span>
                </>
              )}
            </div>
            <p className={`${getServiceAreasTextClasses()} mb-4 max-w-md`}>
              {siteConfig.tagline}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              {siteConfig.contact.phone && (
                <div className="flex items-center space-x-2">
                  <span className={getTextClasses()}>{siteConfig.contact.phone}</span>
                </div>
              )}
              {siteConfig.contact.email && (
                <div className="flex items-center space-x-2">
                  <span className={getTextClasses()}>{siteConfig.contact.email}</span>
                </div>
              )}
              {siteConfig.contact.address && (
                <div className="flex items-center space-x-2">
                  <span className={getTextClasses()}>{siteConfig.contact.address}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {siteConfig.socialMedia && (
              siteConfig.socialMedia.facebook || 
              siteConfig.socialMedia.instagram
            ) && (
              <div className="flex space-x-4">
                {siteConfig.socialMedia.facebook && (
                  <a
                    href={siteConfig.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${getIconClasses()} transition-colors`}
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {siteConfig.socialMedia.instagram && (
                  <a
                    href={siteConfig.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${getIconClasses()} transition-colors`}
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-semibold text-lg mb-4 ${getTextClasses()}`}>Quick Links</h3>
            <nav className="space-y-2">
              {navigation.footer.map((item: any) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block ${getTextClasses()} transition-colors`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className={`font-semibold text-lg mb-4 ${getTextClasses()}`}>Service Areas</h3>
            <ul className="space-y-2">
              {siteConfig.serviceAreas.map((area: string) => (
                <li key={area} className={getServiceAreasTextClasses()}>
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 text-center">
          <p className={`${getCopyrightTextClasses()} text-sm`}>
            © {currentYear} {siteConfig.siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}