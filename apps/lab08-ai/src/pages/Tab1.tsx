import React, { useRef, useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";

import { PhotoService } from "../core/photo.service";
import { GeminiVisionService } from "../core/gemini.service";
import type { Base64Image, ImageAnalysisResult } from "../core/ai.interface";

const Tab1: React.FC = () => {
  // --- States ---
  const [img, setImg] = useState<Base64Image | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // --- Refs ---
  const fileEl = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  // 1. เลือกไฟล์จากเครื่อง (Web Approach)
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const b64 = await PhotoService.fromFile(file);
      setImg(b64);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null); // ล้างผลลัพธ์เก่า
    } catch (error) {
      console.error("File selection error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. ถ่ายภาพด้วย Capacitor Camera
  const onTakePhoto = async () => {
    setLoading(true);
    try {
      const b64 = await PhotoService.fromCamera();
      setImg(b64);
      setPreviewUrl(`data:${b64.mimeType};base64,${b64.base64}`);
      setResult(null);
    } catch (error) {
      console.error("Camera error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. ส่งภาพไปวิเคราะห์ที่ Gemini
  const onAnalyze = async () => {
    if (!img) return;
    setLoading(true);
    try {
      const analysis = await GeminiVisionService.analyze(img);
      setResult(analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      alert("เกิดข้อผิดพลาดในการวิเคราะห์ภาพ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lab08: Gemini Vision โดย นราวิชญ์ คำปุทา</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Input สำหรับเลือกไฟล์ (ซ่อนไว้แล้วใช้ Ref สั่ง Click) */}
        <input
          ref={fileEl}
          type="file"
          accept="image/*"
          hidden
          onChange={onFileChange}
        />

        <IonButton expand="block" onClick={() => fileEl.current?.click()}>
          เลือกไฟล์ภาพ
        </IonButton>
        
        <IonButton expand="block" color="secondary" onClick={onTakePhoto}>
          ถ่ายภาพ (Camera)
        </IonButton>

        {/* แสดงภาพ Preview */}
        {previewUrl && (
          <div 
          style={{ 
            display: 'flex',        
            justifyContent: 'center',
            alignItems: 'center',    
            width: '100%',
            marginTop: '20px', 
            textAlign: 'center' 
            }}>
            <IonImg 
            src={previewUrl} 
            style={{ 
              width: '100%',
              maxWidth: '400px',
              borderRadius: '12px', 
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              overflow: 'hidden' 
              }} />
          </div>
        )}

        <IonButton
          expand="block"
          color="success"
          style={{ marginTop: '20px' }}
          disabled={!img || loading}
          onClick={onAnalyze}
        >
          {loading ? "กำลังประมวลผล..." : "วิเคราะห์ภาพด้วย AI"}
        </IonButton>

        {/* แสดง Spinner ตอนโหลด */}
        {loading && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <IonSpinner name="crescent" />
            <p>AI กำลังคิดโปรดรอสักครู่...</p>
          </div>
        )}

        {/* แสดงผลลัพธ์เป็น JSON (ตามตัวอย่าง Vue) */}
        {result && (
          <div style={{ marginTop: '20px' }}>
             <h3 style={{ marginLeft: '10px' }}>ผลการวิเคราะห์:</h3>
             <pre style={{ 
               backgroundColor: '#f4f4f4', 
               padding: '10px', 
               borderRadius: '8px', 
               overflowX: 'auto',
               fontSize: '14px',
               color: '#333'
             }}>
               {JSON.stringify(result, null, 2)}
             </pre>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;