'use client';

import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  siteConfig: any;
  navigation: any;
  servicesConfig: any;
  enabledServices: any[];
}

export default function Header({ siteConfig, navigation, servicesConfig, enabledServices }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  
  // Determine header styling based on admin settings
  const getHeaderClasses = () => {
    const baseClasses = "shadow-sm sticky top-0 z-50";
    switch (siteConfig.headerStyle) {
      case 'primary':
        return `${baseClasses} bg-primary text-white`;
      case 'secondary':
        return `${baseClasses} bg-secondary text-white`;
      case 'gradient':
        return `${baseClasses} bg-gradient-to-r from-primary to-secondary text-white`;
      case 'transparent':
        return `${baseClasses} bg-white/90 backdrop-blur-sm`;
      default:
        return `${baseClasses} bg-white`;
    }
  };
  
  const getTextClasses = () => {
    switch (siteConfig.headerTextStyle) {
      case 'dark':
        return 'text-gray-700 hover:text-primary';
      case 'light':
        return 'text-white hover:text-white/80';
      case 'primary':
        return 'text-primary hover:text-primary/80';
      case 'auto':
      default:
        return siteConfig.headerStyle === 'primary' || siteConfig.headerStyle === 'secondary' || siteConfig.headerStyle === 'gradient' 
          ? 'text-white hover:text-white/80' 
          : 'text-gray-700 hover:text-primary';
    }
  };
  
  const getLogoClasses = () => {
    switch (siteConfig.headerTextStyle) {
      case 'dark':
        return 'text-gray-900';
      case 'light':
        return 'text-white';
      case 'primary':
        return 'text-primary';
      case 'auto':
      default:
        return siteConfig.headerStyle === 'primary' || siteConfig.headerStyle === 'secondary' || siteConfig.headerStyle === 'gradient'
          ? 'text-white'
          : 'text-gray-900';
    }
  };
  
  const getCtaButtonClasses = () => {
    const buttonClasses: string[] = [];
    
    // Background color classes
    switch (siteConfig.headerCtaStyle) {
      case 'secondary':
        buttonClasses.push('bg-secondary hover:bg-secondary/90');
        break;
      case 'accent':
        buttonClasses.push('hover:opacity-90');
        break;
      case 'white':
        buttonClasses.push('bg-white hover:bg-gray-100');
        break;
      case 'outline':
        buttonClasses.push('border-2 bg-transparent hover:bg-white/10');
        break;
      case 'primary':
      default:
        buttonClasses.push('bg-primary hover:bg-primary/90');
        break;
    }
    
    // Text color classes
    switch (siteConfig.headerCtaTextColor) {
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
  
  const getCtaButtonStyle = () => {
    if (siteConfig.headerCtaStyle === 'accent') {
      return { backgroundColor: 'hsl(var(--accent))' };
    }
    return {};
  };

  // Close dropdown when clicking outside (desktop only, and use 'click' not 'mousedown')
  React.useEffect(() => {
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;

    const handleDocClick = (event: MouseEvent) => {
      if (!isDesktop()) return; // Don't auto-close on mobile
      const target = event.target as Element;
      // Anything inside an element marked as part of the services dropdown is "inside"
      if (!target.closest('[data-services-dropdown="true"]')) {
        setIsServicesOpen(false);
      }
    };

    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  // Check if services should have dropdown
  const hasServicesDropdown = servicesConfig?.pageType === 'multiple';

  return (
    <header className={getHeaderClasses()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 py-2">
            {siteConfig.showLogoInHeader !== false && siteConfig.logo ? (
              <img 
                src={siteConfig.logo} 
                alt={siteConfig.siteName}
                className="object-contain py-1"
                style={{ height: `${siteConfig.logoSize || 48}px` }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <>
                <span className={`font-bold text-xl ${getLogoClasses()}`}>
                  {siteConfig.siteName}
                </span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.header.map((item: any) => {
              // Handle services dropdown
              if (item.label.toLowerCase() === 'services' && hasServicesDropdown) {
                return (
                  <div
                    key={item.href}
                    className="relative services-dropdown"
                    data-services-dropdown="true"
                  >
                    <button
                      className={`flex items-center space-x-1 ${getTextClasses()} transition-colors font-medium`}
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {isServicesOpen && (
                      <div
                        className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50"
                        data-services-dropdown="true"
                      >
                        {servicesConfig?.showAllServicesPage !== false && (
                          <>
                            <Link
                              href="/services"
                              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                              data-services-dropdown="true"
                            >
                              All Services
                            </Link>
                            <div className="border-t border-gray-100 my-1" />
                          </>
                        )}
                        {enabledServices.map((service: any) => (
                          <Link
                            key={service.slug}
                            href={`/services/${service.slug}`}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                            data-services-dropdown="true"
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${getTextClasses()} transition-colors font-medium`}
                >
                  {item.label}
                </Link>
              );
            })}
            {navigation.cta.external ? (
              <Button asChild>
                <a 
                  href={navigation.cta.href}
                  target={navigation.cta.openInNewTab ? "_blank" : "_self"}
                  rel={navigation.cta.openInNewTab ? "noopener noreferrer" : undefined}
                >
                  {navigation.cta.label}
                </a>
              </Button>
            ) : (
              <Button asChild className={getCtaButtonClasses()} style={getCtaButtonStyle()}>
                <Link href={navigation.cta.href}>
                  {navigation.cta.label}
                </Link>
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navigation.header.map((item: any) => {
                // Handle services dropdown for mobile
                if (item.label.toLowerCase() === 'services' && hasServicesDropdown) {
                  return (
                    <div
                      key={item.href}
                      className="space-y-2"
                      data-services-dropdown="true"
                    >
                      <button
                        className={`${getTextClasses()} transition-colors font-medium flex items-center space-x-1`}
                        onClick={() => setIsServicesOpen(!isServicesOpen)}
                      >
                        <span>Services</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isServicesOpen && (
                        <div
                          className="space-y-2 pl-4 border-l-2 border-gray-100"
                          data-services-dropdown="true"
                        >
                          {servicesConfig?.showAllServicesPage !== false && (
                            <Link
                              href="/services"
                              className={`${getTextClasses()} transition-colors font-medium`}
                              onClick={() => setIsMenuOpen(false)}
                              data-services-dropdown="true"
                            >
                              All Services
                            </Link>
                          )}
                          {enabledServices.map((service: any) => (
                            <Link
                              key={service.slug}
                              href={`/services/${service.slug}`}
                              className={`block ${getTextClasses()} transition-colors`}
                              onClick={() => {
                                setIsMenuOpen(false);
                                setIsServicesOpen(false);
                              }}
                              data-services-dropdown="true"
                            >
                              {service.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${getTextClasses()} transition-colors font-medium`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {navigation.cta.external ? (
                <Button asChild className="w-fit">
                  <a 
                    href={navigation.cta.href}
                    target={navigation.cta.openInNewTab ? "_blank" : "_self"}
                    rel={navigation.cta.openInNewTab ? "noopener noreferrer" : undefined}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {navigation.cta.label}
                  </a>
                </Button>
              ) : (
                <Button asChild className={`w-fit ${getCtaButtonClasses()}`} style={getCtaButtonStyle()}>
                  <Link href={navigation.cta.href} onClick={() => setIsMenuOpen(false)}>
                    {navigation.cta.label}
                  </Link>
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
