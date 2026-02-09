import React, { useState, useEffect } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonNote, IonBadge, IonListHeader,
  IonGrid, IonRow, IonCol, IonCard, IonCardContent
} from '@ionic/react';

// Import Firebase
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

// กำหนด Type ของข้อมูลเพื่อให้ TypeScript เข้าใจ
interface Expense {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note: string;
  createdAt: any; // หรือ Timestamp ถ้า import มา
}

const Tab1: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    // 1. สร้าง Query ดึงข้อมูลจาก collection 'expenses' เรียงตามเวลาล่าสุด
    const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));

    // 2. ใช้ onSnapshot เพื่อดึงข้อมูลแบบ Realtime
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedExpenses: Expense[] = [];
      let income = 0;
      let expense = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        // คำนวณยอดรวมทันทีที่วนลูป
        if (data.type === 'income') {
          income += Number(data.amount);
        } else {
          expense += Number(data.amount);
        }

        loadedExpenses.push({ id: doc.id, ...data } as Expense);
      });

      // อัปเดต State
      setExpenses(loadedExpenses);
      setTotalIncome(income);
      setTotalExpense(expense);
    });

    // คืนค่าฟังก์ชัน unsubscribe เพื่อยกเลิกการฟังข้อมูลเมื่อเปลี่ยนหน้า (Cleanup)
    return () => unsubscribe();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>รายการบันทึก</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">รายการบันทึก</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* ส่วนแสดงผลรวม */}
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow className="ion-text-center">
                <IonCol>
                  <IonLabel color="success">
                    <h3>รายรับ</h3>
                    <h1>{totalIncome.toLocaleString()}</h1>
                  </IonLabel>
                </IonCol>
                <IonCol>
                  <IonLabel color="danger">
                    <h3>รายจ่าย</h3>
                    <h1>{totalExpense.toLocaleString()}</h1>
                  </IonLabel>
                </IonCol>
                <IonCol>
                  <IonLabel>
                    <h3>คงเหลือ</h3>
                    <h1>{(totalIncome - totalExpense).toLocaleString()}</h1>
                  </IonLabel>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* ส่วนแสดงรายการ */}
        <IonList>
          <IonListHeader>
            <IonLabel>รายการล่าสุด</IonLabel>
          </IonListHeader>

          {expenses.map((item) => (
            <IonItem key={item.id}
              routerLink={`/edit/${item.id}`}
              button
              detail={true}
            >
              <IonLabel>
                <h2>{item.title}</h2>
                <p>{item.category} {item.note ? `- ${item.note}` : ''}</p>
                {/* แสดงวันที่แบบย่อ (ถ้ามีข้อมูล createdAt) */}
                <p style={{ fontSize: '0.8em', color: '#888' }}>
                  {item.createdAt?.seconds 
                    ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('th-TH')
                    : 'เพิ่งสร้าง'}
                </p>
              </IonLabel>
              
              <IonNote slot="end" color={item.type === 'income' ? 'success' : 'danger'}>
                {item.type === 'income' ? '+' : '-'} {item.amount.toLocaleString()}
              </IonNote>
            </IonItem>
          ))}

          {expenses.length === 0 && (
            <div className="ion-text-center ion-padding" style={{ marginTop: '20px', color: '#888' }}>
              <p>ยังไม่มีรายการบันทึก</p>
            </div>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;