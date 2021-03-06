import { RouteRecordRaw } from 'vue-router'

const options: RouteRecordRaw = {
  path: '/',
  redirect: 'index',
  component: () => import('@/layouts/base.vue'),
  children: [
    {
      path: 'index',
      redirect: '',
      component: () => import('./views/index.vue'),
      meta: {
        title: 'vue-starter'
      }
    },
    {
      path: 'metaball',
      redirect: '',
      component: () => import('./views/metaball/index.vue'),
      meta: {
        title: 'metaball'
      }
    }
  ]
}

export default options