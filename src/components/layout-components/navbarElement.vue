<template>
  <nav class="navbar orange lighten-1">
    <div class="nav-wrapper">
      <div class="navbar-left">
        <a @click.prevent="$emit('click')" href="#">
          <i class="material-icons black-text">dehaze</i>
        </a>

        <span class="black-text">
          {{ formatedDate }}
        </span>
      </div>

      <ul class="right hide-on-small-and-down">
        <li>
          <a
            class="dropdown-trigger black-text"
            href="#"
            data-target="dropdown"
            ref="dropdown"
          >
            {{ name }}
            <i class="material-icons right">arrow_drop_down</i>
          </a>

          <ul id="dropdown" class="dropdown-content">
            <li>
              <router-link to="/profile" class="black-text">
                <i class="material-icons">account_circle</i>
                {{ translate("profile") }}
              </router-link>
            </li>

            <li class="divider" tabindex="-1"></li>

            <li>
              <a @click.prevent="logout" href="#" class="black-text">
                <i class="material-icons">assignment_return</i>
                {{ translate("go-out") }}
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

  emits: {
    click: null,
  },

  data() {
    return {
      dropdown: null,
      dateInterval: null,
      date: new Date(),
    };
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