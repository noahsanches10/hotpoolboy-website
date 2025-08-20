import { getBlogPosts, getSiteConfig, getNavigation, getPageContent } from '@/lib/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CtaBanner from '@/components/CtaBanner';
import BlogCard from '@/components/BlogCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, User, Tag } from 'lucide-react';

export default async function BlogPage() {
  const siteConfig = getSiteConfig();
  const navigation = getNavigation();
  const posts = getBlogPosts();
  const servicesConfig = getPageContent('services');
  
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
        <div className="bg-gradient-to-br from-primary-light to-secondary-light py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Home Service Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert tips, guides, and insights to help you maintain and improve your home
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Blog Posts */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No blog posts yet</h3>
              <p className="text-gray-600">Check back soon for helpful home service tips and guides!</p>
            </div>
          )}
        </div>
      </main>
      
      {siteConfig.ctaBanner?.showOnPages?.blog !== false && (
        <CtaBanner siteConfig={siteConfig} />
      )}
      
      <Footer siteConfig={siteConfig} navigation={navigation} />
    </div>
  );
}