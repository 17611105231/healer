<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="subCount">-</button>
    {{ count }}
    <button @click="addCount">+</button>
  </div>
</template>
<script>
export default {
  computed: {
    count() {
      return this.$store.state.count;
    },
  },
  methods: {
    addCount() {
      this.$store.commit('addCount');
    },
    subCount() {
      this.$store.commit('subCount');
    },
  },
};
</script>
