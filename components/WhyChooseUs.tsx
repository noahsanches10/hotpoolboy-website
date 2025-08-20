import { Shield, Clock, Award, Users, Star, CheckCircle, Heart, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface WhyChooseUsProps {
  content: any;
}

const iconMap = {
  shield: Shield,
  clock: Clock,
  award: Award,
  users: Users,
  star: Star,
  checkCircle: CheckCircle,
  heart: Heart,
  thumbsUp: ThumbsUp,
};

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

export default function WhyChooseUs({ content }: WhyChooseUsProps) {
  const section = content.sections?.whyChooseUs;
  
  if (!section?.enabled || !section?.items?.length) {
    return null;
  }

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

        {/* Values Grid */}
        <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
          {section.items.map((item: any, index: number) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Shield;
            
            return (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full sm:w-64 flex-shrink-0">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}