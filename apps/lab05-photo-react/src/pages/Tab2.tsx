// CHANGE: Add the following import
import { camera } from 'ionicons/icons';
// CHANGE: Update the following import
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg, } from '@ionic/react';
import { usePhotoGallery } from '../hooks/usePhotoGallery';
// CHANGE: Remove or comment out `ExploreContainer`
// import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';

const Tab2: React.FC = () => {
  // CHANGE: Destructure `addNewToGallery()` from `usePhotoGallery()`
  const { photos, addNewToGallery } = usePhotoGallery();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
          <IonTitle size="small">Lab 05 - โดย นราวิชญ์ คำปุทา รหัส 663380017-6</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Photo Gallery</IonTitle>
            <IonTitle size="small">Lab 05 - โดย นราวิชญ์ คำปุทา รหัส 663380017-6</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* CHANGE: Add a grid component to display the photos */}
        <IonGrid>
          <IonRow>
            {/* CHANGE: Create a new column and image component for each photo */}
            {photos.map((photo) => (
              <IonCol size="2" key={photo.filepath}>
                <IonImg src={photo.webviewPath} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {/* CHANGE: Add the floating action button */}
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => addNewToGallery()}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>

        {/* CHANGE: Remove or comment out `ExploreContainer` */}
        {/* <ExploreContainer name="Tab 2 page" /> */}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
