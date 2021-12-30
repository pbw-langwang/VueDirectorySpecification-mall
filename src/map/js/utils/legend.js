import { appendParams } from "ol/uri";

/**
 * arcgis server 图例信息
 * @param  {string} url
 */
export async function getLegendInfoByArcGIS(url) {
  if (!url){
    return;
  }
  
  try {
    let index = url.indexOf("?");
    let str = "/legend";
    if (index != -1) {
      url = url.slice(0, index) + str + url.slice(index);
    } else {
      url += str;
    }

    const jsonUrl = appendParams(url, {
      f: "pjson"
    });

    const response = await fetch(jsonUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}
