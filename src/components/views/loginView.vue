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
          :class="{ invalid: erroredEmail }"
          v-model.trim="email"
          id="email"
          type="text"
          class="validate"
        />

        <label for="email">
          {{ translate("email") }}
        </label>

        <small v-if="erroredEmail" class="helper-text invalid">
          {{ translate("enter-your-email") }}
        </small>
      </div>

      <div class="input-field">
        <input
          @focus="v$.$reset()"
          @keydown.enter.prevent="submitHandler"
          :class="{ invalid: erroredPass }"
          v-model.trim="password"
          id="password"
          type="password"
          class="validate"
        />

        <label for="password">
          {{ translate("password") }}
        </label>

        <small v-if="erroredPass" class="helper-text invalid">
          {{ translate("enter-password") }}
          {{ minLength }}
          {{ translate("characters") }}
        </small>
      </div>
    </div>

    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          {{ translate("sign-in") }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center helper-text-account">
        {{ translate("do-not-have-account") }}

        <router-link to="/register">
          {{ translate("register") }}
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
import messages from "@/utilits/messages.js";
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
      isRussian: true,
    };
  },

  validations() {
    return {
      email: { required, email },
      password: { required, minLength: minLength(6) },
    };
  },

  computed: {
    minLength() {
      return this.v$.password.minLength.$params.min;
    },

    erroredEmail() {
      return this.v$.email.$error;
    },

    erroredPass() {
      return this.v$.password.$error;
    },
  },

  methods: {
    async submitHandler() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      const formSend = {
        email: this.email,
        password: this.password,
      };

      try {
        await this.$store.dispatch("login", formSend);
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

  mounted() {
    const message = this.$route.query.message;

    if (messages[this.language][message]) {
      M.toast({ html: messages[this.language][message] });
    }
  },
};
</script>

<style scoped>
@media (max-width: 700px) {
  .card {
    width: 400px;
  }
  .card-title {
    font-size: 26px;
  }

  label {
    font-size: 16px;
  }

  .card-content {
    padding-bottom: 0;
  }

  .helper-text {
    font-size: 14px;
  }
  .btn {
    font-size: 16px;
  }
  .helper-text-account {
    font-size: 16px;
  }
  .switch switch {
    font-size: 39px;
  }
}

@media (max-width: 450px) {
  .card {
    width: 250px;
  }
}
</style>