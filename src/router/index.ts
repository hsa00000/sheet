import { createRouter, createWebHashHistory } from 'vue-router'

// 靜態 import 所有的 view
import EditView from '../views/EditView.vue'
import PrintView from '../views/PrintView.vue'
import GuideView from '../views/GuideView.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: EditView,
    },
    {
      path: '/edit',
      name: 'edit',
      component: EditView,
    },
    {
      path: '/print',
      name: 'print',
      component: PrintView,
    },
    {
      path: '/guide',
      name: 'guide',
      component: GuideView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
  ],
})

export default router
