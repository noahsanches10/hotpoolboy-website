import { getSiteConfig, getNavigation, getPageContent } from '@/lib/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import CtaBanner from '@/components/CtaBanner';
import Pricing from '@/components/Pricing';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, BookOpen, DollarSign, CheckCircle, Clock, Award, Users, Star, Heart, ThumbsUp } from 'lucide-react';

interface PlanStep {
  step: number;
  title: string;
  description: string;
}

interface Benefit {
  title: string;
  description: string;
  icon: string;
}

interface GuaranteeItem {
  title: string;
  description: string;
}

interface PlanContent {
  hero: {
    title: string;
    subtitle: string;
    image: string;
    videoUrl: string;
    useVideo: boolean;
  };
  process: {
    enabled: boolean;
    title: string;
    description: string;
    image: string;
    steps: PlanStep[];
  };
  benefits: {
    enabled: boolean;
    title: string;
    description: string;
    items: Benefit[];
  };
  guarantee: {
    enabled: boolean;
    title: string;
    description: string;
    items: GuaranteeItem[];
  };
  pricing: {
    enabled: boolean;
    title: string;
    subtitle: string;
    displayStyle: 'cards' | 'list'; // 'cards' or 'list'
    plans: any[];
  };
  sectionOrder: string[];
}

const renderIcon = (iconName: string) => {
  switch (iconName) {
    case 'shield':
      return <Shield className="h-8 w-8" />;
    case 'check':
      return <CheckCircle className="h-8 w-8" />;
    case 'book':
      return <BookOpen className="h-8 w-8" />;
    case 'dollar':
      return <DollarSign className="h-8 w-8" />;
    case 'clock':
      return <Clock className="h-8 w-8" />;
    case 'award':
      return <Award className="h-8 w-8" />;
    case 'users':
      return <Users className="h-8 w-8" />;
    case 'star':
      return <Star className="h-8 w-8" />;
    case 'heart':
      return <Heart className="h-8 w-8" />;
    case 'thumbsup':
      return <ThumbsUp className="h-8 w-8" />;
    default:
      return <CheckCircle className="h-8 w-8" />;
  }
};

