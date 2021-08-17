import Toast from './Toast.vue';

const obj = {};
obj.install = function(vue){
  // 1.创建组件构造器
  const toastContrustor = vue.extend(Toast);
  // 2.new的方式,可以通过组件构造器创建一个组件对象
  const toast = new toastContrustor();
  // 3.将组件对象手动挂载到一个dom元素
  toast.$mount(document.createElement('div'));
  // 4.toast.$el对应的就是上面的dom元素
  document.body.appendChild(toast.$el);
  vue.prototype.$toast = toast;
  // console.log("执行了toast的index.js",vue);
}
export default obj;