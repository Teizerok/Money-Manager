<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>{{ translate("sum") }}</th>
        <th>{{ translate("date") }}</th>
        <th>{{ translate("category") }}</th>
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
        <td>{{ index + 1 }}</td>
        <td>{{ formateCurrency(amount) }}</td>
        <td>{{ formateDate(date) }}</td>
        <td>{{ categoryName }}</td>

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
            <i class="material-icons">open_in_new</i>
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
            <i class="material-icons">delete</i>
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
