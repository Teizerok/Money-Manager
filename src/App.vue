<template>
  <div id="app" :class="{ popupOpen: $store.getters.isPopupOpen }">
    <pre-loader v-if="loading" />
    <component v-else :is="layout" :translate="translate">
      <router-view />
    </component>
  </div>
</template>


<script>
import mainLayout from "./components/layout/mainLayout.vue";
import emptyLayout from "./components/layout/emptyLayout.vue";
import preLoader from "./components/views/preLoader.vue";
import lang from "./lang/translate.js";
import messages from "@/utilits/messages.js";

export default {
  name: "app",

  provide() {
    return {
      t: this.translate,
    };
  },

  data() {
    return {
      loading: true,
    };
  },

  components: {
    mainLayout,
    emptyLayout,
    preLoader,
  },

  computed: {
    //выбор layout-а
    layout() {
      return this.$route.meta.layout || "empty-layout";
    },
    //отслеживание ошибок
    error() {
      return this.$store.getters.getError;
    },
  },

  methods: {
    //функция перевода по ключам, функция получает ключ фразы и по выбраному языку из стейта возращаеет ее содержимое
    translate(prase) {
      const currentLanguage = this.$store.getters.getLanguage;

      if (lang[currentLanguage]) {
        return lang[currentLanguage][prase];
      }
    },
  },

  watch: {
    //при ошибке будет запущен watcher который выведен подсказку пользоателю о том что, что то пошло не так
    error() {
      const message = this.$store.getters.getError;
      const currentLanguage = this.$store.getters.getLanguage;

      if (messages[currentLanguage][message]) {
        M.toast({ html: messages[currentLanguage][message] });
      }
      this.$store.commit("clearError");
    },
  },

  //получение данных о пользователе, подписка на обновление бд, подсчет счета всех записей
  async created() {
    try {
      await this.$store.dispatch("loadInfo");
      await this.$store.dispatch("subscribeToUpdateInfo");
      await this.$store.dispatch("computeBill");
      this.language = this.$store.getters.info.language;
    } catch (e) {
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Fredoka+One&family=Fredoka:wght@300;400;500;600;700&family=Lexend+Giga:wght@100;200;300;400;500;600;700;800;900&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:wght@400;900&display=swap");
@import "~materialize-css/dist/css/materialize.min.css";
@import "./assets/index.css";

body {
  font-family: Fredoka, Arial, "Helvetica Neue", Helvetica, sans-serif;
}

.popupOpen {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}
</style>
