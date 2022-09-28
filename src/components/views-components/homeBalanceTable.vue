<template>
  <div class="col s12 m6 l4">
    <div class="card light-blue bill-card">
      <div class="card-content white-text">
        <span class="card-title">
          {{ translate("currency-account") }}
        </span>

        <p class="currency-line" v-for="currency in currencies" :key="currency">
          {{ formateCurrency(currency) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "balanceTable",

  props: {
    rates: {
      type: Object,
      required: true,
      default: {},
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

  data() {
    return {
      currencies: ["USD", "UAH", "EUR"],
    };
  },

  computed: {
    basedCurrency() {
      return (
        this.$store.getters.info.bill / (this.rates["UAH"] / this.rates["USD"])
      );
    },
  },

  methods: {
    getCurrency(currency) {
      return Math.floor(this.basedCurrency * this.rates[currency]);
    },

    formateCurrency(currency) {
      const currentCurrency = this.getCurrency(currency);

      return new Intl.NumberFormat("en-EN", {
        style: "currency",
        currency,
      }).format(currentCurrency);
    },
  },
};
</script>