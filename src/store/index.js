import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cartList:[]
  },
  // mutations中的方法尽可能完成的功能单一一点,所以把东西放进了actions--->方便跟踪
  mutations: {
    addCount(state,payload){
      payload.count++;
    },
    pushtoList(state,payload){
      payload.count = 1;
      payload.checked = "";
      state.cartList.push(payload);
    },
  },
  actions: {
    addCart(context,payload){
      //payload新添加的商品
      let product = null;
      // 看新添加的商品是已有还是没有
      for(let item of context.state.cartList){
        if(item.iid === payload.iid){
          product = item;
        }
      }
      // 有的话就直接加一;没有的话就设置count,并将新的加入
      if(product){
        // product.count += 1;
        context.commit("addCount",product);
      }else{
        // payload.count = 1;
        // context.state.cartList.push(payload);
        context.commit("pushtoList",payload);
      }
    }
  },
  modules: {
  },
  getters:{
    cartLength(state){
      return state.cartList.length;
    },
    cartData(state){
      return state.cartList;
    }
  }
})
