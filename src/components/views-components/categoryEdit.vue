<template>
  <div class="col s12 m6">
    <div class="edit">
      <div class="page-subtitle">
        <h4>
          {{ t("edit") }}
        </h4>
      </div>

      <form @submit.prevent="submitHandler" class="form">
        <div class="input-field">
          <select v-model="currentCategory" ref="select">
            <option
              v-for="{ key, title } in categories"
              :key="key"
              :value="key"
            >
              <span class="select-option">{{ title }}</span>
            </option>
          </select>

          <label>
            {{ t("select-category") }}
          </label>
        </div>

        <div class="input-field">
          <input
            @keydown.enter.prevent="submitHandler"
            @focus="v$.$reset()"
            :class="{ invalid: erroredTitle }"
            v-model.trim="title"
            id="name-edit"
            type="text"
          />
          <label for="name">
            {{ t("name") }}
          </label>

          <span v-show="erroredTitle" class="helper-text invalid">
            {{ t("enter-category-name") }}
          </span>
        </div>

        <div class="input-field">
          <input
            @keydown.enter.prevent="submitHandler"
            @focus="v$.$reset()"
            :class="{ invalid: erroredLimit }"
            v-model.number="limit"
            id="limit-edit"
            type="number"
          />
          <label for="limit">
            {{ t("limit") }}
          </label>

          <span v-show="erroredLimit" class="helper-text invalid">
            {{ t("minimum-value") }}
            {{ minSum }} UAH
          </span>
        </div>

        <div class="buttons">
          <button
            class="btn waves-effect waves-light send-button"
            type="submit"
          >
            <span class="update-text">{{ t("update") }}</span>
            <i class="material-icons right">update</i>
          </button>

          <button
            @click.prevent="deleteHandler"
            class="btn waves-effect red delete-button"
          >
            <i class="material-icons right">delete</i>
          </button>
        </div>
      </form>
    </div>
  </div>

  <Popup ref="popup" />
</template>

<script>
import useVuelidate from "@vuelidate/core";
import messages from "@/utilits/messages.js";
import { required, minValue } from "@vuelidate/validators";
import Popup from "../common/Popup.vue";
export default {
  name: "categoryEdit",

  inject: ["t"],

  components: {
    Popup,
  },

  props: {
    categories: {
      type: Array,
      required: true,
      default: [],
    },
  },

  emits: {
    updated: null,
    deleted: null,
  },

  setup() {
    return { v$: useVuelidate() };
  },

  data() {
    return {
      title: "",
      limit: 0,
      currentCategory: null,
      formSelect: null,
    };
  },

  validations() {
    return {
      title: { required },
      limit: { minValue: minValue(100), required },
    };
  },

  computed: {
    minSum() {
      return this.v$.limit.minValue.$params.min;
    },

    erroredTitle() {
      return this.v$.title.$error;
    },

    erroredLimit() {
      return this.v$.limit.$error;
    },
  },

  methods: {
    async submitHandler() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      const dataCategory = {
        title: this.title,
        limit: this.limit,
        key: this.currentCategory,
      };

      try {
        this.$store.dispatch("updateCategories", dataCategory);

        const currentLanguage = this.$store.getters.getLanguage;

        this.$emit("updated");
        M.toast({ html: messages[currentLanguage]["category-updated"] });
      } catch (e) {}
    },

    async deleteHandler() {
      /*
      const isDelete = await this.$refs.popup.open();

      if (!isDelete) return;
     
      try {
        this.$store.dispatch("deleteCategories", this.currentCategory);

        const currentLanguage = this.$store.getters.getLanguage;

        this.$emit("deleted");
        M.toast({ html: messages[currentLanguage]["category-deleted"] });
      } catch (e) {}
	  */
    },
  },

  watch: {
    currentCategory() {
      const mainCategory = this.categories.find(
        (category) => category.key === this.currentCategory
      );
      this.title = mainCategory.title;
      this.limit = mainCategory.limit;

      this.$nextTick().then(() => {
        M.updateTextFields();
      });
    },
  },

  created() {
    const mainCategory = this.categories[0];
    this.currentCategory = mainCategory.key;
    this.title = mainCategory.title;
    this.limit = mainCategory.limit;
  },

  mounted() {
    M.updateTextFields();
    this.formSelect = M.FormSelect.init(this.$refs.select);
  },

  beforeUnmount() {
    if (this.formSelect.destroy) {
      this.formSelect.destroy();
    }
  },
};
</script>


<style scoped>
.edit {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.page-subtitle {
  height: 40px;
}

.send-button {
  background: #504ef3;
  border-radius: 6px;
  width: 250px;
}

.delete-button {
  border-radius: 6px;
  width: 52px;
}

.select-option {
  color: #504ef3;
}

.buttons {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.input-field {
  width: 350px;
  margin: 0 0 30px 0;
}

@media (max-width: 600px) {
  label {
    font-size: 18px;
  }

  .helper-text {
    font-size: 14px;
  }
  .btn {
    font-size: 18px;
  }
}

@media (max-width: 400px) {
  .input-field {
    width: 200px;
  }
  .buttons {
    width: 95%;
  }

  .send-button {
    width: 100px;
  }
  .update-text {
    display: none;
  }

  .send-button {
    display: flex;
    justify-content: start;
  }
  .send-button i {
    padding: 0 0 0 12px;
  }
}

.input-field input[type="text"]:focus + label,
.input-field input[type="number"]:focus + label,
.materialize-textarea:focus:not([readonly]) + label {
  color: #504ef3 !important;
}

.input-field input[type="text"]:focus,
.input-field input[type="number"]:focus,
.materialize-textarea:focus:not([readonly]) {
  border-bottom: 1px solid #504ef3 !important;
  box-shadow: 0 1px 0 0 #504ef3 !important;
}

[type="radio"]:checked + span:after,
[type="radio"].with-gap:checked + span:before,
[type="radio"].with-gap:checked + span:after {
  border: 2px solid #504ef3;
}

[type="radio"]:checked + span:after,
[type="radio"].with-gap:checked + span:after {
  background-color: #504ef3;
}
</style>
