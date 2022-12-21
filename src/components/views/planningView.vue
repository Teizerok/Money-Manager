<template>
  <div>
    <div class="page-title">
      <h3>
        {{ t("planning") }}
      </h3>
      <h4 class="bill">
        {{ formatedCurrency }}
      </h4>
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

    <section v-else>
      <div v-for="category in categories" :key="category.key">
        <p>
          <strong>
            {{ category.title }}
          </strong>
          <span class="amount">
            {{ correctAmount(category.spend) }}
            {{ t("of") }}
            {{ category.limit }}
          </span>
        </p>

        <div class="progress">
          <div
            :class="[category.progressColor]"
            :style="{ width: category.progress + '%' }"
            class="determinate"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import preLoader from "./preLoader.vue";
import { loadRatesFor } from "../../api";

export default {
  name: "planning",

  components: {
    preLoader,
  },

  //функция перевода
  inject: ["t"],

  data() {
    return {
      loading: true,
      categories: [],
    };
  },

  computed: {
    //форматирования значения вид валюты
    formatedCurrency() {
      const currentCurrency = this.$store.getters.info.currentCurrency;

      if (!currentCurrency) return;

      const currentBill = new Intl.NumberFormat("en-EN", {
        style: "currency",
        currency: currentCurrency,
      }).format(this.$store.getters.info.bill);

      return currentBill;
    },
  },

  //преобразование значения для отображения
  methods: {
    correctAmount(amount) {
      return amount.toFixed(2);
    },
  },

  async created() {
    //получение актуальных курсов валют к выбраной в.
    const rates = await loadRatesFor(this.$store.getters.info.currentCurrency);

    //получение категорий и записей
    const categories = await this.$store.dispatch("getCategories");
    const records = await this.$store.dispatch("getRecords");

    //проверка на наличие
    if (!categories.length || !records.length) {
      this.categories = [];
      this.loading = false;
      return;
    }

    //преобразование категорий
    this.categories = categories.map((category) => {
      //нахождение записей трат записаных в итерируемую категорию
      const currentRecords = records
        .filter((record) => record.category === category.key)
        .filter((record) => record.type === "outcome");

      //подчсет всех записей итеририруемой категории с конвертацией валюты к выбраной в.
      const spend = currentRecords.reduce((total, record) => {
        let transaction = record.amount / (rates[record.currency] || 1);

        return total + +transaction;
      }, 0);

      //получение процентов progressbar
      const procent = (100 * spend) / category.limit;
      const progress = procent > 100 ? 100 : procent;
      let progressColor;

      //цвет
      if (procent < 60) progressColor = "green";
      else if (procent < 100) progressColor = "yellow";
      else progressColor = "red";

      //настроеная категория
      return {
        ...category,
        spend,
        progress,
        progressColor,
      };
    });

    this.loading = false;
  },
};
</script>

<style scoped>
.progress {
  background-color: rgb(255, 255, 255);
  height: 6px;
  border-radius: 6px;
}

.progress .determinate {
  background-color: rgb(210, 0, 200);
}
.progress .determinate:before {
  content: "";
  position: absolute;
  background-color: rgb(45, 42, 130);
  top: 0;
  left: 0;
  bottom: 0;
  will-change: left, right;
}
.progress .determinate:after {
  content: "";
  position: absolute;
  background-color: rgb(42, 130, 48);
  top: 0;
  left: 0;
  bottom: 0;
  will-change: left, right;
}

.amount {
  padding: 0 0 0 6px;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}

@media (max-width: 700px) {
  .page-title {
    align-items: start;
    display: flex;
    flex-direction: column;
  }

  h3 {
    font-size: 26px;
    margin: 0 0 10px 0;
  }
  h4 {
    font-size: 22px;
  }
}
.bill {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}
</style>

