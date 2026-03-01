import { Haptics, NotificationType ,ImpactStyle} from "@capacitor/haptics";

export class HapticsService {
  async success() {
    await Haptics.notification({ type: NotificationType.Success });
  }
  
  async warning() {
    await Haptics.notification({ type: NotificationType.Warning });
  }

  async impact() {
    await Haptics.impact({ style: ImpactStyle.Medium });
  }
}
