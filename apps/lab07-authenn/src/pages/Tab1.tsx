import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonCard, 
  IonCardContent, 
  IonAvatar, 
  IonItem, 
  IonLabel, 
  IonButton, 
  IonIcon,
  IonLoading
} from '@ionic/react';
import { logOutOutline, personCircleOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { authService } from '../auth/auth-service'; // เช็ค path ไฟล์ให้ถูกนะครับ
import { useHistory } from 'react-router-dom';

const Tab1: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Load user error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    // ใช้ window.location เพื่อเคลียร์สถานะแอปให้สะอาด
    window.location.href = '/login';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>ข้อมูลผู้ใช้งาน</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message={'กำลังโหลดข้อมูล...'} />

        {user ? (
          <IonCard>
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
              <IonAvatar style={{ width: '100px', height: '100px' }}>
                <img 
                  src={user.photoURL || 'https://ionicframework.com/docs/img/demos/avatar.svg'} 
                  alt="profile" 
                />
              </IonAvatar>
            </div>
            
            <IonCardContent>
              <IonItem lines="none">
                <IonLabel className="ion-text-center">
                  <h2>{user.displayName || 'ไม่ระบุชื่อ'}</h2>
                  <p>{user.email}</p>
                </IonLabel>
              </IonItem>

              <div className="ion-padding-top">
                <IonButton 
                  expand="block" 
                  color="danger" 
                  fill="outline" 
                  onClick={handleLogout}
                >
                  <IonIcon slot="start" icon={logOutOutline} />
                  ออกจากระบบ
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        ) : (
          !loading && (
            <div className="ion-text-center ion-padding">
              <IonIcon icon={personCircleOutline} style={{ fontSize: '64px' }} />
              <p>ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่</p>
              <IonButton routerLink="/login">ไปหน้า Login</IonButton>
            </div>
          )
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;