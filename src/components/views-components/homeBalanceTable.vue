<template>
  <div class="col s12 m6 l4">
    <div class="card bill-card">
      <div class="card-content white-text">
        <span class="card-title">
          {{ t("currency-account") }}
        </span>
        <table>
          <tbody>
            <tr v-for="currency in currencies" :key="currency">
              <td>
                {{ formateCurrency(currency) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "balanceTable",

  inject: ["t"],

  props: {
    rates: {
      type: Object,
      required: true,
      default: {},
    },
  },

  data() {
    return {
      currencies: ["USD", "UAH", "EUR"],
    };
  },

  methods: {
    getCurrency(currency) {
      return Math.floor(
        this.$store.getters.info.bill /
          (this.rates[this.$store.getters.info.currentCurrency] /
            this.rates[currency])
      );
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

<style scoped>
.card {
  box-shadow: 1px 1px 10px 2px rgba(0, 0, 0, 0.2);
  background: rgba(25, 24, 79, 0.7);
  border-radius: 8px;
}
tbody {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}
</style>