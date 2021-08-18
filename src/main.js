import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// axios.defaults.withCredentials = true;//允许跨域携带cookie信息

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
