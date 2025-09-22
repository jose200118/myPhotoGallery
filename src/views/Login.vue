<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="floating">Email</ion-label>
        <ion-input v-model="email" type="email"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="floating">Password</ion-label>
        <ion-input v-model="password" type="password"></ion-input>
      </ion-item>

      <ion-button expand="full" @click="handleLogin">Ingresar</ion-button>
      <ion-text color="danger" v-if="error">{{ error }}</ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import { login } from '../services/authService';
import { useRouter } from 'vue-router';

const email = ref('jicardoso@ucompensar.edu.com');
const password = ref('!Aa123456789');
const error = ref('');

const router = useRouter();

const handleLogin = async () => {
  try {
    await login(email.value, password.value);
    router.replace('/home');
  } catch (err) {
    error.value = 'Credenciales incorrectas';
  }
};
</script>
