import { 
  IonContent, IonPage, IonButton, IonIcon, IonText, IonLoading, 
  IonToast, IonImg, IonInput, IonItem, IonList
} from '@ionic/react';
import { logoGoogle, mailOutline, lockClosedOutline, callOutline, chatbubbleEllipsesOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { authService } from '../auth/auth-service';
import './LoginPage.css';
import { useHistory } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // State สำหรับ Email/Password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State สำหรับ Phone OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);
  
  // เพิ่ม State สำหรับเก็บ verificationId ที่ได้จากการส่ง SMS
  const [verificationId, setVerificationId] = useState('');

  // --- ฟังก์ชันช่วยเหลือ ---
  const handleSuccess = () => {
    history.replace('/tab1');;
  };

  const handleError = (error: any) => {
    console.error('Login Error:', error);
    setErrorMsg(error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
  };

  // 1. Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const user = await authService.loginWithGoogle();
      if (user) handleSuccess();
    } catch (error) { handleError(error); }
    finally { setLoading(false); }
  };

  // 2. Email/Password Login (แก้ไขแล้ว)
  const handleEmailLogin = async () => {
    if (!email || !password) return setErrorMsg('กรุณากรอกอีเมลและรหัสผ่าน');
    setLoading(true);
    try {
      // เรียกใช้ loginWithEmailPassword และส่งเป็น Object
      const user = await authService.loginWithEmailPassword({ email, password });
      if (user) handleSuccess();
    } catch (error) { handleError(error); }
    finally { setLoading(false); }
  };

  // 3. Phone OTP Login (แก้ไขแล้ว)
  const handleSendOTP = async () => {
    if (!phoneNumber) return setErrorMsg('กรุณากรอกเบอร์โทรศัพท์');
    setLoading(true);
    try {
      // เรียกใช้ startPhoneLogin และส่งเป็น Object
      // แนะนำให้ใส่รหัสประเทศไว้ด้วย ถ้าผู้ใช้ไม่พิมพ์มา เช่น +66
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+66${phoneNumber.substring(1)}`;
      
      const result = await authService.startPhoneLogin({ phoneNumberE164: formattedPhone });
      setVerificationId(result.verificationId); // เก็บ ID ไว้ใช้ตอนยืนยัน
      setShowOTPInput(true);
    } catch (error) { handleError(error); }
    finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode) return setErrorMsg('กรุณากรอกรหัส OTP');
    setLoading(true);
    try {
      // เรียกใช้ confirmPhoneCode และส่งเป็น Object
      const user = await authService.confirmPhoneCode({ 
        verificationId: verificationId, 
        verificationCode: otpCode 
      });
      if (user) handleSuccess();
    } catch (error) { handleError(error); }
    finally { setLoading(false); }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding ion-text-center">
        {/* ต้องมี div นี้ซ่อนไว้สำหรับระบบ reCAPTCHA ของ Firebase Web (Phone Auth) */}
        <div id="recaptcha-container"></div>

        <div className="login-container">
          <div className="logo-section">
            <IonImg src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" style={{ width: '60px', margin: '0 auto' }} />
            <IonText color="dark">
              <h2>Lab07 Authen</h2>
            </IonText>
          </div>

          {/* --- Email/Password Section --- */}
          <IonList inset={true} className="ion-no-margin">
            <IonItem>
              <IonIcon icon={mailOutline} slot="start" />
              <IonInput label="Email" labelPlacement="floating" value={email} onIonInput={(e) => setEmail(e.detail.value!)} />
            </IonItem>
            <IonItem>
              <IonIcon icon={lockClosedOutline} slot="start" />
              <IonInput label="Password" type="password" labelPlacement="floating" value={password} onIonInput={(e) => setPassword(e.detail.value!)} />
            </IonItem>
          </IonList>
          <IonButton expand="block" onClick={handleEmailLogin} className="ion-margin-top">Login with Email</IonButton>

          <div className="divider"><span>OR</span></div>

          {/* --- Phone OTP Section --- */}
          {!showOTPInput ? (
            <IonItem lines="none" className="phone-item">
              <IonIcon icon={callOutline} slot="start" />
              <IonInput placeholder="08XXXXXXXX" value={phoneNumber} onIonInput={(e) => setPhoneNumber(e.detail.value!)} />
              <IonButton fill="clear" onClick={handleSendOTP}>Send OTP</IonButton>
            </IonItem>
          ) : (
            <IonItem lines="none" className="phone-item">
              <IonIcon icon={chatbubbleEllipsesOutline} slot="start" />
              <IonInput placeholder="Enter OTP" value={otpCode} onIonInput={(e) => setOtpCode(e.detail.value!)} />
              <IonButton fill="clear" onClick={handleVerifyOTP}>Verify</IonButton>
            </IonItem>
          )}

          <div className="divider"><span>OR</span></div>

          {/* --- Google Section --- */}
          <IonButton expand="block" color="light" onClick={handleGoogleLogin} className="google-btn">
            <IonIcon slot="start" icon={logoGoogle} />
            Sign in with Google
          </IonButton>

          <IonLoading isOpen={loading} message={'กรุณารอสักครู่...'} />
          <IonToast isOpen={!!errorMsg} message={errorMsg} duration={3000} onDidDismiss={() => setErrorMsg('')} color="danger" />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;