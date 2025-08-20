'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Wrench, Zap, Thermometer, Hammer, Settings, Wifi, Shield, PenTool as Tool, Home, Car, Paintbrush, Scissors, GripVertical, Trash2, ChevronDown, ChevronRight, Droplets, Wind, Lightbulb, Drill, HardDrive, Gauge, Flame, Snowflake, Lock, Key, Camera, Antenna, Router, Battery, Plug, Cable, Cpu, Monitor, Smartphone, Tablet, Laptop, Tv, Speaker, Headphones, Microscope as Microphone, Search, Filter, Plus, Minus, X, Check, AlertTriangle, Info, HelpCircle, Star, Heart, Bookmark, Flag, Tag, Calendar, Clock, Timer, Watch as Stopwatch, MapPin, Navigation, Compass, Globe, Map, Plane, Train, Bus, Bike, Truck, Package, Box, Archive, Folder, File, FileText, Image, Video, Music, Download, Upload, Share, Send, Mail, Phone, MessageSquare, Bell, User, Users, UserPlus, UserMinus, UserCheck, UserX, Crown, Award, TrendingUp, TrendingDown, BarChart, PieChart, Activity, Sun, Moon, Cloud, CloudRain, CloudSnow, Umbrella, Rainbow } from 'lucide-react';

interface ServicesManagerProps {
  onSave: (type: string, data: any) => void;
  isLoading: boolean;
}

const iconOptions = [
  // Home Services
  { value: 'wrench', label: 'Wrench', icon: Wrench, category: 'Tools' },
  { value: 'hammer', label: 'Hammer', icon: Hammer, category: 'Tools' },
  { value: 'screwdriver', label: 'Screwdriver', icon: HardDrive, category: 'Tools' },
  { value: 'drill', label: 'Drill', icon: Drill, category: 'Tools' },
  { value: 'tool', label: 'Tool', icon: Tool, category: 'Tools' },
  
  // Electrical
  { value: 'zap', label: 'Lightning', icon: Zap, category: 'Electrical' },
  { value: 'lightbulb', label: 'Light Bulb', icon: Lightbulb, category: 'Electrical' },
  { value: 'plug', label: 'Plug', icon: Plug, category: 'Electrical' },
  { value: 'cable', label: 'Cable', icon: Cable, category: 'Electrical' },
  { value: 'battery', label: 'Battery', icon: Battery, category: 'Electrical' },
  
  // HVAC & Plumbing
  { value: 'thermometer', label: 'Thermometer', icon: Thermometer, category: 'HVAC' },
  { value: 'flame', label: 'Flame', icon: Flame, category: 'HVAC' },
  { value: 'snowflake', label: 'Snowflake', icon: Snowflake, category: 'HVAC' },
  { value: 'wind', label: 'Wind', icon: Wind, category: 'HVAC' },
  { value: 'droplets', label: 'Droplets', icon: Droplets, category: 'Plumbing' },
  { value: 'gauge', label: 'Gauge', icon: Gauge, category: 'HVAC' },
  
  // Security & Access
  { value: 'lock', label: 'Lock', icon: Lock, category: 'Security' },
  { value: 'key', label: 'Key', icon: Key, category: 'Security' },
  { value: 'shield', label: 'Shield', icon: Shield, category: 'Security' },
  { value: 'camera', label: 'Camera', icon: Camera, category: 'Security' },
  
  // Technology
  { value: 'wifi', label: 'Wifi', icon: Wifi, category: 'Technology' },
  { value: 'router', label: 'Router', icon: Router, category: 'Technology' },
  { value: 'antenna', label: 'Antenna', icon: Antenna, category: 'Technology' },
  { value: 'cpu', label: 'CPU', icon: Cpu, category: 'Technology' },
  { value: 'monitor', label: 'Monitor', icon: Monitor, category: 'Technology' },
  { value: 'smartphone', label: 'Smartphone', icon: Smartphone, category: 'Technology' },
  
  // General
  { value: 'home', label: 'Home', icon: Home, category: 'General' },
  { value: 'settings', label: 'Settings', icon: Settings, category: 'General' },
  { value: 'car', label: 'Car', icon: Car, category: 'Automotive' },
  { value: 'paintbrush', label: 'Paintbrush', icon: Paintbrush, category: 'Painting' },
  { value: 'scissors', label: 'Scissors', icon: Scissors, category: 'General' },
];

