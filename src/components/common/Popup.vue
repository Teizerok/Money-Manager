<template>
  <div v-show="isOpen" :class="{ open: isOpen }" class="popup">
    <div @click.stop="onCancel" class="popup__layout">
      <div @click.stop class="popup__content">
        <slot name="header"> </slot>
        <slot name="content"> </slot>
        <slot name="footer" :onDelete="onTrue" :onCancel="onFalse"> </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    isOpen: false,
  }),

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

    onFalse() {
      this.close();
      this.$options.popupontroller.resolve(false);
      //onCancel
    },

    onTrue() {
      this.close();
      this.$options.popupontroller.resolve(true);
      //onDelete
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
  visibility: hidden;
  transition: all 600ms ease-out;
}

.popup.open {
  opacity: 1;
  visibility: visible;
  transition: all 600ms ease-out;
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
  top: -200px;
  transition: all 600ms ease-out;
}

.popup.open .popup__content {
  transition: all 600ms ease-out;
  top: 0;
}
</style>