<template>
  <ul :class="{ open: isOpen }" class="sidenav app-sidenav">
    <router-link
      v-for="{ categoryName, url, img } in links"
      :key="categoryName"
      v-slot="{ href, navigate, isExactActive }"
      :to="url"
      active-class="active"
      custom
    >
      <li
        class="item"
        @click="$emit('changeCategory')"
        :class="[isExactActive && 'active']"
      >
        <div class="icon">
          <img :src="img" alt="image" />
        </div>
        <a
          @click="navigate"
          :href="href"
          class="waves-effect waves-light pointer indigo-text text-lighten-4"
        >
          {{ t(categoryName) }}
        </a>
      </li>
    </router-link>
  </ul>
</template>

<script>
import bill from "../../assets/images/icon-bill.png";
import history from "../../assets/images/icon-history.png";
import list from "../../assets/images/icon-list.png";
import menu from "../../assets/images/icon-menu.png";
import ticket from "../../assets/images/icon-ticket.png";

export default {
  name: "sidebar",

  inject: ["t"],

  props: {
    isOpen: {
      type: Boolean,
      required: true,
      default: true,
    },
  },

  emits: {
    changeCategory: null,
  },

  data() {
    return {
      //вкладки для sidebar-а
      links: [
        { categoryName: "bill", url: "/", img: bill },
        { categoryName: "history", url: "/history", img: history },
        { categoryName: "planning", url: "/planning", img: list },
        { categoryName: "new-record", url: "/records", img: ticket },
        { categoryName: "categories", url: "/categories", img: menu },
      ],
    };
  },
};
</script>

<style scoped>
.sidenav {
  background: #05043e;
}
.item {
  padding: 0 0 0 20px;
}

.icon {
  width: 24px;
  height: 24px;
  position: relative;
  top: 35px;
}

.icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
}

@media (max-width: 600px) {
  .sidenav {
    width: 100%;
  }
}
</style>