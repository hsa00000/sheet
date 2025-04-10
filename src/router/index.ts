import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/EditView.vue'),
    },
    {
      path: '/edit',
      name: 'edit',
      component: () => import('../views/EditView.vue'),
    },
    {
      path: '/print',
      name: 'print',
      component: () => import('../views/PrintView.vue'),
    },
    {
      path: '/guide',
      name: 'guide',
      component: () => import('../views/GuideView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
