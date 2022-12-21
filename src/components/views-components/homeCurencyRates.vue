<template>
  <div class="col s12 m6 l8">
    <div class="card bill-card">
      <div class="card-content white-text">
        <div class="card-header">
          <span class="card-title">
            {{ t("exchange-rates") }}
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <td>
                {{ t("currency") }}
              </td>
              <td>
                {{ t("exchange-rate-to") }}
                {{ baseCurrency }}
              </td>
            </tr>
          </thead>

          <tbody>
            <tr v-for="[currency, price] in formatedRates" :key="currency">
              <td>
                {{ currency }}
              </td>
              <td>
                {{ normalizePrice(price) }}
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
  //функция перевода
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
      //валюта к которой остальную будут ковертироваться
      baseCurrency: "USD",
    };
  },

  methods: {
    //нормализация значения для отображения
    normalizePrice(price) {
      return price.toFixed(2);
    },
  },

  computed: {
    //массив курсов
    formatedRates() {
      return Object.entries(this.rates);
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

@media (max-width: 340px) {
  .card {
    height: 350px;
  }
}

tbody {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}
</style>