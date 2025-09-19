'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Trash2, Plus, Star, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';

interface ReviewsManagerProps {
  onSave: (type: string, data: any) => void;
  isLoading: boolean;
}

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
}

interface ReviewsContent {
  sections: {
    testimonials: {
      enabled: boolean;
      title: string;
      subtitle: string;
      background: string;
      useEmbed: boolean;
      iframeUrl: string;
      iframeHeight: string;
      items: Testimonial[];
    };
  };
}

export default function ReviewsManager({ onSave, isLoading }: ReviewsManagerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
  const [reviewsContent, setReviewsContent] = useState<ReviewsContent>({
    sections: {
      testimonials: {
        enabled: true,
        title: "Customer Reviews",
        subtitle: "See what our customers are saying",
        background: "white",
        useEmbed: false,
        iframeUrl: "",
        iframeHeight: "600px",
        items: []
      }
    }
  });

  useEffect(() => {
    loadReviewsContent();
  }, []);

  const loadReviewsContent = async () => {
    try {
      const response = await fetch('/api/admin/content?type=reviews');
      if (response.ok) {
        const data = await response.json();
        // Ensure the data structure matches our expected format
        if (data && data.sections && data.sections.testimonials) {
          setReviewsContent(data);
        } else {
          console.warn('Loaded data structure does not match expected format, using default');
        }
      }
    } catch (error) {
      console.error('Failed to load reviews content:', error);
    }
  };

  const handleSave = async () => {
    // Validate the data before saving
    if (!reviewsContent.sections?.testimonials) {
      console.error('Invalid reviews content structure');
      alert('Error: Invalid content structure');
      return;
    }
    
    // Clean up the data - remove any undefined or null values
    const cleanedData = {
      sections: {
        testimonials: {
          ...reviewsContent.sections.testimonials,
          items: reviewsContent.sections.testimonials.items.filter(item => 
            item && typeof item === 'object'
          )
        }
      }
    };
    
    console.log('Saving reviews content:', cleanedData);
    
    try {
      await onSave('reviews', cleanedData);
      console.log('Reviews content saved successfully');
    } catch (error) {
      console.error('Failed to save reviews content:', error);
      alert('Failed to save reviews content. Check console for details.');
    }
  };

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      name: "",
      location: "",
      rating: 5,
      text: "",
      avatar: ""
    };

    setReviewsContent(prevContent => ({
      ...prevContent,
      sections: {
        ...prevContent.sections,
        testimonials: {
          ...prevContent.sections.testimonials,
          items: [...prevContent.sections.testimonials.items, newTestimonial]
        }
      }
    }));
  };

  const removeTestimonial = (index: number) => {
    setReviewsContent(prevContent => ({
      ...prevContent,
      sections: {
        ...prevContent.sections,
        testimonials: {
          ...prevContent.sections.testimonials,
          items: prevContent.sections.testimonials.items.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const updateTestimonial = (index: number, field: keyof Testimonial, value: any) => {
    setReviewsContent(prevContent => {
      const newItems = [...prevContent.sections.testimonials.items];
      if (newItems[index]) {
        newItems[index] = { ...newItems[index], [field]: value };
      }
      
      return {
        ...prevContent,
        sections: {
          ...prevContent.sections,
          testimonials: {
            ...prevContent.sections.testimonials,
            items: newItems
          }
        }
      };
    });
  };

  const moveTestimonial = (fromIndex: number, toIndex: number) => {
    setReviewsContent(prevContent => {
      const newItems = [...prevContent.sections.testimonials.items];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      
      return {
        ...prevContent,
        sections: {
          ...prevContent.sections,
          testimonials: {
            ...prevContent.sections.testimonials,
            items: newItems
          }
        }
      };
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveTestimonial(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedReviews(newExpanded);
  };

  const updateSectionField = (field: string, value: any) => {
    setReviewsContent(prevContent => ({
      ...prevContent,
      sections: {
        ...prevContent.sections,
        testimonials: {
          ...prevContent.sections.testimonials,
          [field]: value
        }
      }
    }));
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
      {/* Section Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews Section Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={reviewsContent.sections.testimonials.enabled}
                onCheckedChange={(checked) => updateSectionField('enabled', checked)}
              />
              <Label htmlFor="enabled">Enable Reviews Section</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="useEmbed"
                checked={reviewsContent.sections.testimonials.useEmbed}
                onCheckedChange={(checked) => updateSectionField('useEmbed', checked)}
              />
              <Label htmlFor="useEmbed">Use External Reviews (Iframe)</Label>
            </div>

            {reviewsContent.sections.testimonials.useEmbed ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="iframeUrl">Reviews Widget URL</Label>
                  <Input
                    id="iframeUrl"
                    value={reviewsContent.sections.testimonials.iframeUrl || ''}
                    onChange={(e) => updateSectionField('iframeUrl', e.target.value)}
                    placeholder="https://893eac12ce2246829d4b759a3336e8d5.elf.site"
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the URL of your external reviews widget (e.g., Elfsight, Trustpilot, etc.)
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="iframeHeight">Iframe Height</Label>
                  <Input
                    id="iframeHeight"
                    value={reviewsContent.sections.testimonials.iframeHeight || '600px'}
                    onChange={(e) => updateSectionField('iframeHeight', e.target.value)}
                    placeholder="600px"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Set the height of the iframe (e.g., 600px, 500px)
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="testimonialsTitle">Section Title</Label>
                  <Input
                    id="testimonialsTitle"
                    value={reviewsContent.sections.testimonials.title}
                    onChange={(e) => updateSectionField('title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="testimonialsSubtitle">Section Subtitle</Label>
                  <Input
                    id="testimonialsSubtitle"
                    value={reviewsContent.sections.testimonials.subtitle}
                    onChange={(e) => updateSectionField('subtitle', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Management */}
      {!reviewsContent.sections.testimonials.useEmbed && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Customer Testimonials ({reviewsContent.sections.testimonials.items.length})</CardTitle>
              <Button onClick={addTestimonial}>
                <Plus className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviewsContent.sections.testimonials.items.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No testimonials yet</h4>
                  <p className="text-gray-600 mb-4">Add your first customer testimonial to get started</p>
                  <Button onClick={addTestimonial}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Testimonial
                  </Button>
                </div>
              ) : (
                reviewsContent.sections.testimonials.items.map((testimonial: Testimonial, index: number) => (
                  <Card 
                    key={index} 
                    className="relative"
                  >
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <div
                          className="w-full cursor-pointer"
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                        >
                          <CardContent className="p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <GripVertical className="h-5 w-5 text-gray-400" />
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center space-x-1">
                                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                                    ))}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{testimonial.name || 'New Review'}</h4>
                                    <p className="text-sm text-gray-500 truncate max-w-md">
                                      {testimonial.text || 'No review text yet...'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">{testimonial.location}</span>
                                {expandedReviews.has(index) ? (
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
                            <div className="flex items-center justify-between">
                              <Label className="font-medium">Review Details</Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeTestimonial(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor={`name-${index}`}>Customer Name</Label>
                                <Input
                                  id={`name-${index}`}
                                  value={testimonial.name || ''}
                                  onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                                  placeholder="John Smith"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`location-${index}`}>Location/Area</Label>
                                <Input
                                  id={`location-${index}`}
                                  value={testimonial.location || ''}
                                  onChange={(e) => updateTestimonial(index, 'location', e.target.value)}
                                  placeholder="Downtown"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`rating-${index}`}>Rating (1-5 stars)</Label>
                                <select
                                  id={`rating-${index}`}
                                  value={testimonial.rating || 5}
                                  onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                  <option value={5}>5 Stars</option>
                                  <option value={4}>4 Stars</option>
                                  <option value={3}>3 Stars</option>
                                  <option value={2}>2 Stars</option>
                                  <option value={1}>1 Star</option>
                                </select>
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor={`text-${index}`}>Testimonial Text</Label>
                              <Textarea
                                id={`text-${index}`}
                                value={testimonial.text || ''}
                                onChange={(e) => updateTestimonial(index, 'text', e.target.value)}
                                placeholder="This company provided excellent service..."
                                rows={3}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`avatar-${index}`}>Avatar Image URL (optional)</Label>
                              <Input
                                id={`avatar-${index}`}
                                value={testimonial.avatar || ''}
                                onChange={(e) => updateTestimonial(index, 'avatar', e.target.value)}
                                placeholder="https://images.pexels.com/..."
                              />
                              <p className="text-sm text-gray-500 mt-1">
                                Leave empty to use initials instead
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={handleSave}>
        Save Reviews
      </Button>
    </div>
  );
}