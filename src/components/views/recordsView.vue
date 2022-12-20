<template>
  <div class="records">
    <div class="page-title">
      <h3>{{ t("new-record") }}</h3>
    </div>

    <pre-loader v-if="loading" />

    <div v-else-if="!categories.length" class="center">
      <p>
        {{ t("no-categories") }}
      </p>
      <router-link to="/categories">
        {{ t("create-new-category") }}
      </router-link>
    </div>

    <form v-else @submit.prevent="submitHandler" class="form">
      <div class="input-field rating">
        <select v-model="selectCategory" ref="select">
          <option
            class="option"
            v-for="{ key, title } in categories"
            :key="key"
            :value="key"
          >
            <span class="select-option"> {{ title }}</span>
          </option>
        </select>

        <label>
          {{ t("select-rating") }}
        </label>
      </div>

      <div class="input-field">
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
              {{ t("income") }}
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
              {{ t("outcome") }}
            </span>
          </label>
        </p>
      </div>

      <div class="input-field amount">
        <input
          @keydown.enter.prevent="submitHandler"
          @focus="v$.$reset()"
          :class="{ invalid: erroredAmount }"
          v-model.number="amount"
          id="amount"
          type="number"
        />
        <label for="amount">
          {{ t("sum") }}
        </label>

        <span v-show="erroredAmount" class="helper-text invalid">
          {{ t("minimum-value") }}
          {{ minSum }}
        </span>
      </div>

      <div class="input-field currensies">
        <select v-model="selectCurrensies" ref="currencies">
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
          {{ t("choice-currency") }}
        </label>
      </div>

      <div class="input-field description">
        <input
          @keydown.enter.prevent="submitHandler"
          @focus="v$.$reset()"
          :class="{ invalid: erroredDescription }"
          v-model="description"
          id="description"
          type="text"
        />
        <label for="description">
          {{ t("description") }}
        </label>

        <span v-show="erroredDescription" class="helper-text invalid">
          {{ t("enter-description") }}
        </span>
      </div>

      <button class="btn waves-effect waves-light send-button" type="submit">
        {{ t("create") }}
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
import { loadRatesFor } from "../../api";

export default {
  name: "records",

  components: {
    preLoader,
  },

  setup() {
    return { v$: useVuelidate() };
  },

  inject: ["t"],

  data() {
    return {
      loading: true,
      formSelect: null,
      formCurrencies: null,
      selectCategory: null,
      selectCurrensies: null,

      categories: [],
      currencies: ["USD", "UAH", "EUR"],

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

    currentBill() {
      return this.type === "income"
        ? this.$store.getters.info.bill + this.amount
        : this.$store.getters.info.bill - this.amount;
    },
  },

  methods: {
    async hasBillCheck() {
      if (this.type === "income") {
        return true;
      }

      const rates = await loadRatesFor(this.$store.getters.currentCurrency);
      const bill = this.$store.getters.info.bill;

      return rates[this.selectCurrensies] * bill >= this.amount ? true : false;
    },

    async submitHandler() {
      const isFormCorrect = await this.v$.$validate();
      const currentLanguage = this.$store.getters.getLanguage;

      if (!isFormCorrect) return;

      const isHasBill = await this.hasBillCheck();

      if (!isHasBill) {
        M.toast({ html: messages[currentLanguage]["dont-have-money-record"] });
        return;
      }

      const dataToRecord = {
        category: this.selectCategory,
        amount: this.amount,
        type: this.type,
        description: this.description,
        date: new Date().toJSON(),
        currency: this.selectCurrensies,
      };

      await this.$store.dispatch("createRecord", dataToRecord);

      M.toast({ html: messages[currentLanguage]["record-completed"] });

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
    this.selectCurrensies = this.$store.getters.info.currentCurrency;

    this.$nextTick().then(() => {
      M.updateTextFields();
      this.formSelect = M.FormSelect.init(this.$refs.select);
      this.formCurrencies = M.FormSelect.init(this.$refs.currencies);
    });
  },
};
</script>


<style scoped>
.records {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.currensies {
  margin: 4px 0;
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

.form {
  display: flex;
  flex-direction: column;
}

.input-field {
  width: 350px;
  margin: 0 0 30px 0;
}

.rating {
  margin: 0 0 10px 0;
}

.amount label {
  font-size: 16px;
}

.description label {
  font-size: 16px;
}

@media (max-width: 700px) {
  label {
    font-size: 14px;
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