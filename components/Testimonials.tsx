import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TestimonialsProps {
  content: any;
}

function getBackgroundClass(background: string) {
  switch (background) {
    case 'white':
      return 'bg-white';
    case 'gray':
      return 'bg-gray-50';
    case 'secondary-light':
      return 'bg-secondary-light';
    case 'accent-light':
      return 'bg-accent-light';
    default:
      return 'bg-primary-light';
  }
}

export default function Testimonials({ content }: TestimonialsProps) {
  // Check if testimonials section exists and is enabled
  const testimonialsData = content?.sections?.testimonials;
  
  if (!testimonialsData?.enabled || !testimonialsData?.items?.length) {
    return null;
  }

  return (
    <section className={`py-20 ${getBackgroundClass(testimonialsData.background || 'primary-light')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {testimonialsData.title}
          </h2>
          <p className="text-xl text-gray-600">
            {testimonialsData.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
          {testimonialsData.items.map((testimonial: any, index: number) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full sm:w-80 flex-shrink-0">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-primary/20" />
                </div>
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-semibold">
                      {testimonial.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Join hundreds of satisfied customers
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-gray-900 font-semibold">4.9/5 Average Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}