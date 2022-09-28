<template>
  <form @submit.prevent="submitHandler" class="card auth-card">
    <div class="card-content">
      <span class="card-title">
        {{ translate("home-bookkeeping") }}
      </span>

      <div class="input-field">
        <input
          @focus="v$.$reset()"
          @keydown.enter.prevent="submitHandler"
          :class="{ invalid: emailErrored }"
          v-model.trim="email"
          id="email"
          type="text"
          class="validate"
        />
        <label for="email">
          {{ translate("email") }}
        </label>

        <small v-if="emailErrored" class="helper-text invalid">
          {{ translate("enter-your-email") }}
        </small>
      </div>

      <div class="input-field">
        <input
          @focus="v$.$reset()"
          @keydown.enter.prevent="submitHandler"
          :class="{ invalid: passwordErrored }"
          v-model.trim="password"
          id="password"
          type="password"
          class="validate"
        />
        <label for="password">
          {{ translate("password") }}
        </label>

        <small v-if="passwordErrored" class="helper-text invalid">
          {{ translate("enter-password") }}
          {{ minLength }}
          {{ translate("characters") }}
        </small>
      </div>

      <div class="input-field">
        <input
          @focus="v$.$reset()"
          @keydown.enter.prevent="submitHandler"
          :class="{ invalid: errorRepeated }"
          v-model.trim="repeatPassword"
          id="repeat-password"
          type="password"
          class="validate"
        />
        <label for="repeat-password">
          {{ translate("repeat-password") }}
        </label>

        <small v-if="errorRepeated" class="helper-text invalid">
          {{ translate("repeat-password") }}
        </small>
      </div>

      <div class="input-field">
        <input
          @focus="v$.$reset()"
          @keydown.enter.prevent="submitHandler"
          :class="{ invalid: nameErrored }"
          v-model.trim="name"
          id="name"
          type="text"
          class="validate"
        />
        <label for="name">
          {{ translate("name") }}
        </label>

        <small v-if="nameErrored" class="helper-text invalid">
          {{ translate("enter-name") }}
        </small>
      </div>

      <p>
        <label>
          <input v-model="agree" type="checkbox" />
          <span>
            {{ translate("agree") }}
          </span>
        </label>
      </p>
    </div>

    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          {{ translate("register") }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{ translate("have-account") }}
        <router-link to="/login">
          {{ translate("sign-in") }}
        </router-link>
      </p>

      <div class="switch center">
        <label>
          {{ translate("english") }}
          <input v-model="isRussian" type="checkbox" />
          <span class="lever"></span>
          {{ translate("russian") }}
        </label>
      </div>
    </div>
  </form>
</template>


<script>
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";

export default {
  name: "login",

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
      email: "",
      password: "",
      repeatPassword: "",
      name: "",
      agree: false,
      isRussian: true,
    };
  },

  validations() {
    return {
      email: { required, email },
      password: { required, minLength: minLength(6) },
      repeatPassword: { required, repeated: (v) => v === this.password },
      name: { required },
      agree: { checked: (v) => v },
    };
  },

  computed: {
    minLength() {
      return this.v$.password.minLength.$params.min;
    },

    emailErrored() {
      return this.v$.email.$error;
    },

    passwordErrored() {
      return this.v$.password.$error;
    },

    errorRepeated() {
      return this.v$.repeatPassword.$error;
    },

    nameErrored() {
      return this.v$.name.$error;
    },
  },

  methods: {
    async submitHandler() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      const formSend = {
        email: this.email,
        password: this.password,
        name: this.name,
        language: this.language,
      };

      try {
        await this.$store.dispatch("register", formSend);
        this.$router.push("/");
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
    this.isRussian = this.language === "ru" ? true : false;
  },
};
</script>