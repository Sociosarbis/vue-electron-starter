import { createStore } from 'vuex'
import { SET_HEADER, SET_TITLE, SET_LOADING_STATE, SET_USER_INFO } from '@/store/mutation-types'


type HeaderType = Record<'background-color' | 'opacity' | 'color' | 'statusBarColor', string | number>

function defaultState() {
  return {
    title: '',
    header: {},
    loading: false,
    userInfo: {}
  }
}

export default createStore({
  state: defaultState,
  mutations: {
    [SET_TITLE](state, data = '') {
      state.title = data
    },
    [SET_HEADER](
      state,
      { 'background-color': backgroundColor = '#ffffff', opacity = 1, color = '#47555f', statusBarColor }: HeaderType = {} as HeaderType
    ) {
      state.header = { 'background-color': backgroundColor, color }
      statusBarColor = statusBarColor || backgroundColor
    },
    [SET_LOADING_STATE](state, isLoading: boolean) {
      state.loading = isLoading
    },
    [SET_USER_INFO](state, data) {
      state.userInfo = data
    }
  }
});