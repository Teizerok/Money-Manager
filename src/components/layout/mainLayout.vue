<template>
  <div>
    <div class="app-main-layout">
      <navbarElement
        @open="isOpenSidebar = !isOpenSidebar"
        @close="isOpenSidebar = false"
      />

      <sidebarElement
        @change-category="isOpenSidebar = false"
        :isOpen="isOpenSidebar"
      />

      <main class="app-content full">
        <div class="app-page">
          <router-view
            @change-language="(value) => $emit('changeLanguage', value)"
            :translate="translate"
            :language="language"
          ></router-view>
        </div>
      </main>

      <div class="fixed-action-btn">
        <router-link class="btn-floating btn-large" to="/records">
          <i class="large material-icons waves-effect">add</i>
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

  inject: ["translate"],

  components: {
    navbarElement,
    sidebarElement,
  },

  data() {
    return {
      isOpenSidebar: false,
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
      const currentLanguage = this.$store.getters.getLanguage;

      if (messages[currentLanguage][message]) {
        M.toast({ html: messages[currentLanguage][message] });
      }
      this.$store.commit("clearError");
    },
  },

  async created() {
    await this.$store.dispatch("subscribeToUpdateInfo");
  },
};
</script>

<style scoped>
.app-main-layout {
  background: #f5f6f7;
}
.btn-floating {
  background: #504ef3;
}

.btn-floating:hover {
  background: #3b3abf;
}
.btn-floating:focus {
  background: #3b3abf;
}
@media (max-width: 500px) {
  .fixed-action-btn {
    display: none;
  }
}
</style>