import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cpkku.cheychaya.lab07',
  appName: 'lab07-authenn',
  webDir: 'dist',
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["google.com", "phone"],
    }
  }
};
export default config;
