<template>
  <div>
    <div class="page-title">
      <h3 class="title">
        {{ t("recording-history") }}
      </h3>
    </div>
    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>

    <pre-loader v-if="loading" />

    <div v-else-if="!records.length" class="no-entries">
      <p>
        {{ t("no-entries") }}
      </p>
      <router-link to="/records">
        {{ t("create-new-entry") }}
      </router-link>
    </div>

    <section v-else>
      <history-table @delete-record="deleteRecord" :records="paginatedPage" />

      <paginate
        v-show="countedPages > 1"
        v-model="page"
        :page-count="countedPages"
        :container-class="'pagination'"
        :prev-text="t('previous')"
        :next-text="t('next')"
        :page-class="'waves-effect'"
        :prev-class="'waves-effect'"
        :next-class="'waves-effect'"
        :active-class="'active'"
        class="center"
      >
      </paginate>
    </section>
  </div>
</template>


<script>
import historyTable from "../views-components/historyTable.vue";
import preLoader from "./preLoader.vue";
import Paginate from "vuejs-paginate-next";
import { loadRatesFor } from "../../api";
import { Pie } from "vue-chartjs";

export default {
  name: "history",

  mixins: [Pie],

  components: {
    historyTable,
    preLoader,
    Paginate,
  },

  inject: ["t"],

  data() {
    return {
      loading: true,
      records: [],
      page: 1,
      pageSize: 10,
    };
  },

  computed: {
    paginatedPage() {
      const start = (this.page - 1) * this.pageSize;
      const end = this.page * this.pageSize;
      return [...this.records].reverse().slice(start, end);
    },

    countedPages() {
      return this.records.length / this.pageSize;
    },
  },

  methods: {
    async deleteRecord(record) {
      this.loading = true;
      await this.$store.dispatch("deleteRecord", record);

      this.setting();

      this.loading = false;
    },

    normalizeRecord(categories, records) {
      if (!categories.length || !records.length) return;

      this.records = records.map((record) => {
        const categoryName = categories.find(
          (category) => category.key === record.category
        ).title;

        const typeText = record.type === "outcome" ? "outcome" : "income";
        const spendedClass = record.type === "outcome" ? true : false;

        return {
          ...record,
          categoryName,
          typeText,
          spendedClass,
        };
      });
    },
    async renderGraph(categories) {
      if (!categories.length) return;

      const rates = await loadRatesFor(
        this.$store.getters.info.currentCurrency
      );

      this.renderChart({
        labels: categories.map((category) => category.title),
        datasets: [
          {
            label: "Траты по категориям",

            data: categories.map((category) => {
              return this.records.reduce((total, rec) => {
                if (rec.category === category.key && rec.type === "outcome") {
                  let transaction = rec.amount / (rates[rec.currency] || 1);
                  transaction = transaction.toFixed(2);

                  total += +transaction;
                }
                return total;
              }, 0);
            }),

            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    },
    async setting() {
      const records = await this.$store.dispatch("getRecords");
      const categories = await this.$store.dispatch("getCategories");

      if (!records.length) {
        this.records = [];
        this.loading = false;
        return;
      }

      this.normalizeRecord(categories, records);
      this.renderGraph(categories);
    },
  },

  mounted() {
    this.setting();
    this.loading = false;
  },
};
</script>

<style scoped>
.title {
  color: #0a101b;
}

.no-entries {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  position: relative;
  top: -150px;
}
</style>