'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Trash2, Plus, GripVertical, ChevronDown, ChevronRight, DollarSign, Clock, Award, Users, Star, Heart, ThumbsUp, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PlanManagerProps {
  onSave: (type: string, data: any) => void;
  isLoading: boolean;
}

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
    cta: {
      primary: {
        enabled: boolean;
        text: string;
        link: string;
        color: string;
        textColor: string;
      };
      secondary: {
        enabled: boolean;
        text: string;
        link: string;
        color: string;
        textColor: string;
      };
    };
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

export default function PlanManager({ onSave, isLoading }: PlanManagerProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [expandedBenefits, setExpandedBenefits] = useState<Set<number>>(new Set());
  const [expandedGuarantees, setExpandedGuarantees] = useState<Set<number>>(new Set());
  const [draggedStepIndex, setDraggedStepIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  
  const [planContent, setPlanContent] = useState<PlanContent>({
    hero: {
      title: "Our Service Plan",
      subtitle: "Comprehensive solutions tailored to your needs",
      image: "",
      videoUrl: "",
      useVideo: false,
      cta: {
        primary: {
          enabled: true,
          text: "Get Free Quote",
          link: "/contact",
          color: "primary",
          textColor: "white"
        },
        secondary: {
          enabled: true,
          text: "Contact Us",
          link: "/contact", 
          color: "outline",
          textColor: "primary"
        }
      }
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
  });

  useEffect(() => {
    loadPlanContent();
  }, []);

  const loadPlanContent = async () => {
    try {
      const response = await fetch('/api/admin/content?type=plan');
      if (response.ok) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setPlanContent(data);
        }
      }
    } catch (error) {
      console.error('Failed to load plan content:', error);
    }
  };

  const handleSave = async () => {
    try {
      console.log('Saving plan content:', planContent);
      await onSave('plan', planContent);
    } catch (error) {
      console.error('Failed to save plan content:', error);
      alert('Failed to save plan content. Check console for details.');
    }
  };

  // Image upload handler
  const handleImageUpload = async (file: File, fieldType: 'hero' | 'process') => {
    if (!file) return;

    setIsUploading(fieldType);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (fieldType === 'hero') {
          updateHeroField('image', result.path);
        } else if (fieldType === 'process') {
          updateProcessField('image', result.path);
        }
        alert('Image uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(null);
    }
  };

  // Hero Section Handlers
  const updateHeroField = (field: keyof PlanContent['hero'], value: any) => {
    setPlanContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value
      }
    }));
  };

  const updateHeroCta = (type: 'primary' | 'secondary', field: string, value: any) => {
    setPlanContent(prev => {
      // Default CTA structure if it doesn't exist
      const defaultCta = {
        primary: {
          enabled: true,
          text: "Get Free Quote",
          link: "/contact",
          color: "primary",
          textColor: "white"
        },
        secondary: {
          enabled: true,
          text: "Contact Us",
          link: "/contact", 
          color: "outline",
          textColor: "primary"
        }
      };
      
      const currentCta = prev.hero.cta || defaultCta;
      const currentTypeData = currentCta[type] || defaultCta[type];
      
      return {
        ...prev,
        hero: {
          ...prev.hero,
          cta: {
            ...currentCta,
            [type]: {
              ...currentTypeData,
              [field]: value
            }
          }
        }
      };
    });
  };

  // Process Section Handlers
  const updateProcessField = (field: keyof PlanContent['process'], value: any) => {
    setPlanContent(prev => ({
      ...prev,
      process: {
        ...prev.process,
        [field]: value
      }
    }));
  };

  const addStep = () => {
    const newStep: PlanStep = {
      step: planContent.process.steps.length + 1,
      title: "",
      description: ""
    };

    setPlanContent(prev => ({
      ...prev,
      process: {
        ...prev.process,
        steps: [...prev.process.steps, newStep]
      }
    }));
  };

  const removeStep = (index: number) => {
    setPlanContent(prev => ({
      ...prev,
      process: {
        ...prev.process,
        steps: prev.process.steps.filter((_, i) => i !== index).map((step, i) => ({
          ...step,
          step: i + 1
        }))
      }
    }));
  };

  const updateStep = (index: number, field: keyof PlanStep, value: any) => {
    setPlanContent(prev => {
      const newSteps = [...prev.process.steps];
      if (newSteps[index]) {
        newSteps[index] = { ...newSteps[index], [field]: value };
      }
      
      return {
        ...prev,
        process: {
          ...prev.process,
          steps: newSteps
        }
      };
    });
  };

  // Benefits Section Handlers
  const updateBenefitsField = (field: keyof PlanContent['benefits'], value: any) => {
    setPlanContent(prev => ({
      ...prev,
      benefits: {
        ...prev.benefits,
        [field]: value
      }
    }));
  };

  const addBenefit = () => {
    const newBenefit: Benefit = {
      title: "",
      description: "",
      icon: "check"
    };

    setPlanContent(prev => ({
      ...prev,
      benefits: {
        ...prev.benefits,
        items: [...prev.benefits.items, newBenefit]
      }
    }));
  };

  const removeBenefit = (index: number) => {
    setPlanContent(prev => ({
      ...prev,
      benefits: {
        ...prev.benefits,
        items: prev.benefits.items.filter((_, i) => i !== index)
      }
    }));
  };

  const updateBenefit = (index: number, field: keyof Benefit, value: any) => {
    setPlanContent(prev => {
      const newItems = [...prev.benefits.items];
      if (newItems[index]) {
        newItems[index] = { ...newItems[index], [field]: value };
      }
      
      return {
        ...prev,
        benefits: {
          ...prev.benefits,
          items: newItems
        }
      };
    });
  };

  // Guarantee Section Handlers
  const updateGuaranteeField = (field: keyof PlanContent['guarantee'], value: any) => {
    setPlanContent(prev => ({
      ...prev,
      guarantee: {
        ...prev.guarantee,
        [field]: value
      }
    }));
  };

  const addGuaranteeItem = () => {
    const newItem: GuaranteeItem = {
      title: "",
      description: ""
    };

    setPlanContent(prev => ({
      ...prev,
      guarantee: {
        ...prev.guarantee,
        items: [...prev.guarantee.items, newItem]
      }
    }));
  };

  const removeGuaranteeItem = (index: number) => {
    setPlanContent(prev => ({
      ...prev,
      guarantee: {
        ...prev.guarantee,
        items: prev.guarantee.items.filter((_, i) => i !== index)
      }
    }));
  };

  const updateGuaranteeItem = (index: number, field: keyof GuaranteeItem, value: any) => {
    setPlanContent(prev => {
      const newItems = [...prev.guarantee.items];
      if (newItems[index]) {
        newItems[index] = { ...newItems[index], [field]: value };
      }
      
      return {
        ...prev,
        guarantee: {
          ...prev.guarantee,
          items: newItems
        }
      };
    });
  };

  // CTA Section Handlers - removed since using CtaBanner component

 // Pricing Section Handlers
