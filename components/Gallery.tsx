'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface GalleryProps {
  content: any;
}

function getBackgroundClass(background: string) {
  switch (background) {
    case 'white':
      return 'bg-white';
    case 'primary-light':
      return 'bg-primary-light';
    case 'secondary-light':
      return 'bg-secondary-light';
    case 'accent-light':
      return 'bg-accent-light';
    default:
      return 'bg-gray-50';
  }
}

export default function Gallery({ content }: GalleryProps) {
  const section = content.sections?.gallery;
  const [currentSlide, setCurrentSlide] = useState(0);
  
  if (!section?.enabled || !section?.items?.length) {
    return null;
  }

  const displayStyle = section.displayStyle || 'grid';
  const autoRotateInterval = parseInt(section.autoRotateInterval || '5');
  const items = section.items;

  // Carousel navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-rotation effect for carousel
  useEffect(() => {
    if (displayStyle === 'carousel' && autoRotateInterval > 0) {
      const interval = setInterval(nextSlide, autoRotateInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [displayStyle, autoRotateInterval, nextSlide, currentSlide]);

  const renderGalleryItem = (item: any, index: number, isCarousel: boolean = false) => {
    // Use taller containers for single images to better accommodate vertical images
    const isSingleImage = !item.afterImage;
    const imageHeight = isSingleImage && isCarousel ? 'h-96 md:h-[28rem]' : 'h-64 md:h-80';
    
    return (
      <Card 
        key={index} 
        className={`border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden ${
          isCarousel ? 'w-full' : ''
        }`}
      >
        <CardContent className="p-0">
          <div className="relative">
            {/* Gallery Images */}
            <div className={`grid ${item.afterImage ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {item.beforeImage && (
                <div className={`relative ${imageHeight}`}>
                  <Image
                    src={item.beforeImage}
                    alt={item.afterImage ? `${item.title} - Before` : item.title}
                    fill
                    className="object-cover"
                  />
                  {item.afterImage && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        Before
                      </Badge>
                    </div>
                  )}
                </div>
              )}
              {item.afterImage && (
                <div className={`relative ${imageHeight}`}>
                  <Image
                    src={item.afterImage}
                    alt={item.beforeImage ? `${item.title} - After` : item.title}
                    fill
                    className="object-cover"
                  />
                  {item.beforeImage && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        After
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Content */}
            {(item.title || item.description) && (
              <div className="p-6">
                {item.title && (
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <section className={`py-20 ${getBackgroundClass(section.background || 'gray')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {section.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {section.subtitle}
          </p>
        </div>

        {/* Gallery Content */}
        {displayStyle === 'grid' ? (
          /* Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map((item: any, index: number) => renderGalleryItem(item, index))}
          </div>
        ) : (
          /* Carousel Layout */
          <div className="relative max-w-4xl mx-auto">
            {/* Carousel Container */}
            <div className="relative overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {items.map((item: any, index: number) => (
                  <div key={index} className="w-full flex-shrink-0">
                    {renderGalleryItem(item, index, true)}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {items.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Pagination Dots */}
            {items.length > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {items.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      currentSlide === index 
                        ? 'bg-primary' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}