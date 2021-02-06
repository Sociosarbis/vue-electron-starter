import { nextTick } from 'vue'
import { Router } from 'vue-router'
import { Store, Module } from 'vuex'

const types = {
  HISTORY_CHANGED: 'HISTORY_CHANGED',
  SET_ROUTER_READY: 'SET_ROUTER_READY',
  SET_BACK_STATUS: 'SET_BACK_STATUS'
}

const mappings = {
  historyChanged: types.HISTORY_CHANGED,
  setRouterReady: types.SET_ROUTER_READY,
  setBackStatus: types.SET_BACK_STATUS
}

function defaultState() {
  return {
    isBack: false,
    routerReady: false,
    backStatus: false
  }
}

type DefaultState = ReturnType<typeof defaultState>

type Mutation = keyof typeof mappings

const config: Module<DefaultState, any> = {
  namespaced: true,
  state: defaultState,
  mutations: {
    [types.HISTORY_CHANGED](state, isBack: boolean) {
      state.isBack = isBack
    },
    [types.SET_BACK_STATUS](state, bool: boolean) {
      state.backStatus = bool
    },
    [types.SET_ROUTER_READY](state, isReady: boolean) {
      state.routerReady = isReady
    }
  }
}

export default function registerRouterStore(store: Store<any>, router: Router) {
  store.registerModule('router', config)

  const mutations = Object.keys(mappings).reduce((acc, key) => {
    acc[key as Mutation] = (payload: any) => store.commit(`router/${mappings[key as Mutation]}`, payload, { root: true })
    return acc
  }, {} as { [key in Mutation]: (payload: any) => any})

  const state = store.state.router as DefaultState

  router.beforeResolve((_, __, next) => {
    next()
    if (!state.routerReady) {
      nextTick(() => mutations.setRouterReady(true))
    }
  })

  router.beforeEach((_, __, next) => {
    state.backStatus && mutations.setBackStatus(false)
    next()
  })
}