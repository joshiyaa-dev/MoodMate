import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.moodmate.app',
  appName: 'Mood Mate',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#3B82F6",
      showSpinner: false,
      launchAutoHide: true,
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'light',
      backgroundColor: "#3B82F6",
      overlaysWebView: false
    },
    Keyboard: {
      resize: "ionic",
      style: "dark",
      resizeOnFullScreen: true
    },
    App: {
      launchUrl: "",
      launchAutoHide: true
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    backgroundColor: "#3B82F6"
  },
  ios: {
    contentInset: "automatic",
    scrollEnabled: true,
    backgroundColor: "#3B82F6",
    allowsLinkPreview: false
  }
};

export default config;
