<template>
  <div>
    <div class="page-title">
      <h3>
        {{ translate("planning") }}
      </h3>
      <h4>
        {{ formatedCurrency }}
      </h4>
    </div>

    <pre-loader v-if="loading" />

    <div v-else-if="!categories.length" class="center">
      <p>
        {{ translate("no-categories") }}
      </p>
      <router-link to="/categories">
        {{ translate("create-new-category") }}
      </router-link>
    </div>

    <section v-else>
      <div v-for="category in categories" :key="category.key">
        <p>
          <strong>
            {{ category.title }}
          </strong>

          {{ category.spend }}
          {{ translate("of") }}
          {{ category.limit }}
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

export default {
  name: "planning",

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
      categories: [],
    };
  },

  computed: {
    formatedCurrency() {
      const currentBill = new Intl.NumberFormat("en-EN", {
        style: "currency",
        currency: "UAH",
      }).format(this.$store.getters.info.bill);

      return currentBill;
    },
  },

  async created() {
    const categories = await this.$store.dispatch("getCategories");
    const records = await this.$store.dispatch("getRecords");

    if (!categories.length || !records.length) {
      this.categories = [];
      this.loading = false;
      return;
    }

    this.categories = categories.map((category) => {
      const currentRecords = records
        .filter((record) => record.category === category.key)
        .filter((record) => record.type === "outcome");

      const spend = currentRecords.reduce((total, record) => {
        return total + record.amount;
      }, 0);

      const procent = (100 * spend) / category.limit;
      const progress = procent > 100 ? 100 : procent;
      let progressColor;

      if (procent < 60) progressColor = "green";
      else if (procent < 100) progressColor = "yellow";
      else progressColor = "red";

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