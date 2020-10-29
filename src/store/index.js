import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    addCount(state) {
      state.count++;
    },
    subCount(state) {
      state.count--;
    },
  },
  actions: {
    addCount({ commit }) {
      commit('addCount');
    },
    subCount({ commit }) {
      commit('subCount');
    },
  },
  modules: {},
});
export default store;
