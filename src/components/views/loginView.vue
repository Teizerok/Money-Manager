<template>
  <form v-if="!loading" @submit.prevent="submitHandler" class="card auth-card">
    <div class="card-content">
      <span class="card-title">
        {{ t("home-bookkeeping") }}
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
          {{ t("email") }}
        </label>

        <small v-if="erroredEmail" class="helper-text invalid">
          {{ t("enter-your-email") }}
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
          {{ t("password") }}
        </label>

        <small v-if="erroredPass" class="helper-text invalid">
          {{ t("enter-password") }}
          {{ minLength }}
          {{ t("characters") }}
        </small>
      </div>
    </div>

    <div class="card-action lighten-5">
      <div>
        <button
          class="send-button btn waves-effect blue lighten-1 auth-submit"
          type="submit"
        >
          {{ t("sign-in") }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="has-account center helper-text-account">
        {{ t("do-not-have-account") }}

        <router-link class="register" to="/register">
          <span class="blue-text text-darken-1">{{
            t("register")
          }}</span>
        </router-link>
      </p>

      <div class="switch center">
        <label>
          {{ t("russian") }}
          <input v-model="isEnglish" type="checkbox" />

          <span class="lever"></span>
          {{ t("english") }}
        </label>
      </div>
    </div>
  </form>

  <pre-loader v-else />
</template>



<script>
import useVuelidate from "@vuelidate/core";
import messages from "@/utilits/messages.js";
import { required, email, minLength } from "@vuelidate/validators";
import preLoader from "./preLoader.vue";

export default {
  name: "login",

  setup() {
    return { v$: useVuelidate() };
  },

  components: {
    preLoader,
  },

  inject: ["t"],

  data() {
    return {
      email: "",
      password: "",
      isEnglish: true,
      loading: false,
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
        this.loading = true;
        await this.$store.dispatch("login", formSend);
        this.$router.push("/");
      } catch (e) {
        this.loading = false;
      }
    },
  },

  watch: {
    isEnglish() {
      const currentLanguage = this.isEnglish === true ? "en" : "ru";
      this.$store.commit("setLanguage", currentLanguage);
    },

    loading() {
      this.$nextTick().then(() => {
        M.updateTextFields();
      });
    },
  },

  created() {
    this.isEnglish = this.$store.getters.getLanguage === "en" ? true : false;
  },

  mounted() {
    const message = this.$route.query.message;
    const currentLanguage = this.$store.getters.getLanguage;

    if (messages[currentLanguage][message]) {
      M.toast({ html: messages[currentLanguage][message] });
    }
  },
};
</script>

<style scoped>
.input-field input[type="text"]:focus + label,
.input-field input[type="number"]:focus + label,
.input-field input[type="password"]:focus + label,
.materialize-textarea:focus:not([readonly]) + label {
  color: #42a5f5 !important;
}

.input-field input[type="text"]:focus,
.input-field input[type="number"]:focus,
.input-field input[type="password"]:focus,
.materialize-textarea:focus:not([readonly]) {
  border-bottom: 1px solid #42a5f5 !important;
  box-shadow: 0 1px 0 0 #42a5f5 !important;
}

.switch label input[type="checkbox"]:checked + .lever:after {
  background-color: #0091ea;
}

.switch label input[type="checkbox"]:checked + .lever {
  background-color: #bbdefb;
}

@media (max-width: 550px) {
  .card {
    max-width: 400px;
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
  .register span {
    padding: 0 0 0 20px;
  }
}

@media (max-width: 450px) {
  .card {
    max-width: 350px;
  }
  .send-button {
    margin: 10px 0 5px;
  }
  .has-account {
    margin-bottom: 20px;
  }
  .switch {
    margin-bottom: 20px;
  }
}

@media (max-width: 375px) {
  .card {
    max-width: 250px;
  }
  .register {
    font-size: 14px;
  }
  .helper-text-account {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .switch label {
    font-size: 13px;
  }
}

.card {
  border-radius: 15px;
  overflow: hidden;
}
.auth-submit {
  border-radius: 6px;
}
</style>