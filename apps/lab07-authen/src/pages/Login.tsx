import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonItem, IonInput, IonButton, IonIcon, IonLabel, 
  IonLoading, IonToast, useIonRouter, IonText, IonGrid, IonRow, IonCol
} from '@ionic/react';
import { logoGoogle, mailOutline, lockClosedOutline, callOutline, phonePortraitOutline } from 'ionicons/icons';

// 👇 Import authService ที่คุณสร้างไว้ (ปรับ Path ให้ตรงกับที่คุณวางไฟล์)
import { authService } from '../auth/auth-service'; 

const Login: React.FC = () => {
  const router = useIonRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // State สำหรับ Email/Password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State สำหรับ Phone Auth
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(''); // เก็บ ID ที่ได้จาก step 1
  const [stepPhone, setStepPhone] = useState<'input' | 'verify'>('input');

  // --- Helper: เมื่อ Login สำเร็จ ---
  const handleSuccess = async () => {
    try {
      // ดึงข้อมูล User ล่าสุดมาเช็ค (ตามโจทย์)
      const user = await authService.getCurrentUser();
      console.log('Login Success! User:', user);
      
      setLoading(false);
      setMessage(`ยินดีต้อนรับ ${user?.displayName || user?.email || user?.phoneNumber}`);
      
      // ไปหน้า Tab1 (แบบไม่ให้ย้อนกลับมาหน้า Login ได้)
      window.location.href = '/tabs/tab1';
    } catch (error) {
      console.error('Get User Error:', error);
    }
  };

  const handleError = (error: any) => {
    setLoading(false);
    console.error('Login Error:', error);
    setMessage(error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
  };

  // ==========================================
  // 1. Login Email / Password
  // ==========================================
  const loginEmail = async () => {
    if (!email || !password) { setMessage('กรุณากรอกอีเมลและรหัสผ่าน'); return; }
    setLoading(true);
    try {
      await authService.loginWithEmailPassword({ email, password });
      handleSuccess();
    } catch (e) { handleError(e); }
  };

  // ==========================================
  // 2. Login Google
  // ==========================================
  const loginGoogle = async () => {
    setLoading(true);
    try {
      await authService.loginWithGoogle();
      handleSuccess();
    } catch (e) { handleError(e); }
  };

  // ==========================================
  // 3. Login Phone
  // ==========================================
  const sendOtp = async () => {
    if (!phoneNumber) { setMessage('กรุณากรอกเบอร์โทรศัพท์'); return; }
    
    // แปลงเบอร์โทร: ตัดช่องว่าง, แปลง 08x เป็น +668x
    let formattedPhone = phoneNumber.replace(/\s/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+66' + formattedPhone.substring(1);
    }

    setLoading(true);
    try {
      // เรียกใช้ Service (auth-web หรือ auth-app จะทำงานตาม Platform เอง)
      const res = await authService.startPhoneLogin({ phoneNumberE164: formattedPhone });
      
      setVerificationId(res.verificationId);
      setStepPhone('verify'); // เปลี่ยนหน้าจอไปกรอก OTP
      setLoading(false);
      setMessage(`ส่ง OTP ไปที่ ${formattedPhone} แล้ว`);
    } catch (e) { handleError(e); }
  };

  const verifyOtp = async () => {
    if (!otp) { setMessage('กรุณากรอกรหัส OTP'); return; }
    setLoading(true);
    try {
      await authService.confirmPhoneCode({ 
        verificationId: verificationId, 
        verificationCode: otp 
      });
      handleSuccess();
    } catch (e) { handleError(e); }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>เข้าสู่ระบบ</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message="กำลังตรวจสอบข้อมูล..." />
        <IonToast 
          isOpen={!!message} 
          message={message!} 
          duration={3000} 
          onDidDismiss={() => setMessage(null)} 
          position="top"
          color="dark"
        />

        {/* --- ส่วนที่ 1: Email & Password --- */}
        <IonCard className="ion-margin-bottom">
          <IonCardHeader><IonCardTitle>Email Login</IonCardTitle></IonCardHeader>
          <IonCardContent>
            <IonItem className="ion-margin-bottom">
              <IonIcon icon={mailOutline} slot="start" />
              <IonInput
                fill="outline" 
                label="อีเมล" labelPlacement="floating" 
                value={email} onIonInput={e => setEmail(e.detail.value!)} 
              />
            </IonItem>
            <IonItem className="ion-margin-bottom">
              <IonIcon icon={lockClosedOutline} slot="start" />
              <IonInput
                fill="outline" 
                label="รหัสผ่าน" labelPlacement="floating" type="password"
                value={password} onIonInput={e => setPassword(e.detail.value!)} 
              />
            </IonItem>
            <IonButton expand="block" onClick={loginEmail}>เข้าสู่ระบบด้วยอีเมล</IonButton>
          </IonCardContent>
        </IonCard>

        <div className="ion-text-center ion-padding-vertical">
          <IonText color="medium">หรือ</IonText>
        </div>

        {/* --- ส่วนที่ 2: Google Login --- */}
        <IonButton expand="block" color="danger" onClick={loginGoogle} className="ion-margin-bottom">
          <IonIcon icon={logoGoogle} slot="start" /> &nbsp; เข้าสู่ระบบด้วย Google
        </IonButton>

        <div className="ion-text-center ion-padding-vertical">
          <IonText color="medium">หรือ</IonText>
        </div>

        {/* --- ส่วนที่ 3: Phone Login --- */}
        <IonCard>
          <IonCardHeader><IonCardTitle>Phone Login</IonCardTitle></IonCardHeader>
          <IonCardContent>
            {stepPhone === 'input' ? (
              <>
                <IonItem className="ion-margin-bottom">
                  <IonIcon icon={callOutline} slot="start" />
                  <IonInput
                    fill="outline" 
                    label="เบอร์โทรศัพท์ (08x...)" labelPlacement="floating" type="tel"
                    value={phoneNumber} onIonInput={e => setPhoneNumber(e.detail.value!)} 
                  />
                </IonItem>
                <IonButton expand="block" color="tertiary" onClick={sendOtp}>ขอรหัส OTP</IonButton>
              </>
            ) : (
              <>
                <IonText color="primary"><p>กรอกรหัสที่ได้รับทาง SMS</p></IonText>
                <IonItem className="ion-margin-bottom">
                  <IonIcon icon={phonePortraitOutline} slot="start" />
                  <IonInput
                    fill="outline" 
                    label="รหัส OTP 6 หลัก" labelPlacement="floating" type="number"
                    value={otp} onIonInput={e => setOtp(e.detail.value!)} 
                  />
                </IonItem>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonButton expand="block" color="medium" fill="outline" onClick={() => setStepPhone('input')}>เปลี่ยนเบอร์</IonButton>
                    </IonCol>
                    <IonCol>
                      <IonButton expand="block" color="success" onClick={verifyOtp}>ยืนยัน</IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </>
            )}
          </IonCardContent>
        </IonCard>

        {/* 🚨 จำเป็นสำหรับ Web Phone Auth (ตามไฟล์ auth-web.ts ที่คุณให้มา) */}
        <div id="recaptcha-container"></div>

      </IonContent>
    </IonPage>
  );
};

export default Login;