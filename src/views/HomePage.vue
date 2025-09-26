<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Tienda</ion-title>
        <ion-buttons slot="end">
          <!-- Botón del carrito -->
          <ion-button @click="toggleCart">
            🛒 {{ cart.length }}
          </ion-button>
          <ion-button color="light" @click="logoutUser">
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
        <p>Cargando productos...</p>
      </div>

      <!-- Lista de productos -->
      <div v-else-if="dispositivos.length > 0" class="products">
        <ion-card v-for="prod in dispositivos" :key="prod.id" class="product-card">
          <img :src="prod.imagen" :alt="prod.nombre" />
          <ion-card-header>
            <ion-card-title>{{ prod.nombre }}</ion-card-title>
            <ion-card-subtitle>${{ prod.precio.toFixed(2) }}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p>{{ prod.descripcion }}</p>
            <ion-button expand="block" color="success" @click="addToCart(prod)">
              Agregar al carrito
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>

      <p v-else>No hay productos cargados.</p>

      <!-- Carrito -->
      <ion-modal :is-open="showCart" @didDismiss="showCart = false">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Carrito</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showCart = false">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div v-if="cart.length > 0">
            <ion-list>
              <ion-item v-for="(item, i) in cart" :key="i">
                <ion-label>
                  {{ item.nombre }} <br />
                  <small>${{ item.precio.toFixed(2) }}</small>
                </ion-label>
                <ion-button color="danger" size="small" @click="removeFromCart(i)">
                  Quitar
                </ion-button>
              </ion-item>
            </ion-list>
            <h2>Total: ${{ cartTotal.toFixed(2) }}</h2>
            <ion-button expand="block" color="success" @click="pagar">
              Pagar
            </ion-button>
          </div>
          <p v-else>No hay productos en el carrito.</p>
        </ion-content>
      </ion-modal>

      <!-- Alert de compra realizada -->
      <ion-alert
        :is-open="showCompraOk"
        header="Compra realizada"
        message="Tu compra fue procesada con éxito 🎉"
        :buttons="['OK']"
        @didDismiss="showCompraOk = false"
      ></ion-alert>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
import { onIonViewWillEnter } from "@ionic/vue";
import { Preferences } from "@capacitor/preferences";

const router = useRouter();
const dispositivos = ref<any[]>([]);
const loading = ref(false);

const cart = ref<any[]>([]);
const showCart = ref(false);
const showCompraOk = ref(false);

const baseURL = "https://localhost:7167/api";

// Guardar carrito en Preferences
const saveCart = async () => {
  await Preferences.set({
    key: "cart",
    value: JSON.stringify(cart.value),
  });
};

// Cargar carrito desde Preferences
const loadCart = async () => {
  const { value } = await Preferences.get({ key: "cart" });
  if (value) {
    try {
      cart.value = JSON.parse(value);
    } catch {
      cart.value = [];
    }
  }
};

// Ir a cámara
const camara = () => router.replace("/camara");

// Logout
const logoutUser = async () => {
  await Preferences.remove({ key: "token" });
  await Preferences.remove({ key: "cart" });
  router.replace("/login");
};

// Obtener dispositivos desde API
const fetchDispositivos = async () => {
  try {
    loading.value = true;
    await nextTick();

    const { value: token } = await Preferences.get({ key: "token" });
    const res = await fetch(
      `${baseURL}/dispositivos/read?Pagina=1&RegistrosPorPagina=20`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) throw new Error(await res.text());
    dispositivos.value = await res.json();
  } catch (err) {
    console.error("Error al cargar dispositivos:", err);
  } finally {
    loading.value = false;
  }
};

// Carrito
const addToCart = async (prod: any) => {
  cart.value.push(prod);
  await saveCart();
};
const removeFromCart = async (i: number) => {
  cart.value.splice(i, 1);
  await saveCart();
};
const toggleCart = () => {
  showCart.value = true;
};
const cartTotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.precio, 0)
);

// Pagar
const pagar = async () => {
  cart.value = [];
  await saveCart();
  showCart.value = false;
  showCompraOk.value = true;
};

// Ejecutar al montar
onMounted(() => {
  loadCart();
  fetchDispositivos();
});
onIonViewWillEnter(() => {
  fetchDispositivos();
});
</script>

<style scoped>
.products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.product-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.product-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
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
