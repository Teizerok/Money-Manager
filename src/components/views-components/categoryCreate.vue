<template>
  <div class="col s12 m6">
    <div class="create">
      <div class="page-subtitle">
        <h4>
          {{ t("create") }}
        </h4>
      </div>

      <form @submit.prevent="submitHandler" class="form">
        <div class="input-field">
          <input
            @keydown.enter.prevent="submitHandler"
            :class="{ invalid: erroredTitle }"
            v-model.trim="title"
            @focus="v$.$reset()"
            id="name-create"
            type="text"
          />
          <label for="name">
            {{ t("name") }}
          </label>

          <span v-show="erroredTitle" class="helper-text invalid">
            {{ t("enter-category-name") }}
          </span>
        </div>

        <div class="input-field">
          <input
            @focus="v$.$reset()"
            @keydown.enter.prevent="submitHandler"
            :class="{ invalid: erroredLimit }"
            v-model.number="limit"
            id="limit-create"
            type="number"
          />
          <label for="limit">
            {{ t("limit") }}
          </label>

          <span v-show="erroredLimit" class="helper-text invalid">
            {{ t("minimum-value") }}
            {{ minSum }} 
          </span>
        </div>

        <button class="btn waves-effect waves-light send-button" type="submit">
          {{ t("create") }}
          <i class="material-icons right">create</i>
        </button>
      </form>
    </div>
  </div>
</template>


<script>
import useVuelidate from "@vuelidate/core";
import messages from "@/utilits/messages.js";
import { required, minValue } from "@vuelidate/validators";

export default {
  name: "categoryCreate",

  inject: ["t"],

  emits: {
    updated: null,
  },

  setup() {
    return { v$: useVuelidate() };
  },

  data() {
    return {
      title: "",
      limit: 0,
    };
  },

  validations() {
    return {
      title: { required },
      limit: { minValue: minValue(1), required },
    };
  },

  computed: {
    minSum() {
      return this.v$.limit.minValue.$params.min;
    },

    erroredTitle() {
      return this.v$.title.$error;
    },

    erroredLimit() {
      return this.v$.limit.$error;
    },
  },

  methods: {
    async submitHandler() {
      const isFormCorrect = await this.v$.$validate();
      const currentLanguage = this.$store.getters.getLanguage;
      if (!isFormCorrect) return;

      const sendDataCategory = {
        title: this.title,
        limit: this.limit,
      };

      try {
        await this.$store.dispatch("createCategory", sendDataCategory);

        this.limit = 0;
        this.title = "";
        this.v$.$reset();

        this.$emit("updated");
        M.toast({ html: messages[currentLanguage]["category-added"] });
      } catch (e) {}
    },
  },

  mounted() {
    M.updateTextFields();
  },
};
</script>

<style scoped>
.create {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.page-subtitle {
  height: 40px;
}

.select-option {
  color: #504ef3;
}
.send-button {
  background: #504ef3;
  border-radius: 6px;
  width: 300px;
  align-self: center;
}

.input-field {
  width: 350px;
  margin: 0 0 30px 0;
}

@media (max-width: 600px) {
  .col {
    margin: 0 0 80px 0;
  }

  label {
    font-size: 18px;
  }

  .helper-text {
    font-size: 14px;
  }
  .btn {
    font-size: 18px;
  }
}

@media (max-width: 400px) {
  .input-field {
    width: 200px;
  }
  .send-button {
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
