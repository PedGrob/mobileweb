import { TextToSpeech } from '@capacitor-community/text-to-speech';

export class TtsService {
  async speak(text: string) {
    try {
      await TextToSpeech.speak({
        text: text,
        lang: 'th-TH', 
        rate: 0.9,   // ลองปรับช้าลงนิดนึงเพื่อให้ฟังชัด
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient',
      });
    } catch (e) {
      await TextToSpeech.speak({ text: "Task Started", lang: 'en-US' });
    }
  }  
}