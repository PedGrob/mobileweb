import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // 👇 1. เช็ค appId ให้ตรงกับ package_name ใน google-services.json เป๊ะๆ
  appId: "cpkku.narata.lab07", 
  
  appName: 'lab07-authen',
  
  // 👇 2. ถ้าใช้ Vite (Ionic React ใหม่ๆ) จะเป็น 'dist'
  // แต่ถ้าเป็น Create React App เก่าๆ จะเป็น 'build'
  webDir: 'dist', 
  
  server: {
    androidScheme: 'https'
  },
  
  // 👇 3. ส่วนสำคัญที่สุด! ต้องมีตรงนี้ Google Login ถึงจะไม่ Error
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false, // ใช้ Native Google Sign-In (สำคัญมาก)
      providers: ["google.com", "phone"],
    }
  }
};

export default config;