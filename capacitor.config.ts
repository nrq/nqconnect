import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nqsalam.app',
  appName: 'NQSalam',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
