<template>
  <div>
    <div class="page-title">
      <h3>
        {{ translate("categories") }}
      </h3>
    </div>

    <pre-loader v-if="loading" />

    <section v-else>
      <div class="row">
        <category-create
          @updated="loadCategories"
          :translate="translate"
          :language="language"
        />

        <category-edit
          v-if="categories.length"
          @updated="loadCategories"
          :categories="categories"
          :translate="translate"
          :language="language"
        />

        <p v-else>{{ translate("no-categories") }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import categoryCreate from "../views-components/categoryCreate.vue";
import categoryEdit from "../views-components/categoryEdit.vue";
import preLoader from "../views/preLoader.vue";

export default {
  name: "categories",

  components: {
    categoryCreate,
    categoryEdit,
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
      categories: [],
      loading: true,
    };
  },

  methods: {
    loadCategories() {
      this.loading = true;
      this.$store.dispatch("getCategories").then((loadedCategories) => {
        this.categories = loadedCategories;
        this.loading = false;
      });
    },
  },

  created() {
    this.loadCategories();
  },
};
</script>