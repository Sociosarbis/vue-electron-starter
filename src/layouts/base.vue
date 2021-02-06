<template>
  <div class="base">
    <router-view v-slot="{ Component }">
    <transition :name="routerReady ? (isBack ? 'slide-right' : 'slide-left') : ''">
      <component :is="Component" />
    </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('router', ['routerReady', 'isBack'])
  }
}
</script>
