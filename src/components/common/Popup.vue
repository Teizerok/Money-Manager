<template>
  <div :class="{ open: isOpen }" class="popup">
    <div @click.stop="onFalse" class="popup__layout">
      <div @click.stop class="popup__content" :class="{ open: isOpen }">
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
    //публичный метод открытия попапа который возвращает promise который будет заразелвен через какое то время
    //когда это произойдет он будет закрыт
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

    //закрытие попапа
    close() {
      this.isOpen = false;
      this.$store.commit("closePopup");
    },

    //метод ресолвещий false
    onFalse() {
      this.close();
      this.$options.popupontroller.resolve(false);
      //onCancel
    },

    //метод ресолвещий true
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
  transition: all 500ms ease-out;
}

.popup.open {
  opacity: 1;
  visibility: visible;
  transition: all 300ms ease-out;
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
  transition: all 800ms ease-in-out;
}

.popup__content.open {
  transition: all 600ms ease-in-out;
  top: 0;
}
</style>