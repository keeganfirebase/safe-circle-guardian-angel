
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';

export const useCapacitorApp = () => {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());

    if (Capacitor.isNativePlatform()) {
      // Configure status bar
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: '#1f2937' });

      // Handle app state changes
      App.addListener('appStateChange', (state) => {
        console.log('App state changed:', state.isActive);
      });

      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          App.exitApp();
        } else {
          window.history.back();
        }
      });
    }

    return () => {
      if (Capacitor.isNativePlatform()) {
        App.removeAllListeners();
      }
    };
  }, []);

  return { isNative };
};
