<template>
  <nav class="navbar">
    <div class="nav-wrapper">
      <div class="navbar-left">
        <a @click.prevent="$emit('open')" href="#">
          <i class="burger material-icons white-text">dehaze</i>
        </a>

        <span class="white-text">
          {{ formatedDate }}
        </span>
      </div>

      <ul class="right dropdown-container" @click.prevent="$emit('close')">
        <li>
          <a
            class="dropdown-trigger white-text"
            href="#"
            data-target="dropdown"
            ref="dropdown"
          >
            {{ name }}
            <i class="material-icons right">arrow_drop_down</i>
          </a>

          <ul id="dropdown" class="dropdown-content">
            <li>
              <router-link to="/profile" class="grey-text text-darken-2">
                <i class="material-icons">account_circle</i>
                {{ t("profile") }}
              </router-link>
            </li>

            <li class="divider" tabindex="-1"></li>

            <li>
              <a @click.prevent="logout" href="#" class="go-out">
                <i class="material-icons">assignment_return</i>
                {{ t("go-out") }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "nabar",
  inject: ["t"],

  data() {
    return {
      dropdown: null,
      dateInterval: null,
      date: new Date(),
    };
  },

  emits: {
    open: null,
    close: null,
  },

  computed: {
    formatedDate() {
      return Intl.DateTimeFormat().format(this.date);
    },

    name() {
      return this.$store.getters.info.name;
    },
  },

  methods: {
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.push("/login?message=logout");
    },
  },

  created() {
    this.dateInterval = setInterval(() => {
      this.date = new Date();
    }, 1000);
  },

  mounted() {
    this.dropdown = M.Dropdown.init(this.$refs.dropdown, {
      constrainWidth: false,
    });
  },

  beforeUnmount() {
    clearInterval(this.dateInterval);

    if (this.dropdown.destroy) {
      this.dropdown.destroy();
    }
  },
};
</script>

<style scoped>
.navbar {
  background: #504ef3;
}
.go-out {
  color: #f32b49;
}
</style>

