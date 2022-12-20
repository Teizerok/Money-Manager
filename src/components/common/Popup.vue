<template>
  <div v-if="isOpen" :class="{ open: isOpen }" class="popup">
    <div @click.stop="onCancel" class="popup__layout">
      <div @click.stop class="popup__content">
        <h2 class="popup_title">{{ t("warning-title") }}</h2>

        <div class="popup__text">
          <p>{{ t("warning-text") }}</p>
        </div>

        <div class="buttons">
          <button
            @click.prevent="onCancel"
            class="btn waves-effect blue cancel-button"
          >
            <span class="update-text">{{ t("update") }}</span>
            <i class="material-icons right">cancel</i>
          </button>
          <button
            @click.prevent="onDelete"
            class="btn waves-effect red delete-button"
          >
            <span class="update-text">{{ t("delete") }}</span>
            <i class="material-icons right">delete</i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    isOpen: false,
  }),

  inject: ["t"],

  popupontroller: {},

  methods: {
    open() {
      let resolve;
      const promise = new Promise((res, rej) => {
        resolve = res;
      });

      this.$options.popupontroller = { resolve };

      this.isOpen = true;
      this.$store.commit("openPopup");

      return promise;
    },

    close() {
      this.isOpen = false;
      this.$store.commit("closePopup");
    },

    onCancel() {
      this.close();
      this.$options.popupontroller.resolve(false);
    },

    onDelete() {
      this.close();
      this.$options.popupontroller.resolve(true);
    },
  },
};
</script>

<style scoped>
.popup {
  z-index: 1500;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  opacity: 0;
  transition: opacity 600ms ease-out;
}

.open {
  opacity: 1;
}

.popup__layout {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
}

.popup__content {
  z-index: 1000;
  position: relative;
  background: #fff;
  border-radius: 6px;
  max-width: 600px;
  width: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.popup_title {
  margin: 0 0 10px 0;
  font-size: 40px;
}

.popup__text {
  flex: 1 1 auto;
  width: 50%;
}

.buttons {
  display: flex;
  justify-content: space-between;
  width: 60%;
}

.cancel-button {
  border-radius: 6px;
}

.delete-button {
  border-radius: 6px;
}

@media (max-width: 606px) {
  .cancel-button span {
    display: none;
  }
  .cancel-button i {
    position: relative;
    left: -6px;
    font-size: 25px;
  }

  .delete-button span {
    display: none;
  }

  .delete-button i {
    position: relative;
    left: -6px;
    font-size: 25px;
  }

  .popup_title {
    font-size: 30px;
  }
}

@media (max-width: 340px) {
  .cancel-button {
    width: 60px;
  }

  .delete-button {
    width: 60px;
  }

  .cancel-button i {
    left: 0px;
  }

  .delete-button i {
    left: 0px;
  }
}
</style>