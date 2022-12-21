<template>
  <div>
    <div class="page-title">
      <h3>
        {{ t("categories") }}
      </h3>
    </div>

    <pre-loader v-if="loading" />

    <section v-else>
      <div class="columns">
        <div class="create">
          <category-create @updated="loadCategories" />
        </div>
        <div v-if="categories.length" class="edit">
          <category-edit
            @updated="loadCategories"
            @deleted="loadCategories"
            :categories="categories"
          />
        </div>

        <p v-else>{{ t("no-categories") }}</p>
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

  //функция перевода
  inject: ["t"],

  data() {
    return {
      categories: [],
      loading: true,
    };
  },

  methods: {
    //загрузка всех категорий
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

<style scoped>
.columns {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.create {
  margin: 0px 0 100px 0;
}

@media (max-width: 600px) {
  .create {
    margin: 0px 0 0px 0;
  }
}
</style>