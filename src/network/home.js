import { request } from "network/request";
import { request5 } from "network/request";

export function getHomeMultidata(){
  return request({
    url:"/home/multidata"
  })
}

export function getHomeGoods(type,page){
  return request5({
    url:"home/data",
    params:{
      type,
      page
    }
  })
}