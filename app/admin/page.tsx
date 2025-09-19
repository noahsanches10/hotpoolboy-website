'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Settings, FileText, Navigation, Palette, Upload, BookOpen, Home, ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import BlogManager from '@/components/BlogManager';
import SiteSettings from '@/components/admin/SiteSettings';
import NavigationManager from '@/components/admin/NavigationManager';
import SocialMediaManager from '@/components/admin/SocialMediaManager';
import HomeContentManager from '@/components/admin/HomeContentManager';
import DesignManager from '@/components/admin/DesignManager';
import MediaManager from '@/components/admin/MediaManager';
import ContactManager from '@/components/admin/ContactManager';
import ServicesManager from '@/components/admin/ServicesManager';
import AboutManager from '@/components/admin/AboutManager';
import ReviewsManager from '@/components/admin/ReviewsManager';
import { Wrench } from 'lucide-react';

// Simple password check - in production, you'd want this in an environment variable
const ADMIN_PASSWORD = 'admin123';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  
  // Initialize with default content structure
  const [siteConfig, setSiteConfig] = useState({
    siteName: "Elite Home Services",
    tagline: "Professional Home Services You Can Trust",
    logo: "/uploads/logo.png",
    brandColors: {
      primary: "#2563eb",
      secondary: "#1e40af",
      accent: "#f59e0b"
    },
    contact: {
      phone: "(555) 123-4567",
      email: "info@elitehomeservices.com",
      address: "123 Service St, Your City, ST 12345"
    },
    serviceAreas: [
      "Downtown",
      "Westside", 
      "Eastside",
      "Northside",
      "Southside"
    ],
    socialMedia: {
      facebook: "",
      instagram: "",
      nextdoor: "",
      google: ""
    }
  });

  const [navigation, setNavigation] = useState({
    header: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Reviews", href: "/reviews" }
    ],
    footer: [],
    cta: {
      label: "Get A Quote!",
      href: "/quote"
    }
  });

  const [homeContent, setHomeContent] = useState({
    hero: {
      title: "Professional Home Services You Can Trust",
      subtitle: "From plumbing to electrical, we handle all your home service needs with expertise and care.",
      ctaText: "Get Free Quote",
      ctaLink: "/quote"
    },
    services: {
      title: "Our Services",
      subtitle: "Comprehensive home services to keep your property in perfect condition"
    },
    testimonials: {
      title: "What Our Customers Say",
      subtitle: "Don't just take our word for it"
    }
  });

  // Load actual content from files when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadContent();
    }
  }, [isAuthenticated]);

  const loadContent = async () => {
    setIsLoadingContent(true);
    try {
      // Load site config
      const siteConfigResponse = await fetch('/api/admin/content?type=site-config');
      if (siteConfigResponse.ok) {
        const siteConfigData = await siteConfigResponse.json();
        setSiteConfig(siteConfigData);
      }

      // Load navigation
      const navigationResponse = await fetch('/api/admin/content?type=navigation');
      if (navigationResponse.ok) {
        const navigationData = await navigationResponse.json();
        setNavigation({
          ...navigationData,
          footer: navigationData.footer || []
        });
      }

      // Load home content
      const homeResponse = await fetch('/api/admin/content?type=home');
      if (homeResponse.ok) {
        const homeData = await homeResponse.json();
        
        // Ensure pricing section is included in order if it's enabled
        if (homeData.sections?.pricing?.enabled && homeData.sections?.order) {
          if (!homeData.sections.order.includes('pricing')) {
            homeData.sections.order.push('pricing');
          }
        }
        
        setHomeContent(homeData);
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleAuth = async () => {
    if (passcode === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      await loadBlogPosts();
    } else {
      alert('Invalid passcode');
    }
  };

  const loadBlogPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const response = await fetch('/api/admin/blog');
      if (response.ok) {
        const posts = await response.json();
        setBlogPosts(posts);
      } else {
        console.error('Failed to load blog posts');
        setBlogPosts([]);
      }
    } catch (error) {
      console.error('Failed to load blog posts:', error);
      setBlogPosts([]);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const saveContent = async (type: string, data: any) => {
    try {
      console.log(`Saving ${type} content:`, data);
      
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data })
      });
      
      if (response.ok) {
        alert('Content saved successfully!');
        // Reload content to ensure consistency
        if (type === 'site-config') {
          setSiteConfig(data);
        } else if (type === 'navigation') {
          setNavigation(data);
        } else if (type === 'home') {
          setHomeContent(data);
        }
      } else {
        const errorText = await response.text();
        console.error('Save response error:', errorText);
        throw new Error(`Failed to save: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to save content:', error);
      alert(`Failed to save content: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the console for details.`);
    }
  };

  // Wrapper functions for components that expect specific parameter order
  const handleSiteSave = () => saveContent('site-config', siteConfig);
  const handleNavigationSave = () => saveContent('navigation', navigation);
  const handleHomeSave = () => saveContent('home', homeContent);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                id="passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                placeholder="Enter admin password"
              />
            </div>
            <Button onClick={handleAuth} className="w-full">
              Access Admin Panel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Exit Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage your website content and settings</p>
          </div>
          <Button variant="outline" asChild className="flex items-center space-x-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Website</span>
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="site" className="space-y-6">
          {/* Responsive Navigation */}
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1 h-auto p-2">
            <TabsTrigger value="site" className="flex flex-col items-center space-y-1 h-16 text-xs">
              <Settings className="h-4 w-4" />
              <span>Site</span>
            </TabsTrigger>
            <TabsTrigger value="nav" className="flex flex-col items-center space-y-1 h-16 text-xs">
              <Navigation className="h-4 w-4" />
              <span>Nav</span>
            </TabsTrigger>
            <TabsTrigger value="home" className="flex flex-col items-center space-y-1 h-16 text-xs">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex flex-col items-center space-y-1 h-16 text-xs">
              <FileText className="h-4 w-4" />
              <span>About</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex flex-col items-center space-y-1 h-16 text-xs">
              <Wrench className="h-4 w-4" />
              <span>Services</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex flex-col items-center space-y-1 h-16 text-xs">
              <Star className="h-4 w-4" />
              <span>Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex flex-col items-center space-y-1 h-16 text-xs">
              <FileText className="h-4 w-4" />
              <span>Contact</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex flex-col items-center space-y-1 h-16 text-xs">
              <BookOpen className="h-4 w-4" />
              <span>Blog</span>
            </TabsTrigger>
            <TabsTrigger value="design" className="flex flex-col items-center space-y-1 h-16 text-xs">
              <Palette className="h-4 w-4" />
              <span>Design</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex flex-col items-center space-y-1 h-16 text-xs">
              <Upload className="h-4 w-4" />
              <span>Media</span>
            </TabsTrigger>
          </TabsList>

          {/* Site Settings Tab */}
          <TabsContent value="site">
            <div className="space-y-6">
              <SiteSettings
                siteConfig={siteConfig}
                setSiteConfig={setSiteConfig}
                onSave={handleSiteSave}
                isLoading={isLoadingContent}
              />
              <SocialMediaManager
                siteConfig={siteConfig}
                setSiteConfig={setSiteConfig}
                onSave={handleSiteSave}
                isLoading={isLoadingContent}
              />
            </div>
          </TabsContent>

          {/* Navigation Tab */}
          <TabsContent value="nav">
            <NavigationManager
              navigation={navigation}
              setNavigation={setNavigation}
              onSave={handleNavigationSave}
              isLoading={isLoadingContent}
            />
          </TabsContent>

          {/* Home Page Tab */}
          <TabsContent value="home">
            <HomeContentManager
              homeContent={homeContent}
              setHomeContent={setHomeContent}
              onSave={handleHomeSave}
              isLoading={isLoadingContent}
            />
          </TabsContent>

          {/* About Page Tab */}
          <TabsContent value="about">
            <AboutManager
              onSave={saveContent}
              isLoading={isLoadingContent}
            />
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <ServicesManager
              onSave={saveContent}
              isLoading={isLoadingContent}
            />
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <ReviewsManager
              onSave={saveContent}
              isLoading={isLoadingContent}
            />
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <ContactManager
              onSave={saveContent}
              isLoading={isLoadingContent}
            />
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <Card>
              <CardHeader>
                <CardTitle>Blog Management</CardTitle>
              </CardHeader>
              <CardContent>
                <BlogManager posts={blogPosts} onPostsChange={setBlogPosts} isLoading={isLoadingPosts} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Design Tab */}
          <TabsContent value="design">
            <DesignManager
              siteConfig={siteConfig}
              setSiteConfig={setSiteConfig}
              onSave={handleSiteSave}
              isLoading={isLoadingContent}
            />
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media">
            <MediaManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}