<template>
  <div id="app">
    <pre-loader v-if="loading" />
    <component
      v-else
      @change-language="changeLanguage"
      :is="layout"
      :translate="translate"
      :language="language"
    >
      <router-view />
    </component>
  </div>
</template>


<script>
import mainLayout from "./components/layout/mainLayout.vue";
import emptyLayout from "./components/layout/emptyLayout.vue";
import preLoader from "./components/views/preLoader.vue";
import lang from "./lang/translate.js";

export default {
  name: "app",
  data() {
    return {
      loading: true,
      language: "ru",
    };
  },

  components: {
    mainLayout,
    emptyLayout,
    preLoader,
  },

  computed: {
    layout() {
      return this.$route.meta.layout || "empty-layout";
    },
  },

  methods: {
    translate(prase) {
      if (lang[this.language]) {
        return lang[this.language][prase];
      }
    },

    changeLanguage(language) {
      this.language = language;
    },
  },

  async created() {
    try {
      await this.$store.dispatch("loadInfo");
      await this.$store.dispatch("subscribeToUpdateInfo");
      this.language = await this.$store.getters.info.language;
    } catch (e) {
      this.language = "ru";
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style lang="scss">
@import "~materialize-css/dist/css/materialize.min.css";
@import "./assets/index.css";
</style>
