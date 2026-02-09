import React, { useState } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton,
  IonItem, IonList, useIonRouter
} from '@ionic/react';

// Import Firebase
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // ตรวจสอบ path ให้ถูกว่าไฟล์ firebase.ts อยู่ไหน

const Tab2: React.FC = () => {
  // 1. สร้าง State สำหรับเก็บค่าจากฟอร์ม (แทน v-model ใน Vue)
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<number | string>(''); // ใช้ string ชั่วคราวเพื่อให้ input ว่างได้ตอนเริ่ม
  const [type, setType] = useState<string>('expense');
  const [category, setCategory] = useState<string>('');
  const [note, setNote] = useState<string>('');

  // ใช้สำหรับเปลี่ยนหน้า (แทน useRouter)
  const router = useIonRouter();

  // 2. ฟังก์ชันบันทึกข้อมูล
  const saveExpense = async () => {
    // Basic Validation: เช็คว่ากรอกชื่อและจำนวนเงินหรือยัง
    if (!title || !amount) {
      alert("กรุณากรอกชื่อรายการและจำนวนเงิน");
      return;
    }

    try {
      await addDoc(collection(db, "expenses"), {
        title: title,
        amount: Number(amount), // แปลงเป็นตัวเลขก่อนบันทึก
        type: type,
        category: category,
        note: note,
        createdAt: new Date()
      });

      console.log("Document written successfully");

      // เคลียร์ค่าในฟอร์มหลังจากบันทึกเสร็จ (Optional)
      setTitle('');
      setAmount('');
      setCategory('');
      setNote('');

      // 3. กลับไปหน้ารายการหลัก (สมมติว่า Tab1 คือหน้ารายการ)
      // เช็คใน App.tsx ว่า route ของคุณชื่ออะไร ปกติคือ /tab1
      router.push('/tab1', 'back'); 

    } catch (e) {
      console.error("Error adding document: ", e);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>เพิ่มรายการรายรับ–รายจ่าย</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          {/* ชื่อรายการ */}
          <IonItem>
            <IonInput
              label="ชื่อรายการ"
              labelPlacement="floating"
              value={title}
              onIonInput={(e) => setTitle(e.detail.value!)}
            ></IonInput>
          </IonItem>

          {/* จำนวนเงิน */}
          <IonItem>
            <IonInput
              label="จำนวนเงิน"
              labelPlacement="floating"
              type="number"
              value={amount}
              onIonInput={(e) => setAmount(e.detail.value!)}
            ></IonInput>
          </IonItem>

          {/* ประเภท (รายรับ/รายจ่าย) */}
          <IonItem>
            <IonSelect
              label="ประเภท"
              labelPlacement="floating"
              value={type}
              onIonChange={(e) => setType(e.detail.value)}
            >
              <IonSelectOption value="income">รายรับ</IonSelectOption>
              <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
            </IonSelect>
          </IonItem>

          {/* หมวดหมู่ */}
          <IonItem>
            <IonInput
              label="หมวดหมู่"
              labelPlacement="floating"
              value={category}
              onIonInput={(e) => setCategory(e.detail.value!)}
            ></IonInput>
          </IonItem>

          {/* หมายเหตุ */}
          <IonItem>
            <IonTextarea
              label="หมายเหตุ"
              labelPlacement="floating"
              value={note}
              onIonInput={(e) => setNote(e.detail.value!)}
              rows={3}
            ></IonTextarea>
          </IonItem>
        </IonList>

        {/* ปุ่มบันทึก */}
        <div style={{ marginTop: '20px' }}>
          <IonButton expand="block" onClick={saveExpense}>
            บันทึกข้อมูล
          </IonButton>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Tab2;