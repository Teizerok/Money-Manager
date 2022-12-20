<template>
  <div>
    <div class="app-main-layout">
      <navbarElement
        @open="isOpenSidebar = !isOpenSidebar"
        @close="isOpenSidebar = false"
        :isOpen="isOpenSidebar"
      />

      <sidebarElement
        @change-category="isOpenSidebar = false"
        :isOpen="isOpenSidebar"
      />

      <main class="app-content full">
        <div class="app-page">
          <router-view
            @change-language="(value) => $emit('changeLanguage', value)"
          ></router-view>
        </div>
      </main>

      <div class="fixed-action-btn">
        <router-link class="btn-floating btn-large" to="/records">
          <i class="large material-icons waves-effect">add</i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import navbarElement from "@/components/layout-components/navbarElement.vue";
import sidebarElement from "@/components/layout-components/sidebarElement.vue";

export default {
  name: "mainLayout",

  components: {
    navbarElement,
    sidebarElement,
  },

  data() {
    return {
      isOpenSidebar: false,
    };
  },

  async created() {
    await this.$store.dispatch("subscribeToUpdateInfo");
  },
};
</script>

<style scoped>
.app-main-layout {
  background: #f5f6f7;
}
.btn-floating {
  background: #504ef3;
}

.btn-floating:hover {
  background: #3b3abf;
}
.btn-floating:focus {
  background: #3b3abf;
}
@media (max-width: 500px) {
  .fixed-action-btn {
    display: none;
  }
}
</style>