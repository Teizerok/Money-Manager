<template>
  <div>
    <div class="page-title">
      <h3>
        {{ translate("bill") }}
      </h3>

      <button @click="refresh" class="btn waves-effect waves-light btn-small">
        <i class="material-icons">refresh</i>
      </button>
    </div>

    <pre-loader v-if="loading" />

    <div class="row" v-else>
      <home-balance-table
        :rates="rates"
        :translate="translate"
        :language="language"
      />
      <home-curency-rates
        :rates="rates"
        :translate="translate"
        :language="language"
      />
    </div>
  </div>
</template>

<script>
import preLoader from "./preLoader.vue";
import homeBalanceTable from "@/components/views-components/homeBalanceTable.vue";
import homeCurencyRates from "@/components/views-components/homeCurencyRates.vue";
import { loadRates } from "../../api.js";

export default {
  name: "HomeView",

  components: {
    preLoader,
    homeBalanceTable,
    homeCurencyRates,
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
      rates: {},
    };
  },

  methods: {
    refresh() {
      this.loading = true;

      loadRates().then((rates) => {
        this.rates = rates;
        this.loading = false;
      });
    },
  },

  created() {
    this.refresh();
  },
};
</script>
