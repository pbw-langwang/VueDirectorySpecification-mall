import { request5 } from "network/request";

export function getDetaildata(iid){
  return request5({
    url:"/detail",
    params:{
      iid
    }
  })
}

export function getRecommend(){
  return request5({
    url:"/recommend"
  })
}

export class GoodsInfo{
  // 数据整合,将要用的复杂的数据用类整合起来
  constructor(itemInfo,columns,services){
    this.title = itemInfo.title;
    this.desc = itemInfo.desc;
    this.discountBgcolor = itemInfo.discountBgColor;
    this.newPrice = itemInfo.price;
    this.oldPrice = itemInfo.oldPrice;
    this.discount = itemInfo.discountDesc;
    this.columns = columns;
    this.services = services;
    this.realPrice = itemInfo.lowNowPrice;
  }
}

export class shopInfo{
  constructor(shopInfo){
    this.logo = shopInfo.shopLogo;
    this.name = shopInfo.name;
    this.fans = shopInfo.cFans;
    this.sells = shopInfo.cSells;
    this.goodsCount = shopInfo.cGoods;
    this.score = shopInfo.score;
  }
}