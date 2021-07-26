import { request } from "network/request";

export function getHomeMultidata(){
  return request({
    url:"/home/multidata"
  })
}