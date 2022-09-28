<template>
  <div>
    <div class="page-title">
      <h3>
        {{ translate("profile") }}
      </h3>
    </div>

    <form @submit.prevent="submitHandler" class="form">
      <div class="input-field">
        <input
          @focus="v$.$reset()"
          @keydown.enter.prevent="submitHandler"
          v-model.trim="name"
          id="name"
          type="text"
        />
        <label for="name">
          {{ translate("enter-new-name") }}
        </label>

        <small v-if="erroredName" class="helper-text invalid">
          {{ translate("enter-name") }}
        </small>
      </div>

      <div class="switch">
        <label>
          {{ translate("english") }}
          <input v-model="isRussian" type="checkbox" />
          <span class="lever"></span>
          {{ translate("russian") }}
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ translate("update") }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  name: "profile",

  setup() {
    return { v$: useVuelidate() };
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
      name: null,
      isRussian: true,
    };
  },

  validations() {
    return {
      name: { required },
    };
  },

  computed: {
    erroredName() {
      return this.v$.name.$error;
    },
  },

  methods: {
    async submitHandler() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      const updateToData = {
        name: this.name,
        language: this.language,
      };

      try {
        await this.$store.dispatch("updateInfo", updateToData);
      } catch (e) {}
    },
  },

  watch: {
    isRussian() {
      const currentLanguage = this.isRussian === true ? "ru" : "en";
      this.$emit("changeLanguage", currentLanguage);
    },
  },

  created() {
    this.name = this.$store.getters.info.name;

    this.isRussian = this.language === "ru" ? true : false;

    this.$nextTick().then(() => {
      M.updateTextFields();
    });
  },
};
</script>

<style scoped>
.switch {
  margin: 0 0 20px 0;
}
</style>