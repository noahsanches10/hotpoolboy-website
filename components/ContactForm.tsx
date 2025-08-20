'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ExternalLink } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const [contactConfig, setContactConfig] = useState({
    embedForm: { enabled: false, url: '', title: 'Contact Us', zoom: 100 },
    standardForm: { enabled: true, title: 'Send Us a Message', submitText: 'Send Message' }
  });

  useEffect(() => {
    loadContactConfig();
  }, []);

  const loadContactConfig = async () => {
    try {
      const response = await fetch('/api/admin/content?type=contact');
      if (response.ok) {
        const data = await response.json();
        setContactConfig(data);
      }
    } catch (error) {
      console.error('Failed to load contact config:', error);
    }
  };

  const useEmbeddedForm = contactConfig.embedForm.enabled && contactConfig.embedForm.url.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the form data to an API
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Thank You!
          </h3>
          <p className="text-gray-600 mb-6">
            We've received your message and will get back to you within 24 hours.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline">
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (useEmbeddedForm) {
    return (
      <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
        <iframe
          src={contactConfig.embedForm.url}
          width="100%"
          height="100%"
          frameBorder="0"
          className="absolute inset-0"
          style={{ zoom: `${contactConfig.embedForm.zoom}%` }}
          title={contactConfig.embedForm.title || "Contact Form"}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{contactConfig.standardForm.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              required
              rows={5}
              placeholder="Please describe your project or issue in detail..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <Button type="submit" size="lg" className="w-full">
            {contactConfig.standardForm.submitText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}