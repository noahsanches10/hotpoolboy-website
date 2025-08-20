'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SiteSettingsProps {
  siteConfig: any;
  setSiteConfig: (config: any) => void;
  onSave: () => void;
  isLoading: boolean;
}

export default function SiteSettings({ siteConfig, setSiteConfig, onSave, isLoading }: SiteSettingsProps) {
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
    <Card>
      <CardHeader>
        <CardTitle>Site Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={siteConfig.siteName}
              onChange={(e) => setSiteConfig({...siteConfig, siteName: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={siteConfig.tagline}
              onChange={(e) => setSiteConfig({...siteConfig, tagline: e.target.value})}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={siteConfig.contact.phone}
              onChange={(e) => setSiteConfig({
                ...siteConfig,
                contact: {...siteConfig.contact, phone: e.target.value}
              })}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={siteConfig.contact.email}
              onChange={(e) => setSiteConfig({
                ...siteConfig,
                contact: {...siteConfig.contact, email: e.target.value}
              })}
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={siteConfig.contact.address}
              onChange={(e) => setSiteConfig({
                ...siteConfig,
                contact: {...siteConfig.contact, address: e.target.value}
              })}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="serviceAreas">Service Areas (one per line)</Label>
          <Textarea
            id="serviceAreas"
            value={siteConfig.serviceAreas.join('\n')}
            onChange={(e) => setSiteConfig({
              ...siteConfig,
              serviceAreas: e.target.value.split('\n')
            })}
            rows={5}
          />
        </div>
        <Button onClick={onSave}>
          Save
        </Button>
      </CardContent>
    </Card>
  );
}