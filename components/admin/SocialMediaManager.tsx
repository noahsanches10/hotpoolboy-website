'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SocialMediaManagerProps {
  siteConfig: any;
  setSiteConfig: (config: any) => void;
  onSave: () => void;
  isLoading: boolean;
}

export default function SocialMediaManager({ siteConfig, setSiteConfig, onSave, isLoading }: SocialMediaManagerProps) {
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
        <CardTitle>Social Media Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              value={siteConfig.socialMedia?.facebook || ''}
              onChange={(e) => setSiteConfig({
                ...siteConfig,
                socialMedia: {...(siteConfig.socialMedia || {}), facebook: e.target.value}
              })}
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              id="instagram"
              value={siteConfig.socialMedia?.instagram || ''}
              onChange={(e) => setSiteConfig({
                ...siteConfig,
                socialMedia: {...(siteConfig.socialMedia || {}), instagram: e.target.value}
              })}
              placeholder="https://instagram.com/yourpage"
            />
          </div>
        </div>
        
        <Button onClick={onSave}>
          Save
        </Button>
      </CardContent>
    </Card>
  );
}