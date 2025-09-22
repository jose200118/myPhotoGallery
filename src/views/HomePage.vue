<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Inicio</ion-title>
        <ion-buttons slot="end">
          <ion-button color="medium" @click="logoutUser">
            Cerrar Sesión
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- Botón abrir cámara -->
      <ion-button expand="block" color="medium" @click="camara">
        Abrir Cámara
      </ion-button>

      <!-- Spinner cargando -->
      <div v-if="loading" class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Cargando dispositivos...</p>
      </div>

      <!-- Galería de fotos -->
      <div class="gallery" v-else-if="dispositivos.length > 0">
        <div v-for="(disp, i) in dispositivos" :key="i" class="photo-card">
          <img :src="disp.imagen" />
          <div class="info">
            <p>{{ disp.nombre }}</p>
            <p>{{ disp.precio }}</p>
          </div>
        </div>
      </div>

      <p v-else>No hay dispositivos cargados.</p>

    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { onIonViewWillEnter } from '@ionic/vue';

const router = useRouter();
const dispositivos = ref<any[]>([]);
const loading = ref(false);

const baseURL = "https://localhost:7167/api";

const camara = () => router.replace('/camara');
const logoutUser = () => {
  localStorage.removeItem('token');
  router.replace('/login');
};


// Función para obtener dispositivos
const fetchDispositivos = async () => {
  try {
    loading.value = true;        // mostrar spinner
    await nextTick();            // forzar actualización del DOM antes de fetch

    const token = localStorage.getItem('token');
    const res = await fetch(`${baseURL}/dispositivos/read?Pagina=1&RegistrosPorPagina=10`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Error API:", err);
      return;
    }

    const data = await res.json();
    dispositivos.value = data;
  } catch (err) {
    console.error("Error al cargar dispositivos:", err);
  } finally {
    loading.value = false;       // ocultar spinner
  }
};

// Ejecutar al montar (F5)
onMounted(() => {
  fetchDispositivos();
});

// Ejecutar al entrar en vista (SPA)
onIonViewWillEnter(() => {
  fetchDispositivos();
});
</script>

<style scoped>
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
  text-align: center;
}

.photo-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.info {
  padding: 4px;
  font-size: 12px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
}
.loading-container p {
  margin-top: 8px;
  font-size: 14px;
  color: #555;
}
</style>
