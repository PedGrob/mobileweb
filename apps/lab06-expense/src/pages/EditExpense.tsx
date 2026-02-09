import React, { useState, useEffect } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton,
  IonItem, IonList, IonButtons, IonBackButton, useIonRouter,
  IonAlert, IonIcon // 1. เพิ่ม IonAlert และ IonIcon
} from '@ionic/react';
import { trash } from 'ionicons/icons'; // 2. เพิ่มไอคอนถังขยะ
import { useParams } from 'react-router';

// Firebase
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'; // 3. เพิ่ม deleteDoc
import { db } from '../firebase';

const EditExpense: React.FC = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | string>('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  
  // 4. สร้าง State สำหรับควบคุมการเปิด/ปิด Alert ยืนยันการลบ
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const router = useIonRouter();
  const { id } = useParams<{ id: string }>();

  // --- ส่วนดึงข้อมูล (เหมือนเดิม) ---
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const docRef = doc(db, "expenses", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setAmount(data.amount);
        setType(data.type);
        setCategory(data.category);
        setNote(data.note);
      } else {
        router.goBack();
      }
    };
    fetchData();
  }, [id]);

  // --- ส่วนบันทึกแก้ไข (เหมือนเดิม) ---
  const handleUpdate = async () => {
    if (!title || !amount) return;
    try {
      const docRef = doc(db, "expenses", id);
      await updateDoc(docRef, {
        title,
        amount: Number(amount),
        type,
        category,
        note,
      });
      router.goBack();
    } catch (e) {
      console.error("Error updating: ", e);
    }
  };

  // 5. ฟังก์ชันลบข้อมูล (Delete Logic)
  const handleDelete = async () => {
    try {
      const docRef = doc(db, "expenses", id);
      await deleteDoc(docRef); // คำสั่งลบจาก Firestore
      
      console.log("Document deleted");
      router.goBack(); // ลบเสร็จแล้วกลับไปหน้ารายการ
    } catch (e) {
      console.error("Error deleting: ", e);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>แก้ไขรายการ</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          {/* ... (Input Fields เหมือนเดิม) ... */}
          <IonItem>
            <IonInput label="ชื่อรายการ" labelPlacement="floating" value={title} onIonInput={e => setTitle(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonInput label="จำนวนเงิน" labelPlacement="floating" type="number" value={amount} onIonInput={e => setAmount(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonSelect label="ประเภท" labelPlacement="floating" value={type} onIonChange={e => setType(e.detail.value)}>
              <IonSelectOption value="income">รายรับ</IonSelectOption>
              <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonInput label="หมวดหมู่" labelPlacement="floating" value={category} onIonInput={e => setCategory(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonTextarea label="หมายเหตุ" labelPlacement="floating" value={note} onIonInput={e => setNote(e.detail.value!)} rows={3} />
          </IonItem>
        </IonList>

        <div style={{ marginTop: '20px' }}>
          <IonButton expand="block" onClick={handleUpdate}>
            บันทึกการแก้ไข
          </IonButton>

          {/* 6. ปุ่มลบข้อมูล (สีแดง) */}
          <IonButton 
            expand="block" 
            color="danger" 
            className="ion-margin-top"
            onClick={() => setShowDeleteAlert(true)} // กดแล้วเปิด Alert
          >
            <IonIcon icon={trash} slot="start" />
            ลบรายการนี้
          </IonButton>
        </div>

        {/* 7. กล่องยืนยันการลบ (Alert Confirmation) */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="ยืนยันการลบ"
          message="คุณแน่ใจหรือไม่ที่จะลบรายการนี้? การกระทำนี้ไม่สามารถย้อนกลับได้"
          buttons={[
            {
              text: 'ยกเลิก',
              role: 'cancel',
              handler: () => {
                console.log('ยกเลิกการลบ');
              }
            },
            {
              text: 'ลบข้อมูล',
              role: 'destructive', // สีแดงใน iOS
              handler: handleDelete // เรียกฟังก์ชันลบเมื่อกดยืนยัน
            }
          ]}
        />

      </IonContent>
    </IonPage>
  );
};

export default EditExpense;