<template>
  <div class="dashboard-container">
    <Card />
    <Sale />
    <Observe />
  </div>
</template>

<script>
import Card from './card'
import Sale from './sale'
import Observe from './observe'

export default {
  name: 'Dashboard',
  components: {
    Card,
    Sale,
    Observe
  },
  mounted() {
    this.$store.dispatch('getHomeData')
  },
}
</script>

<style scoped>
</style>
