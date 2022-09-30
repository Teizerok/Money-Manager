<template>
  <div>
    <div class="page-title">
      <h3>
        {{ translate("recording-history") }}
      </h3>
    </div>
    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>

    <pre-loader v-if="loading" />

    <div v-else-if="!records.length" class="center">
      <p>
        {{ translate("no-entries") }}
      </p>
      <router-link to="/records">
        {{ translate("create-new-entry") }}
      </router-link>
    </div>

    <section v-else>
      <history-table
        @delete-record="deleteRecord"
        :records="paginatedPage"
        :translate="translate"
        :language="language"
      />

      <paginate
        v-show="countedPages > 1"
        v-model="page"
        :page-count="countedPages"
        :container-class="'pagination'"
        :prev-text="translate('previous')"
        :next-text="translate('next')"
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
import { Pie } from "vue-chartjs";

export default {
  name: "history",

  mixins: [Pie],

  components: {
    historyTable,
    preLoader,
    Paginate,
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
      records: [],
      page: 1,
      pageSize: 10,
    };
  },

  computed: {
    paginatedPage() {
      const start = (this.page - 1) * this.pageSize;
      const end = this.page * this.pageSize;
      return this.records.slice(start, end);
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
    renderGraph(categories) {
      this.renderChart({
        labels: categories.map((category) => category.title),
        datasets: [
          {
            label: "Траты по категориям",

            data: categories.map((category) => {
              return this.records.reduce((total, rec) => {
                if (rec.category === category.key && rec.type === "outcome")
                  total += +rec.amount;

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
