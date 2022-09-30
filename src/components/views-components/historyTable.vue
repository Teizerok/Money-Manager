<template>
  <table>
    <thead>
      <tr>
        <th class="count-record">#</th>
        <th class="sum-record">{{ translate("sum") }}</th>
        <th class="date-record">{{ translate("date") }}</th>
        <th class="category-record">{{ translate("category") }}</th>
        <th>{{ translate("type") }}</th>
        <th>{{ translate("open") }}</th>
        <th>{{ translate("delete") }}</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="({ amount, date, categoryName, ...record }, index) in records"
        :key="index"
      >
        <td class="count-record">{{ index + 1 }}</td>
        <td class="sum-record">{{ formateCurrency(amount) }}</td>
        <td class="date-record">{{ formateDate(date) }}</td>
        <td class="category-record">{{ categoryName }}</td>

        <td>
          <span
            :class="{
              green: !record.spendedClass,
              red: record.spendedClass,
            }"
            class="white-text badge"
          >
            {{ translate(record.typeText) }}
          </span>
        </td>

        <td>
          <button
            @click="$router.push('/detail/' + record.key)"
            class="btn-small btn"
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
            class="btn-small btn red"
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

  props: {
    records: {
      type: Array,
      required: true,
      default: [],
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

  emits: {
    deleteRecord: (value) => typeof value === "object",
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
};
</script>


<style scoped>
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
  .sum-record {
    display: none;
  }
}
</style>
