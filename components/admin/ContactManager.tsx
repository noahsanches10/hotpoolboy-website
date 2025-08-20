'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ContactManagerProps {
  onSave: (type: string, data: any) => void;
  isLoading: boolean;
}

export default function ContactManager({ onSave, isLoading }: ContactManagerProps) {
  const [contactContent, setContactContent] = useState({
    showContactInfo: true,
    embedForm: {
      enabled: false,
      url: '',
      title: 'Contact Us',
      zoom: 100
    },
    standardForm: {
      enabled: true,
      title: 'Send Us a Message',
      submitText: 'Send Message'
    },
    businessHours: {
      monday: '7:00 AM - 6:00 PM',
      tuesday: '7:00 AM - 6:00 PM',
      wednesday: '7:00 AM - 6:00 PM',
      thursday: '7:00 AM - 6:00 PM',
      friday: '7:00 AM - 6:00 PM',
      saturday: '8:00 AM - 4:00 PM',
      sunday: 'Emergency calls only'
    }
  });

  useEffect(() => {
    loadContactContent();
  }, []);

  const loadContactContent = async () => {
    try {
      const response = await fetch('/api/admin/content?type=contact');
      if (response.ok) {
        const data = await response.json();
        setContactContent({
          showContactInfo: data.showContactInfo ?? true,
          embedForm: {
            enabled: data.embedForm?.enabled ?? false,
            url: data.embedForm?.url ?? '',
            title: data.embedForm?.title ?? 'Contact Us',
            zoom: data.embedForm?.zoom ?? 100
          },
          standardForm: {
            enabled: data.standardForm?.enabled ?? true,
            title: data.standardForm?.title ?? 'Send Us a Message',
            submitText: data.standardForm?.submitText ?? 'Send Message'
          },
          businessHours: data.businessHours || {
            monday: '7:00 AM - 6:00 PM',
            tuesday: '7:00 AM - 6:00 PM',
            wednesday: '7:00 AM - 6:00 PM',
            thursday: '7:00 AM - 6:00 PM',
            friday: '7:00 AM - 6:00 PM',
            saturday: '8:00 AM - 4:00 PM',
            sunday: 'Emergency calls only'
          }
        });
      }
    } catch (error) {
      console.error('Failed to load contact content:', error);
    }
  };

  const handleSave = () => {
    onSave('contact', contactContent);
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
      {/* Layout Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Page Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={contactContent.showContactInfo}
              onCheckedChange={(checked) => 
                setContactContent({
                  ...contactContent,
                  showContactInfo: checked
                })
              }
            />
            <Label>Show "Get In Touch" section with contact information</Label>
          </div>
          <p className="text-sm text-gray-500">
            When disabled, the contact form will take the full width of the page
          </p>
        </CardContent>
      </Card>

      {/* Contact Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Embedded Form (Recommended)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={contactContent.embedForm.enabled}
              onCheckedChange={(checked) => 
                setContactContent({
                  ...contactContent,
                  embedForm: { ...contactContent.embedForm, enabled: checked },
                  standardForm: { ...contactContent.standardForm, enabled: !checked }
                })
              }
            />
            <Label>Use embedded form (Google Forms, Typeform, etc.)</Label>
          </div>
          
          {contactContent.embedForm.enabled && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="embedUrl">Form Embed URL</Label>
                <Input
                  id="embedUrl"
                  value={contactContent.embedForm.url}
                  onChange={(e) => setContactContent({
                    ...contactContent,
                    embedForm: { ...contactContent.embedForm, url: e.target.value }
                  })}
                  placeholder="https://docs.google.com/forms/d/e/..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Paste the embed URL from Google Forms, Typeform, or similar service
                </p>
              </div>
              <div>
                <Label htmlFor="embedZoom">Form Zoom Level (%)</Label>
                <Input
                  id="embedZoom"
                  type="number"
                  min="50"
                  max="150"
                  value={contactContent.embedForm.zoom}
                  onChange={(e) => setContactContent({
                    ...contactContent,
                    embedForm: { ...contactContent.embedForm, zoom: parseInt(e.target.value) || 100 }
                  })}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Adjust the zoom level of the embedded form (50% - 150%)
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Standard Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Standard Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={contactContent.standardForm.enabled}
              onCheckedChange={(checked) => 
                setContactContent({
                  ...contactContent,
                  standardForm: { ...contactContent.standardForm, enabled: checked },
                  embedForm: { ...contactContent.embedForm, enabled: !checked }
                })
              }
            />
            <Label>Use standard contact form</Label>
          </div>
          
          {contactContent.standardForm.enabled && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="formTitle">Form Title</Label>
                <Input
                  id="formTitle"
                  value={contactContent.standardForm.title}
                  onChange={(e) => setContactContent({
                    ...contactContent,
                    standardForm: { ...contactContent.standardForm, title: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="submitText">Submit Button Text</Label>
                <Input
                  id="submitText"
                  value={contactContent.standardForm.submitText}
                  onChange={(e) => setContactContent({
                    ...contactContent,
                    standardForm: { ...contactContent.standardForm, submitText: e.target.value }
                  })}
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Standard form submissions will be logged to the browser console. 
                  For production use, you'll need to implement server-side form handling or use an embedded form service.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Hours - only show if contact info is enabled */}
      {contactContent.showContactInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(contactContent.businessHours).map(([day, hours]) => (
                <div key={day}>
                  <Label htmlFor={day} className="capitalize">{day}</Label>
                  <Input
                    id={day}
                    value={hours}
                    onChange={(e) => setContactContent({
                      ...contactContent,
                      businessHours: { ...contactContent.businessHours, [day]: e.target.value }
                    })}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}