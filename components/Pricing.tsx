'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, X } from 'lucide-react';

interface PricingProps {
  content: any;
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
      return 'bg-gray-50';
  }
}

export default function Pricing({ content }: PricingProps) {
  const section = content.sections?.pricing;
  
  if (!section?.enabled || !section?.plans?.length) {
    return null;
  }
  const plans = section.plans || [];
  const cols = Math.min(3, plans.length || 1);
  const colsClass = `md:grid-cols-${cols}`;
  const cardWidthClass = cols === 2 ? 'md:max-w-lg' : '';
  const gapClass = cols === 2 ? 'gap-8 md:gap-6' : 'gap-12 md:gap-8';

  return (
    <section className={`py-20 ${getBackgroundClass(section.background || 'white')}`}>
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

        {/* Pricing Cards */}
  <div className={`grid grid-cols-1 ${colsClass} ${gapClass} max-w-5xl mx-auto`}>
          {plans.map((plan: any, index: number) => (
            <Card 
              key={index} 
              className={`relative shadow-lg transition-all duration-300 hover:-translate-y-2 h-full flex flex-col ${cardWidthClass} ${
                plan.popular ? 'border-2 border-primary' : 'border-0'
              }`}
              style={{
                boxShadow: `0 10px 25px rgba(0, 0, 0, 0.1)`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 50px hsl(var(--primary) / 0.4)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 25px rgba(0, 0, 0, 0.1)`;
              }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-white px-4 py-1">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <div className="mt-8">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-6">
                  {plan.description}
                </p>
              </CardHeader>
              
              <CardContent className="pt-2 pb-8 flex-1 flex flex-col">
                <div className="space-y-4 mb-8 flex-1">
                  {/* Features */}
                  {(() => {
                    const features = Array.isArray(plan.features)
                      ? plan.features
                      : (plan.features || '').split('\n').filter((f: string) => f.trim());
                    
                    return features.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ));
                  })()}
                  
                  {/* Exclusions */}
                  {(() => {
                    const exclusions = Array.isArray(plan.exclusions)
                      ? plan.exclusions
                      : (plan.exclusions || '').split('\n').filter((e: string) => e.trim());
                    
                    return exclusions.map((exclusion: string, exclusionIndex: number) => (
                      <li key={`exclusion-${exclusionIndex}`} className="flex items-center space-x-3">
                        <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <span className="text-gray-500 line-through">{exclusion}</span>
                      </li>
                    ));
                  })()}
                </div>
                
                <Button 
                  asChild 
                  className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <Link href="/contact">
                    Get Started
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}