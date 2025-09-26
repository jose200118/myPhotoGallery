<template>
  <ion-page>
    <ion-content fullscreen class="login-content">
      <div class="login-wrapper">
        <div class="logo-container">
          <img src="/favicon.png" alt="Logo Tienda" class="logo" />
          <h1 class="app-title">Mi Tienda</h1>
        </div>

        <ion-card class="login-card">
          <ion-card-header>
            <ion-card-title class="ion-text-center">Bienvenido</ion-card-title>
            <ion-card-subtitle class="ion-text-center">
              Inicia sesión para continuar
            </ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <ion-item lines="none" class="custom-input">
              <ion-input 
                v-model:value="email"
                type="email"
                placeholder="Correo electrónico"
                autocapitalize="none"
                autocomplete="email"
                autocorrect="off"
                required
              />
            </ion-item>

            <ion-item lines="none" class="custom-input">
              <ion-input
                v-model:value="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Contraseña"
                autocapitalize="none"
                autocomplete="current-password"
                autocorrect="off"
                required
              />
              <ion-icon
                :icon="showPassword ? eyeOff : eye"
                slot="end"
                class="toggle-password"
                @click="togglePassword"
              />
            </ion-item>

            <ion-button
              expand="block"
              shape="round"
              class="login-button ion-margin-top"
              @click="handleLogin"
            >
              Ingresar
            </ion-button>

            <ion-text
              color="danger"
              v-if="error"
              class="ion-text-center ion-margin-top"
            >
              {{ error }}
            </ion-text>
          </ion-card-content>
        </ion-card>

        <div class="footer-text">
          <p>¿No tienes cuenta? <a href="#">Regístrate</a></p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>


<script setup>
import { ref } from "vue";
import { login } from "../services/authService";
import { useRouter } from "vue-router";
import { eye, eyeOff } from "ionicons/icons";

const email = ref("jicardoso@ucompensar.edu.com");
const password = ref("!Aa123456789");
const error = ref("");
const showPassword = ref(false);
const router = useRouter();

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = "Por favor, completa todos los campos";
    return;
  }

  try {
    await login(email.value, password.value);
    router.replace("/home");
  } catch (err) {
    error.value = "Credenciales incorrectas";
  }
};





const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>



<style scoped>
/* Contenedor principal: centrado absoluto */
.login-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 0; /* elimina padding lateral y superior de ion-content */
  --padding-start: 0;
  --padding-end: 0;
  background: var(--ion-background-color);
}

/* Wrapper centrado */
.login-wrapper {
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto; /* asegura centrado horizontal */
  padding-top: 5.5rem;
}

/* Logo y título */
.logo-container {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 80px;
  height: auto;
  margin-bottom: 0.5rem;
}

.app-title {
  font-weight: bold;
  font-size: 1.5rem;
  color: var(--ion-color-primary);
}

/* Card centrado */
.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 1rem;
  background: var(--ion-card-background, var(--ion-color-light));
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

/* Inputs */
.custom-input {
  --background: var(--ion-item-background, #fafafa);
  --color: var(--ion-text-color);
  --placeholder-color: var(--ion-text-color-tint, #888);
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 0.3rem 0.5rem;
}

.custom-input ion-input:-webkit-autofill,
.custom-input ion-input:-webkit-autofill:hover,
.custom-input ion-input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px var(--ion-item-background, #fafafa) inset;
  box-shadow: 0 0 0px 1000px var(--ion-item-background, #fafafa) inset;
  -webkit-text-fill-color: var(--ion-text-color);
}

/* Botón */
.login-button {
  --background: linear-gradient(45deg, var(--ion-color-primary), #4facfe);
  font-weight: bold;
}

/* Footer */
.footer-text {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.footer-text a {
  color: var(--ion-color-primary);
  font-weight: 500;
  text-decoration: none;
}

/* Icono mostrar/ocultar contraseña */
.toggle-password {
  font-size: 1.3rem;
  color: var(--ion-text-color-tint, #666);
  cursor: pointer;
}
</style>
