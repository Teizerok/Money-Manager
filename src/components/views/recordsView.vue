<template>
  <div>
    <div class="page-title">
      <h3>{{ translate("new-record") }}</h3>
    </div>

    <pre-loader v-if="loading" />

    <div v-else-if="!categories.length" class="center">
      <p>
        {{ translate("no-categories") }}
      </p>
      <router-link to="/categories">
        {{ translate("create-new-category") }}
      </router-link>
    </div>

    <form v-else @submit.prevent="submitHandler" class="form">
      <div class="input-field">
        <select v-model="selectCategory" ref="select">
          <option v-for="{ key, title } in categories" :key="key" :value="key">
            {{ title }}
          </option>
        </select>

        <label>
          {{ translate("select-rating") }}
        </label>
      </div>

      <p>
        <label>
          <input
            v-model="type"
            class="with-gap"
            name="type"
            type="radio"
            value="income"
          />
          <span>
            {{ translate("income") }}
          </span>
        </label>
      </p>

      <p>
        <label>
          <input
            v-model="type"
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
          />
          <span>
            {{ translate("outcome") }}
          </span>
        </label>
      </p>

      <div class="input-field">
        <input
          @keydown.enter.prevent="submitHandler"
          @focus="v$.$reset()"
          :class="{ invalid: erroredAmount }"
          v-model.number="amount"
          id="amount"
          type="number"
        />
        <label for="amount">
          {{ translate("sum") }}
        </label>

        <span v-show="erroredAmount" class="helper-text invalid">
          {{ translate("minimum-value") }}
          {{ minSum }} UAH
        </span>
      </div>

      <div class="input-field">
        <input
          @keydown.enter.prevent="submitHandler"
          @focus="v$.$reset()"
          :class="{ invalid: erroredDescription }"
          v-model="description"
          id="description"
          type="text"
        />
        <label for="description">
          {{ translate("description") }}
        </label>

        <span v-show="erroredDescription" class="helper-text invalid">
          {{ translate("enter-description") }}
        </span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ translate("create") }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import preLoader from "./preLoader.vue";
import useVuelidate from "@vuelidate/core";
import messages from "@/utilits/messages.js";
import { required, minValue } from "@vuelidate/validators";

export default {
  name: "records",

  components: {
    preLoader,
  },

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

  data() {
    return {
      loading: true,
      categories: [],
      formSelect: null,
      selectCategory: null,
      type: "outcome",
      amount: 0,
      description: "",
    };
  },

  validations() {
    return {
      description: { required },
      amount: { minValue: minValue(1), required },
    };
  },

  computed: {
    minSum() {
      return this.v$.amount.minValue.$params.min;
    },

    erroredDescription() {
      return this.v$.description.$error;
    },

    erroredAmount() {
      return this.v$.amount.$error;
    },

    hasBill() {
      if (this.type === "income") {
        return true;
      }

      return this.$store.getters.info.bill >= this.amount ? true : false;
    },

    currentBill() {
      return this.type === "income"
        ? this.$store.getters.info.bill + this.amount
        : this.$store.getters.info.bill - this.amount;
    },
  },

  methods: {
    async submitHandler() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      if (!this.hasBill) {
        M.toast({ html: messages[this.language]["dont-have-money-record"] });
        return;
      }
      const dataToRecord = {
        category: this.selectCategory,
        amount: this.amount,
        type: this.type,
        description: this.description,
        date: new Date().toJSON(),
      };

      await this.$store.dispatch("createRecord", dataToRecord);

      M.toast({ html: messages[this.language]["record-completed"] });

      this.amount = 0;
      this.description = "";
      this.v$.$reset();
    },
  },

  async created() {
    this.categories = await this.$store.dispatch("getCategories");
    this.loading = false;

    if (!this.categories.length) {
      return;
    }
    this.selectCategory = this.categories[0].key;

    this.$nextTick().then(() => {
      M.updateTextFields();
      this.formSelect = M.FormSelect.init(this.$refs.select);
    });
  },
};
</script>


<style scoped>
@media (max-width: 700px) {
  label {
    font-size: 16px;
  }

  .helper-text {
    font-size: 14px;
  }
  .btn {
    font-size: 18px;
  }
}
</style>