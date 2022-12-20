<template>
  <Popup ref="popup">
    <template #header>
      <h2 class="popup__title">{{ t("warning-title") }}</h2>
    </template>
    <template #content>
      <div class="popup__text">
        <p>{{ t("warning-text") }}</p>
      </div>
    </template>
    <template #footer="{ onDelete, onCancel }">
      <div class="popup__buttons">
        <button
          @click.prevent="onCancel"
          class="btn waves-effect popup__cancel-button"
        >
          <span class="update-text">{{ t("cancel") }}</span>
          <i class="material-icons right">cancel</i>
        </button>
        <button
          @click.prevent="onDelete"
          class="btn waves-effect red popup__delete-button"
        >
          <span class="update-text">{{ t("delete") }}</span>
          <i class="material-icons right">delete</i>
        </button>
      </div>
    </template>
  </Popup>
</template>

<script>
import Popup from "../common/Popup.vue";
export default {
  data: () => ({
    isOpen: false,
  }),

  components: {
    Popup,
  },

  inject: ["t"],

  methods: {
    async open() {
      const promise = await this.$refs.popup.open();
      return promise;
    },
  },
};
</script>

<style scoped>
.popup__title {
  margin: 0 0 10px 0;
  font-size: 40px;
}

.popup__text {
  flex: 1 1 auto;
  width: 50%;
}

.popup__buttons {
  display: flex;
  justify-content: space-between;
  width: 60%;
}

.popup__cancel-button {
  border-radius: 6px;
  background: #504ef3;
}

.popup__delete-button {
  border-radius: 6px;
}

@media (max-width: 606px) {
  .popup__cancel-button span {
    display: none;
  }
  .popup__cancel-button i {
    position: relative;
    left: -6px;
    font-size: 25px;
  }

  .popup__delete-button span {
    display: none;
  }

  .popup__delete-button i {
    position: relative;
    left: -6px;
    font-size: 25px;
  }

  .popup__title {
    font-size: 30px;
  }
}

@media (max-width: 340px) {
  .popup__cancel-button {
    width: 60px;
  }

  .popup__delete-button {
    width: 60px;
  }

  .popup__cancel-button i {
    left: 0px;
  }

  .popup__delete-button i {
    left: 0px;
  }
}
</style>