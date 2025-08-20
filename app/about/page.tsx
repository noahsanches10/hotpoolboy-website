import { getSiteConfig, getNavigation, getPageContent } from '@/lib/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CtaBanner from '@/components/CtaBanner';
import Hero from '@/components/Hero';
import Image from 'next/image';
import { Users, Award, Clock, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AboutPage() {
  const siteConfig = getSiteConfig();
  const navigation = getNavigation();
  const servicesConfig = getPageContent('services');
  const aboutContent = getPageContent('about');
  
  // Get enabled services for header dropdown
  const enabledServices = servicesConfig.services?.filter((service: any) => service.enabled !== false) || [];

  return (
    <div className="min-h-screen">
      <Header 
        siteConfig={siteConfig} 
        navigation={navigation} 
        servicesConfig={servicesConfig}
        enabledServices={enabledServices}
      />
      <main>
        {/* Hero Section */}
        <Hero content={aboutContent} siteConfig={siteConfig} pageType="about" />
        

        {/* Story Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {aboutContent.story.title}
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-8 mb-16">
            {aboutContent.story.content.map((paragraph: string, index: number) => (
              <p key={index} className="text-lg text-gray-700 leading-relaxed text-center">
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* Statistics */}
          {aboutContent.story.stats && aboutContent.story.stats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {aboutContent.story.stats.map((stat: any, index: number) => (
                <Card key={index} className="text-center border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

       {/* Team Section - Only show if team members exist */}
{aboutContent.team.members && aboutContent.team.members.length > 0 && (
  <section className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {aboutContent.team.title}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {aboutContent.team.subtitle}
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
        {aboutContent.team.members.map((member: any, index: number) => (
          <div key={index} className="w-full sm:w-80 lg:w-80">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
              <CardContent className="p-8">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name || 'Team member'}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-gray-600">
                      {member.initials}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-4">
                  {member.title}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {member.description}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  </section>
)}
      </main>
      
      {siteConfig.ctaBanner?.showOnPages?.about !== false && (
        <CtaBanner siteConfig={siteConfig} />
      )}
      
      <Footer siteConfig={siteConfig} navigation={navigation} />
    </div>
  );
}