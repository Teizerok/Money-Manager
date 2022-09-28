<template>
  <div>
    <pre-loader v-if="loading" />

    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">
          {{ translate("history") }}
        </router-link>

        <a @click.prevent class="breadcrumb">
          {{ translate(record.outputedText) }}
        </a>
      </div>

      <div class="row">
        <div class="col s12 m6">
          <div :class="[record.outputedColor]" class="card">
            <div class="card-content white-text">
              <p>
                {{ translate("description") }}:
                {{ record.description }}
              </p>

              <p>
                {{ translate("sum") }}:
                {{ formateCurrency(record.amount) }}
              </p>
              <p>
                {{ translate("category") }}:
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
        {{ translate("no-entry") }}
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
      record: {},
    };
  },

  computed: {
    dateLanguaged() {
      return this.language === "ru" ? "ru-RU" : "en-EN";
    },
  },

  methods: {
    formateCurrency(value) {
      const currentBill = new Intl.NumberFormat("en-EN", {
        style: "currency",
        currency: "UAH",
      }).format(value);

      return currentBill;
    },

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