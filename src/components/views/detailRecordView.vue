<template>
  <div>
    <pre-loader v-if="loading" />

    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">
          <p>{{ t("history") }}</p>
        </router-link>

        <a @click.prevent class="breadcrumb">
          {{ t(record.outputedText) }}
        </a>
      </div>

      <div class="row">
        <div class="col s12 m6">
          <div :class="[`${record.outputedColor}-icon`]" class="card">
            <div class="card-content white-text">
              <p>
                {{ t("description") }}:
                {{ record.description }}
              </p>

              <p>
                {{ t("sum") }}:
                {{ formateCurrency(record.amount, record.currency) }}
              </p>
              <p>
                {{ t("category") }}:
                {{ record.categoryName }}
              </p>

              <small>{{ formateDate(record.date) }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="center">
      <p>
        {{ t("no-entry") }}
      </p>
    </div>
  </div>
</template>

<script>
import preLoader from "./preLoader.vue";

export default {
  name: "record",

  components: {
    preLoader,
  },

  //функция перевода
  inject: ["t"],

  data() {
    return {
      loading: true,
      record: {},
    };
  },

  computed: {
    dateLanguaged() {
      return this.$store.getters.getLanguage === "ru" ? "ru-RU" : "en-EN";
    },
  },

  methods: {
    //преобразование значения в более подходящий вид
    formateCurrency(value, currency = "UAH") {
      const currentBill = new Intl.NumberFormat("en-EN", {
        style: "currency",
        currency,
      }).format(value);

      return currentBill;
    },

    //преобразование даты
    formateDate(date) {
      const options = {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };

      return Intl.DateTimeFormat(this.dateLanguaged, options).format(
        new Date(date)
      );
    },
  },

  //подготовка отображаемой записи
  async created() {
    const record = await this.$store.dispatch(
      "getRecordByKey",
      this.$route.params.key
    );

    const category = await this.$store.dispatch(
      "getCategoryByKey",
      record.category
    );

    const outputedColor = record.type === "outcome" ? "red" : "green";
    const outputedText = record.type === "outcome" ? "outcome" : "income";

    this.record = {
      ...record,
      categoryName: category.title,
      outputedColor,
      outputedText,
    };

    this.loading = false;
  },
};
</script>

<style scoped>
.green-icon {
  background: #09b383;
}
.red-icon {
  background: #ee3838;
}

@media (max-width: 500px) {
  .breadcrumb-wrap {
    display: flex;
    align-items: center;
    justify-content: start;
  }
  .breadcrumb-wrap p {
    font-size: 20px;
  }
  .breadcrumb-wrap a {
    font-size: 20px;
  }
  p {
    font-size: 17px;
  }
  small {
    font-size: 11px;
  }
}
</style>