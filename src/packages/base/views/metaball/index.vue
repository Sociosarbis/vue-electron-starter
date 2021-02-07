<template>
  <div>
    <canvas ref="canvas" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import renderMetaBall from './webgl/mainMetaball';

@Options({})
export default class Metaball extends Vue {
  mounted() {
    renderMetaBall(this.$refs.canvas as HTMLCanvasElement)
  }
}
</script>