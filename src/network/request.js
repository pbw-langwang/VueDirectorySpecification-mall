// 对你引用的第三方网络请求框架进行封装

import axios from "axios"

export function request(config){
  // 1. 创建axios的实例
  const instance = axios.create({
    baseURL:"http://123.207.32.32:8000",
    Timeout:3000,
    // headers:{}
  });
  //2. 使用axios拦截器
  //2.1 请求拦截
  instance.interceptors.request.use(conF=>{
    // console.log(conF);
    console.log("request.js请求成功1:"+new Date().getTime());
    //如果不返回,则真正的请求被拦截了,用户就会打印err
    // *** 一般进行的操作 ***
    // 1. config中的一些信息不符合服务器要求,就可以在这修改,在创建实例时也可以
    // 2. 每次发送网络请求时,都希望在界面中显示一个请求的图标
    // 3. 某些网络请求(登陆[token]),必须携带一些特殊的信息
    //    解释:判断请求是什么,如果是特殊的请求,就看看里面有没有token,要是没有,就让其去登陆
    return conF;
  },err=>{
    console.log(err);
  });
  //2.2 响应拦截
  instance.interceptors.response.use(res=>{
    // console.log(res);
    console.log("request.js请求成功2:"+new Date().getTime());
    return res.data;
  },err=>{
    console.log(err);
  });
  //3. 真正的发送请求
  return instance(config);
}