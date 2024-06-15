import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/ChatView.vue')
    },
    {
      path: '/groups',
      name: 'groups',
      component: () => import('../views/GroupsView.vue')
    },
    {
      path: '/group/:groupId',
      name: 'GroupChat',
      component: () => import('../views/ChatView.vue'),
      props: true
    },
    {
      path: '/notification',
      name: 'notification',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ChatView.vue')
    }
  ]
})

export default router
