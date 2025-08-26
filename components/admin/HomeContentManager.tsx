'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight, Shield, Clock, Award, Users, Star, CheckCircle, Heart, ThumbsUp } from 'lucide-react';

interface HomeContentManagerProps {
  homeContent: any;
  setHomeContent: (content: any) => void;
  onSave: () => void;
  isLoading: boolean;
}

const iconOptions = [
  { value: 'shield', label: 'Shield', icon: Shield },
  { value: 'clock', label: 'Clock', icon: Clock },
  { value: 'award', label: 'Award', icon: Award },
  { value: 'users', label: 'Users', icon: Users },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'checkCircle', label: 'Check Circle', icon: CheckCircle },
  { value: 'heart', label: 'Heart', icon: Heart },
  { value: 'thumbsUp', label: 'Thumbs Up', icon: ThumbsUp },
];

export default function HomeContentManager({ homeContent, setHomeContent, onSave, isLoading }: HomeContentManagerProps) {
  const [servicesConfig, setServicesConfig] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['hero']));
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadServicesConfig();
  }, []);

  const loadServicesConfig = async () => {
    try {
      const response = await fetch('/api/admin/content?type=services');
      if (response.ok) {
        const data = await response.json();
        setServicesConfig(data);
      }
    } catch (error) {
      console.error('Failed to load services config:', error);
    }
  };

  const toggleExpanded = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const moveSection = (fromIndex: number, toIndex: number) => {
    const sections = homeContent.sections || {};
    const order = sections.order || ['services', 'whyChooseUs', 'testimonials', 'pricing', 'gallery', 'faq'];
    const newOrder = [...order];
    const [movedSection] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedSection);
    
    setHomeContent({
      ...homeContent,
      sections: {
        ...sections,
        order: newOrder
      }
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveSection(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number, field: 'beforeImage' | 'afterImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'gallery');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const newItems = [...sections.gallery.items];
        newItems[index] = { ...newItems[index], [field]: result.path };
        setHomeContent({
          ...homeContent,
          sections: {
            ...sections,
            gallery: { ...sections.gallery, items: newItems }
          }
        });
        alert('Image uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  if (isLoading || !servicesConfig) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </CardContent>
      </Card>
    );
  }

  const sections = homeContent.sections || {};
  const sectionOrder = sections.order || ['services', 'whyChooseUs', 'testimonials', 'pricing', 'gallery', 'faq'];

  const sectionLabels = {
    services: 'Services',
    whyChooseUs: 'Why Choose Us',
    testimonials: 'Testimonials',
    pricing: 'Pricing',
    gallery: 'Gallery',
    faq: 'FAQ'
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="sections">Page Sections</TabsTrigger>
          <TabsTrigger value="order">Section Settings</TabsTrigger>
        </TabsList>

        {/* Hero Tab */}
<TabsContent value="hero" className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>Hero Section</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label htmlFor="heroTitle">Hero Title</Label>
        <Input
          id="heroTitle"
          value={homeContent.hero.title}
          onChange={(e) => setHomeContent({
            ...homeContent,
            hero: { ...homeContent.hero, title: e.target.value }
          })}
        />
      </div>
      <div>
        <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
        <Input
          id="heroSubtitle"
          value={homeContent.hero.subtitle}
          onChange={(e) => setHomeContent({
            ...homeContent,
            hero: { ...homeContent.hero, subtitle: e.target.value }
          })}
        />
      </div>

      {/* Primary button text/link */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ctaText">Primary Button Text</Label>
          <Input
            id="ctaText"
            value={homeContent.hero.cta?.primary?.text || homeContent.hero.ctaText || 'Get Free Quote'}
            onChange={(e) => setHomeContent({
              ...homeContent,
              hero: {
                ...homeContent.hero,
                cta: {
                  ...homeContent.hero.cta,
                  primary: {
                    ...homeContent.hero.cta?.primary,
                    text: e.target.value,
                    enabled: true
                  }
                }
              }
            })}
          />
        </div>
        <div>
          <Label htmlFor="ctaLink">Primary Button Link</Label>
          <Input
            id="ctaLink"
            value={homeContent.hero.cta?.primary?.link || homeContent.hero.ctaLink || '/contact'}
            onChange={(e) => setHomeContent({
              ...homeContent,
              hero: {
                ...homeContent.hero,
                cta: {
                  ...homeContent.hero.cta,
                  primary: {
                    ...homeContent.hero.cta?.primary,
                    link: e.target.value,
                    enabled: true
                  }
                }
              }
            })}
          />
        </div>
      </div>

      {/* Secondary button text/link */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="secondaryCtaText">Secondary Button Text</Label>
          <Input
            id="secondaryCtaText"
            value={homeContent.hero.cta?.secondary?.text || 'Contact Us'}
            onChange={(e) => setHomeContent({
              ...homeContent,
              hero: {
                ...homeContent.hero,
                cta: {
                  ...homeContent.hero.cta,
                  secondary: {
                    ...homeContent.hero.cta?.secondary,
                    text: e.target.value,
                    enabled: true
                  }
                }
              }
            })}
          />
        </div>
        <div>
          <Label htmlFor="secondaryCtaLink">Secondary Button Link</Label>
          <Input
            id="secondaryCtaLink"
            value={homeContent.hero.cta?.secondary?.link || '/contact'}
            onChange={(e) => setHomeContent({
              ...homeContent,
              hero: {
                ...homeContent.hero,
                cta: {
                  ...homeContent.hero.cta,
                  secondary: {
                    ...homeContent.hero.cta?.secondary,
                    link: e.target.value,
                    enabled: true
                  }
                }
              }
            })}
          />
        </div>
      </div>

      {/* ✅ Button Styles */}
      <div>
        <Label className="text-base font-semibold">Button Styles</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Primary Button Colors */}
          <div className="space-y-3">
            <Label>Primary Button Color</Label>
            <Select
              value={homeContent.hero.cta?.primary?.color || 'primary'}
              onValueChange={(value) => setHomeContent(prev => ({
                ...prev,
                hero: {
                  ...prev.hero,
                  cta: {
                    ...prev.hero.cta,
                    primary: {
                      ...prev.hero.cta?.primary,
                      color: value
                    }
                  }
                }
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select button color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="accent">Accent</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>

            <Label>Primary Button Text Color</Label>
            <Select
              value={homeContent.hero.cta?.primary?.textColor || 'white'}
              onValueChange={(value) => setHomeContent(prev => ({
                ...prev,
                hero: {
                  ...prev.hero,
                  cta: {
                    ...prev.hero.cta,
                    primary: {
                      ...prev.hero.cta?.primary,
                      textColor: value
                    }
                  }
                }
              }))}
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

          {/* Secondary Button Colors */}
          <div className="space-y-3">
            <Label>Secondary Button Color</Label>
            <Select
              value={homeContent.hero.cta?.secondary?.color || 'outline'}
              onValueChange={(value) => setHomeContent(prev => ({
                ...prev,
                hero: {
                  ...prev.hero,
                  cta: {
                    ...prev.hero.cta,
                    secondary: {
                      ...prev.hero.cta?.secondary,
                      color: value
                    }
                  }
                }
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select button color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="accent">Accent</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>

            <Label>Secondary Button Text Color</Label>
            <Select
              value={homeContent.hero.cta?.secondary?.textColor || 'primary'}
              onValueChange={(value) => setHomeContent(prev => ({
                ...prev,
                hero: {
                  ...prev.hero,
                  cta: {
                    ...prev.hero.cta,
                    secondary: {
                      ...prev.hero.cta?.secondary,
                      textColor: value
                    }
                  }
                }
              }))}
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

      {/* Enable toggles */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="primaryCtaEnabled"
            checked={homeContent.hero.cta?.primary?.enabled !== false}
            onChange={(e) => setHomeContent({
              ...homeContent,
              hero: {
                ...homeContent.hero,
                cta: {
                  ...homeContent.hero.cta,
                  primary: {
                    ...homeContent.hero.cta?.primary,
                    enabled: e.target.checked
                  }
                }
              }
            })}
            className="w-4 h-4 text-primary"
          />
          <Label htmlFor="primaryCtaEnabled" className="text-sm">Enable primary button</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="secondaryCtaEnabled"
            checked={homeContent.hero.cta?.secondary?.enabled !== false}
            onChange={(e) => setHomeContent({
              ...homeContent,
              hero: {
                ...homeContent.hero,
                cta: {
                  ...homeContent.hero.cta,
                  secondary: {
                    ...homeContent.hero.cta?.secondary,
                    enabled: e.target.checked
                  }
                }
              }
            })}
            className="w-4 h-4 text-primary"
          />
          <Label htmlFor="secondaryCtaEnabled" className="text-sm">Enable secondary button</Label>
        </div>
      </div>

              {/* Trust Indicators */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Trust Indicators</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newIndicators = [
                        ...(homeContent.hero.trustIndicators || []),
                        { text: 'New Indicator', enabled: true }
                      ];
                      setHomeContent({
                        ...homeContent,
                        hero: {
                          ...homeContent.hero,
                          trustIndicators: newIndicators
                        }
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Indicator
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {(homeContent.hero.trustIndicators || []).map((indicator: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Input
                        value={indicator.text}
                        onChange={(e) => {
                          const newIndicators = [...homeContent.hero.trustIndicators];
                          newIndicators[index] = { ...indicator, text: e.target.value };
                          setHomeContent({
                            ...homeContent,
                            hero: {
                              ...homeContent.hero,
                              trustIndicators: newIndicators
                            }
                          });
                        }}
                        placeholder="Trust indicator text"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newIndicators = homeContent.hero.trustIndicators.filter((_: any, i: number) => i !== index);
                          setHomeContent({
                            ...homeContent,
                            hero: {
                              ...homeContent.hero,
                              trustIndicators: newIndicators
                            }
                          });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Hero Image */}
              <div>
                <Label htmlFor="heroImage">Hero Image URL</Label>
                <Input
                  id="heroImage"
                  value={homeContent.hero.image || ''}
                  onChange={(e) => setHomeContent({
                    ...homeContent,
                    hero: { ...homeContent.hero, image: e.target.value }
                  })}
                  placeholder="https://images.pexels.com/..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty to center the hero content. When provided, content will be left-aligned with image on the right.
                </p>
                {homeContent.hero.image && (
                  <div className="mt-2">
                    <img 
                      src={homeContent.hero.image} 
                      alt="Hero preview"
                      className="w-32 h-20 object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg';
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sections Tab */}
        <TabsContent value="sections" className="space-y-6">
          {/* Services Section */}
          <Card>
            <CardHeader>
              <CardTitle>Services Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={sections.services?.enabled !== false}
                  onCheckedChange={(checked) => setHomeContent({
                    ...homeContent,
                    sections: {
                      ...sections,
                      services: { ...sections.services, enabled: checked }
                    }
                  })}
                />
                <Label>Show Services Section on Home Page</Label>
              </div>

              {sections.services?.enabled !== false && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="servicesTitle">Services Section Title</Label>
                      <Input
                        id="servicesTitle"
                        value={sections?.services?.title ?? 'Our Services'}
                        onChange={(e) => setHomeContent({
                          ...homeContent,
                          sections: {
                            ...sections,
                            services: { ...sections.services, title: e.target.value }
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="servicesSubtitle">Services Section Subtitle</Label>
                      <Input
                        id="servicesSubtitle"
                        value={sections?.services?.subtitle ?? 'Comprehensive home services'}
                        onChange={(e) => setHomeContent({
                          ...homeContent,
                          sections: {
                            ...sections,
                            services: { ...sections.services, subtitle: e.target.value }
                          }
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Services to Display on Home Page</Label>
                    <p className="text-sm text-gray-500 mb-4">
                      Select which services to show on the home page. Services are configured on the Services tab.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {servicesConfig.services?.map((service: any) => (
                        <div key={service.slug} className="flex items-center space-x-2">
                          <Checkbox
                            checked={!sections.services?.hiddenServices?.includes(service.slug)}
                            onCheckedChange={(checked) => {
                              const hiddenServices = sections.services?.hiddenServices || [];
                              const newHiddenServices = checked
                                ? hiddenServices.filter((slug: string) => slug !== service.slug)
                                : [...hiddenServices, service.slug];
                              
                              setHomeContent({
                                ...homeContent,
                                sections: {
                                  ...sections,
                                  services: {
                                    ...sections.services,
                                    hiddenServices: newHiddenServices
                                  }
                                }
                              });
                            }}
                          />
                          <Label className="text-sm">{service.title}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Why Choose Us Section */}
          <Card>
            <CardHeader>
              <CardTitle>Why Choose Us Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={sections.whyChooseUs?.enabled !== false}
                  onCheckedChange={(checked) => setHomeContent({
                    ...homeContent,
                    sections: {
                      ...sections,
                      whyChooseUs: { ...sections.whyChooseUs, enabled: checked }
                    }
                  })}
                />
                <Label>Show Why Choose Us Section</Label>
              </div>

              {sections.whyChooseUs?.enabled !== false && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="whyChooseUsTitle">Section Title</Label>
                      <Input
                        id="whyChooseUsTitle"
                        value={sections?.whyChooseUs?.title ?? 'Why Choose Us'}
                        onChange={(e) => setHomeContent({
                          ...homeContent,
                          sections: {
                            ...sections,
                            whyChooseUs: { ...sections.whyChooseUs, title: e.target.value }
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="whyChooseUsSubtitle">Section Subtitle</Label>
                      <Input
                        id="whyChooseUsSubtitle"
                        value={sections?.whyChooseUs?.subtitle ?? 'We\'re committed to excellence'}
                        onChange={(e) => setHomeContent({
                          ...homeContent,
                          sections: {
                            ...sections,
                            whyChooseUs: { ...sections.whyChooseUs, subtitle: e.target.value }
                          }
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label>Value Propositions</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newItems = [
                            ...(sections.whyChooseUs?.items || []),
                            { icon: 'shield', title: 'New Value', description: 'Description' }
                          ];
                          setHomeContent({
                            ...homeContent,
                            sections: {
                              ...sections,
                              whyChooseUs: { ...sections.whyChooseUs, items: newItems }
                            }
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Value
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {(sections.whyChooseUs?.items || []).map((item: any, index: number) => (
                        <Card key={index} className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">Value {index + 1}</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newItems = sections.whyChooseUs.items.filter((_: any, i: number) => i !== index);
                                  setHomeContent({
                                    ...homeContent,
                                    sections: {
                                      ...sections,
                                      whyChooseUs: { ...sections.whyChooseUs, items: newItems }
                                    }
                                  });
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor={`icon-${index}`}>Icon</Label>
                                <select
                                  id={`icon-${index}`}
                                  value={item.icon}
                                  onChange={(e) => {
                                    const newItems = [...sections.whyChooseUs.items];
                                    newItems[index] = { ...item, icon: e.target.value };
                                    setHomeContent({
                                      ...homeContent,
                                      sections: {
                                        ...sections,
                                        whyChooseUs: { ...sections.whyChooseUs, items: newItems }
                                      }
                                    });
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                  {iconOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <Label htmlFor={`title-${index}`}>Title</Label>
                                <Input
                                  id={`title-${index}`}
                                  value={item.title}
                                  onChange={(e) => {
                                    const newItems = [...sections.whyChooseUs.items];
                                    newItems[index] = { ...item, title: e.target.value };
                                    setHomeContent({
                                      ...homeContent,
                                      sections: {
                                        ...sections,
                                        whyChooseUs: { ...sections.whyChooseUs, items: newItems }
                                      }
                                    });
                                  }}
                                  placeholder="Value title"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`description-${index}`}>Description</Label>
                                <Textarea
                                  id={`description-${index}`}
                                  value={item.description}
                                  onChange={(e) => {
                                    const newItems = [...sections.whyChooseUs.items];
                                    newItems[index] = { ...item, description: e.target.value };
                                    setHomeContent({
                                      ...homeContent,
                                      sections: {
                                        ...sections,
                                        whyChooseUs: { ...sections.whyChooseUs, items: newItems }
                                      }
                                    });
                                  }}
                                  placeholder="Value description"
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Pricing Section */}
<Card>
  <CardHeader>
    <CardTitle>Pricing Section</CardTitle>
  </CardHeader>
  <CardContent className="space-y-6">
    <div className="flex items-center space-x-2">
      <Switch
        checked={sections.pricing?.enabled === true}
        onCheckedChange={(checked) => setHomeContent({
          ...homeContent,
          sections: {
            ...sections,
            pricing: { ...sections.pricing, enabled: checked }
          }
        })}
      />
      <Label>Show Pricing Section</Label>
    </div>

    {sections.pricing?.enabled && (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="pricingTitle">Section Title</Label>
            <Input
              id="pricingTitle"
              value={sections?.pricing?.title ?? 'Transparent Pricing'}
              onChange={(e) => setHomeContent({
                ...homeContent,
                sections: {
                  ...sections,
                  pricing: { ...sections.pricing, title: e.target.value }
                }
              })}
            />
          </div>
          <div>
            <Label htmlFor="pricingSubtitle">Section Subtitle</Label>
            <Input
              id="pricingSubtitle"
              value={sections?.pricing?.subtitle ?? 'No hidden fees, no surprises'}
              onChange={(e) => setHomeContent({
                ...homeContent,
                sections: {
                  ...sections,
                  pricing: { ...sections.pricing, subtitle: e.target.value }
                }
              })}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Label>Pricing Plans</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newPlans = [
                  ...(sections.pricing?.plans || []),
                  {
                    name: 'New Plan',
                    price: '$99',
                    period: 'per visit',
                    description: 'Plan description',
                    features: ['Feature 1', 'Feature 2'],
                    popular: false
                  }
                ];
                setHomeContent({
                  ...homeContent,
                  sections: {
                    ...sections,
                    pricing: { ...sections.pricing, plans: newPlans }
                  }
                });
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Plan
            </Button>
          </div>
          
          <div className="space-y-4">
            {(sections.pricing?.plans || []).map((plan: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Plan {index + 1}</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={plan.popular}
                        onChange={(e) => {
                          const newPlans = [...sections.pricing.plans];
                          newPlans[index] = { ...plan, popular: e.target.checked };
                          setHomeContent({
                            ...homeContent,
                            sections: {
                              ...sections,
                              pricing: { ...sections.pricing, plans: newPlans }
                            }
                          });
                        }}
                        className="w-4 h-4 text-primary"
                      />
                      <Label className="text-sm">Popular</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newPlans = sections.pricing.plans.filter((_: any, i: number) => i !== index);
                          setHomeContent({
                            ...homeContent,
                            sections: {
                              ...sections,
                              pricing: { ...sections.pricing, plans: newPlans }
                            }
                          });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor={`plan-name-${index}`}>Plan Name</Label>
                      <Input
                        id={`plan-name-${index}`}
                        value={plan.name}
                        onChange={(e) => {
                          const newPlans = [...sections.pricing.plans];
                          newPlans[index] = { ...plan, name: e.target.value };
                          setHomeContent({
                            ...homeContent,
                            sections: {
                              ...sections,
                              pricing: { ...sections.pricing, plans: newPlans }
                            }
                          });
                        }}
                        placeholder="Plan name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`plan-price-${index}`}>Price</Label>
                      <Input
                        id={`plan-price-${index}`}
                        value={plan.price}
                        onChange={(e) => {
                          const newPlans = [...sections.pricing.plans];
                          newPlans[index] = { ...plan, price: e.target.value };
                          setHomeContent({
                            ...homeContent,
                            sections: {
                              ...sections,
                              pricing: { ...sections.pricing, plans: newPlans }
                            }
                          });
                        }}
                        placeholder="$99"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`plan-period-${index}`}>Period</Label>
                      <Input
                        id={`plan-period-${index}`}
                        value={plan.period}
                        onChange={(e) => {
                          const newPlans = [...sections.pricing.plans];
                          newPlans[index] = { ...plan, period: e.target.value };
                          setHomeContent({
                            ...homeContent,
                            sections: {
                              ...sections,
                              pricing: { ...sections.pricing, plans: newPlans }
                            }
                          });
                        }}
                        placeholder="per visit"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`plan-description-${index}`}>Description</Label>
                      <Textarea
                        id={`plan-description-${index}`}
                        value={plan.description}
                        onChange={(e) => {
                          const newPlans = [...sections.pricing.plans];
                          newPlans[index] = { ...plan, description: e.target.value };
                          setHomeContent({
                            ...homeContent,
                            sections: {
                              ...sections,
                              pricing: { ...sections.pricing, plans: newPlans }
                            }
                          });
                        }}
                        placeholder="Plan description"
                        rows={2}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Features (one per line)</Label>
                    <Textarea
                      value={plan.features?.join('\n') || ''}
                      onChange={(e) => {
                        const newPlans = [...sections.pricing.plans];
                        newPlans[index] = { 
                          ...plan, 
                          features: e.target.value.split('\n')
                        };
                        setHomeContent({
                          ...homeContent,
                          sections: {
                            ...sections,
                            pricing: { ...sections.pricing, plans: newPlans }
                          }
                        });
                      }}
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      rows={6}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`exclusions-${index}`}>Not Included (one per line)</Label>
                    <Textarea
                      id={`exclusions-${index}`}
                      value={plan.exclusions?.join('\n') || ''}
                      onChange={(e) => {
                        const newPlans = [...sections.pricing.plans];
                        newPlans[index] = {
                          ...newPlans[index],
                          exclusions: e.target.value.split('\n')
                        };
                        setHomeContent({
                          ...homeContent,
                          sections: {
                            ...sections,
                            pricing: { ...sections.pricing, plans: newPlans }
                          }
                        });
                      }}
                      rows={4}
                      placeholder="Not included item 1&#10;Not included item 2"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Items that are not included in this plan (will show with X icon)
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </>
    )}
  </CardContent>
</Card>

          {/* Gallery Section */}
          <Card>
            <CardHeader>
              <CardTitle>Before/After Gallery Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={sections.gallery?.enabled === true}
                  onCheckedChange={(checked) => setHomeContent({
                    ...homeContent,
                    sections: {
                      ...sections,
                      gallery: { ...sections.gallery, enabled: checked }
                    }
                  })}
                />
                <Label>Show Gallery Section</Label>
              </div>

              {sections.gallery?.enabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="galleryDisplayStyle">Display Style</Label>
                      <select
                        id="galleryDisplayStyle"
                        value={sections.gallery?.displayStyle || 'grid'}
                        onChange={(e) => setHomeContent({
                          ...homeContent,
                          sections: {
                            ...sections,
                            gallery: { ...sections.gallery, displayStyle: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                      >
                        <option value="grid">Grid Layout</option>
                        <option value="carousel">Carousel</option>
                      </select>
                    </div>
                    {sections.gallery?.displayStyle === 'carousel' && (
                      <div>
                        <Label htmlFor="carouselAutoRotate">Auto-Rotate Interval (seconds)</Label>
                        <Input
                          id="carouselAutoRotate"
                          type="number"
                          min="0"
                          step="1"
                          value={sections.gallery?.autoRotateInterval || '5'}
                          onChange={(e) => setHomeContent({
                            ...homeContent,
                            sections: {
                              ...sections,
                              gallery: { ...sections.gallery, autoRotateInterval: e.target.value }
                            }
                          })}
                        />
                        <p className="text-sm text-gray-500 mt-1">Set to 0 to disable auto-rotation</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="galleryTitle">Section Title</Label>
                      <Input
                        id="galleryTitle"
                        value={sections?.gallery?.title ?? 'Our Work'}
                        onChange={(e) => setHomeContent({
                          ...homeContent,
                          sections: {
                            ...sections,
                            gallery: { ...sections.gallery, title: e.target.value }
                          }
                        })}
                      />
                    </div>
                   <div>
  <Label htmlFor="gallerySubtitle">Section Subtitle</Label>
  <Input
    id="gallerySubtitle"
    value={sections?.gallery?.subtitle ?? 'See the professional results'} 
    onChange={(e) =>
      setHomeContent(prev => ({
        ...prev,
        sections: {
          ...prev.sections,
          gallery: {
            ...prev.sections?.gallery,
            subtitle: e.target.value
          }
        }
      }))
    }
  />
</div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label>Before/After Items</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newItems = [
                            ...(sections.gallery?.items || []),
                            {
                              title: 'New Project',
                              beforeImage: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
                              afterImage: 'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg',
                              description: 'Project description'
                            }
                          ];
                          setHomeContent({
                            ...homeContent,
                            sections: {
                              ...sections,
                              gallery: { ...sections.gallery, items: newItems }
                            }
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Gallery Item
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {(sections.gallery?.items || []).map((item: any, index: number) => (
                        <Card key={index} className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">Gallery Item {index + 1}</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newItems = sections.gallery.items.filter((_: any, i: number) => i !== index);
                                  setHomeContent({
                                    ...homeContent,
                                    sections: {
                                      ...sections,
                                      gallery: { ...sections.gallery, items: newItems }
                                    }
                                  });
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`gallery-title-${index}`}>Project Title</Label>
                                <Input
                                  id={`gallery-title-${index}`}
                                  value={item.title}
                                  onChange={(e) => {
                                    const newItems = [...sections.gallery.items];
                                    newItems[index] = { ...item, title: e.target.value };
                                    setHomeContent({
                                      ...homeContent,
                                      sections: {
                                        ...sections,
                                        gallery: { ...sections.gallery, items: newItems }
                                      }
                                    });
                                  }}
                                  placeholder="Project title"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`gallery-description-${index}`}>Description</Label>
                                <Textarea
                                  id={`gallery-description-${index}`}
                                  value={item.description}
                                  onChange={(e) => {
                                    const newItems = [...sections.gallery.items];
                                    newItems[index] = { ...item, description: e.target.value };
                                    setHomeContent({
                                      ...homeContent,
                                      sections: {
                                        ...sections,
                                        gallery: { ...sections.gallery, items: newItems }
                                      }
                                    });
                                  }}
                                  placeholder="Project description"
                                  rows={2}
                                />
                              </div>
                            </div>
                            <div className="space-y-4">
                              <Label className="text-sm font-medium">Before Image</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`gallery-before-url-${index}`} className="text-xs">Image URL</Label>
                                  <Input
                                    id={`gallery-before-url-${index}`}
                                    value={item.beforeImage}
                                    onChange={(e) => {
                                      const newItems = [...sections.gallery.items];
                                      newItems[index] = { ...item, beforeImage: e.target.value };
                                      setHomeContent({
                                        ...homeContent,
                                        sections: {
                                          ...sections,
                                          gallery: { ...sections.gallery, items: newItems }
                                        }
                                      });
                                    }}
                                    placeholder="https://images.pexels.com/..."
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`gallery-before-upload-${index}`} className="text-xs">Or Upload Image</Label>
                                  <input
                                    id={`gallery-before-upload-${index}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleGalleryImageUpload(e, index, 'beforeImage')}
                                    className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                                  />
                                </div>
                              </div>
                              {item.beforeImage && (
                                <div className="mt-2">
                                  <img 
                                    src={item.beforeImage} 
                                    alt="Before preview"
                                    className="w-20 h-20 object-cover rounded-lg border"
                                    onError={(e) => {
                                      e.currentTarget.src = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg';
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-4">
                              <Label className="text-sm font-medium">After Image</Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`gallery-after-url-${index}`} className="text-xs">Image URL</Label>
                                  <Input
                                    id={`gallery-after-url-${index}`}
                                    value={item.afterImage}
                                    onChange={(e) => {
                                      const newItems = [...sections.gallery.items];
                                      newItems[index] = { ...item, afterImage: e.target.value };
                                      setHomeContent({
                                        ...homeContent,
                                        sections: {
                                          ...sections,
                                          gallery: { ...sections.gallery, items: newItems }
                                        }
                                      });
                                    }}
                                    placeholder="https://images.pexels.com/..."
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`gallery-after-upload-${index}`} className="text-xs">Or Upload Image</Label>
                                  <input
                                    id={`gallery-after-upload-${index}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleGalleryImageUpload(e, index, 'afterImage')}
                                    className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                                  />
                                </div>
                              </div>
                              {item.afterImage && (
                                <div className="mt-2">
                                  <img 
                                    src={item.afterImage} 
                                    alt="After preview"
                                    className="w-20 h-20 object-cover rounded-lg border"
                                    onError={(e) => {
                                      e.currentTarget.src = 'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg';
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle>FAQ Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={sections.faq?.enabled === true}
                  onCheckedChange={(checked) => setHomeContent({
                    ...homeContent,
                    sections: {
                      ...sections,
                      faq: { ...sections.faq, enabled: checked }
                    }
                  })}
                />
                <Label>Show FAQ Section</Label>
              </div>

              {sections.faq?.enabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="faqTitle">Section Title</Label>
                      <Input
                        id="faqTitle"
                        value={sections?.faq?.title ?? 'Frequently Asked Questions'}
                        onChange={(e) => setHomeContent({
                          ...homeContent,
                          sections: {
                            ...sections,
                            faq: { ...sections.faq, title: e.target.value }
                          }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="faqSubtitle">Section Subtitle</Label>
                      <Input
                        id="faqSubtitle"
                        value={sections?.faq?.subtitle ?? 'Get answers to common questions'}
                        onChange={(e) => setHomeContent({
                          ...homeContent,
                          sections: {
                            ...sections,
                            faq: { ...sections.faq, subtitle: e.target.value }
                          }
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label>FAQ Items</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newItems = [
                            ...(sections.faq?.items || []),
                            { question: 'New Question?', answer: 'Answer to the question.' }
                          ];
                          setHomeContent({
                            ...homeContent,
                            sections: {
                              ...sections,
                              faq: { ...sections.faq, items: newItems }
                            }
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add FAQ
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {(sections.faq?.items || []).map((item: any, index: number) => (
                        <Card key={index} className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">FAQ {index + 1}</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newItems = sections.faq.items.filter((_: any, i: number) => i !== index);
                                  setHomeContent({
                                    ...homeContent,
                                    sections: {
                                      ...sections,
                                      faq: { ...sections.faq, items: newItems }
                                    }
                                  });
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div>
                              <Label htmlFor={`faq-question-${index}`}>Question</Label>
                              <Input
                                id={`faq-question-${index}`}
                                value={item.question}
                                onChange={(e) => {
                                  const newItems = [...sections.faq.items];
                                  newItems[index] = { ...item, question: e.target.value };
                                  setHomeContent({
                                    ...homeContent,
                                    sections: {
                                      ...sections,
                                      faq: { ...sections.faq, items: newItems }
                                    }
                                  });
                                }}
                                placeholder="What is your question?"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
                              <Textarea
                                id={`faq-answer-${index}`}
                                value={item.answer}
                                onChange={(e) => {
                                  const newItems = [...sections.faq.items];
                                  newItems[index] = { ...item, answer: e.target.value };
                                  setHomeContent({
                                    ...homeContent,
                                    sections: {
                                      ...sections,
                                      faq: { ...sections.faq, items: newItems }
                                    }
                                  });
                                }}
                                placeholder="Answer to the question..."
                                rows={3}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Order Tab */}
        <TabsContent value="order" className="space-y-6">
          {/* Section Backgrounds */}
          <Card>
            <CardHeader>
              <CardTitle>Section Background Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Customize the background color for each section. Text colors will automatically adjust for readability.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="servicesBackground">Services Section</Label>
                  <select
                    id="servicesBackground"
                    value={homeContent.sections?.services?.background || 'white'}
                    onChange={(e) => setHomeContent({
                      ...homeContent,
                      sections: {
                        ...homeContent.sections,
                        services: {
                          ...homeContent.sections?.services,
                          background: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                  >
                    <option value="white">White</option>
                    <option value="gray">Light Gray</option>
                    <option value="primary-light">Primary Light</option>
                    <option value="secondary-light">Secondary Light</option>
                    <option value="accent-light">Accent Light</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="whyChooseUsBackground">Why Choose Us Section</Label>
                  <select
                    id="whyChooseUsBackground"
                    value={homeContent.sections?.whyChooseUs?.background || 'gray'}
                    onChange={(e) => setHomeContent({
                      ...homeContent,
                      sections: {
                        ...homeContent.sections,
                        whyChooseUs: {
                          ...homeContent.sections?.whyChooseUs,
                          background: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                  >
                    <option value="white">White</option>
                    <option value="gray">Light Gray</option>
                    <option value="primary-light">Primary Light</option>
                    <option value="secondary-light">Secondary Light</option>
                    <option value="accent-light">Accent Light</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="testimonialsBackground">Testimonials Section</Label>
                  <select
                    id="testimonialsBackground"
                    value={homeContent.sections?.testimonials?.background || 'primary-light'}
                    onChange={(e) => setHomeContent({
                      ...homeContent,
                      sections: {
                        ...homeContent.sections,
                        testimonials: {
                          ...homeContent.sections?.testimonials,
                          background: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                  >
                    <option value="white">White</option>
                    <option value="gray">Light Gray</option>
                    <option value="primary-light">Primary Light</option>
                    <option value="secondary-light">Secondary Light</option>
                    <option value="accent-light">Accent Light</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="pricingBackground">Pricing Section</Label>
                  <select
                    id="pricingBackground"
                    value={homeContent.sections?.pricing?.background || 'white'}
                    onChange={(e) => setHomeContent({
                      ...homeContent,
                      sections: {
                        ...homeContent.sections,
                        pricing: {
                          ...homeContent.sections?.pricing,
                          background: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                  >
                    <option value="white">White</option>
                    <option value="gray">Light Gray</option>
                    <option value="primary-light">Primary Light</option>
                    <option value="secondary-light">Secondary Light</option>
                    <option value="accent-light">Accent Light</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="galleryBackground">Gallery Section</Label>
                  <select
                    id="galleryBackground"
                    value={homeContent.sections?.gallery?.background || 'gray'}
                    onChange={(e) => setHomeContent({
                      ...homeContent,
                      sections: {
                        ...homeContent.sections,
                        gallery: {
                          ...homeContent.sections?.gallery,
                          background: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                  >
                    <option value="white">White</option>
                    <option value="gray">Light Gray</option>
                    <option value="primary-light">Primary Light</option>
                    <option value="secondary-light">Secondary Light</option>
                    <option value="accent-light">Accent Light</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="faqBackground">FAQ Section</Label>
                  <select
                    id="faqBackground"
                    value={homeContent.sections?.faq?.background || 'white'}
                    onChange={(e) => setHomeContent({
                      ...homeContent,
                      sections: {
                        ...homeContent.sections,
                        faq: {
                          ...homeContent.sections?.faq,
                          background: e.target.value
                        }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                  >
                    <option value="white">White</option>
                    <option value="gray">Light Gray</option>
                    <option value="primary-light">Primary Light</option>
                    <option value="secondary-light">Secondary Light</option>
                    <option value="accent-light">Accent Light</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Section Order & Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm mb-4">
                Drag sections to reorder them on the home page. Use the toggle to enable/disable sections.
              </p>
              
              <div className="space-y-3">
                {sectionOrder.map((sectionKey: string, index: number) => {
                  const section = sections[sectionKey];
                  const isEnabled = section?.enabled !== false;
                  
                  return (
                    <Card 
                      key={sectionKey}
                      className="cursor-move"
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <GripVertical className="h-5 w-5 text-gray-400" />
                            <span className="font-medium">{sectionLabels[sectionKey as keyof typeof sectionLabels]}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={isEnabled}
                              onCheckedChange={(checked) => setHomeContent({
                                ...homeContent,
                                sections: {
                                  ...sections,
                                  [sectionKey]: { ...section, enabled: checked }
                                }
                              })}
                            />
                            <Label className="text-sm">Enabled</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={onSave}>
        Save Home Page
      </Button>
    </div>
  );
}