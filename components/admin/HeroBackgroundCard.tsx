'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

interface HeroBackgroundCardProps {
  image: any;
  index: number;
  availablePageOptions: Array<{ key: string; label: string }>;
  siteConfig: any;
  onDelete: (filename: string) => void;
  onCopyToClipboard: (text: string) => void;
  onSetHeroBackground: (pageType: string, imagePath: string) => void;
  onSaveOverlaySettings: (imageKey: string, settings: any) => void;
  getHeroBackgroundStatus: (pageType: string, imagePath: string) => boolean;
}

export default function HeroBackgroundCard({
  image,
  index,
  availablePageOptions,
  siteConfig,
  onDelete,
  onCopyToClipboard,
  onSetHeroBackground,
  onSaveOverlaySettings,
  getHeroBackgroundStatus
}: HeroBackgroundCardProps) {
  const imageKey = `image-${image.filename}`;
  const [tempOverlaySettings, setTempOverlaySettings] = useState(() => ({
    overlayType: siteConfig.heroOverlays?.[imageKey]?.overlayType || 'none',
    overlayOpacity: siteConfig.heroOverlays?.[imageKey]?.overlayOpacity || 50,
    overlayColor: siteConfig.heroOverlays?.[imageKey]?.overlayColor || '#000000'
  }));
  const [tempPageSelections, setTempPageSelections] = useState(() => {
    const selections: Record<string, boolean> = {};
    availablePageOptions.forEach(option => {
      selections[option.key] = getHeroBackgroundStatus(option.key, image.path);
    });
    return selections;
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSaveOverlaySettings = () => {
    // Save both overlay settings and page selections
    onSaveOverlaySettings(imageKey, tempOverlaySettings, tempPageSelections);
    setHasUnsavedChanges(false);
  };

  const handlePageSelectionChange = (pageKey: string, selected: boolean) => {
    setTempPageSelections(prev => ({
      ...prev,
      [pageKey]: selected
    }));
    setHasUnsavedChanges(true);
  };

  const handleOverlayChange = (field: string, value: any) => {
    setTempOverlaySettings(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  return (
    <Card key={index} className="p-4">
      <div className="space-y-4">
        <div className="relative">
          <img 
            src={image.path} 
            alt="Hero background"
            className="w-full h-32 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = 'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg';
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(image.filename)}
            className="absolute top-2 right-2 text-red-600 hover:text-red-700 bg-white/90"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Image URL</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                value={image.path}
                readOnly
                className="text-xs"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCopyToClipboard(image.path)}
              >
                Copy
              </Button>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Apply as Hero Background For:</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {availablePageOptions.map((option) => (
                <Button
                  key={option.key}
                  variant={tempPageSelections[option.key] ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageSelectionChange(option.key, !tempPageSelections[option.key])}
                  className="text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </div>
            {hasUnsavedChanges && (
              <p className="text-xs text-orange-600 mt-2">
                You have unsaved changes. Click "Save Settings" to apply them.
              </p>
            )}
          </div>
          
          {/* Overlay Settings for this specific image */}
          <div className="space-y-3 border-t pt-3">
            <Label className="text-sm font-medium">Overlay Settings for Pages Using This Image</Label>
            
            <div>
              <Label className="text-xs">Overlay Type</Label>
              <select
                value={tempOverlaySettings.overlayType}
                onChange={(e) => {
                  handleOverlayChange('overlayType', e.target.value);
                }}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              >
                <option value="none">No Overlay</option>
                <option value="dark">Dark Overlay</option>
                <option value="light">Light Overlay</option>
                <option value="primary">Primary Color</option>
                <option value="secondary">Secondary Color</option>
                <option value="accent">Accent Color</option>
                <option value="custom">Custom Color</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Opacity (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={tempOverlaySettings.overlayOpacity}
                  onChange={(e) => {
                    handleOverlayChange('overlayOpacity', parseInt(e.target.value) || 50);
                  }}
                  className="text-xs"
                />
              </div>
              
              {tempOverlaySettings.overlayType === 'custom' && (
                <div>
                  <Label className="text-xs">Custom Color</Label>
                  <Input
                    type="color"
                    value={tempOverlaySettings.overlayColor}
                    onChange={(e) => {
                      handleOverlayChange('overlayColor', e.target.value);
                    }}
                    className="w-full h-8"
                  />
                </div>
              )}
            </div>
            
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveOverlaySettings}
                className={`w-full ${hasUnsavedChanges ? 'bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100' : ''}`}
              >
                {hasUnsavedChanges ? 'Save Settings (Unsaved Changes)' : 'Save Settings'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}