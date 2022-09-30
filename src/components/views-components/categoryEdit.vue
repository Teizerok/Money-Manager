<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>
          {{ translate("edit") }}
        </h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <select v-model="currentCategory" ref="select">
            <option
              v-for="{ key, title } in categories"
              :key="key"
              :value="key"
            >
              {{ title }}
            </option>
          </select>

          <label>
            {{ translate("select-category") }}
          </label>
        </div>

        <div class="input-field">
          <input
            @keydown.enter.prevent="submitHandler"
            @focus="v$.$reset()"
            :class="{ invalid: erroredTitle }"
            v-model.trim="title"
            id="name-edit"
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
            @keydown.enter.prevent="submitHandler"
            @focus="v$.$reset()"
            :class="{ invalid: erroredLimit }"
            v-model.number="limit"
            id="limit-edit"
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
          {{ translate("update") }}
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
  name: "categoryEdit",

  props: {
    categories: {
      type: Array,
      required: true,
      default: [],
    },

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
      currentCategory: null,
      formSelect: null,
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

      const dataCategory = {
        title: this.title,
        limit: this.limit,
        key: this.currentCategory,
      };

      try {
        this.$store.dispatch("updateCategories", dataCategory);

        this.$emit("updated");
        M.toast({ html: messages[this.language]["category-updated"] });
      } catch (e) {}
    },
  },

  watch: {
    currentCategory() {
      const mainCategory = this.categories.find(
        (category) => category.key === this.currentCategory
      );
      this.title = mainCategory.title;
      this.limit = mainCategory.limit;

      this.$nextTick().then(() => {
        M.updateTextFields();
      });
    },
  },

  created() {
    const mainCategory = this.categories[0];
    this.currentCategory = mainCategory.key;
    this.title = mainCategory.title;
    this.limit = mainCategory.limit;
  },

  mounted() {
    M.updateTextFields();
    this.formSelect = M.FormSelect.init(this.$refs.select);
  },

  beforeUnmount() {
    if (this.formSelect.destroy) {
      this.formSelect.destroy();
    }
  },
};
</script>


<style scoped>
@media (max-width: 600px) {
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