export default async function PlanPage() {
  const siteConfig = getSiteConfig();
  const navigation = getNavigation();
  const pageContent = getPageContent('plan') as PlanContent;
  const servicesConfig = getPageContent('services');
  
  // Get enabled services for header dropdown
  const enabledServices = servicesConfig.services?.filter((service: any) => service.enabled !== false) || [];

  // Default content if no data exists
  const defaultContent: PlanContent = {
    hero: {
      title: "Our Service Plan",
      subtitle: "Comprehensive solutions tailored to your needs",
      image: "",
      videoUrl: "",
      useVideo: false
    },
    process: {
      enabled: true,
      title: "How It Works",
      description: "Our simple process ensures you get the best service",
      image: "",
      steps: [
        { step: 1, title: "Consultation", description: "We discuss your needs and requirements" },
        { step: 2, title: "Planning", description: "We create a customized plan for you" },
        { step: 3, title: "Execution", description: "We deliver high-quality service" }
      ]
    },
    benefits: {
      enabled: true,
      title: "Why Choose Our Plan",
      description: "Benefits you can count on",
      items: [
        { title: "Professional Service", description: "Expert technicians with years of experience", icon: "shield" },
        { title: "Quality Guarantee", description: "100% satisfaction guaranteed", icon: "check" },
        { title: "Competitive Pricing", description: "Fair prices for premium service", icon: "dollar" }
      ]
    },
    guarantee: {
      enabled: true,
      title: "Our Guarantee",
      description: "We stand behind our work",
      items: [
        { title: "100% Satisfaction", description: "If you're not happy, we'll make it right" },
        { title: "Quality Work", description: "Professional service every time" }
      ]
    },
    pricing: {
      enabled: false,
      title: "Service Plans",
      subtitle: "Choose the plan that works best for you",
      displayStyle: "cards",
      plans: []
    },
    sectionOrder: ['process', 'benefits', 'guarantee', 'pricing']
  };

  const planContent = pageContent && Object.keys(pageContent).length > 0 ? pageContent : defaultContent;

  // Get section order and render sections dynamically
  const sectionOrder = planContent.sectionOrder || ['process', 'benefits', 'guarantee', 'pricing'];
  
  const sectionComponents = {
    process: () => planContent.process?.enabled && (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className={planContent.process.image ? "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" : "max-w-4xl mx-auto"}>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {planContent.process.title}
              </h2>
              {planContent.process.description && (
                <p className="text-lg text-gray-600 mb-8">
                  {planContent.process.description}
                </p>
              )}
              
              <div className="space-y-6">
                {planContent.process.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {planContent.process.image && (
              <div>
                <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={planContent.process.image}
                    alt="Process"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    benefits: () => planContent.benefits?.enabled && (
  <section className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {planContent.benefits.title}
        </h2>
        {planContent.benefits.description && (
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {planContent.benefits.description}
          </p>
        )}
      </div>

      {/* Benefits Grid */}
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
        {planContent.benefits.items.map((benefit, index) => (
          <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full sm:w-64 flex-shrink-0">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="text-primary">
                  {renderIcon(benefit.icon)}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
),
    guarantee: () => planContent.guarantee?.enabled && (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {planContent.guarantee.title}
            </h2>
            {planContent.guarantee.description && (
              <p className="text-lg text-gray-600">
                {planContent.guarantee.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {planContent.guarantee.items.map((item, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    ),
   pricing: () => planContent.pricing?.enabled && (
  planContent.pricing.displayStyle === 'cards' ? (
    <Pricing content={{ sections: { pricing: planContent.pricing } }} />
  ) : (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title + Subtitle */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {planContent.pricing.title}
          </h2>
          {planContent.pricing.subtitle && (
            <p className="text-lg text-gray-600">
              {planContent.pricing.subtitle}
            </p>
          )}
        </div>

        {/* Plan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {planContent.pricing.plans.map((plan: any, index: number) => {
            const features = Array.isArray(plan.features)
              ? plan.features
              : (plan.features || '').split('\n').filter((f: string) => f.trim());

            return (
              <Card
                key={index}
                className={`border-0 shadow-lg overflow-hidden h-full flex flex-col ${
                  plan.popular ? 'ring-2 ring-primary scale-[1.02]' : ''
                }`}
              >
                <CardContent className="p-0 flex-1 flex flex-col">
                  {/* Plan Header */}
                  <div
                    className={`p-6 text-center ${
                      plan.popular ? 'bg-primary text-white' : 'bg-gray-100'
                    }`}
                  >
                    <h3 className="text-2xl font-bold mb-2">
                      {plan.name}
                    </h3>
                    {plan.description && (
                      <p
                        className={`text-sm ${
                          plan.popular ? 'text-white/80' : 'text-gray-600'
                        }`}
                      >
                        {plan.description}
                      </p>
                    )}
                    {plan.popular && (
                      <span className="mt-3 inline-block text-xs font-semibold bg-white/20 rounded-full px-3 py-1">
                        Most Popular
                      </span>
                    )}
                  </div>

                  {/* Plan Content */}
                  <div className="p-6 flex-1">
                    {features.length > 0 && (
                      <div className="space-y-3">
                        {features.map((feature: string, featureIndex: number) => {
                          const priceMatch = feature.match(/\$[\d,]+(?:\.\d{2})?/);
                          const price = priceMatch ? priceMatch[0] : null;

                          const periodMatch = feature.match(/per\s+\w+/i);
                          const period = periodMatch ? periodMatch[0] : '';

                          let description = feature;
                          if (price) description = description.replace(price, '').trim();
                          if (period) description = description.replace(new RegExp(period, 'i'), '').trim();
                          description = description.replace(/^[-\s]+|[-\s]+$/g, '');

                          return (
                            <div
                              key={featureIndex}
                              className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="text-gray-900 font-medium text-sm">
                                  {description || feature}
                                </p>
                                {period && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {period}
                                  </p>
                                )}
                              </div>
                              {price && (
                                <div className="text-right ml-3">
                                  <div className="text-lg font-bold text-primary">
                                    {price}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Get Started Button */}
                  <div className="p-6 pt-0">
                    <Button
                      size="lg"
                      className={`w-full ${
                        plan.popular
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                      asChild
                    >
                      <Link href="/contact">
                        Get Started
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  )
),

  };

  return (
    <div className="min-h-screen">
      <Header 
        siteConfig={siteConfig} 
        navigation={navigation} 
        servicesConfig={servicesConfig}
        enabledServices={enabledServices}
      />
      <main>
        <Hero content={planContent} siteConfig={siteConfig} pageType="plan" />
        {sectionOrder.map((sectionKey: string) => {
          const component = sectionComponents[sectionKey as keyof typeof sectionComponents];
          return component ? <div key={sectionKey}>{component()}</div> : null;
        })}
      </main>
      {siteConfig.ctaBanner?.showOnPages?.plan !== false && (
        <CtaBanner siteConfig={siteConfig} />
      )}
      <Footer siteConfig={siteConfig} navigation={navigation} />
    </div>
  );
}