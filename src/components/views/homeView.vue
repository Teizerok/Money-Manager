<template>
  <div>
    <div class="page-title">
      <h3 class="title">
        {{ t("bill") }}
      </h3>

      <button
        @click="refresh"
        class="refresh btn waves-effect waves-light btn-small"
      >
        <i class="material-icons">refresh</i>
      </button>
    </div>

    <pre-loader v-if="loading" />

    <div class="row" v-else>
      <home-balance-table :rates="rates" />
      <home-curency-rates :rates="rates" />
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

  inject: ["t"],

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

<style scoped>
.title {
  color: #0a101b;
  font-family: Fredoka, Arial, "Helvetica Neue", Helvetica, sans-serif;
}
.refresh {
  background: #504ef3;
  border-radius: 50%;
  width: 46px;
  height: 46px;
}

.refresh i {
  position: relative;
  top: 3px;
  left: -2px;
}

.refresh:hover {
  background: #3b3abf;
  transform: rotate(260deg);
}
</style>
