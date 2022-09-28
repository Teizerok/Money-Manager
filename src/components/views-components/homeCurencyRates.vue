<template>
  <div class="col s12 m6 l8">
    <div class="card orange darken-3 bill-card">
      <div class="card-content white-text">
        <div class="card-header">
          <span class="card-title">
            {{ translate("exchange-rates") }}
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th>
                {{ translate("currency") }}
              </th>
              <th>
                {{ translate("exchange-rate-to") }}
                {{ baseCurrency }}
              </th>
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
      baseCurrency: "USD",
    };
  },

  methods: {
    normalizePrice(price) {
      return price.toFixed(2);
    },
  },

  computed: {
    formatedRates() {
      return Object.entries(this.rates);
    },
  },
};
</script>