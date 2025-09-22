<template>
  <ion-page>
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>📷 Mi Galería</ion-title>
    <ion-buttons slot="end">
      <ion-button color="medium" @click="logoutUser">
        Cerrar Sesión
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>


    <ion-content class="ion-padding">

      <!-- Botón volver -->
      <ion-button
        color="medium"
        size="small"
        fill="solid"
        class="close-btn"
        @click="stopCamera"
      >
        ⬅️
      </ion-button>

      <!-- Vista previa solo en Web -->
      <div v-if="isWeb" class="preview-container">
        <video
          ref="videoRef"
          autoplay
          playsinline
          muted
          class="preview-video"
        ></video>

        <!-- Botones cámara -->
        <div class="camera-controls">
          <button class="capture-btn" @click="capturePhoto"></button>
        </div>
      </div>

      <!-- Galería de fotos -->
      <div class="gallery">
        <div v-for="(p, i) in photos" :key="i" class="photo-card">
          <img :src="p" />
          <ion-button
            color="transparent"
            size="small"
            fill="solid"
            class="delete-btn"
            @click="deletePhoto(i)"
          >
            ❌
          </ion-button>
        </div>
      </div>

      <!-- Botón enviar fotos al API -->
      <ion-button
        v-if="photos.length > 0"
        expand="block"
        color="success"
        @click="uploadPhotos"
      >
        📤 Enviar al API
      </ion-button>

   
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  photos,
  takePhoto,
  startCameraPreview,
  stopCameraPreview,
  videoElement,
  removePhoto
} from '../services/photoService';
import { Capacitor } from '@capacitor/core';

const router = useRouter();
const videoRef = ref<HTMLVideoElement | null>(null);
const isWeb = Capacitor.getPlatform() === 'web';



import { onIonViewWillEnter, onIonViewWillLeave } from '@ionic/vue';

onIonViewWillEnter(() => {
  if (isWeb) {
    videoElement.value = videoRef.value;
    startCameraPreview();
  }
});

onIonViewWillLeave(() => {
  if (isWeb) {
    stopCameraPreview();
  }
});


onMounted(() => {
  if (isWeb) {
    videoElement.value = videoRef.value;
    startCameraPreview();
  }
});

onBeforeUnmount(() => {
  if (isWeb) stopCameraPreview();
});

const capturePhoto = async () => {
  await takePhoto();
};

const deletePhoto = (index: number) => {
  removePhoto(index);
};

const uploadPhotos = async () => {
  try {
    const token = localStorage.getItem('token'); // tu token guardado

    for (const img of photos.value) {
      const payload = {
        nombre: "Dispositivo Demo",
        descripcion: "Descripción Demo",
        fechaLanzamiento: new Date().toISOString(),
        precio: 1000,
        imagen: img,
        marcaId: 1,
        categoriaId: 2
      };

      // Envío al API con token
      const res = await fetch(`https://localhost:7167/api/dispositivos/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Error API:", err);
        alert("❌ Error al enviar la foto al API");
        return;
      }
    }

    alert("📤 Fotos enviadas al API correctamente");
    photos.value = []; // Limpia galería
  } catch (err) {
    console.error("Error al enviar al API:", err);
    alert("❌ Error al enviar al API");
  }
};



const logoutUser = () => {
  localStorage.removeItem('token');
  router.replace('/login');
};

const stopCamera = () => {
  stopCameraPreview();
  router.replace('/home');
};
</script>

<style scoped>
.preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
  position: relative;
}

.preview-video {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  border: 2px solid #3880ff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

/* Botón circular captura */
.capture-btn {
  margin-top: 12px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 4px solid #3880ff;
  background: white;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.capture-btn:hover {
  transform: scale(1.1);
}

.camera-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
}

.close-btn {
  border-radius: 50%;
  font-size: 16px;
  min-width: 40px;
  height: 40px;
  padding: 0;
  margin-bottom: 15px;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 20px;
}

.photo-card {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 2px 8px rgba(0,0,0,0.15);
}

.photo-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.delete-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  border-radius: 50%;
  font-size: 12px;
  min-width: 28px;
  height: 28px;
  padding: 0;
}
</style>
