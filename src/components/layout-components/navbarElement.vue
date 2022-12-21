<template>
  <nav class="navbar">
    <div class="nav-wrapper">
      <div class="navbar-left nav-container">
        <div
          :class="{ open: isOpen }"
          @click.prevent="$emit('open')"
          class="hamburger-lines"
        >
          <span class="line line1"></span>
          <span class="line line2"></span>
          <span class="line line3"></span>
        </div>

        <span class="white-text date">
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
            <span class="name"> {{ name }}</span>
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

  props: {
    isOpen: {
      type: Boolean,
      required: true,
      default: true,
    },
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
    //выход из сессии
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.push("/login?message=logout");
    },
  },

  //временной интервал
  created() {
    this.dateInterval = setInterval(() => {
      this.date = new Date();
    }, 60000);
  },

  //dropdown
  mounted() {
    this.dropdown = M.Dropdown.init(this.$refs.dropdown, {
      constrainWidth: false,
    });
  },

  //удаление dropdown-а и временного интервала
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
.name {
  font-size: 18px;
}

.date {
  padding: 0 0 0 50px;
}

@media (max-width: 600px) {
  .navbar {
    position: fixed;
  }
}

.nav-container .hamburger-lines {
  display: block;
  height: 26px;
  width: 34px;
  position: absolute;
  top: 20px;
  left: 0px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
}

.hamburger-lines .line {
  display: block;
  height: 2px;
  width: 100%;
  border-radius: 10px;
  background: #ffffff;
}

.hamburger-lines .line1 {
  transform-origin: 0% 0%;
  transition: transform 0.4s ease-in-out;
}

.hamburger-lines .line2 {
  transition: transform 0.2s ease-in-out;
}

.hamburger-lines .line3 {
  transform-origin: 0% 100%;
  transition: transform 0.4s ease-in-out;
}

.hamburger-lines.open .line1 {
  transform: rotate(45deg);
}
.hamburger-lines.open .line2 {
  transform: scaleY(0);
}

.hamburger-lines.open .line3 {
  transform: rotate(-45deg);
}

.arrow-icon {
  position: relative;
  left: -10px;
  transform: rotate(0deg);
  transition: all 500ms ease-in-out;
}

.arrow-icon.open {
  transform: rotate(180deg);
  transition: all 500ms ease-out;
}
</style>

