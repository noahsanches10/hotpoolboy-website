'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X } from 'lucide-react';

interface NavigationManagerProps {
  navigation: any;
  setNavigation: (nav: any) => void;
  onSave: () => void;
  isLoading: boolean;
}

export default function NavigationManager({ navigation, setNavigation, onSave, isLoading }: NavigationManagerProps) {
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load site config when component mounts
  React.useEffect(() => {
    loadSiteConfig();
  }, []);

  const loadSiteConfig = async () => {
    try {
      const response = await fetch('/api/admin/content?type=site-config');
      if (response.ok) {
        const data = await response.json();
        setSiteConfig(data);
      }
    } catch (error) {
      console.error('Failed to load site config:', error);
    }
  };

  const saveSiteConfig = async () => {
    if (!siteConfig) return;

    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'site-config', data: siteConfig })
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Failed to save site config:', error);
      alert('Failed to save settings.');
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', logoFile);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setSiteConfig({
          ...siteConfig,
          logo: result.path
        });
        setLogoFile(null);
        alert('Logo uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading || !siteConfig) {
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
      <Tabs defaultValue="navigation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="styling">Styling</TabsTrigger>
          <TabsTrigger value="cta-banners">CTA Banners</TabsTrigger>
        </TabsList>

        {/* Navigation Tab */}
        <TabsContent value="navigation" className="space-y-6">
          {/* Header Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Header Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Navigation Links</Label>
                <div className="space-y-3 mt-2">
                  {navigation.header.map((item: any, index: number) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Link Text"
                        value={item.label}
                        onChange={(e) => {
                          const newHeader = [...navigation.header];
                          newHeader[index] = { ...item, label: e.target.value };
                          setNavigation({ ...navigation, header: newHeader });
                        }}
                      />
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Link URL"
                          value={item.href}
                          onChange={(e) => {
                            const newHeader = [...navigation.header];
                            newHeader[index] = { ...item, href: e.target.value };
                            setNavigation({ ...navigation, header: newHeader });
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newHeader = navigation.header.filter((_, i) => i !== index);
                            setNavigation({ ...navigation, header: newHeader });
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newHeader = [...navigation.header, { label: "", href: "" }];
                      setNavigation({ ...navigation, header: newHeader });
                    }}
                  >
                    Add Navigation Link
                  </Button>
                </div>
              </div>

              <div>
                <Label>Header CTA Button</Label>
                <div className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ctaLabel">Button Text</Label>
                      <Input
                        id="ctaLabel"
                        placeholder="Button Text"
                        value={navigation.cta.label}
                        onChange={(e) => setNavigation({
                          ...navigation,
                          cta: { ...navigation.cta, label: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ctaHref">Button Link</Label>
                      <Input
                        id="ctaHref"
                        placeholder="Button Link"
                        value={navigation.cta.href}
                        onChange={(e) => setNavigation({
                          ...navigation,
                          cta: { ...navigation.cta, href: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={navigation.cta.external || false}
                        onCheckedChange={(checked) => setNavigation({
                          ...navigation,
                          cta: { ...navigation.cta, external: checked }
                        })}
                      />
                      <Label>External Link</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={navigation.cta.openInNewTab || false}
                        onCheckedChange={(checked) => setNavigation({
                          ...navigation,
                          cta: { ...navigation.cta, openInNewTab: checked }
                        })}
                      />
                      <Label>Open in New Tab</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Footer Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Footer Links</Label>
                <div className="space-y-3 mt-2">
                  {navigation.footer.map((item: any, index: number) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Link Text"
                        value={item.label}
                        onChange={(e) => {
                          const newFooter = [...navigation.footer];
                          newFooter[index] = { ...item, label: e.target.value };
                          setNavigation({ ...navigation, footer: newFooter });
                        }}
                      />
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Link URL"
                          value={item.href}
                          onChange={(e) => {
                            const newFooter = [...navigation.footer];
                            newFooter[index] = { ...item, href: e.target.value };
                            setNavigation({ ...navigation, footer: newFooter });
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newFooter = navigation.footer.filter((_, i) => i !== index);
                            setNavigation({ ...navigation, footer: newFooter });
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newFooter = [...navigation.footer, { label: "", href: "" }];
                      setNavigation({ ...navigation, footer: newFooter });
                    }}
                  >
                    Add Footer Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={onSave}>
            Save Navigation
          </Button>
        </TabsContent>

        {/* Styling Tab */}
        <TabsContent value="styling" className="space-y-6">
          {/* Header Styling */}
          <Card>
            <CardHeader>
              <CardTitle>Header Styling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="headerStyle">Header Background Style</Label>
                <Select
                  value={siteConfig.headerStyle || 'default'}
                  onValueChange={(value) => setSiteConfig({
                    ...siteConfig,
                    headerStyle: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select header style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default (White Background)</SelectItem>
                    <SelectItem value="primary">Primary Color Background</SelectItem>
                    <SelectItem value="secondary">Secondary Color Background</SelectItem>
                    <SelectItem value="gradient">Gradient Background</SelectItem>
                    <SelectItem value="transparent">Transparent Background</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="headerCtaStyle">Header CTA Button Style</Label>
                <Select
                  value={siteConfig.headerCtaStyle || 'primary'}
                  onValueChange={(value) => setSiteConfig({
                    ...siteConfig,
                    headerCtaStyle: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select CTA button style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary Color</SelectItem>
                    <SelectItem value="secondary">Secondary Color</SelectItem>
                    <SelectItem value="accent">Accent Color</SelectItem>
                    <SelectItem value="white">White (for dark headers)</SelectItem>
                    <SelectItem value="outline">Outline Style</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="headerCtaTextColor">Header CTA Text Color</Label>
                <Select
                  value={siteConfig.headerCtaTextColor || 'white'}
                  onValueChange={(value) => setSiteConfig({
                    ...siteConfig,
                    headerCtaTextColor: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select text color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="headerTextStyle">Header Text Style</Label>
                <Select
                  value={siteConfig.headerTextStyle || 'auto'}
                  onValueChange={(value) => setSiteConfig({
                    ...siteConfig,
                    headerTextStyle: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select text style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (based on background)</SelectItem>
                    <SelectItem value="dark">Dark Text</SelectItem>
                    <SelectItem value="light">Light Text</SelectItem>
                    <SelectItem value="primary">Primary Color Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Preview:</strong> Header styling changes will be visible after saving and refreshing the page.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer Styling */}
          <Card>
            <CardHeader>
              <CardTitle>Footer Styling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="footerStyle">Footer Background Style</Label>
                <Select
                  value={siteConfig.footerStyle || 'default'}
                  onValueChange={(value) => setSiteConfig({
                    ...siteConfig,
                    footerStyle: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select footer style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default (Dark Background)</SelectItem>
                    <SelectItem value="primary">Primary Color Background</SelectItem>
                    <SelectItem value="secondary">Secondary Color Background</SelectItem>
                    <SelectItem value="gradient">Gradient Background</SelectItem>
                    <SelectItem value="light">Light Background</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="footerTextColor">Footer Text Color</Label>
                <Select
                  value={siteConfig.footerTextColor || 'auto'}
                  onValueChange={(value) => setSiteConfig({
                    ...siteConfig,
                    footerTextColor: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select footer text color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (based on background)</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="dark">Dark Gray</SelectItem>
                    <SelectItem value="primary">Primary Color</SelectItem>
                    <SelectItem value="secondary">Secondary Color</SelectItem>
                    <SelectItem value="accent">Accent Color</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Footer text and icon colors can be customized independently of the background style.
                </p>
              </div>
            </CardContent>
          </Card>

          <Button onClick={saveSiteConfig}>
            Save Styling
          </Button>
        </TabsContent>

        {/* CTA Banners Tab */}
        <TabsContent value="cta-banners" className="space-y-6">
          {/* Page Toggles */}
          <Card>
            <CardHeader>
              <CardTitle>CTA Banner Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Show CTA Banner On Pages</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={siteConfig.ctaBanner?.showOnPages?.home !== false}
                      onCheckedChange={(checked) => setSiteConfig({
                        ...siteConfig,
                        ctaBanner: {
                          ...siteConfig.ctaBanner,
                          showOnPages: {
                            ...siteConfig.ctaBanner?.showOnPages,
                            home: checked
                          }
                        }
                      })}
                    />
                    <Label className="text-sm">Home Page</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={siteConfig.ctaBanner?.showOnPages?.services !== false}
                      onCheckedChange={(checked) => setSiteConfig({
                        ...siteConfig,
                        ctaBanner: {
                          ...siteConfig.ctaBanner,
                          showOnPages: {
                            ...siteConfig.ctaBanner?.showOnPages,
                            services: checked
                          }
                        }
                      })}
                    />
                    <Label className="text-sm">Services Page</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={siteConfig.ctaBanner?.showOnPages?.servicePages !== false}
                      onCheckedChange={(checked) => setSiteConfig({
                        ...siteConfig,
                        ctaBanner: {
                          ...siteConfig.ctaBanner,
                          showOnPages: {
                            ...siteConfig.ctaBanner?.showOnPages,
                            servicePages: checked
                          }
                        }
                      })}
                    />
                    <Label className="text-sm">Individual Service Pages</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={siteConfig.ctaBanner?.showOnPages?.blog !== false}
                      onCheckedChange={(checked) => setSiteConfig({
                        ...siteConfig,
                        ctaBanner: {
                          ...siteConfig.ctaBanner,
                          showOnPages: {
                            ...siteConfig.ctaBanner?.showOnPages,
                            blog: checked
                          }
                        }
                      })}
                    />
                    <Label className="text-sm">Blog Page</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={siteConfig.ctaBanner?.showOnPages?.blogPosts !== false}
                      onCheckedChange={(checked) => setSiteConfig({
                        ...siteConfig,
                        ctaBanner: {
                          ...siteConfig.ctaBanner,
                          showOnPages: {
                            ...siteConfig.ctaBanner?.showOnPages,
                            blogPosts: checked
                          }
                        }
                      })}
                    />
                    <Label className="text-sm">Blog Post Pages</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={siteConfig.ctaBanner?.showOnPages?.about !== false}
                      onCheckedChange={(checked) => setSiteConfig({
                        ...siteConfig,
                        ctaBanner: {
                          ...siteConfig.ctaBanner,
                          showOnPages: {
                            ...siteConfig.ctaBanner?.showOnPages,
                            about: checked
                          }
                        }
                      })}
                    />
                    <Label className="text-sm">About Page</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={siteConfig.ctaBanner?.showOnPages?.reviews !== false}
                      onCheckedChange={(checked) => setSiteConfig({
                        ...siteConfig,
                        ctaBanner: {
                          ...siteConfig.ctaBanner,
                          showOnPages: {
                            ...siteConfig.ctaBanner?.showOnPages,
                            reviews: checked
                          }
                        }
                      })}
                    />
                    <Label className="text-sm">Reviews Page</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Banner Content */}
          <Card>
            <CardHeader>
              <CardTitle>Banner Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="bannerTitle">Banner Title</Label>
                  <Input
                    id="bannerTitle"
                    value={siteConfig.ctaBanner?.title || 'Ready to Get Started?'}
                    onChange={(e) => setSiteConfig({
                      ...siteConfig,
                      ctaBanner: {
                        ...siteConfig.ctaBanner,
                        title: e.target.value
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="bannerSubtitle">Banner Subtitle</Label>
                  <Input
                    id="bannerSubtitle"
                    value={siteConfig.ctaBanner?.subtitle || 'Contact us today for a free consultation and quote.'}
                    onChange={(e) => setSiteConfig({
                      ...siteConfig,
                      ctaBanner: {
                        ...siteConfig.ctaBanner,
                        subtitle: e.target.value
                      }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Banner Styling */}
          <Card>
            <CardHeader>
              <CardTitle>Banner Styling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="bannerStyle">Banner Background Style</Label>
                <Select
                  value={siteConfig.ctaBanner?.style || 'gradient'}
                  onValueChange={(value) => setSiteConfig({
                    ...siteConfig,
                    ctaBanner: {
                      ...siteConfig.ctaBanner,
                      style: value
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select banner style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gradient">Gradient Background</SelectItem>
                    <SelectItem value="primary">Primary Color Background</SelectItem>
                    <SelectItem value="secondary">Secondary Color Background</SelectItem>
                    <SelectItem value="accent">Accent Color Background</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bannerLayout">Banner Layout</Label>
                <Select
                  value={siteConfig.ctaBanner?.layout || 'contained'}
                  onValueChange={(value) => setSiteConfig({
                    ...siteConfig,
                    ctaBanner: {
                      ...siteConfig.ctaBanner,
                      layout: value
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select banner layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fullwidth">Full Width</SelectItem>
                    <SelectItem value="contained">Contained with Rounded Corners</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Banner Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Banner Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Button Colors */}
              <div>
                <Label className="text-base font-semibold">Button Colors</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <Label htmlFor="bannerPrimaryButtonColor">Primary Button Color</Label>
                    <Select
                      value={siteConfig.ctaBanner?.primaryButtonColor || 'accent'}
                      onValueChange={(value) => setSiteConfig({
                        ...siteConfig,
                        ctaBanner: {
                          ...siteConfig.ctaBanner,
                          primaryButtonColor: value
                        }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary button color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary Color</SelectItem>
                        <SelectItem value="secondary">Secondary Color</SelectItem>
                        <SelectItem value="accent">Accent Color</SelectItem>
                        <SelectItem value="white">White</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Primary Button Text Color</Label>
                    <Select
                      value={siteConfig.ctaBanner?.primaryButtonTextColor || 'white'}
                      onValueChange={(value) => setSiteConfig({
                        ...siteConfig,
                        ctaBanner: {
                          ...siteConfig.ctaBanner,
                          primaryButtonTextColor: value
                        }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select text color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bannerSecondaryButtonColor">Secondary Button Color</Label>
                    <Select
                      value={siteConfig.ctaBanner?.secondaryButtonColor || 'outline'}
                      onValueChange={(value) => setSiteConfig({
                        ...siteConfig,
                        ctaBanner: {
                          ...siteConfig.ctaBanner,
                          secondaryButtonColor: value
                        }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select secondary button color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary Color</SelectItem>
                        <SelectItem value="secondary">Secondary Color</SelectItem>
                        <SelectItem value="accent">Accent Color</SelectItem>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="outline">Outline (Transparent)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Secondary Button Text Color</Label>
                    <Select
                      value={siteConfig.ctaBanner?.secondaryButtonTextColor || 'white'}
                      onValueChange={(value) => setSiteConfig({
                        ...siteConfig,
                        ctaBanner: {
                          ...siteConfig.ctaBanner,
                          secondaryButtonTextColor: value
                        }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select text color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Button Text and Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="bannerPrimaryText">Primary Button Text</Label>
                  <Input
                    id="bannerPrimaryText"
                    value={siteConfig.ctaBanner?.primaryText || 'Get Free Quote'}
                    onChange={(e) => setSiteConfig({
                      ...siteConfig,
                      ctaBanner: {
                        ...siteConfig.ctaBanner,
                        primaryText: e.target.value
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="bannerPrimaryLink">Primary Button Link</Label>
                  <Input
                    id="bannerPrimaryLink"
                    value={siteConfig.ctaBanner?.primaryLink || '/contact'}
                    onChange={(e) => setSiteConfig({
                      ...siteConfig,
                      ctaBanner: {
                        ...siteConfig.ctaBanner,
                        primaryLink: e.target.value
                      }
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="bannerSecondaryText">Secondary Button Text</Label>
                  <Input
                    id="bannerSecondaryText"
                    value={siteConfig.ctaBanner?.secondaryText || 'Contact Us'}
                    onChange={(e) => setSiteConfig({
                      ...siteConfig,
                      ctaBanner: {
                        ...siteConfig.ctaBanner,
                        secondaryText: e.target.value
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="bannerSecondaryLink">Secondary Button Link</Label>
                  <Input
                    id="bannerSecondaryLink"
                    value={siteConfig.ctaBanner?.secondaryLink || '/contact'}
                    onChange={(e) => setSiteConfig({
                      ...siteConfig,
                      ctaBanner: {
                        ...siteConfig.ctaBanner,
                        secondaryLink: e.target.value
                      }
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={siteConfig.ctaBanner?.primaryEnabled !== false}
                    onCheckedChange={(checked) => setSiteConfig({
                      ...siteConfig,
                      ctaBanner: {
                        ...siteConfig.ctaBanner,
                        primaryEnabled: checked
                      }
                    })}
                  />
                  <Label className="text-sm">Enable primary button</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={siteConfig.ctaBanner?.secondaryEnabled !== false}
                    onCheckedChange={(checked) => setSiteConfig({
                      ...siteConfig,
                      ctaBanner: {
                        ...siteConfig.ctaBanner,
                        secondaryEnabled: checked
                      }
                    })}
                  />
                  <Label className="text-sm">Enable secondary button</Label>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> These settings control the CTA banners that appear at the bottom of pages.
                  You can customize the button colors and toggle banners on/off for each page type.
                </p>
              </div>
            </CardContent>
          </Card>

          <Button onClick={saveSiteConfig}>
            Save CTA Banners
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
