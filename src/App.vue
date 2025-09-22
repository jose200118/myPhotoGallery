<!-- <template>
  <ion-app>
    <ion-router-outlet></ion-router-outlet>
  </ion-app>
</template> -->

<template>
  <ion-app>
    <ion-router-outlet :key="$route.fullPath"></ion-router-outlet>
  </ion-app>
</template>


<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>
