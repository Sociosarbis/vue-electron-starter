import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import registerRouterStore from '@/store/router'
import { SET_HEADER, SET_TITLE } from '@/store/mutation-types'
import BaseRoutes from '@/packages/base/routes'


const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    BaseRoutes
  ]
})

router.beforeEach(async (to, _, next) => {
  if (to.meta.validate) {
    const validateResult = to.meta.validate(store.state)
    if (validateResult) {
      next(validateResult)
      return
    }
  }
  store.commit(SET_TITLE, '')
  next()
})

router.afterEach(to => {
  // 重置滑动高度
  document.documentElement.scrollTop = document.body.scrollTop = 0
  // 设置页面标题
  if (to.meta) {
    to.meta.title && store.commit(SET_TITLE, to.meta.title)
    document.title = to.meta.title
    store.commit(SET_HEADER, to.meta.header)
  }
})

registerRouterStore(store, router)

export default router