export default function ServicesManager({ onSave, isLoading }: ServicesManagerProps) {
  const [servicesConfig, setServicesConfig] = useState({
    pageType: 'single',
    title: 'Our Services',
    subtitle: 'Professional home services delivered with expertise and care',
    displayType: 'icons',
    services: []
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [expandedServices, setExpandedServices] = useState<Set<number>>(new Set());
  const [iconSearch, setIconSearch] = useState('');

  useEffect(() => {
    loadServicesConfig();
  }, []);

  const loadServicesConfig = async () => {
    try {
      const response = await fetch('/api/admin/content?type=services');
      if (response.ok) {
        const data = await response.json();
        setServicesConfig(data);
        // Expand first service by default if there are services
        if (data.services && data.services.length > 0) {
          setExpandedServices(new Set([0]));
        }
      }
    } catch (error) {
      console.error('Failed to load services config:', error);
    }
  };

  const handleSave = () => {
    onSave('services', servicesConfig);
  };

  const addService = () => {
    const newService = {
      title: 'New Service',
      description: 'Service description',
      icon: 'wrench',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      slug: 'new-service',
      benefits: [
        {
          title: 'Licensed & Insured',
          description: 'All our technicians are fully licensed and insured for your protection.'
        },
        {
          title: '24/7 Emergency Service',
          description: 'Emergency service available around the clock.'
        },
        {
          title: 'Satisfaction Guarantee',
          description: '100% satisfaction guarantee on all work.'
        },
        {
          title: 'Free Estimates',
          description: 'Get a detailed, no-obligation estimate for your project.'
        }
      ]
    };
    const newServices = [...servicesConfig.services, newService];
    setServicesConfig({
      ...servicesConfig,
      services: newServices
    });
    // Expand the newly added service
    setExpandedServices(new Set([...expandedServices, newServices.length - 1]));
  };

  const removeService = (index: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const newServices = servicesConfig.services.filter((_, i) => i !== index);
      setServicesConfig({
        ...servicesConfig,
        services: newServices
      });
      // Update expanded services indices
      const newExpanded = new Set<number>();
      expandedServices.forEach(i => {
        if (i < index) newExpanded.add(i);
        else if (i > index) newExpanded.add(i - 1);
      });
      setExpandedServices(newExpanded);
    }
  };

  const updateService = (index: number, field: string, value: any) => {
    const newServices = [...servicesConfig.services];
    newServices[index] = { ...newServices[index], [field]: value };
    
    // Auto-generate slug from title
    if (field === 'title') {
      newServices[index].slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    setServicesConfig({
      ...servicesConfig,
      services: newServices
    });
  };

  const moveService = (fromIndex: number, toIndex: number) => {
    const newServices = [...servicesConfig.services];
    const [movedService] = newServices.splice(fromIndex, 1);
    newServices.splice(toIndex, 0, movedService);
    setServicesConfig({
      ...servicesConfig,
      services: newServices
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
      moveService(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedServices(newExpanded);
  };

  const filteredIcons = iconOptions.filter(icon => 
    icon.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
    icon.category.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const groupedIcons = filteredIcons.reduce((acc, icon) => {
    if (!acc[icon.category]) acc[icon.category] = [];
    acc[icon.category].push(icon);
    return acc;
  }, {} as Record<string, typeof iconOptions>);

  if (isLoading) {
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
      {/* Page Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Services Page Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="pageType">Page Structure</Label>
            <select
              id="pageType"
              value={servicesConfig.pageType}
              onChange={(e) => setServicesConfig({
                ...servicesConfig,
                pageType: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-2"
            >
              <option value="single">Single Services Page</option>
              <option value="multiple">Individual Service Pages</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">
              {servicesConfig.pageType === 'single' 
                ? 'All services displayed on one page (/services). Header "Services" link goes directly to this page.'
                : 'Each service gets its own page (/services/service-name). Header "Services" link becomes a dropdown menu automatically.'
              }
            </p>
          </div>

          {(servicesConfig.pageType === 'single' || servicesConfig.showAllServicesPage !== false) && (
            <>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="showAllServicesPage"
                  checked={servicesConfig.showAllServicesPage !== false}
                  onChange={(e) => setServicesConfig({
                    ...servicesConfig,
                    showAllServicesPage: e.target.checked
                  })}
                  className="w-4 h-4 text-primary"
                />
                <Label htmlFor="showAllServicesPage">Show "All Services" link in dropdown menu</Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="servicesPageTitle">Services Page Title</Label>
                  <Input
                    id="servicesPageTitle"
                    value={servicesConfig.title}
                    onChange={(e) => setServicesConfig({
                      ...servicesConfig,
                      title: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="servicesPageSubtitle">Services Page Subtitle</Label>
                  <Input
                    id="servicesPageSubtitle"
                    value={servicesConfig.subtitle}
                    onChange={(e) => setServicesConfig({
                      ...servicesConfig,
                      subtitle: e.target.value
                    })}
                  />
                </div>
              </div>
            </>
          )}
          
          {servicesConfig.pageType === 'multiple' && servicesConfig.showAllServicesPage === false && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showAllServicesPageMultiple"
                checked={servicesConfig.showAllServicesPage !== false}
                onChange={(e) => setServicesConfig({
                  ...servicesConfig,
                  showAllServicesPage: e.target.checked
                })}
                className="w-4 h-4 text-primary"
              />
              <Label htmlFor="showAllServicesPageMultiple">Show "All Services" link in dropdown menu</Label>
            </div>
          )}

          {/* Hero CTA Configuration */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Hero Section CTA Buttons</Label>
            <p className="text-sm text-gray-500">Configure the call-to-action buttons in the hero section</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary CTA */}
              <div>
                <Label className="text-sm font-medium">Primary Button</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="primaryCtaEnabled"
                      checked={servicesConfig.heroCta?.primary?.enabled !== false}
                      onChange={(e) => setServicesConfig({
                        ...servicesConfig,
                        heroCta: {
                          ...servicesConfig.heroCta,
                          primary: {
                            ...servicesConfig.heroCta?.primary,
                            enabled: e.target.checked
                          }
                        }
                      })}
                      className="w-4 h-4 text-primary"
                    />
                    <Label htmlFor="primaryCtaEnabled" className="text-sm">Enable primary button</Label>
                  </div>
                  
                  {servicesConfig.heroCta?.primary?.enabled !== false && (
                    <>
                      <div>
                        <Label htmlFor="primaryCtaText" className="text-xs">Button Text</Label>
                        <Input
                          id="primaryCtaText"
                          value={servicesConfig.heroCta?.primary?.text || 'Get Free Quote'}
                          onChange={(e) => setServicesConfig({
                            ...servicesConfig,
                            heroCta: {
                              ...servicesConfig.heroCta,
                              primary: {
                                ...servicesConfig.heroCta?.primary,
                                text: e.target.value
                              }
                            }
                          })}
                          placeholder="Get Free Quote"
                        />
                      </div>
                      <div>
                        <Label htmlFor="primaryCtaLink" className="text-xs">Button Link</Label>
                        <Input
                          id="primaryCtaLink"
                          value={servicesConfig.heroCta?.primary?.link || '/contact'}
                          onChange={(e) => setServicesConfig({
                            ...servicesConfig,
                            heroCta: {
                              ...servicesConfig.heroCta,
                              primary: {
                                ...servicesConfig.heroCta?.primary,
                                link: e.target.value
                              }
                            }
                          })}
                          placeholder="/contact"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Secondary CTA */}
              <div>
                <Label className="text-sm font-medium">Secondary Button</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="secondaryCtaEnabled"
                      checked={servicesConfig.heroCta?.secondary?.enabled !== false}
                      onChange={(e) => setServicesConfig({
                        ...servicesConfig,
                        heroCta: {
                          ...servicesConfig.heroCta,
                          secondary: {
                            ...servicesConfig.heroCta?.secondary,
                            enabled: e.target.checked
                          }
                        }
                      })}
                      className="w-4 h-4 text-primary"
                    />
                    <Label htmlFor="secondaryCtaEnabled" className="text-sm">Enable secondary button</Label>
                  </div>
                  
                  {servicesConfig.heroCta?.secondary?.enabled !== false && (
                    <>
                      <div>
                        <Label htmlFor="secondaryCtaText" className="text-xs">Button Text</Label>
                        <Input
                          id="secondaryCtaText"
                          value={servicesConfig.heroCta?.secondary?.text || 'Contact Us'}
                          onChange={(e) => setServicesConfig({
                            ...servicesConfig,
                            heroCta: {
                              ...servicesConfig.heroCta,
                              secondary: {
                                ...servicesConfig.heroCta?.secondary,
                                text: e.target.value
                              }
                            }
                          })}
                          placeholder="Contact Us"
                        />
                      </div>
                      <div>
                        <Label htmlFor="secondaryCtaLink" className="text-xs">Button Link</Label>
                        <Input
                          id="secondaryCtaLink"
                          value={servicesConfig.heroCta?.secondary?.link || '/contact'}
                          onChange={(e) => setServicesConfig({
                            ...servicesConfig,
                            heroCta: {
                              ...servicesConfig.heroCta,
                              secondary: {
                                ...servicesConfig.heroCta?.secondary,
                                link: e.target.value
                              }
                            }
                          })}
                          placeholder="/contact"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="displayType">Display Style</Label>
            <select
              id="displayType"
              value={servicesConfig.displayType}
              onChange={(e) => setServicesConfig({
                ...servicesConfig,
                displayType: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-2"
            >
              <option value="icons">Icons</option>
              <option value="images">Images</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Services ({servicesConfig.services.length})</CardTitle>
            <Button onClick={addService}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {servicesConfig.services.map((service: any, index: number) => (
              <Card key={index} className="relative">
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <div
                      className="w-full"
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <CardContent className="p-4 cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <GripVertical className="h-5 w-5 text-gray-400" />
                            <div className="flex items-center space-x-3">
                              {servicesConfig.displayType === 'icons' ? (
                                (() => {
                                  const iconOption = iconOptions.find(opt => opt.value === service.icon);
                                  const IconComponent = iconOption?.icon || Wrench;
                                  return <IconComponent className="h-6 w-6 text-primary" />;
                                })()
                              ) : (
                                <img 
                                  src={service.image} 
                                  alt={service.title}
                                  className="w-8 h-8 object-cover rounded"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg';
                                  }}
                                />
                              )}
                              <div>
                                <h4 className="font-medium">{service.title}</h4>
                                <p className="text-sm text-gray-500 truncate max-w-md">{service.description}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{service.slug}</Badge>
                            {expandedServices.has(index) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="px-4 pb-4 pt-0 border-t bg-gray-50/50">
                      <div className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`service-title-${index}`}>Service Title</Label>
                            <Input
                              id={`service-title-${index}`}
                              value={service.title}
                              onChange={(e) => updateService(index, 'title', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`service-slug-${index}`}>URL Slug</Label>
                            <Input
                              id={`service-slug-${index}`}
                              value={service.slug}
                              onChange={(e) => updateService(index, 'slug', e.target.value)}
                              placeholder="service-url-name"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor={`service-description-${index}`}>Description</Label>
                          <Textarea
                            id={`service-description-${index}`}
                            value={service.description}
                            onChange={(e) => updateService(index, 'description', e.target.value)}
                            rows={3}
                          />
                        </div>
                        
                        {servicesConfig.pageType === 'multiple' && (
                          <>
                            <div>
                              <Label htmlFor={`service-long-description-${index}`}>Long Description (for individual page)</Label>
                              <Textarea
                                id={`service-long-description-${index}`}
                                value={service.longDescription || ''}
                                onChange={(e) => updateService(index, 'longDescription', e.target.value)}
                                rows={5}
                                placeholder="Detailed description for the individual service page..."
                              />
                            </div>
                            
                            <div>
                              <Label>Hero Section Image Display</Label>
                              <div className="mt-2 space-y-2">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    id={`service-hero-none-${index}`}
                                    name={`service-hero-${index}`}
                                    checked={!service.showThumbnailInHero && !service.showContentInHero}
                                    onChange={() => {
                                      updateService(index, 'showThumbnailInHero', false);
                                      updateService(index, 'showContentInHero', false);
                                    }}
                                    className="w-4 h-4 text-primary"
                                  />
                                  <Label htmlFor={`service-hero-none-${index}`}>No image in hero section</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    id={`service-hero-thumbnail-${index}`}
                                    name={`service-hero-${index}`}
                                    checked={service.showThumbnailInHero === true}
                                    onChange={() => {
                                      updateService(index, 'showThumbnailInHero', true);
                                      updateService(index, 'showContentInHero', false);
                                    }}
                                    className="w-4 h-4 text-primary"
                                  />
                                  <Label htmlFor={`service-hero-thumbnail-${index}`}>Show thumbnail image in hero</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    id={`service-hero-content-${index}`}
                                    name={`service-hero-${index}`}
                                    checked={service.showContentInHero === true}
                                    onChange={() => {
                                      updateService(index, 'showThumbnailInHero', false);
                                      updateService(index, 'showContentInHero', true);
                                    }}
                                    className="w-4 h-4 text-primary"
                                  />
                                  <Label htmlFor={`service-hero-content-${index}`}>Show content image in hero</Label>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mt-2">
                                Choose which image to display in the hero section of individual service pages
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`service-show-other-services-${index}`}
                                checked={service.showOtherServices !== false}
                                onChange={(e) => updateService(index, 'showOtherServices', e.target.checked)}
                                className="w-4 h-4 text-primary"
                              />
                              <Label htmlFor={`service-show-other-services-${index}`}>Show other services section</Label>
                            </div>
                            
                            {/* Benefits Configuration */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label>Service Benefits</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newBenefits = [
                                      ...(service.benefits || []),
                                      { title: 'New Benefit', description: 'Benefit description' }
                                    ];
                                    updateService(index, 'benefits', newBenefits);
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Benefit
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {(service.benefits || []).map((benefit: any, benefitIndex: number) => (
                                  <Card key={benefitIndex} className="p-4">
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium">Benefit {benefitIndex + 1}</Label>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            const newBenefits = service.benefits.filter((_: any, i: number) => i !== benefitIndex);
                                            updateService(index, 'benefits', newBenefits);
                                          }}
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      <div className="space-y-2">
                                        <div>
                                          <Label htmlFor={`benefit-title-${index}-${benefitIndex}`} className="text-xs">Title</Label>
                                          <Input
                                            id={`benefit-title-${index}-${benefitIndex}`}
                                            value={benefit.title}
                                            onChange={(e) => {
                                              const newBenefits = [...service.benefits];
                                              newBenefits[benefitIndex] = { ...benefit, title: e.target.value };
                                              updateService(index, 'benefits', newBenefits);
                                            }}
                                            placeholder="Benefit title"
                                            className="text-sm"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor={`benefit-description-${index}-${benefitIndex}`} className="text-xs">Description</Label>
                                          <Textarea
                                            id={`benefit-description-${index}-${benefitIndex}`}
                                            value={benefit.description}
                                            onChange={(e) => {
                                              const newBenefits = [...service.benefits];
                                              newBenefits[benefitIndex] = { ...benefit, description: e.target.value };
                                              updateService(index, 'benefits', newBenefits);
                                            }}
                                            placeholder="Benefit description"
                                            rows={2}
                                            className="text-sm"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                              
                              {(!service.benefits || service.benefits.length === 0) && (
                                <p className="text-sm text-gray-500 italic">
                                  No custom benefits configured. Default benefits will be used.
                                </p>
                              )}
                            </div>
                          </>
                        )}
                        
                        {servicesConfig.displayType === 'icons' ? (
                          <div>
                            <Label htmlFor={`service-icon-${index}`}>Icon</Label>
                            <div className="mt-2">
                              <Input
                                placeholder="Search icons..."
                                value={iconSearch}
                                onChange={(e) => setIconSearch(e.target.value)}
                                className="mb-4"
                              />
                              <div className="max-h-64 overflow-y-auto border rounded-lg p-4 bg-white">
                                {Object.entries(groupedIcons).map(([category, icons]) => (
                                  <div key={category} className="mb-4">
                                    <h5 className="text-sm font-semibold text-gray-700 mb-2">{category}</h5>
                                    <div className="grid grid-cols-6 gap-2">
                                      {icons.map((iconOption) => {
                                        const IconComponent = iconOption.icon;
                                        return (
                                          <button
                                            key={iconOption.value}
                                            type="button"
                                            onClick={() => updateService(index, 'icon', iconOption.value)}
                                            className={`p-3 rounded-lg border-2 transition-all ${
                                              service.icon === iconOption.value
                                                ? 'border-primary bg-primary/10'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            title={iconOption.label}
                                          >
                                            <IconComponent className="h-5 w-5 mx-auto" />
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <Label>Service Thumbnail Image</Label>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-4">
                                {/* Current Image Preview */}
                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                  <img 
                                    src={service.image} 
                                    alt={service.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg';
                                    }}
                                  />
                                </div>
                                
                                {/* Upload Button */}
                                <div className="flex-1">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        try {
                                          const formData = new FormData();
                                          formData.append('file', file);
                                          formData.append('type', 'service');

                                          const response = await fetch('/api/admin/upload', {
                                            method: 'POST',
                                            body: formData,
                                          });

                                          if (response.ok) {
                                            const result = await response.json();
                                            updateService(index, 'image', result.path);
                                          } else {
                                            alert('Failed to upload image');
                                          }
                                        } catch (error) {
                                          console.error('Error uploading image:', error);
                                          alert('Failed to upload image');
                                        }
                                      }
                                    }}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    Upload service thumbnail image
                                  </p>
                                </div>
                              </div>
                              
                              {/* Manual URL Input */}
                              <div>
                                <Label htmlFor={`service-image-url-${index}`}>Or Enter Image URL</Label>
                                <Input
                                  id={`service-image-url-${index}`}
                                  value={service.image}
                                  onChange={(e) => updateService(index, 'image', e.target.value)}
                                  placeholder="https://images.pexels.com/..."
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Content Image for Individual Service Pages */}
                        {servicesConfig.pageType === 'multiple' && (
                          <div>
                            <Label>Content Image (for individual service page)</Label>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-4">
                                {/* Current Image Preview */}
                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                  <img 
                                    src={service.contentImage || service.image} 
                                    alt={`${service.title} content`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg';
                                    }}
                                  />
                                </div>
                                
                                {/* Upload Button */}
                                <div className="flex-1">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        try {
                                          const formData = new FormData();
                                          formData.append('file', file);
                                          formData.append('type', 'service-content');

                                          const response = await fetch('/api/admin/upload', {
                                            method: 'POST',
                                            body: formData,
                                          });

                                          if (response.ok) {
                                            const result = await response.json();
                                            updateService(index, 'contentImage', result.path);
                                          } else {
                                            alert('Failed to upload image');
                                          }
                                        } catch (error) {
                                          console.error('Error uploading image:', error);
                                          alert('Failed to upload image');
                                        }
                                      }
                                    }}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    Upload content image for service page
                                  </p>
                                </div>
                              </div>
                              
                              {/* Manual URL Input */}
                              <div>
                                <Label htmlFor={`service-content-image-url-${index}`}>Or Enter Content Image URL</Label>
                                <Input
                                  id={`service-content-image-url-${index}`}
                                  value={service.contentImage || ''}
                                  onChange={(e) => updateService(index, 'contentImage', e.target.value)}
                                  placeholder="https://images.pexels.com/..."
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeService(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Service
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}