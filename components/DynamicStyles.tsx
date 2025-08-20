'use client';

import { useEffect } from 'react';

interface DynamicStylesProps {
  siteConfig: any;
}

export default function DynamicStyles({ siteConfig }: DynamicStylesProps) {
  useEffect(() => {
    if (siteConfig?.brandColors) {
      const root = document.documentElement;
      
      // Convert hex to HSL for CSS custom properties
      const hexToHsl = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }

        return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
      };

      // Update CSS custom properties
      root.style.setProperty('--primary', hexToHsl(siteConfig.brandColors.primary));
      root.style.setProperty('--secondary', hexToHsl(siteConfig.brandColors.secondary));
      root.style.setProperty('--accent', hexToHsl(siteConfig.brandColors.accent));
      
      // Create lighter variants for backgrounds
      const primaryHsl = hexToHsl(siteConfig.brandColors.primary);
      const secondaryHsl = hexToHsl(siteConfig.brandColors.secondary);
      const accentHsl = hexToHsl(siteConfig.brandColors.accent);
      
      // Extract HSL values and create lighter variants
      const createLightVariant = (hsl: string, lightness: number) => {
        const [h, s] = hsl.split(' ');
        return `${h} ${s} ${lightness}%`;
      };
      
      root.style.setProperty('--primary-light', createLightVariant(primaryHsl, 95));
      root.style.setProperty('--secondary-light', createLightVariant(secondaryHsl, 95));
      root.style.setProperty('--accent-light', createLightVariant(accentHsl, 95));
    }
  }, [siteConfig]);

  return null;
}