'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Upload, X, Image as ImageIcon, Globe } from 'lucide-react';
import HeroBackgroundCard from './HeroBackgroundCard';

export default function MediaManager() {
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [servicesConfig, setServicesConfig] = useState<any>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroBackgroundFile, setHeroBackgroundFile] = useState<File | null>(null);
  const [uploadedHeroBackgrounds, setUploadedHeroBackgrounds] = useState<any[]>([]);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [isUploadingHeroImage, setIsUploadingHeroImage] = useState(false);
  const [isUploadingHeroBackground, setIsUploadingHeroBackground] = useState(false);

  useEffect(() => {
    loadSiteConfig();
    loadServicesConfig();
    loadUploadedHeroBackgrounds();
  }, []);

  const loadSiteConfig = async () => {
    try {
      const response = await fetch('/api/admin/content?type=site-config');
      if (response.ok) {
        const data = await response.json();
        setSiteConfig(data);
      }
    } catch (error) {
      console.error('Failed to load site config:', error);
    }
  };

  const loadServicesConfig = async () => {
    try {
      const response = await fetch('/api/admin/content?type=services');
      if (response.ok) {
        const data = await response.json();
        setServicesConfig(data);
      }
    } catch (error) {
      console.error('Failed to load services config:', error);
    }
  };
  const saveSiteConfig = async (updatedConfig?: any) => {
    const configToSave = updatedConfig || siteConfig;
    if (!configToSave) return;
    
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'site-config', data: configToSave })
      });
      
      if (response.ok) {
        alert('Settings saved successfully!');
        setSiteConfig(configToSave);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings.');
    }
  };

  const handleLogoUpload = async (file: File) => {
    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const updatedConfig = {
          ...siteConfig,
          logo: result.path
        };
        setSiteConfig(updatedConfig);
        await saveSiteConfig(updatedConfig);
        setLogoFile(null);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (file: File) => {
    setIsUploadingFavicon(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const updatedConfig = {
          ...siteConfig,
          favicon: result.path
        };
        setSiteConfig(updatedConfig);
        await saveSiteConfig(updatedConfig);
        setFaviconFile(null);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading favicon:', error);
      alert('Failed to upload favicon. Please try again.');
    } finally {
      setIsUploadingFavicon(false);
    }
  };


  const loadUploadedHeroBackgrounds = async () => {
    try {
      const response = await fetch('/api/admin/upload');
      if (response.ok) {
        const images = await response.json();
        setUploadedHeroBackgrounds(images.filter((img: any) => 
          img.filename.includes('hero-background') || 
          img.type === 'hero-background'
        ));
      }
    } catch (error) {
      console.error('Failed to load uploaded hero backgrounds:', error);
    }
  };


  const handleHeroBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingHeroBackground(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'hero-background');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadedHeroBackgrounds(prev => [...prev, result]);
        e.target.value = ''; // Reset file input
        alert('Hero background image uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading hero background:', error);
      alert('Failed to upload hero background image. Please try again.');
    } finally {
      setIsUploadingHeroBackground(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('URL copied to clipboard!');
  };


  const deleteHeroBackground = async (filename: string) => {
    if (!confirm('Are you sure you want to delete this hero background image?')) return;
    
    try {
      // First, check if this image is being used as a hero background and remove those references
      const imagePath = `/uploads/${filename}`;
      let configUpdated = false;
      
      if (siteConfig.heroBackgrounds) {
        const updatedHeroBackgrounds = { ...siteConfig.heroBackgrounds };
        const updatedConfig = { ...siteConfig };
        
        // Remove references to this image from hero backgrounds
        Object.keys(updatedHeroBackgrounds).forEach(pageKey => {
          if (updatedHeroBackgrounds[pageKey] === imagePath) {
            delete updatedHeroBackgrounds[pageKey];
            configUpdated = true;
          }
        });
        
        // Also check if it's set as the main hero styling background image
        if (siteConfig.heroStyling?.backgroundImage === imagePath) {
          updatedConfig.heroStyling = {
            ...siteConfig.heroStyling,
            backgroundType: 'gradient', // Revert to default
            backgroundImage: ''
          };
          configUpdated = true;
        }
        
        // Update site config if changes were made
        if (configUpdated) {
          updatedConfig.heroBackgrounds = updatedHeroBackgrounds;
          await saveSiteConfig(updatedConfig);
        }
      }
      
      // Now delete the file
      const response = await fetch(`/api/admin/upload?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUploadedHeroBackgrounds(prev => prev.filter(img => img.filename !== filename));
        const message = configUpdated 
          ? 'Image deleted successfully! Hero background settings have been reset to default where this image was used.'
          : 'Image deleted successfully!';
        alert(message);
      } else {
        const errorData = await response.text();
        console.error('Delete response:', errorData);
        throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting hero background image:', error);
      alert(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const setHeroBackground = async (pageType: string, imagePath: string) => {
    const updatedConfig = {
      ...siteConfig,
      heroStyling: {
        ...siteConfig.heroStyling,
        backgroundType: 'image',
        backgroundImage: imagePath
      },
      heroBackgrounds: {
        ...siteConfig.heroBackgrounds,
        [pageType]: imagePath
      }
    };
    
    await saveSiteConfig(updatedConfig);
  };

  const getHeroBackgroundStatus = (pageType: string, imagePath: string) => {
    return siteConfig.heroBackgrounds?.[pageType] === imagePath;
  };

  // Determine which page options to show based on services configuration
  const getAvailablePageOptions = () => {
    const options = [
      { key: 'home', label: 'Home Page' },
      { key: 'about', label: 'About Page' }
    ];

    if (servicesConfig) {
      // If services page is enabled (either single page or multiple with "All Services" enabled)
      if (servicesConfig.pageType === 'single' || 
          (servicesConfig.pageType === 'multiple' && servicesConfig.showAllServicesPage !== false)) {
        options.push({ key: 'services', label: 'Services Page' });
      }

      // If individual service pages are enabled
      if (servicesConfig.pageType === 'multiple') {
        // Add each individual service as a separate option
        const enabledServices = servicesConfig.services?.filter((service: any) => service.enabled !== false) || [];
        enabledServices.forEach((service: any) => {
          options.push({ 
            key: `service-${service.slug}`, 
            label: `${service.title} Page` 
          });
        });
      }
    }

    return options;
  };
  // Auto-upload when file is selected
  useEffect(() => {
    if (logoFile) {
      handleLogoUpload(logoFile);
    }
  }, [logoFile]);

  useEffect(() => {
    if (faviconFile) {
      handleFaviconUpload(faviconFile);
    }
  }, [faviconFile]);


  if (!siteConfig || !servicesConfig) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading media settings...</p>
        </CardContent>
      </Card>
    );
  }

  const availablePageOptions = getAvailablePageOptions();
  return (
    <div className="space-y-6">
      {/* Logo Management */}
      <Card>
        <CardHeader>
          <CardTitle>Logo Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Logo */}
          {siteConfig.logo && (
            <div>
              <Label>Current Logo</Label>
              <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                <img 
                  src={siteConfig.logo} 
                  alt="Current logo"
                  className="object-contain"
                  style={{ height: `${siteConfig.logoSize || 48}px` }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Upload New Logo */}
          <div>
            <Label htmlFor="logoUpload">Upload New Logo</Label>
            <div className="mt-2">
              <input
                id="logoUpload"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                disabled={isUploadingLogo}
              />
              <p className="text-xs text-gray-500 mt-1">
                Logo will be uploaded and saved automatically when selected
              </p>
            </div>
            {isUploadingLogo && (
              <div className="mt-4 flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-blue-600">Uploading logo...</span>
              </div>
            )}
          </div>
          
          {/* Manual Logo URL */}
          <div>
            <Label htmlFor="logoUrl">Or Enter Logo URL</Label>
            <Input
              id="logoUrl"
              value={siteConfig.logo || ''}
              onChange={(e) => setSiteConfig({
                ...siteConfig,
                logo: e.target.value
              })}
              placeholder="https://example.com/logo.png"
            />
          </div>

          {/* Logo Size Control */}
          <div>
            <Label htmlFor="logoSize">Logo Size (pixels)</Label>
            <div className="flex items-center space-x-4 mt-2">
              <Input
                id="logoSize"
                type="number"
                min="20"
                max="200"
                value={siteConfig.logoSize || 48}
                onChange={(e) => setSiteConfig({
                  ...siteConfig,
                  logoSize: parseInt(e.target.value) || 48
                })}
                className="w-24"
              />
              <span className="text-sm text-gray-500">
                Height in pixels (width will scale proportionally)
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 32-80px for header, 40-60px for footer
            </p>
          </div>

          {/* Logo Display Options */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Logo Display Options</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={siteConfig.showLogoInHeader !== false}
                  onCheckedChange={(checked) => setSiteConfig({
                    ...siteConfig,
                    showLogoInHeader: checked
                  })}
                />
                <Label>Show logo in header</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={siteConfig.showLogoInFooter !== false}
                  onCheckedChange={(checked) => setSiteConfig({
                    ...siteConfig,
                    showLogoInFooter: checked
                  })}
                />
                <Label>Show logo in footer</Label>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              When logo display is disabled, the site name will be shown as text instead.
            </p>
          </div>

          <Button onClick={() => saveSiteConfig()}>
            Save Logo Settings
          </Button>
        </CardContent>
      </Card>

      {/* Favicon Management */}
      <Card>
        <CardHeader>
          <CardTitle>Website Icon (Favicon)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Favicon */}
          {siteConfig.favicon && (
            <div>
              <Label>Current Favicon</Label>
              <div className="mt-2 p-4 border rounded-lg bg-gray-50 flex items-center space-x-3">
                <img 
                  src={siteConfig.favicon} 
                  alt="Current favicon"
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-sm text-gray-600">16x16 or 32x32 pixels recommended</span>
              </div>
            </div>
          )}
          
          {/* Upload New Favicon */}
          <div>
            <Label htmlFor="faviconUpload">Upload New Favicon</Label>
            <div className="mt-2">
              <input
                id="faviconUpload"
                type="file"
                accept=".ico,.png,.jpg,.jpeg,.gif,.svg"
                onChange={(e) => setFaviconFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                disabled={isUploadingFavicon}
              />
              <p className="text-xs text-gray-500 mt-1">
                Accepts .ico, .png, .jpg, .gif, or .svg files. Favicon will be uploaded and saved automatically when selected.
              </p>
            </div>
            {isUploadingFavicon && (
              <div className="mt-4 flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-blue-600">Uploading favicon...</span>
              </div>
            )}
          </div>
          
          {/* Manual Favicon URL */}
          <div>
            <Label htmlFor="faviconUrl">Or Enter Favicon URL</Label>
            <Input
              id="faviconUrl"
              value={siteConfig.favicon || ''}
              onChange={(e) => setSiteConfig({
                ...siteConfig,
                favicon: e.target.value
              })}
              placeholder="https://example.com/favicon.ico"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Favicon changes require a page refresh to be visible in the browser tab. 
              For best results, use a square image (16x16, 32x32, or 64x64 pixels).
            </p>
          </div>

          <Button onClick={() => saveSiteConfig()}>
            Save Favicon Settings
          </Button>
        </CardContent>
      </Card>

      {/* General Media Upload */}
      <Card>
        <CardHeader>
          <CardTitle>General Media Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="generalUpload">Upload Hero Background Images</Label>
              <div className="mt-2">
                <input
                  id="generalUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleHeroBackgroundUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload images to use as hero background images for your pages
                </p>
              </div>
              {isUploadingHeroBackground && (
                <div className="mt-4 flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-blue-600">Uploading hero background image...</span>
                </div>
              )}
            </div>

            {/* Hero Background Images Management */}
            {uploadedHeroBackgrounds.length > 0 && (
              <div>
                <Label className="text-base font-semibold">Hero Background Images</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {uploadedHeroBackgrounds.map((image: any, index: number) => (
                    <HeroBackgroundCard
                      key={index}
                      image={image}
                      index={index}
                      availablePageOptions={availablePageOptions}
                      siteConfig={siteConfig}
                      onDelete={deleteHeroBackground}
                      onCopyToClipboard={copyToClipboard}
                      onSaveOverlaySettings={async (imageKey: string, overlaySettings: any, pageSelections: Record<string, boolean>) => {
                        // Update hero backgrounds based on page selections
                        const updatedHeroBackgrounds = { ...siteConfig.heroBackgrounds };
                        
                        // Apply page selections
                        Object.entries(pageSelections).forEach(([pageKey, selected]) => {
                          if (selected) {
                            updatedHeroBackgrounds[pageKey] = image.path;
                          } else if (updatedHeroBackgrounds[pageKey] === image.path) {
                            delete updatedHeroBackgrounds[pageKey];
                          }
                        });
                        
                        // Update site config with both hero backgrounds and overlay settings
                        const updatedConfig = {
                          ...siteConfig,
                          heroBackgrounds: updatedHeroBackgrounds,
                          heroOverlays: {
                            ...siteConfig.heroOverlays,
                            [imageKey]: overlaySettings
                          }
                        };
                        setSiteConfig(updatedConfig);
                        await saveSiteConfig(updatedConfig);
                      }}
                      getHeroBackgroundStatus={getHeroBackgroundStatus}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}