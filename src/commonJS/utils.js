/*  保存公共的方法  */

// 1. 防抖函数
export function debounce(func,delay){
  let timer = null;
  return function(...args){
    if(timer) clearTimeout(timer);
    timer = setTimeout(()=>{
      func.apply(this,args);
    },delay);
  }
};

//2. 时间戳转换函数