import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 操作vuex要遵守规范, 不能直接操作state, 要用commit/dispatch
export default new Vuex.Store({
  state: {
  },
  // mutations中的方法尽可能完成的功能单一一点,把东西放进actions,单一的功能引用mutations--->方便跟踪
  mutations: {
  },
  // vuex中有mapActions把这个映射到methods
  actions: {
  },
  modules: {
  },
  // vuex中有mapGetters把这个映射到计算属性
  getters:{
  },
})
