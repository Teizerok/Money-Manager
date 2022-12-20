<template>
  <table>
    <thead>
      <tr>
        <th class="count-record grey-text text-darken-1">#</th>
        <th class="sum-record grey-text text-darken-4">
          {{ t("sum") }}
        </th>
        <th class="date-record grey-text text-darken-4">
          {{ t("date") }}
        </th>
        <th class="category-record grey-text text-darken-4">
          {{ t("category") }}
        </th>
        <th class="category-type">{{ t("type") }}</th>
        <th>{{ t("open") }}</th>
        <th>{{ t("delete") }}</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="(
          { amount, date, categoryName, currency, ...record }, index
        ) in records"
        :key="index"
      >
        <td class="count-record grey-text text-lighten-1">{{ index + 1 }}</td>
        <td class="sum-record grey-text text-darken-1">
          {{ formateCurrency(amount, currency) }}
        </td>
        <td class="date-record grey-text text-darken-1">
          {{ formateDate(date) }}
        </td>
        <td class="category-record grey-text text-darken-1">
          {{ categoryName }}
        </td>

        <td class="category-type">
          <span
            :class="{
              'green-icon': !record.spendedClass,
              'red-icon': record.spendedClass,
            }"
            class="white-text badge"
          >
            {{ t(record.typeText) }}
          </span>
        </td>

        <td>
          <button
            @click="$router.push('/detail/' + record.key)"
            class="detail btn-small btn waves-effect"
          >
            <i class="tiny material-icons">open_in_new</i>
          </button>
        </td>

        <td>
          <button
            @click="
              $emit('deleteRecord', {
                key: record.key,
              })
            "
            class="delete-record btn-small btn waves-effect"
          >
            <i class="tiny material-icons">delete</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "historyTable",
  inject: ["t"],

  props: {
    records: {
      type: Array,
      required: true,
      default: [],
    },
  },

  emits: {
    deleteRecord: (value) => typeof value === "object",
  },

  computed: {
    dateLanguaged() {
      return this.$store.getters.getLanguage === "ru" ? "ru-RU" : "en-EN";
    },
  },

  methods: {
    formateCurrency(value, currency = "UAH") {
      const currentBill = new Intl.NumberFormat("en-EN", {
        style: "currency",
        currency,
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
};
</script>


<style scoped>
.green-icon {
  background: #09b383;
  border-radius: 6px;
}
.red-icon {
  background: #f32b49;
  border-radius: 6px;
}
.detail {
  background: #09b383;
  border-radius: 50%;
  width: 32px;
  height: 32px;
}
.detail:hover {
  background: #066b4e;
}

.detail i {
  position: relative;
  left: -9px;
}

.delete-record {
  background: #f32b49;
  border-radius: 10px;
}
.delete-record:hover {
  background: #961e30;
}

@media (max-width: 700px) {
  .date-record,
  .count-record {
    display: none;
  }
}
@media (max-width: 500px) {
  .category-record {
    display: none;
  }
}
@media (max-width: 310px) {
  .category-type {
    display: none;
  }
}

table {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}
</style>
