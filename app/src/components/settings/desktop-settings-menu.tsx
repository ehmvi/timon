'use client';

import { useEffect } from 'react';
import { fetchCapabilities, isPageSurfaceAllowed } from '@/lib/capabilities';
import { SETTINGS_PARAM, useSettingsNavigation } from '@/lib/settings-navigation';

/**
 * "Settings…" (Cmd+,) of the desktop app's macOS menu bar: the shell only
 * says it was chosen, and the page opens its own dialog, as the gear does.
 * Chosen over the open dialog, it leaves it on the tab it shows. A viewer
 * whose gear is hidden gets no dialog from the menu either. In a browser, or
 * an older desktop app, there is nothing to listen to.
 */
export function DesktopSettingsMenu(): null {
  const { open } = useSettingsNavigation();
  useEffect(() => {
    const subscribe = window.timonDesktop?.onOpenSettings;
    if (typeof subscribe !== 'function') return;
    return subscribe(() => {
      if (new URL(window.location.href).searchParams.has(SETTINGS_PARAM)) return;
      void fetchCapabilities().then((caps) => {
        if (caps !== null && isPageSurfaceAllowed(caps, '/settings')) open();
      });
    });
  }, [open]);
  return null;
}
