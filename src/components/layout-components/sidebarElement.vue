<template>
  <ul :class="{ open: isOpen }" class="sidenav app-sidenav">
    <router-link
      v-for="{ categoryName, url } in links"
      :key="categoryName"
      v-slot="{ href, navigate, isExactActive }"
      :to="url"
      active-class="active"
      custom
    >
      <li @click="$emit('changeCategory')" :class="[isExactActive && 'active']">
        <a
          @click="navigate"
          :href="href"
          class="waves-effect waves-orange pointer"
        >
          {{ translate(categoryName) }}
        </a>
      </li>
    </router-link>
  </ul>
</template>

<script>
export default {
  name: "sidebar",

  props: {
    isOpen: {
      type: Boolean,
      required: true,
      default: true,
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
    changeCategory: null,
  },

  data() {
    return {
      links: [
        { categoryName: "bill", url: "/" },
        { categoryName: "history", url: "/history" },
        { categoryName: "planning", url: "/planning" },
        { categoryName: "new-record", url: "/records" },
        { categoryName: "categories", url: "/categories" },
      ],
    };
  },
};
</script>

<style scoped>
@media (max-width: 600px) {
  .sidenav {
    width: 100%;
  }
}
</style>