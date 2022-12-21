<template>
  <div class="layout grey lighten-2 empty-layout">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "emptyLayout",
};
</script>

<style scoped>
@media (max-height: 655px) {
  .layout {
    padding: 30px 0 0 0;
  }
}
</style>