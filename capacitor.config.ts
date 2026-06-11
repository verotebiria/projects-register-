import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.projectsregister.app',
  appName: 'Projects Register',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      launchAutoHide: true,
      backgroundColor: '#0D1117',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_INSIDE',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      fadeInDuration: 300,
      fadeOutDuration: 400,
    },
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#0D1117',
    },
  },
  android: {
    buildOptions: {
      releaseType: 'APK',
    },
  },
};

export default config;
