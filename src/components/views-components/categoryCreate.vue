<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>
          {{ translate("create") }}
        </h4>
      </div>

      <form @submit.prevent="submitHandler">
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
            {{ translate("name") }}
          </label>

          <span v-show="erroredTitle" class="helper-text invalid">
            {{ translate("enter-category-name") }}
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
            {{ translate("limit") }}
          </label>

          <span v-show="erroredLimit" class="helper-text invalid">
            {{ translate("minimum-value") }}
            {{ minSum }} UAH
          </span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{ translate("create") }}
          <i class="material-icons right">send</i>
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
      limit: { minValue: minValue(100), required },
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
        M.toast({ html: messages[this.language]["category-added"] });
      } catch (e) {}
    },
  },

  mounted() {
    M.updateTextFields();
  },
};
</script>

<style scoped>
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
</style>
