'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
// NEW: color pickers
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AboutManagerProps {
  onSave: (type: string, data: any) => void;
  isLoading: boolean;
}

export default function AboutManager({ onSave, isLoading }: AboutManagerProps) {
  const [aboutContent, setAboutContent] = useState({
    hero: {
      title: "About {siteName}",
      subtitle:
        "Your trusted partner for professional home services with a commitment to quality and customer satisfaction.",
      // NEW: CTA config for About -> Hero
      cta: {
        primary: {
          enabled: true,
          text: 'Get Free Quote',
          link: '/contact',
          color: 'primary' as 'primary' | 'secondary' | 'accent' | 'white' | 'outline',
          textColor: 'white' as 'white' | 'black' | 'primary' | 'secondary',
        },
        secondary: {
          enabled: true,
          text: 'Contact Us',
          link: '/contact',
          color: 'outline' as 'primary' | 'secondary' | 'accent' | 'white' | 'outline',
          textColor: 'primary' as 'white' | 'black' | 'primary' | 'secondary',
        },
      },
    },
    story: {
      title: 'Our Story',
      image: '',
      content: [
        'Founded with a simple mission: to provide homeowners with reliable, professional service they can trust. We understand that your home is your most valuable investment, and we treat it with the care and respect it deserves.',
        "What started as a small local business has grown into a trusted name in home services, but we've never forgotten our roots. We still believe in old-fashioned values like showing up on time, doing quality work, and standing behind our services.",
      ],
      stats: [
        {
          number: '500+',
          label: 'Happy Customers',
        },
        {
          number: '10+',
          label: 'Years Experience',
        },
        {
          number: '24/7',
          label: 'Emergency Service',
        },
      ],
    },
    values: {
      title: 'Why Choose Us',
      subtitle: "We're committed to excellence in every aspect of our service",
      items: [
        {
          icon: 'shield',
          title: 'Licensed & Insured',
          description:
            'Fully licensed professionals with comprehensive insurance coverage for your peace of mind.',
        },
        {
          icon: 'clock',
          title: '24/7 Emergency',
          description:
            "Emergency services available around the clock because home problems don't wait for business hours.",
        },
        {
          icon: 'award',
          title: 'Quality Guarantee',
          description:
            "100% satisfaction guarantee on all our work. If you're not happy, we'll make it right.",
        },
        {
          icon: 'users',
          title: 'Local Team',
          description:
            'Local professionals who understand your community and are invested in your satisfaction.',
        },
      ],
    },
    team: {
      title: 'Meet Our Team',
      subtitle: 'Experienced professionals dedicated to serving your community',
      members: [
        {
          name: 'John Doe',
            title: 'Master Plumber',
            description: '15+ years experience in residential and commercial plumbing systems.',
            initials: 'JD',
            image: '',
        },
        {
          name: 'Sarah Martinez',
          title: 'Licensed Electrician',
          description:
            'Certified electrical specialist with expertise in modern home electrical systems.',
          initials: 'SM',
        },
        {
          name: 'Mike Thompson',
          title: 'HVAC Technician',
          description:
            'Heating and cooling expert ensuring your home stays comfortable year-round.',
          initials: 'MT',
        },
      ],
    },
  });

  useEffect(() => {
    loadAboutContent();
  }, []);

  const loadAboutContent = async () => {
    try {
      const response = await fetch('/api/admin/content?type=about');
      if (response.ok) {
        const data = await response.json();
        // Ensure defaults for new CTA fields if older content exists
        setAboutContent((prev) => ({
          ...prev,
          ...data,
          hero: {
            ...prev.hero,
            ...(data.hero || {}),
            cta: {
              primary: {
                enabled:
                  data.hero?.cta?.primary?.enabled ?? prev.hero.cta.primary.enabled,
                text: data.hero?.cta?.primary?.text ?? prev.hero.cta.primary.text,
                link: data.hero?.cta?.primary?.link ?? prev.hero.cta.primary.link,
                color: (data.hero?.cta?.primary?.color ??
                  prev.hero.cta.primary.color) as any,
                textColor: (data.hero?.cta?.primary?.textColor ??
                  prev.hero.cta.primary.textColor) as any,
              },
              secondary: {
                enabled:
                  data.hero?.cta?.secondary?.enabled ?? prev.hero.cta.secondary.enabled,
                text: data.hero?.cta?.secondary?.text ?? prev.hero.cta.secondary.text,
                link: data.hero?.cta?.secondary?.link ?? prev.hero.cta.secondary.link,
                color: (data.hero?.cta?.secondary?.color ??
                  prev.hero.cta.secondary.color) as any,
                textColor: (data.hero?.cta?.secondary?.textColor ??
                  prev.hero.cta.secondary.textColor) as any,
              },
            },
          },
        }));
      }
    } catch (error) {
      console.error('Failed to load about content:', error);
    }
  };

  const handleSave = () => {
    onSave('about', aboutContent);
  };

  const addStoryParagraph = () => {
    setAboutContent({
      ...aboutContent,
      story: {
        ...aboutContent.story,
        content: [...aboutContent.story.content, ''],
      },
    });
  };

  const removeStoryParagraph = (index: number) => {
    setAboutContent({
      ...aboutContent,
      story: {
        ...aboutContent.story,
        content: aboutContent.story.content.filter((_, i) => i !== index),
      },
    });
  };

  const updateStoryParagraph = (index: number, value: string) => {
    const newContent = [...aboutContent.story.content];
    newContent[index] = value;
    setAboutContent({
      ...aboutContent,
      story: {
        ...aboutContent.story,
        content: newContent,
      },
    });
  };

  const addTeamMember = () => {
    setAboutContent({
      ...aboutContent,
      team: {
        ...aboutContent.team,
        members: [
          ...aboutContent.team.members,
          {
            name: '',
            title: '',
            description: '',
            initials: '',
            image: '',
          },
        ],
      },
    });
  };

  const removeTeamMember = (index: number) => {
    setAboutContent({
      ...aboutContent,
      team: {
        ...aboutContent.team,
        members: aboutContent.team.members.filter((_, i) => i !== index),
      },
    });
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const newMembers = [...aboutContent.team.members];
    newMembers[index] = { ...newMembers[index], [field]: value };

    // Auto-generate initials from name
    if (field === 'name') {
      const initials = value
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
      newMembers[index].initials = initials;
    }

    setAboutContent({
      ...aboutContent,
      team: {
        ...aboutContent.team,
        members: newMembers,
      },
    });
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
          <CardTitle>About Page Hero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="hero-enabled"
              checked={aboutContent.hero?.enabled !== false}
              onChange={(e) =>
                setAboutContent({
                  ...aboutContent,
                  hero: {
                    ...aboutContent.hero,
                    enabled: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 text-primary border-gray-300 rounded"
            />
            <Label htmlFor="hero-enabled" className="text-sm font-medium cursor-pointer">
              Show hero section
            </Label>
          </div>

          {aboutContent.hero?.enabled !== false && (
            <>
              <div>
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Input
                  id="heroTitle"
                  value={aboutContent.hero.title}
                  onChange={(e) =>
                    setAboutContent({
                      ...aboutContent,
                      hero: { ...aboutContent.hero, title: e.target.value },
                    })
                  }
                  placeholder="About {siteName}"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use {`{siteName}`} to automatically insert your site name
                </p>
              </div>

              <div>
                <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                <Textarea
                  id="heroSubtitle"
                  value={aboutContent.hero.subtitle}
                  onChange={(e) =>
                    setAboutContent({
                      ...aboutContent,
                      hero: { ...aboutContent.hero, subtitle: e.target.value },
                    })
                  }
                  rows={3}
                />
              </div>

              {/* NEW: CTA Buttons */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Hero CTA Buttons</Label>
                <p className="text-sm text-gray-500">
                  Configure the call-to-action buttons that appear on the About page hero.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Primary CTA */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="about-primary-cta-enabled"
                        checked={aboutContent.hero.cta?.primary?.enabled !== false}
                        onChange={(e) =>
                          setAboutContent((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              cta: {
                                ...prev.hero.cta,
                                primary: {
                                  ...prev.hero.cta.primary,
                                  enabled: e.target.checked,
                                },
                              },
                            },
                          }))
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <Label htmlFor="about-primary-cta-enabled" className="text-sm">
                        Enable primary button
                      </Label>
                    </div>

                    {aboutContent.hero.cta?.primary?.enabled !== false && (
                      <>
                        <div>
                          <Label htmlFor="about-primary-cta-text" className="text-xs">
                            Button Text
                          </Label>
                          <Input
                            id="about-primary-cta-text"
                            value={aboutContent.hero.cta?.primary?.text || 'Get Free Quote'}
                            onChange={(e) =>
                              setAboutContent((prev) => ({
                                ...prev,
                                hero: {
                                  ...prev.hero,
                                  cta: {
                                    ...prev.hero.cta,
                                    primary: {
                                      ...prev.hero.cta.primary,
                                      text: e.target.value,
                                    },
                                  },
                                },
                              }))
                            }
                            placeholder="Get Free Quote"
                          />
                        </div>

                        <div>
                          <Label htmlFor="about-primary-cta-link" className="text-xs">
                            Button Link
                          </Label>
                          <Input
                            id="about-primary-cta-link"
                            value={aboutContent.hero.cta?.primary?.link || '/contact'}
                            onChange={(e) =>
                              setAboutContent((prev) => ({
                                ...prev,
                                hero: {
                                  ...prev.hero,
                                  cta: {
                                    ...prev.hero.cta,
                                    primary: {
                                      ...prev.hero.cta.primary,
                                      link: e.target.value,
                                    },
                                  },
                                },
                              }))
                            }
                            placeholder="/contact"
                          />
                        </div>

                        {/* Colors */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs">Primary Button Color</Label>
                            <Select
                              value={aboutContent.hero.cta?.primary?.color || 'primary'}
                              onValueChange={(value) =>
                                setAboutContent((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    cta: {
                                      ...prev.hero.cta,
                                      primary: {
                                        ...prev.hero.cta.primary,
                                        color: value as any,
                                      },
                                    },
                                  },
                                }))
                              }
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
                          </div>

                          <div>
                            <Label className="text-xs">Primary Button Text Color</Label>
                            <Select
                              value={aboutContent.hero.cta?.primary?.textColor || 'white'}
                              onValueChange={(value) =>
                                setAboutContent((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    cta: {
                                      ...prev.hero.cta,
                                      primary: {
                                        ...prev.hero.cta.primary,
                                        textColor: value as any,
                                      },
                                    },
                                  },
                                }))
                              }
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
                      </>
                    )}
                  </div>

                  {/* Secondary CTA */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="about-secondary-cta-enabled"
                        checked={aboutContent.hero.cta?.secondary?.enabled !== false}
                        onChange={(e) =>
                          setAboutContent((prev) => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              cta: {
                                ...prev.hero.cta,
                                secondary: {
                                  ...prev.hero.cta.secondary,
                                  enabled: e.target.checked,
                                },
                              },
                            },
                          }))
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <Label htmlFor="about-secondary-cta-enabled" className="text-sm">
                        Enable secondary button
                      </Label>
                    </div>

                    {aboutContent.hero.cta?.secondary?.enabled !== false && (
                      <>
                        <div>
                          <Label htmlFor="about-secondary-cta-text" className="text-xs">
                            Button Text
                          </Label>
                          <Input
                            id="about-secondary-cta-text"
                            value={aboutContent.hero.cta?.secondary?.text || 'Contact Us'}
                            onChange={(e) =>
                              setAboutContent((prev) => ({
                                ...prev,
                                hero: {
                                  ...prev.hero,
                                  cta: {
                                    ...prev.hero.cta,
                                    secondary: {
                                      ...prev.hero.cta.secondary,
                                      text: e.target.value,
                                    },
                                  },
                                },
                              }))
                            }
                            placeholder="Contact Us"
                          />
                        </div>

                        <div>
                          <Label htmlFor="about-secondary-cta-link" className="text-xs">
                            Button Link
                          </Label>
                          <Input
                            id="about-secondary-cta-link"
                            value={aboutContent.hero.cta?.secondary?.link || '/contact'}
                            onChange={(e) =>
                              setAboutContent((prev) => ({
                                ...prev,
                                hero: {
                                  ...prev.hero,
                                  cta: {
                                    ...prev.hero.cta,
                                    secondary: {
                                      ...prev.hero.cta.secondary,
                                      link: e.target.value,
                                    },
                                  },
                                },
                              }))
                            }
                            placeholder="/contact"
                          />
                        </div>

                        {/* Colors */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs">Secondary Button Color</Label>
                            <Select
                              value={aboutContent.hero.cta?.secondary?.color || 'outline'}
                              onValueChange={(value) =>
                                setAboutContent((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    cta: {
                                      ...prev.hero.cta,
                                      secondary: {
                                        ...prev.hero.cta.secondary,
                                        color: value as any,
                                      },
                                    },
                                  },
                                }))
                              }
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
                          </div>

                          <div>
                            <Label className="text-xs">Secondary Button Text Color</Label>
                            <Select
                              value={aboutContent.hero.cta?.secondary?.textColor || 'primary'}
                              onValueChange={(value) =>
                                setAboutContent((prev) => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    cta: {
                                      ...prev.hero.cta,
                                      secondary: {
                                        ...prev.hero.cta.secondary,
                                        textColor: value as any,
                                      },
                                    },
                                  },
                                }))
                              }
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
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Story Section */}
      <Card>
        <CardHeader>
          <CardTitle>Our Story Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="storyTitle">Section Title</Label>
            <Input
              id="storyTitle"
              value={aboutContent.story.title}
              onChange={(e) =>
                setAboutContent({
                  ...aboutContent,
                  story: { ...aboutContent.story, title: e.target.value },
                })
              }
            />
          </div>

          {/* Story Image */}
          <div className="space-y-4">
            <Label>Story Image</Label>
            <div className="flex items-center space-x-4">
              {/* Image Preview */}
              {aboutContent.story.image && (
                <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={aboutContent.story.image}
                    alt="Our Story"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

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
                        formData.append('type', 'about');

                        const response = await fetch('/api/admin/upload', {
                          method: 'POST',
                          body: formData,
                        });

                        if (response.ok) {
                          const result = await response.json();
                          setAboutContent({
                            ...aboutContent,
                            story: {
                              ...aboutContent.story,
                              image: result.path,
                            },
                          });
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
                  Upload an image to display alongside your story
                </p>
              </div>
            </div>

            {/* Manual URL Input */}
            <div>
              <Label htmlFor="story-image-url">Or Enter Image URL</Label>
              <Input
                id="story-image-url"
                value={aboutContent.story.image || ''}
                onChange={(e) =>
                  setAboutContent({
                    ...aboutContent,
                    story: {
                      ...aboutContent.story,
                      image: e.target.value,
                    },
                  })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Story Content (Paragraphs)</Label>
              <Button type="button" variant="outline" size="sm" onClick={addStoryParagraph}>
                <Plus className="h-4 w-4 mr-1" />
                Add Paragraph
              </Button>
            </div>
            <div className="space-y-4">
              {aboutContent.story.content.map((paragraph: string, index: number) => (
                <div key={index} className="flex space-x-2">
                  <Textarea
                    value={paragraph}
                    onChange={(e) => updateStoryParagraph(index, e.target.value)}
                    placeholder={`Paragraph ${index + 1}`}
                    rows={3}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeStoryParagraph(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div>
            <Label>Statistics</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {aboutContent.story.stats.map((stat: any, index: number) => (
                <div key={index} className="space-y-2">
                  <Input
                    value={stat.number}
                    onChange={(e) => {
                      const newStats = [...aboutContent.story.stats];
                      newStats[index] = { ...stat, number: e.target.value };
                      setAboutContent({
                        ...aboutContent,
                        story: { ...aboutContent.story, stats: newStats },
                      });
                    }}
                    placeholder="500+"
                  />
                  <Input
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...aboutContent.story.stats];
                      newStats[index] = { ...stat, label: e.target.value };
                      setAboutContent({
                        ...aboutContent,
                        story: { ...aboutContent.story, stats: newStats },
                      });
                    }}
                    placeholder="Happy Customers"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team Section</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addTeamMember}>
              <Plus className="h-4 w-4 mr-1" />
              Add Team Member
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="teamTitle">Section Title</Label>
              <Input
                id="teamTitle"
                value={aboutContent.team.title}
                onChange={(e) =>
                  setAboutContent({
                    ...aboutContent,
                    team: { ...aboutContent.team, title: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="teamSubtitle">Section Subtitle</Label>
              <Input
                id="teamSubtitle"
                value={aboutContent.team.subtitle}
                onChange={(e) =>
                  setAboutContent({
                    ...aboutContent,
                    team: { ...aboutContent.team, subtitle: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            {aboutContent.team.members.map((member: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Team Member {index + 1}</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTeamMember(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                    {/* Team Member Image */}
                  <div className="space-y-4">
                    <Label>Team Member Photo</Label>
                    <div className="flex items-center space-x-4">
                      {/* Current Image Preview */}
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
                        {member.image ? (
                          <>
                            <img
                              src={member.image}
                              alt={member.name || 'Team member'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  const fallback = document.createElement('span');
                                  fallback.className = 'text-sm font-bold text-gray-600';
                                  fallback.textContent = member.initials || '';
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0"
                              onClick={() => updateTeamMember(index, 'image', '')}
                            >
                              ×
                            </Button>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-gray-600">
                            {member.initials ||
                              (member.name
                                ? member.name
                                    .split(' ')
                                    .map((n: string) => n[0])
                                    .join('')
                                : '')}
                          </span>
                        )}
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
                                formData.append('type', 'team');

                                const response = await fetch('/api/admin/upload', {
                                  method: 'POST',
                                  body: formData,
                                });

                                if (response.ok) {
                                  const result = await response.json();
                                  updateTeamMember(index, 'image', result.path);
                                } else {
                                  const error = await response.text();
                                  console.error('Upload failed:', error);
                                  alert('Failed to upload image: ' + error);
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
                          Upload team member photo (optional)
                        </p>
                      </div>
                    </div>

                    {/* Manual URL Input */}
                    <div>
                      <Label htmlFor={`image-url-${index}`}>Or Enter Image URL</Label>
                      <Input
                        id={`image-url-${index}`}
                        value={member.image || ''}
                        onChange={(e) => updateTeamMember(index, 'image', e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter a direct URL to an image, or use the upload button above
                      </p>
                    </div>
                  </div>                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor={`name-${index}`}>Name</Label>
                      <Input
                        id={`name-${index}`}
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                        placeholder="Full Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`member-title-${index}`}>Job Title</Label>
                      <Input
                        id={`member-title-${index}`}
                        value={member.title}
                        onChange={(e) => updateTeamMember(index, 'title', e.target.value)}
                        placeholder="Job Title"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`initials-${index}`}>Initials</Label>
                      <Input
                        id={`initials-${index}`}
                        value={member.initials}
                        onChange={(e) => updateTeamMember(index, 'initials', e.target.value)}
                        placeholder="JD"
                        maxLength={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`description-${index}`}>Description</Label>
                      <Textarea
                        id={`description-${index}`}
                        value={member.description}
                        onChange={(e) => updateTeamMember(index, 'description', e.target.value)}
                        placeholder="Brief description of experience"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave}>Save About Page</Button>
    </div>
  );
}
