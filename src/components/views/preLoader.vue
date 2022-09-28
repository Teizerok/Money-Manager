<template>
  <div class="app-loader">
    <div class="preloader-wrapper big active">
      <div :class="selectedColor" class="spinner-layer">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "preLoader",

  data() {
    return {
      colors: [
        "spinner-red-only",
        "spinner-green-only",
        "spinner-blue-only",
        "spinner-yellow-only",
      ],
    };
  },

  computed: {
    selectedColor() {
      const randomColor = Math.floor(Math.random() * this.colors.length);
      return this.colors[randomColor];
    },
  },
};
</script>
