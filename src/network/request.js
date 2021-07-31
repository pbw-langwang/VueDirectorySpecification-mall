import axios from "axios"

export function request1(config,success,failure){
  // 1. 创建axios的实例,不要用全局的
  const instance = axios.create({
    baseURL:"http://123.207.32.32:8000",
    Timeout:3000
  });
  instance(config)
  .then(res => success(res))
  .catch(err => failure(err));
}
// 使用方法:
// request1({
//   url:""
// },res=>{
//   console.log(res);
// },err=>{
//   console.log(err);
// })


export function request2(config){
  const instance = axios.create({
    baseURL:"http://123.207.32.32:8000",
    Timeout:3000
  });
  instance(config.baseconfig)
  .then(res => config.success(res))
  .catch(err => config.failure(err));
}
// 使用方法:
// request2({
//   baseconfig:{
//     url:""
//   },
//   success:function(res){
//     console.log(res);
//   },
//   failure:function(err){
//     console.log(err);
//   }
// })


export function request3(config){
  return new Promise((resolve,reject)=>{
    const instance = axios.create({
      baseURL:"http://123.207.32.32:8000",
      Timeout:3000
    });
    instance(config)
    .then(res => resolve(res))
    .catch(err => reject(err));
  })
}
// 使用方法:
// request3({
//   url:""
// })
//.then(res=>{console.log(res)})
//.catch(err=>{console.log(err)})


export function request(config){
  // 1. 创建axios的实例
  const instance = axios.create({
    baseURL:"http://123.207.32.32:8000",
    Timeout:3000,
    // headers:{}
    // ...
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
// 使用方法:
// request({
//   url:""
// })
//.then(res=>{console.log(res)})
//.catch(err=>{console.log(err)})


// axios.all是axios的静态方法，不是axios实例的方法,所以instance.all报错
// export function requestAll(...config){
//   const instance = axios.create({
//     baseURL:"http://152.136.185.210:7878/api/m5",
//     Timeout:3000
//   });
//   return instance.all(config);
// }




//后面接口换了的
export function request5(config){
  const instance = axios.create({
    baseURL:"http://152.136.185.210:7878/api/m5/",
    Timeout:3000,
  });
  instance.interceptors.request.use(conF=>{
    // console.log(conF);
    console.log("request5.js请求成功1:"+new Date().getTime());
    return conF;
  },err=>{
    console.log(err);
  });
  instance.interceptors.response.use(res=>{
    // console.log(res);
    console.log("request5.js请求成功2:"+new Date().getTime());
    return res.data;
  },err=>{
    console.log(err);
  });
  return instance(config);
} 