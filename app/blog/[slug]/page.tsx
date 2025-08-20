import { getBlogPost, getBlogPosts, getSiteConfig, getNavigation, getPageContent } from '@/lib/content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CtaBanner from '@/components/CtaBanner';
import BlogContent from '@/components/BlogContent';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = getBlogPost(params.slug);
    const siteConfig = getSiteConfig();
    
    return {
      title: `${post.frontMatter.title} | ${siteConfig.siteName}`,
      description: post.frontMatter.excerpt,
      openGraph: {
        title: post.frontMatter.title,
        description: post.frontMatter.excerpt,
        images: post.frontMatter.image ? [{ url: post.frontMatter.image }] : [],
        type: 'article',
        publishedTime: post.frontMatter.date,
        authors: [post.frontMatter.author],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.frontMatter.title,
        description: post.frontMatter.excerpt,
        images: post.frontMatter.image ? [post.frontMatter.image] : [],
      },
    };
  } catch {
    return {
      title: 'Post Not Found',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const siteConfig = getSiteConfig();
  const navigation = getNavigation();
  const servicesConfig = getPageContent('services');
  
  // Get enabled services for header dropdown
  const enabledServices = servicesConfig.services?.filter((service: any) => service.enabled !== false) || [];
  
  let post;
  try {
    post = getBlogPost(params.slug);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Header 
        siteConfig={siteConfig} 
        navigation={navigation} 
        servicesConfig={servicesConfig}
        enabledServices={enabledServices}
      />
      <main>
        <BlogContent post={post} servicesConfig={servicesConfig} />
      </main>
      
      {siteConfig.ctaBanner?.showOnPages?.blogPosts !== false && (
        <CtaBanner siteConfig={siteConfig} />
      )}
      
      <Footer siteConfig={siteConfig} navigation={navigation} />
    </div>
  );
}