<template>
  <div>
    <div class="app-main-layout">
      <navbarElement
        @click="isOpenSidebar = !isOpenSidebar"
        :translate="translate"
        :language="language"
      />

      <sidebarElement
        :isOpen="isOpenSidebar"
        :translate="translate"
        :language="language"
      />

      <main class="app-content" :class="{ full: !isOpenSidebar }">
        <div class="app-page">
          <router-view
            @change-language="(value) => $emit('changeLanguage', value)"
            :translate="translate"
            :language="language"
          ></router-view>
        </div>
      </main>

      <div class="fixed-action-btn">
        <router-link class="btn-floating btn-large blue" to="/records">
          <i class="large material-icons">add</i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import navbarElement from "@/components/layout-components/navbarElement.vue";
import sidebarElement from "@/components/layout-components/sidebarElement.vue";
import messages from "@/utilits/messages.js";

export default {
  name: "mainLayout",

  components: {
    navbarElement,
    sidebarElement,
  },

  props: {
    language: {
      type: String,
      required: true,
      default: "ru",
    },

    translate: {
      type: Function,
      required: true,
      default: () => {},
    },
  },

  emits: {
    changeLanguage: null,
  },

  data() {
    return {
      isOpenSidebar: true,
    };
  },

  computed: {
    error() {
      return this.$store.getters.getError;
    },

    info() {
      return this.$store.getters.info;
    },
  },

  watch: {
    error() {
      const message = this.$store.getters.getError;

      console.log(message);
      if (messages[language][message]) {
        M.toast({ html: messages[language][message] });
      }
      this.$store.commit("clearError");
    },
  },

  async created() {
    await this.$store.dispatch("subscribeToUpdateInfo");
  },
};
</script>