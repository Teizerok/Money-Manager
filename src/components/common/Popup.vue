<template>
  <div v-if="isOpen" :class="{ open: isOpen }" class="popup">
    <div @click.stop="onFalse" class="popup__layout">
      <div class="popup__content">
        <h2 class="popup_title">title</h2>

        <button @click="onTrue">true</button>
        <button @click="onFalse">false</button>
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

      this.this.isOpen = true;
      this.$store.commit("openPopup");

      return promise;
    },

    close() {
      this.isOpen = false;
      this.$store.commit("closePopup");
    },

    onTrue() {
      this.$options.popupontroller.resolve(true);
      this.close();
    },

    onFasle() {
      this.$options.popupontroller.resolve(false);
      this.close();
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
}

.popup__content {
  z-index: 1000;
  position: relative;
  background: #fff;
  border-radius: 6px;
  width: 300px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>