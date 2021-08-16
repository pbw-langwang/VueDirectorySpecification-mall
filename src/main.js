import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 前期自己写组件比较好
// import { Card } from 'vant';
// Vue.use(Card);

// vue实例可以作为事件总线
Vue.prototype.$bus = new Vue();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
