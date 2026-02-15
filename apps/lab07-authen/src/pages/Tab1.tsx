import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonButton, IonIcon, IonAvatar, IonItem, IonLabel, IonList, useIonViewWillEnter, useIonRouter
} from '@ionic/react';
import { logOutOutline, personCircleOutline, mailOutline, callOutline } from 'ionicons/icons';
import { authService } from '../auth/auth-service';
import { AuthUser } from '../auth/auth-interface';

const Tab1: React.FC = () => {
  const router = useIonRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useIonViewWillEnter(() => {
    const initData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          // ถ้าไม่มี User ให้ดีดกลับไปหน้า Login
          router.push('/login', 'back', 'replace');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    initData();
  });  
  const handleLogout = async () => {
    await authService.logout();
    router.push('/login', 'back', 'replace');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>ข้อมูลผู้ใช้</IonTitle>
          <IonButton slot="end" onClick={handleLogout}>
            <IonIcon icon={logOutOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Profile</IonTitle>
          </IonToolbar>
        </IonHeader>

        {user ? (
          <IonCard className="ion-text-center ion-padding-top">
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              {user.photoUrl ? (
                <IonAvatar style={{ width: '100px', height: '100px' }}>
                  <img src={user.photoUrl} alt="Profile" />
                </IonAvatar>
              ) : (
                <IonIcon icon={personCircleOutline} style={{ fontSize: '100px', color: '#ccc' }} />
              )}
            </div>
            
            <IonCardHeader>
              <IonCardTitle>{user.displayName || 'ไม่ระบุชื่อ'}</IonCardTitle>
              <IonCardSubtitle>UID: {user.uid.substring(0, 10)}...</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
              <IonList>
                <IonItem lines="none">
                  <IonIcon icon={mailOutline} slot="start" color="primary" />
                  <IonLabel>
                    <h3>อีเมล</h3>
                    <p>{user.email || '-'}</p>
                  </IonLabel>
                </IonItem>

                <IonItem lines="none">
                  <IonIcon icon={callOutline} slot="start" color="success" />
                  <IonLabel>
                    <h3>เบอร์โทรศัพท์</h3>
                    <p>{user.phoneNumber || '-'}</p>
                  </IonLabel>
                </IonItem>
              </IonList>

              <IonButton expand="block" color="danger" className="ion-margin-top" onClick={handleLogout}>
                ออกจากระบบ
              </IonButton>
            </IonCardContent>
          </IonCard>
        ) : (
          <div className="ion-text-center ion-padding">
            <p>ไม่พบข้อมูลผู้ใช้...</p>
            <IonButton onClick={() => router.push('/login')}>ไปหน้าเข้าสู่ระบบ</IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;