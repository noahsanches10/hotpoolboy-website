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
      return 'bg-white';
  }
}

export default function Pricing({ content }: PricingProps) {
  const section = content.sections?.pricing;
  
  if (!section?.enabled || !section?.plans?.length) {
    return null;
  }

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {section.plans.map((plan: any, index: number) => (
            <Card 
              key={index} 
              className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-white px-4 py-1">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-2">
                  {plan.description}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3 mb-8">
                  {/* Features */}
                  {plan.features?.map((feature: string, featureIndex: number) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  
                  {/* Exclusions */}
                  {plan.exclusions?.map((exclusion: string, exclusionIndex: number) => (
                    <li key={`exclusion-${exclusionIndex}`} className="flex items-center space-x-3">
                      <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <span className="text-gray-500 line-through">{exclusion}</span>
                    </li>
                  ))}
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