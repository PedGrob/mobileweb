<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          <div>Photo Gallery</div>
          <div style="font-size: 0.8rem; font-weight: normal; color: gray;">
            โดย นราวิชญ์ คำปุทา รหัส 663380017-6
          </div>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col size="2" v-for="photo in photos" :key="photo.filepath">
            <ion-img :src="photo.webviewPath"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- CHANGE: Add the floating action button -->
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="addNewToGallery()">
          <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <!-- CHANGE: Remove or comment out <ExploreContainer /> -->
      <!-- <ExploreContainer name="Tab 2 page" /> -->
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { camera } from 'ionicons/icons';
import { 
  IonPage, IonHeader, IonFab, IonFabButton, IonIcon, 
  IonToolbar, IonTitle, IonContent, 
  IonGrid, IonRow, IonCol, IonImg // เพิ่มตัวแสดงผลรูปภาพ
} from '@ionic/vue';

import { usePhotoGallery } from '@/composables/usePhotoGallery';

const { photos, addNewToGallery } = usePhotoGallery();

// import ExploreContainer from '@/components/ExploreContainer.vue';
</script>
