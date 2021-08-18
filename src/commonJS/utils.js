/*  保存公共的方法  */

// eg: 防抖函数
export function debounce(func,delay){
  let timer = null;
  return function(...args){
    if(timer) clearTimeout(timer);
    timer = setTimeout(()=>{
      func.apply(this,args);
    },delay);
  }
};
/** 使用方式
 *  import {debounce} from "commonJS/utils.js"
 *  const refresh = debounce(想要防抖的函数,100);
 *  监听事件("监听事件名",()=> {
 *    refresh();
 *  });
 **/ 
