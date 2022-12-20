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
          :class="{ invalid: emailErrored }"
          v-model.trim="email"
          id="email"
          type="text"
          class="validate"
        />
        <label for="email">
          {{ t("email") }}
        </label>

        <small v-if="emailErrored" class="helper-text invalid">
          {{ t("enter-your-email") }}
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
          {{ t("password") }}
        </label>

        <small v-if="passwordErrored" class="helper-text invalid">
          {{ t("enter-password") }}
          {{ minLength }}
          {{ t("characters") }}
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
          {{ t("repeat-password") }}
        </label>

        <small v-if="errorRepeated" class="helper-text invalid">
          {{ t("repeat-password") }}
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
          {{ t("name-user") }}
        </label>

        <small v-if="nameErrored" class="helper-text invalid">
          {{ t("enter-name") }}
        </small>
      </div>

      <p>
        <label>
          <input v-model="agree" class="checkbox" type="checkbox" />
          <span class="rulles">
            {{ t("agree") }}
          </span>
        </label>
      </p>
    </div>

    <div class="card-action grey lighten-5">
      <div>
        <button
          class="btn waves-effect blue lighten-1 auth-submit"
          type="submit"
        >
          {{ t("register") }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="has-account center">
        <span class="already-has-account">{{ t("have-account") }}</span>
        <router-link class="register" to="/login">
          <span class="blue-text text-darken-1">{{
            t("sign-in")
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
      repeatPassword: "",
      name: "",
      agree: false,
      isEnglish: true,
      loading: false,
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
        this.loading = true;
        await this.$store.dispatch("register", formSend);
        this.$router.push("/");
      } catch (e) {}
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

.input-field input[type="checkbox"]:checked + span:not(.lever):after {
  border: 2px solid #42a5f5;
  background-color: #42a5f5;
}

[type="checkbox"].filled-in:checked + span:not(.lever):after {
  background-color: #42a5f5;
}

.switch label input[type="checkbox"]:checked + .lever:after {
  background-color: #0091ea;
}

.switch label input[type="checkbox"]:checked + .lever {
  background-color: #bbdefb;
}

.already-has-account {
  margin: 0 5px 0 0;
}
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

  .rulles {
    margin: 0 0 10px 0;
  }
}

@media (max-width: 450px) {
  .card {
    width: 350px;
  }
  .send-button {
    margin: 10px 0 5px;
  }
  .has-account {
    margin-bottom: 10px;
  }
  .switch {
    margin: 5px 0;
  }
}

@media (max-width: 370px) {
  .card {
    width: 250px;
  }
  .switch label {
    font-size: 13px;
  }
  .has-account label {
    font-size: 14px;
  }
  .already-has-account {
    display: block;
  }
}

@media (max-height: 655px) {
  .card-title {
    font-size: 20px;
    margin: 0;
  }

  .input-field {
    margin: 5px 0;
    height: 70px;
  }
  .switch label {
    margin: 0;
  }
  .has-account {
    margin: 10px 0 5px;
  }

  .helper-text {
    font-size: 12px;
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