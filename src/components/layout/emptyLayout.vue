<template>
  <div class="grey darken-1 empty-layout">
    <router-view
      @change-language="(value) => $emit('changeLanguage', value)"
      :translate="translate"
      :language="language"
    ></router-view>
  </div>
</template>

<script>
import messages from "@/utilits/messages.js";

export default {
  name: "emptyLayout",

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
      language: "ru",
    };
  },

  provide() {
    return {
      setLanguage: this.setLanguage,
      getLanguage: this.getLanguage,
    };
  },

  computed: {
    error() {
      return this.$store.getters.getError;
    },
  },

  methods: {
    setLanguage(current) {
      this.language = current;
    },

    getLanguage() {
      return this.language;
    },
  },

  watch: {
    error() {
      const message = this.$store.getters.getError;
      const lang = this.language;

      if (messages[lang][message]) {
        M.toast({ html: messages[lang][message] });
      }
      this.$store.commit("clearError");
    },
  },
};
</script>