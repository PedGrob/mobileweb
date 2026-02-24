import './HomePage.css';
import React, { useEffect, useMemo, useState } from "react";
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonCard, IonCardContent, IonText, IonBadge, IonButtons,
  IonInput
} from "@ionic/react";
import { MotionService } from "../core/MotionService";
import { TtsService } from "../core/TtsService";
import { HapticsService } from "../core/HapticsService";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import type { WorkoutState } from "../core/types";


export const HomePage: React.FC = () => {
  const [state, setState] = useState<WorkoutState | null>(null);
  const [targetReps, setTargetReps] = useState<number>(10);

  const engine = useMemo(() => new ArmWorkoutEngine(), []);
  const motion = useMemo(() => new MotionService(), []);
  const tts = useMemo(() => new TtsService(), []);
  const haptic = useMemo(() => new HapticsService(), []);

  useEffect(() => {
    const unsubscribe = engine.onChange(setState);
    return () => unsubscribe();
  }, [engine]);

  useEffect(() => {
    if (state?.status === "STOPPED") {
      motion.stop();
    }
  }, [state?.status, motion]);

  const start = async () => {
    try {
      await tts.speak(`เริ่มกายบริหารแขน ${targetReps} ครั้ง ยกขึ้นจนสุดแล้วลดลง`);
    } catch (e) {
      console.warn("TTS Error: Language not supported", e);
    }
    
    engine.start(targetReps);
    await motion.start((s) => engine.process(s));
    console.log("Motion started");
  };

  const stop = async () => {
    await motion.stop();
    engine.stop();
  };


  // ตัวแปรเช็คว่าระบบกำลังทำงานอยู่หรือไม่
  const isRunning = state?.status === "RUNNING";

  const isSuccess = state?.status === "STOPPED" && (state?.repDisplay ?? 0) >= targetReps && targetReps > 0;

return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle slot="start">Lab09 Sensors</IonTitle>
          <IonButtons slot="end">
            <div className="ion-padding-horizontal" style={{ textAlign: 'right' }}>
              <IonText style={{ fontSize: '0.75rem' }}>
                663380017-6<br />
                นราวิชญ์ คำปุทา
              </IonText>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* --- ปรับแต่ง IonContent ให้เปลี่ยนสีเมื่อ isSuccess เป็น true --- */}
      <IonContent 
        className="ion-padding ion-text-center"
        style={{ 
          '--background': isSuccess ? '#008000' : '',
          transition: 'background 0.3s ease-in-out'
        }}
      >
        
        <div style={{ marginTop: '10px' }}>
          <IonBadge color={isSuccess ? "success" : isRunning ? "primary" : "medium"}>
            {isSuccess ? "สำเร็จเป้าหมาย!" : isRunning ? "กำลังจับการเคลื่อนไหว" : "รอการเริ่มต้น"}
          </IonBadge>
        </div>

        <div style={{ margin: '40px 0' }}>
          <IonText color="dark">
            <h1 style={{ fontSize: '6rem', margin: '0', fontWeight: 'bold' }}>
              {state?.repDisplay ?? 0}
            </h1>
          </IonText>
          <IonText color="medium"><h2>/ {targetReps} ครั้ง</h2></IonText>
        </div>

        {!isRunning && !isSuccess && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <IonButton color="light" onClick={() => setTargetReps(prev => Math.max(1, prev - 1))}>-</IonButton>
            <div style={{ borderBottom: '2px solid var(--ion-color-primary)', width: '80px' }}>
              <IonInput 
                type="number" 
                value={targetReps}
                className="ion-text-center"
                style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                onIonInput={(e: any) => {
                  const val = parseInt(e.detail.value, 10);
                  if (!isNaN(val) && val > 0) {
                    setTargetReps(val);
                  }
                }}
              />
            </div>
            <IonButton color="light" onClick={() => setTargetReps(prev => prev + 1)}>+</IonButton>
          </div>
        )}

        <IonCard>
          <IonCardContent>
            <h2>
              คะแนนรวม: <IonText color="success"><b>{state?.stats.score ?? 0}</b></IonText>
            </h2>
            <div style={{ marginTop: '15px' }}>
              <IonText color={state?.stats.lastMessage === "OK" ? "success" : "danger"}>
                <h3>{state?.stats.lastMessage || "กด Start เพื่อเริ่ม"}</h3>
              </IonText>
            </div>
          </IonCardContent>
        </IonCard>

        <div style={{ marginTop: '30px' }}>
          {/* เปลี่ยนข้อความปุ่มถ้าทำสำเร็จแล้วให้เป็น "เริ่มใหม่" */}
          <IonButton expand="block" shape="round" size="large" onClick={start} disabled={isRunning}>
            {isSuccess ? "เริ่มใหม่อีกครั้ง" : "Start"}
          </IonButton>
          
          <IonButton expand="block" color="danger" fill="outline" shape="round" style={{ marginTop: '15px' }} onClick={stop} disabled={!isRunning}>
            Stop
          </IonButton>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default HomePage;