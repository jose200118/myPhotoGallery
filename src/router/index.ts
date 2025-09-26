import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import Login from '../views/Login.vue';
import Camera from '../views/Camara.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', name: 'Home', component: HomePage },
  { path: '/camara', name: 'Camara', component: Camera }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const token = localStorage.getItem('token');

  if (authRequired && !token) {
    if (to.path !== '/login') {
      return next('/login');
    }
  }
  next();
});

// router.beforeEach((to, from, next) => {
//   const publicPages = ['/login'];
//   const authRequired = !publicPages.includes(to.path);
//   const token = localStorage.getItem('token');

//   if (authRequired && !token) {
//     // No hay token, redirigir al login
//     return next('/login');
//   }
//   next();
// });

export default router;
