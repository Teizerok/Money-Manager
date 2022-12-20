<template>
  <div class="layout grey lighten-1 empty-layout">
    <router-view></router-view>
  </div>
</template>

<script>
import messages from "@/utilits/messages.js";

export default {
  name: "emptyLayout",

  data() {
    return {
      language: "ru",
    };
  },

  computed: {
    error() {
      return this.$store.getters.getError;
    },
  },

  watch: {
    error() {
      const message = this.$store.getters.getError;
      const lang = this.$store.getters.getLanguage;

      if (messages[lang][message]) {
        M.toast({ html: messages[lang][message] });
      }
      this.$store.commit("clearError");
    },
  },
};
</script>

<style scoped>
@media (max-height: 655px) {
  .layout {
    padding: 30px 0 0 0;
  }
}
</style>