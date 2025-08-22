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

  if (contactConfig.embedForm?.enabled && contactConfig.embedForm?.url?.trim()) {
    return (
      <div className="relative w-full h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-lg">
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

  // If no embedded form is configured, show a message
  return (
    <div className="text-center py-8">
      <p className="text-gray-600">Please configure an embedded form in the admin panel to display the contact form.</p>
    </div>
  );
}