'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DesignManagerProps {
  siteConfig: any;
  setSiteConfig: (config: any) => void;
  onSave: () => void;
  isLoading: boolean;
}

export default function DesignManager({ siteConfig, setSiteConfig, onSave, isLoading }: DesignManagerProps) {
  const [localSiteConfig, setLocalSiteConfig] = useState<any>(null);

  useEffect(() => {
    loadSiteConfig();
  }, []);

  const loadSiteConfig = async () => {
    try {
      const response = await fetch('/api/admin/content?type=site-config');
      if (response.ok) {
        const data = await response.json();
        setLocalSiteConfig(data);
      }
    } catch (error) {
      console.error('Failed to load site config:', error);
    }
  };

  const handleSave = async () => {
    if (!localSiteConfig) return;
    
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'site-config', data: localSiteConfig })
      });
      
      if (response.ok) {
        alert('Brand colors saved successfully!');
        // Update parent component state
        setSiteConfig(localSiteConfig);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Failed to save brand colors:', error);
      alert('Failed to save brand colors.');
    }
  };

  if (isLoading || !localSiteConfig) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Brand Colors */}
      {/* Font Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="fontFamily">Font Family</Label>
            <select
              id="fontFamily"
              value={localSiteConfig.fontFamily || 'inter'}
              onChange={(e) => setLocalSiteConfig({
                ...localSiteConfig,
                fontFamily: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-2"
            >
              <option value="inter">Inter (Default)</option>
              <option value="roboto">Roboto</option>
              <option value="open-sans">Open Sans</option>
              <option value="lato">Lato</option>
              <option value="montserrat">Montserrat</option>
              <option value="poppins">Poppins</option>
              <option value="nunito">Nunito</option>
              <option value="source-sans">Source Sans Pro</option>
              <option value="raleway">Raleway</option>
              <option value="work-sans">Work Sans</option>
              <option value="playfair">Playfair Display</option>
              <option value="merriweather">Merriweather</option>
              <option value="crimson">Crimson Text</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">
              Choose a font family for your website. Changes will be visible after saving and refreshing the page.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Font Preview:</strong> The selected font will be applied to all text throughout your website including headings, body text, and navigation.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 text-sm">
            These colors are used throughout your website for buttons, accents, and design elements.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={localSiteConfig.brandColors?.primary || '#2563eb'}
                  onChange={(e) => setLocalSiteConfig({
                    ...localSiteConfig,
                    brandColors: {
                      ...localSiteConfig.brandColors,
                      primary: e.target.value
                    }
                  })}
                  className="w-16 h-10"
                />
                <Input
                  value={localSiteConfig.brandColors?.primary || '#2563eb'}
                  onChange={(e) => setLocalSiteConfig({
                    ...localSiteConfig,
                    brandColors: {
                      ...localSiteConfig.brandColors,
                      primary: e.target.value
                    }
                  })}
                  placeholder="#2563eb"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={localSiteConfig.brandColors?.secondary || '#1e40af'}
                  onChange={(e) => setLocalSiteConfig({
                    ...localSiteConfig,
                    brandColors: {
                      ...localSiteConfig.brandColors,
                      secondary: e.target.value
                    }
                  })}
                  className="w-16 h-10"
                />
                <Input
                  value={localSiteConfig.brandColors?.secondary || '#1e40af'}
                  onChange={(e) => setLocalSiteConfig({
                    ...localSiteConfig,
                    brandColors: {
                      ...localSiteConfig.brandColors,
                      secondary: e.target.value
                    }
                  })}
                  placeholder="#1e40af"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={localSiteConfig.brandColors?.accent || '#f59e0b'}
                  onChange={(e) => setLocalSiteConfig({
                    ...localSiteConfig,
                    brandColors: {
                      ...localSiteConfig.brandColors,
                      accent: e.target.value
                    }
                  })}
                  className="w-16 h-10"
                />
                <Input
                  value={localSiteConfig.brandColors?.accent || '#f59e0b'}
                  onChange={(e) => setLocalSiteConfig({
                    ...localSiteConfig,
                    brandColors: {
                      ...localSiteConfig.brandColors,
                      accent: e.target.value
                    }
                  })}
                  placeholder="#f59e0b"
                />
              </div>
            </div>
          </div>


          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Color changes will be visible after saving and refreshing the page. 
              These colors are used for buttons, links, and design accents throughout your website.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Hero Section Styling */}
      <Card>
        <CardHeader>
          <CardTitle>Default Hero Section Styling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> These settings apply to pages that don't have specific background images set in the Media Manager. 
              For pages with background images, use the Media Manager to configure individual overlay settings.
            </p>
          </div>
          
          <div>
            <Label htmlFor="heroBackgroundType">Hero Background Type</Label>
            <select
              id="heroBackgroundType"
              value={localSiteConfig.heroStyling?.backgroundType || 'gradient'}
              onChange={(e) => setLocalSiteConfig({
                ...localSiteConfig,
                heroStyling: {
                  ...localSiteConfig.heroStyling,
                  backgroundType: e.target.value
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-2"
            >
              <option value="gradient">Gradient (Primary to Secondary)</option>
              <option value="primary">Primary Color</option>
              <option value="secondary">Secondary Color</option>
              <option value="accent">Accent Color</option>
              <option value="white">White</option>
              <option value="gray">Light Gray</option>
            </select>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Use the Media Manager to upload and assign specific background images to individual pages, 
              then configure overlay settings for each image separately.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}