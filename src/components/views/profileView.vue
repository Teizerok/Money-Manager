<template>
  <div class="profile">
    <div class="page-title">
      <h3 class="title">
        {{ t("profile") }}
      </h3>
    </div>

    <form @submit.prevent="submitHandler" class="form">
      <div class="input-field name">
        <input
          @focus="v$.$reset()"
          @keydown.enter.prevent="submitHandler"
          v-model.trim="name"
          id="name"
          type="text"
        />
        <label for="name">
          {{ t("enter-new-name") }}
        </label>

        <small v-if="erroredName" class="helper-text invalid">
          {{ t("enter-name") }}
        </small>
      </div>

      <div class="input-field currensies">
        <select v-model="currentCurrency" ref="currencies">
          <option
            class="option"
            v-for="item in currencies"
            :key="item"
            :value="item"
          >
            <span class="select-option"> {{ item }}</span>
          </option>
        </select>

        <label>
          {{ t("choice-main-currency") }}
        </label>
      </div>

      <div class="input-field languages">
        <select v-model="currentLanguage" ref="languages">
          <option
            class="option"
            v-for="{ lang, title, img } in languages"
            :key="lang"
            :value="lang"
          >
            <div class="image-option">
              <img :src="img" alt="image" />
            </div>
            <span class="select-option"> {{ t(title) }}</span>
          </option>
        </select>

        <label>
          {{ t("choice-language") }}
        </label>
      </div>

      <button class="btn waves-effect send-button" type="submit">
        {{ t("update") }}
        <i class="material-icons right">update</i>
      </button>
    </form>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import messages from "@/utilits/messages.js";

import english from "../../assets/images/english.png";
import franch from "../../assets/images/franch.png";
import russian from "../../assets/images/russian.png";
import ukraine from "../../assets/images/ukraine.png";

export default {
  name: "profile",

  setup() {
    return { v$: useVuelidate() };
  },

  inject: ["t"],

  data() {
    return {
      formCurrencies: null,
      formLanguages: null,

      name: null,

      currencies: ["USD", "UAH", "EUR"],
      languages: [
        { lang: "en", title: "english", img: english },
        { lang: "ua", title: "ukrainien", img: ukraine },
        { lang: "ru", title: "russian", img: russian },
        { lang: "fr", title: "franch", img: franch },
      ],

      currentCurrency: null,
      currentLanguage: null,
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
        language: this.$store.getters.getLanguage,
        currentCurrency: this.currentCurrency,
      };

      try {
        const currentLanguage = this.$store.getters.getLanguage;
        M.toast({ html: messages[currentLanguage]["profile-updatated"] });
        await this.$store.dispatch("updateInfo", updateToData);
      } catch (e) {}
    },
  },

  watch: {
    currentLanguage() {
      this.$store.commit("setLanguage", this.currentLanguage);
    },
  },

  created() {
    this.name = this.$store.getters.info.name;

    this.currentCurrency = this.$store.getters.info.currentCurrency;
    this.currentLanguage = this.$store.getters.getLanguage;

    this.$nextTick().then(() => {
      M.updateTextFields();
      this.formCurrencies = M.FormSelect.init(this.$refs.currencies);
      this.formLanguages = M.FormSelect.init(this.$refs.languages);
    });
  },
};
</script>

<style scoped>
.switch {
  margin: 0 0 20px 0;
}
</style>



<style scoped>
.switch label input[type="checkbox"]:checked + .lever:after {
  background-color: #0091ea;
}

.switch label input[type="checkbox"]:checked + .lever {
  background-color: #bbdefb;
}
.select-option {
  color: #504ef3;
  padding: 0 0 0 30px;
}

.title {
  color: #0a101b;
}
.send-button {
  background: #504ef3;
  border-radius: 6px;
  width: 300px;
}

.profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.input-field {
  width: 350px;
}

.name {
  margin: 0 0 35px 0;
}
.currensies {
  margin: 0 0 40px 0;
}
.languages {
  margin: 0 0 30px 0;
}

.option {
  position: relative;
}

.image-option {
  position: absolute;
  left: 0;
  width: 22px;
  height: 22px;
}

.image-option img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  top: -5px;
}

@media (max-width: 700px) {
  label {
    font-size: 18px;
  }

  .helper-text {
    font-size: 14px;
  }
  .btn {
    font-size: 18px;
  }
  .helper-text-account {
    font-size: 18px;
  }
  .switch switch {
    font-size: 39px;
  }
  .currensies label {
    font-size: 14px;
  }
  .languages label {
    font-size: 14px;
  }
}

@media (max-width: 400px) {
  .input-field {
    width: 200px;
  }
  .send-button {
    background: #504ef3;
    border-radius: 6px;
    width: 160px;
  }
}

.input-field input[type="text"]:focus + label,
.input-field input[type="number"]:focus + label,
.materialize-textarea:focus:not([readonly]) + label {
  color: #504ef3 !important;
}

.input-field input[type="text"]:focus,
.input-field input[type="number"]:focus,
.materialize-textarea:focus:not([readonly]) {
  border-bottom: 1px solid #504ef3 !important;
  box-shadow: 0 1px 0 0 #504ef3 !important;
}

[type="radio"]:checked + span:after,
[type="radio"].with-gap:checked + span:before,
[type="radio"].with-gap:checked + span:after {
  border: 2px solid #504ef3;
}

[type="radio"]:checked + span:after,
[type="radio"].with-gap:checked + span:after {
  background-color: #504ef3;
}
</style>