const updatePricingField = (field: keyof PlanContent['pricing'], value: any) => {
  setPlanContent(prev => ({
    ...prev,
    pricing: {
      ...prev.pricing,
      [field]: value
    }
  }));
};

const addPricingPlan = () => {
  const newPlan = {
    name: 'New Plan',
    price: '$99',
    period: 'per visit',
    description: 'Plan description',
    features: '',      // store as raw string while editing
    exclusions: '',    // same here
    popular: false
  };

  setPlanContent(prev => ({
    ...prev,
    pricing: {
      ...prev.pricing,
      plans: [...(prev.pricing?.plans || []), newPlan]
    }
  }));
};

const removePricingPlan = (index: number) => {
  setPlanContent(prev => ({
    ...prev,
    pricing: {
      ...prev.pricing,
      plans: (prev.pricing?.plans || []).filter((_, i) => i !== index)
    }
  }));
};

const updatePricingPlan = (index: number, field: string, value: any) => {
  setPlanContent(prev => {
    const newPlans = [...(prev.pricing?.plans || [])];
    if (newPlans[index]) {
      newPlans[index] = { ...newPlans[index], [field]: value };
    }

    return {
      ...prev,
      pricing: {
        ...prev.pricing,
        plans: newPlans
      }
    };
  });
};
  // Section Order Handlers
  const updateSectionOrder = (newOrder: string[]) => {
    setPlanContent(prev => ({
      ...prev,
      sectionOrder: newOrder
    }));
  };

  const toggleExpandedStep = (index: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSteps(newExpanded);
  };

  const toggleExpandedBenefit = (index: number) => {
    const newExpanded = new Set(expandedBenefits);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedBenefits(newExpanded);
  };

  const toggleExpandedGuarantee = (index: number) => {
    const newExpanded = new Set(expandedGuarantees);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedGuarantees(newExpanded);
  };

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
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="heroTitle">Page Title</Label>
              <Input
                id="heroTitle"
                value={planContent.hero.title}
                onChange={(e) => updateHeroField('title', e.target.value)}
                placeholder="Our Service Plan"
              />
            </div>
            <div>
              <Label htmlFor="heroSubtitle">Subtitle</Label>
              <Input
                id="heroSubtitle"
                value={planContent.hero.subtitle}
                onChange={(e) => updateHeroField('subtitle', e.target.value)}
                placeholder="Comprehensive solutions tailored to your needs"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="useVideo"
                checked={planContent.hero.useVideo}
                onCheckedChange={(checked) => updateHeroField('useVideo', checked)}
              />
              <Label htmlFor="useVideo">Use Video Instead of Image</Label>
            </div>

            {planContent.hero.useVideo ? (
              <div>
                <Label htmlFor="videoUrl">Video URL (YouTube, Vimeo, etc.)</Label>
                <Input
                  id="videoUrl"
                  value={planContent.hero.videoUrl}
                  onChange={(e) => updateHeroField('videoUrl', e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use embed URLs for best results
                </p>
              </div>
            ) : (
              <div>
                <Label htmlFor="heroImage">Hero Image</Label>
                <div className="space-y-3">
                  <Input
                    id="heroImage"
                    value={planContent.hero.image}
                    onChange={(e) => updateHeroField('image', e.target.value)}
                    placeholder="/uploads/plan-hero.jpg"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'hero');
                      }}
                      className="hidden"
                      id="heroImageUpload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('heroImageUpload')?.click()}
                      disabled={isUploading === 'hero'}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading === 'hero' ? 'Uploading...' : 'Upload Image'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hero CTA Configuration */}
          <div className="space-y-6">
            <Label className="text-base font-semibold">Call to Action Buttons</Label>
            
            {/* Primary CTA */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Primary Button</CardTitle>
                  <Switch
                    checked={planContent.hero.cta?.primary?.enabled || false}
                    onCheckedChange={(checked) => updateHeroCta('primary', 'enabled', checked)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryText">Button Text</Label>
                    <Input
                      id="primaryText"
                      value={planContent.hero.cta?.primary?.text || ''}
                      onChange={(e) => updateHeroCta('primary', 'text', e.target.value)}
                      disabled={!planContent.hero.cta?.primary?.enabled}
                    />
                  </div>
                  <div>
                    <Label htmlFor="primaryLink">Button Link</Label>
                    <Input
                      id="primaryLink"
                      value={planContent.hero.cta?.primary?.link || ''}
                      onChange={(e) => updateHeroCta('primary', 'link', e.target.value)}
                      placeholder="/contact"
                      disabled={!planContent.hero.cta?.primary?.enabled}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Button Color</Label>
                    <Select
                      value={planContent.hero.cta?.primary?.color || 'primary'}
                      onValueChange={(value) => updateHeroCta('primary', 'color', value)}
                      disabled={!planContent.hero.cta?.primary?.enabled}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="accent">Accent</SelectItem>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="primaryTextColor">Text Color</Label>
                    <Select
                      value={planContent.hero.cta?.primary?.textColor || 'white'}
                      onValueChange={(value) => updateHeroCta('primary', 'textColor', value)}
                      disabled={!planContent.hero.cta?.primary?.enabled}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
              </CardContent>
            </Card>

            {/* Secondary CTA */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Secondary Button</CardTitle>
                  <Switch
                    checked={planContent.hero.cta?.secondary?.enabled || false}
                    onCheckedChange={(checked) => updateHeroCta('secondary', 'enabled', checked)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="secondaryText">Button Text</Label>
                    <Input
                      id="secondaryText"
                      value={planContent.hero.cta?.secondary?.text || ''}
                      onChange={(e) => updateHeroCta('secondary', 'text', e.target.value)}
                      disabled={!planContent.hero.cta?.secondary?.enabled}
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondaryLink">Button Link</Label>
                    <Input
                      id="secondaryLink"
                      value={planContent.hero.cta?.secondary?.link || ''}
                      onChange={(e) => updateHeroCta('secondary', 'link', e.target.value)}
                      placeholder="/contact"
                      disabled={!planContent.hero.cta?.secondary?.enabled}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="secondaryColor">Button Color</Label>
                    <Select
                      value={planContent.hero.cta?.secondary?.color || 'outline'}
                      onValueChange={(value) => updateHeroCta('secondary', 'color', value)}
                      disabled={!planContent.hero.cta?.secondary?.enabled}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="accent">Accent</SelectItem>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="secondaryTextColor">Text Color</Label>
                    <Select
                      value={planContent.hero.cta?.secondary?.textColor || 'primary'}
                      onValueChange={(value) => updateHeroCta('secondary', 'textColor', value)}
                      disabled={!planContent.hero.cta?.secondary?.enabled}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Process Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>How It Works Section</CardTitle>
            <Switch
              checked={planContent.process.enabled}
              onCheckedChange={(checked) => updateProcessField('enabled', checked)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="processTitle">Section Title</Label>
              <Input
                id="processTitle"
                value={planContent.process.title}
                onChange={(e) => updateProcessField('title', e.target.value)}
                disabled={!planContent.process.enabled}
              />
            </div>
            <div>
              <Label htmlFor="processImage">Process Image</Label>
              <div className="space-y-3">
                <Input
                  id="processImage"
                  value={planContent.process.image}
                  onChange={(e) => updateProcessField('image', e.target.value)}
                  placeholder="/uploads/process-image.jpg"
                  disabled={!planContent.process.enabled}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'process');
                    }}
                    className="hidden"
                    id="processImageUpload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('processImageUpload')?.click()}
                    disabled={isUploading === 'process' || !planContent.process.enabled}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading === 'process' ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="processDescription">Description</Label>
            <Textarea
              id="processDescription"
              value={planContent.process.description}
              onChange={(e) => updateProcessField('description', e.target.value)}
              rows={3}
              disabled={!planContent.process.enabled}
            />
          </div>

          {planContent.process.enabled && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Process Steps ({planContent.process.steps.length})</h3>
                <Button onClick={addStep}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>

              <div className="space-y-4">
                {planContent.process.steps.map((step, index) => (
                  <Card key={index}>
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <div className="w-full cursor-pointer">
                          <CardContent className="p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <GripVertical className="h-5 w-5 text-gray-400" />
                                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                                  {step.step}
                                </div>
                                <div>
                                  <h4 className="font-medium">{step.title || `Step ${step.step}`}</h4>
                                  <p className="text-sm text-gray-500 truncate max-w-md">
                                    {step.description || 'No description...'}
                                  </p>
                                </div>
                              </div>
                              {expandedSteps.has(index) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </div>
                          </CardContent>
                        </div>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <CardContent className="px-4 pb-4 pt-0 border-t bg-gray-50/50">
                          <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">Step Details</Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeStep(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div>
                              <Label htmlFor={`stepTitle-${index}`}>Step Title</Label>
                              <Input
                                id={`stepTitle-${index}`}
                                value={step.title}
                                onChange={(e) => updateStep(index, 'title', e.target.value)}
                                placeholder="Step Title"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`stepDescription-${index}`}>Step Description</Label>
                              <Textarea
                                id={`stepDescription-${index}`}
                                value={step.description}
                                onChange={(e) => updateStep(index, 'description', e.target.value)}
                                placeholder="Describe what happens in this step..."
                                rows={3}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Benefits Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Benefits Section</CardTitle>
            <Switch
              checked={planContent.benefits.enabled}
              onCheckedChange={(checked) => updateBenefitsField('enabled', checked)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="benefitsTitle">Section Title</Label>
              <Input
                id="benefitsTitle"
                value={planContent.benefits.title}
                onChange={(e) => updateBenefitsField('title', e.target.value)}
                disabled={!planContent.benefits.enabled}
              />
            </div>
            <div>
              <Label htmlFor="benefitsDescription">Description</Label>
              <Input
                id="benefitsDescription"
                value={planContent.benefits.description}
                onChange={(e) => updateBenefitsField('description', e.target.value)}
                disabled={!planContent.benefits.enabled}
              />
            </div>
          </div>

          {planContent.benefits.enabled && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Benefits ({planContent.benefits.items.length})</h3>
                <Button onClick={addBenefit}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Benefit
                </Button>
              </div>

              <div className="space-y-4">
                {planContent.benefits.items.map((benefit, index) => (
                  <Card key={index}>
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <div className="w-full cursor-pointer">
                          <CardContent className="p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <GripVertical className="h-5 w-5 text-gray-400" />
                                <div>
                                  <h4 className="font-medium">{benefit.title || 'New Benefit'}</h4>
                                  <p className="text-sm text-gray-500 truncate max-w-md">
                                    {benefit.description || 'No description...'}
                                  </p>
                                </div>
                              </div>
                              {expandedBenefits.has(index) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </div>
                          </CardContent>
                        </div>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <CardContent className="px-4 pb-4 pt-0 border-t bg-gray-50/50">
                          <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">Benefit Details</Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeBenefit(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`benefitTitle-${index}`}>Benefit Title</Label>
                                <Input
                                  id={`benefitTitle-${index}`}
                                  value={benefit.title}
                                  onChange={(e) => updateBenefit(index, 'title', e.target.value)}
                                  placeholder="Benefit Title"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`benefitIcon-${index}`}>Icon</Label>
                                <Select
                                  value={benefit.icon}
                                  onValueChange={(value) => updateBenefit(index, 'icon', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="check">Check Circle</SelectItem>
                                    <SelectItem value="shield">Shield</SelectItem>
                                    <SelectItem value="book">Book</SelectItem>
                                    <SelectItem value="dollar">Dollar Sign</SelectItem>
                                    <SelectItem value="clock">Clock</SelectItem>
                                    <SelectItem value="award">Award</SelectItem>
                                    <SelectItem value="users">Users</SelectItem>
                                    <SelectItem value="star">Star</SelectItem>
                                    <SelectItem value="heart">Heart</SelectItem>
                                    <SelectItem value="thumbsup">Thumbs Up</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor={`benefitDescription-${index}`}>Description</Label>
                              <Textarea
                                id={`benefitDescription-${index}`}
                                value={benefit.description}
                                onChange={(e) => updateBenefit(index, 'description', e.target.value)}
                                placeholder="Describe this benefit..."
                                rows={3}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Guarantee Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Guarantee Section</CardTitle>
            <Switch
              checked={planContent.guarantee.enabled}
              onCheckedChange={(checked) => updateGuaranteeField('enabled', checked)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guaranteeTitle">Section Title</Label>
              <Input
                id="guaranteeTitle"
                value={planContent.guarantee.title}
                onChange={(e) => updateGuaranteeField('title', e.target.value)}
                disabled={!planContent.guarantee.enabled}
              />
            </div>
            <div>
              <Label htmlFor="guaranteeDescription">Description</Label>
              <Input
                id="guaranteeDescription"
                value={planContent.guarantee.description}
                onChange={(e) => updateGuaranteeField('description', e.target.value)}
                disabled={!planContent.guarantee.enabled}
              />
            </div>
          </div>

          {planContent.guarantee.enabled && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Guarantee Items ({planContent.guarantee.items.length})</h3>
                <Button onClick={addGuaranteeItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Guarantee
                </Button>
              </div>

              <div className="space-y-4">
                {planContent.guarantee.items.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium">Guarantee Item</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeGuaranteeItem(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div>
                          <Label htmlFor={`guaranteeItemTitle-${index}`}>Title</Label>
                          <Input
                            id={`guaranteeItemTitle-${index}`}
                            value={item.title}
                            onChange={(e) => updateGuaranteeItem(index, 'title', e.target.value)}
                            placeholder="Guarantee Title"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`guaranteeItemDescription-${index}`}>Description</Label>
                          <Textarea
                            id={`guaranteeItemDescription-${index}`}
                            value={item.description}
                            onChange={(e) => updateGuaranteeItem(index, 'description', e.target.value)}
                            placeholder="Describe this guarantee..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pricing Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pricing Section</CardTitle>
            <Switch
              checked={planContent.pricing?.enabled || false}
              onCheckedChange={(checked) => updatePricingField('enabled', checked)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pricingTitle">Section Title</Label>
              <Input
                id="pricingTitle"
                value={planContent.pricing?.title || 'Our Pricing'}
                onChange={(e) => updatePricingField('title', e.target.value)}
                disabled={!planContent.pricing?.enabled}
              />
            </div>
            <div>
              <Label htmlFor="pricingSubtitle">Section Subtitle</Label>
              <Input
                id="pricingSubtitle"
                value={planContent.pricing?.subtitle || 'Choose the plan that works for you'}
                onChange={(e) => updatePricingField('subtitle', e.target.value)}
                disabled={!planContent.pricing?.enabled}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="pricingDisplayStyle">Display Style</Label>
            <Select
              value={planContent.pricing?.displayStyle || 'cards'}
              onValueChange={(value) => updatePricingField('displayStyle', value)}
              disabled={!planContent.pricing?.enabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cards">Pricing Cards (like home page)</SelectItem>
                <SelectItem value="list">Simple List with Prices</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              Cards: Full pricing cards with features. List: Simple item + price format.
            </p>
          </div>

          {planContent.pricing?.enabled && (
  <>
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium">
        Pricing Plans ({planContent.pricing?.plans?.length || 0})
      </h3>
      <Button onClick={addPricingPlan}>
        <Plus className="h-4 w-4 mr-2" />
        Add Plan
      </Button>
    </div>

    <div className="space-y-4">
      {(planContent.pricing?.plans || []).map((plan: any, index: number) => (
        <Card key={index} className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="font-medium">Plan {index + 1}</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={plan.popular}
                  onChange={(e) => updatePricingPlan(index, 'popular', e.target.checked)}
                  className="w-4 h-4 text-primary"
                />
                <Label className="text-sm">Popular</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removePricingPlan(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {planContent.pricing?.displayStyle === 'list' && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  <strong>List Format:</strong> Each feature should include the service description and price.
                  Example: "Basic maintenance check - $40 per month"
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`plan-name-${index}`}>Plan Name</Label>
                <Input
                  id={`plan-name-${index}`}
                  value={plan.name}
                  onChange={(e) => updatePricingPlan(index, 'name', e.target.value)}
                  placeholder="Plan name"
                />
              </div>
              {planContent.pricing?.displayStyle === 'cards' && (
                <>
                  <div>
                    <Label htmlFor={`plan-price-${index}`}>Price</Label>
                    <Input
                      id={`plan-price-${index}`}
                      value={plan.price}
                      onChange={(e) => updatePricingPlan(index, 'price', e.target.value)}
                      placeholder="$99 or Free"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`plan-period-${index}`}>Period</Label>
                    <Input
                      id={`plan-period-${index}`}
                      value={plan.period}
                      onChange={(e) => updatePricingPlan(index, 'period', e.target.value)}
                      placeholder="per visit"
                    />
                  </div>
                </>
              )}
              <div>
                <Label htmlFor={`plan-description-${index}`}>Description</Label>
                <Textarea
                  id={`plan-description-${index}`}
                  value={plan.description}
                  onChange={(e) => updatePricingPlan(index, 'description', e.target.value)}
                  placeholder="Plan description"
                  rows={2}
                />
              </div>
            </div>

            <div>
              <Label>
                {planContent.pricing?.displayStyle === 'list'
                  ? 'Services & Pricing (one per line - include description and price)'
                  : 'Features (one per line)'}
              </Label>
              <Textarea
                value={plan.features}
                onChange={(e) => updatePricingPlan(index, 'features', e.target.value)}
                placeholder={
                  planContent.pricing?.displayStyle === 'list'
                    ? "Basic maintenance check - $40 per month\nEmergency service - $125 per call"
                    : "Feature 1\nFeature 2\nFeature 3"
                }
                rows={6}
              />
            </div>

            {planContent.pricing?.displayStyle === 'cards' && (
              <div>
                <Label htmlFor={`exclusions-${index}`}>Not Included (one per line)</Label>
                <Textarea
                  id={`exclusions-${index}`}
                  value={plan.exclusions}
                  onChange={(e) => updatePricingPlan(index, 'exclusions', e.target.value)}
                  rows={4}
                  placeholder="Not included item 1&#10;Not included item 2"
                />
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  </>
)}
        </CardContent>
      </Card>

      {/* Section Order */}
      <Card>
        <CardHeader>
          <CardTitle>Section Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Drag and drop to reorder how sections appear on the page (after the hero section).
          </p>
          
          <div className="space-y-2">
            {(planContent.sectionOrder || ['process', 'benefits', 'guarantee', 'pricing']).map((sectionKey, index) => {
              const sectionNames = {
                process: 'How It Works',
                benefits: 'Benefits',
                guarantee: 'Guarantee', 
                pricing: 'Pricing'
              };
              
              const sectionEnabled = {
                process: planContent.process.enabled,
                benefits: planContent.benefits.enabled,
                guarantee: planContent.guarantee.enabled,
                pricing: planContent.pricing?.enabled || false
              };

              return (
                <div key={sectionKey} className={`flex items-center justify-between p-3 border rounded-lg ${sectionEnabled[sectionKey as keyof typeof sectionEnabled] ? 'bg-white' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-3">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <span className={`font-medium ${sectionEnabled[sectionKey as keyof typeof sectionEnabled] ? 'text-gray-900' : 'text-gray-500'}`}>
                      {index + 1}. {sectionNames[sectionKey as keyof typeof sectionNames]}
                    </span>
                    {!sectionEnabled[sectionKey as keyof typeof sectionEnabled] && (
                      <span className="text-xs text-gray-500">(disabled)</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const currentOrder = planContent.sectionOrder || ['process', 'benefits', 'guarantee', 'pricing'];
                          const newOrder = [...currentOrder];
                          [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
                          updateSectionOrder(newOrder);
                        }}
                      >
                        ↑
                      </Button>
                    )}
                    {index < (planContent.sectionOrder || ['process', 'benefits', 'guarantee', 'pricing']).length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const currentOrder = planContent.sectionOrder || ['process', 'benefits', 'guarantee', 'pricing'];
                          const newOrder = [...currentOrder];
                          [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
                          updateSectionOrder(newOrder);
                        }}
                      >
                        ↓
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave}>
        Save Plan Content
      </Button>
    </div>
  );
}