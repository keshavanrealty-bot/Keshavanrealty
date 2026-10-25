import React, { createContext, useContext, useState, useEffect } from 'react';
import { AllSiteSettings } from '../types/settings';
import { settingsService, DEFAULT_SETTINGS } from '../services/settingsService';

interface SiteSettingsContextType {
  settings: AllSiteSettings;
  loading: boolean;
  updateSetting: <K extends keyof AllSiteSettings>(key: K, value: AllSiteSettings[K]) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AllSiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getAllSettings();
      setSettings(data);
    } catch (e) {
      console.warn('Failed to load settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Update dynamic document head attributes (Title, Favicon, Meta Description, Google Analytics)
  useEffect(() => {
    if (!settings) return;

    // 1. Dynamic Favicon
    if (settings.appearance.faviconUrl) {
      let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'shortcut icon';
        document.head.appendChild(favicon);
      }
      favicon.href = settings.appearance.faviconUrl;
    }

    // 2. Dynamic Meta Description
    if (settings.seo_settings.metaDescription) {
      let metaDesc = document.querySelector("meta[name='description']") as HTMLMetaElement;
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = settings.seo_settings.metaDescription;
    }

    // 3. Dynamic OpenGraph Image
    if (settings.seo_settings.ogImage) {
      let ogImage = document.querySelector("meta[property='og:image']") as HTMLMetaElement;
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.content = settings.seo_settings.ogImage;
    }

    // 4. Google Analytics Script injection if ID is configured
    const gaId = settings.seo_settings.googleAnalyticsId?.trim();
    if (gaId && gaId.startsWith('G-')) {
      const existingScript = document.getElementById('ga-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'ga-script';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        const inlineScript = document.createElement('script');
        inlineScript.id = 'ga-inline';
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
        document.head.appendChild(inlineScript);
      }
    }
  }, [settings]);

  const updateSetting = async <K extends keyof AllSiteSettings>(key: K, value: AllSiteSettings[K]) => {
    // Optimistic update
    setSettings((prev) => ({ ...prev, [key]: value }));
    await settingsService.updateSetting(key, value);
  };

  const refreshSettings = async () => {
    await loadSettings();
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        loading,
        updateSetting,
        refreshSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}
