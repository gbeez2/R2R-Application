// src/config/brandingOverride.ts

// This file allows overriding branding configurations.
// If no override is provided, defaults from `brandingConfig.ts` will be used.

const brandingOverride = {
  navbar: {
    appName: 'MacroPilot',
    showDocsButton: false,
  },
  logo: {
    src: '/images/default_profile.svg',
    alt: 'MacroPilot Logo',
  },
};

// Export the override object
export default brandingOverride;
