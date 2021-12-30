<template>
  <MyMapPlacement class="my-map-city" v-bind="$attrs">
    <div class="min-content" :class="{ active: isOpen }" @click="triggerOpen">
      <span>{{ currentCity }}</span>
      <span
        class="icon fa"
        :class="[isOpen ? 'fa-caret-up' : 'fa-caret-down']"
      ></span>
    </div>

    <MyBasePopupBox ref="popupbox" class="max-content" @close="isOpen = false">
      <div class="current">
        <span class="title">当前位置：{{ currentCity }}</span>
        <span class="icon fa fa-close" @click="triggerOpen"></span>
      </div>
      <ul class="hot">
        <li
          v-for="(item, index) in hotList"
          :key="index"
          @click="positionCity(item)"
        >
          {{ item.name }}
        </li>
      </ul>
      <div class="middle-content">
        <div class="catalog">
          <div
            class="catalog-item"
            :class="{ active: selectLetterTypeIndex === index }"
            v-for="(item, index) in letterTypes"
            :key="index"
            @click="changeLetterTypeIndex(index)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="search">
          <el-autocomplete
            placeholder="请输入名称"
            size="mini"
            prefix-icon="fa fa-search"
            v-model="inputValue"
            :fetch-suggestions="inputChange"
            :trigger-on-focus="false"
            @select="handleSelect"
            autocomplete="off"
            popper-class="search-suggest"
          >
            <template slot-scope="{ item }">
              <div class="search-suggest-item">
                {{ item.name }}({{ item.spell }})
              </div>
            </template>
          </el-autocomplete>
        </div>
      </div>

      <div class="city-list">
        <div class="city-list-letter">
          <span
            class="city-list-letter-item"
            v-for="(value, name, index) in list"
            :key="index"
            @click="gotoCityContent(name)"
          >
            {{ name }}
          </span>
        </div>
        <div class="city-list-content">
          <template v-if="selectLetterTypeIndex === 0">
            <div v-for="(value, name, index) in list" :key="index">
              <div v-for="(item, t) in value" :key="t">
                <dl v-for="(c, p, i) in item" :key="i">
                  <dt :id="`index-${name}`">{{ p }}:</dt>
                  <dd>
                    <li v-for="(cs, j) in c" :key="j" @click="gotoCity(cs)">
                      {{ cs.name }}
                    </li>
                  </dd>
                </dl>
              </div>
            </div>
          </template>
          <template v-if="selectLetterTypeIndex === 1">
            <dl v-for="(value, name, i) in list" :key="i">
              <dt :id="`index-${name}`">{{ name }}:</dt>
              <dd>
                <li v-for="(item, j) in value" :key="j" @click="gotoCity(item)">
                  {{ item.name }}
                </li>
              </dd>
            </dl>
          </template>
        </div>
      </div>
    </MyBasePopupBox>
  </MyMapPlacement>
</template>

<script>
import MyMapPlacement from "./Placement";
import MyBasePopupBox from "../base/Popupbox";

import {
  getZoomByAdCode,
  getCityInfoByAdCode,
  getCityByCoordinate,
  adjustAdCodeByZoom,
  getCityList
} from "@map/js/utils/adcode";
import cityLetter from "@map/assets/data/cityLetter.json"

import { cities_type, cities_top_name } from "../../config";

export default {
  name: "MyMapCity",
  inject: ["myMap"],
  components: { MyMapPlacement, MyBasePopupBox },
  data() {
    return {
      currentCity: "武汉",
      isOpen: false,
      letterTypes: cities_type,
      selectLetterTypeIndex: 0,
      suggest: [],
      inputValue: null
    };
  },
  computed: {
    list() {
      let key = this.letterTypes[this.selectLetterTypeIndex].key;
      return cityLetter[key];
    },
    hotList() {
      return cityLetter.cityData.hotCitys;
    },
    cities() {
      return cityLetter.cityData.provinces;
    },
    cityList() {
      return getCityList(cityLetter.cityData.provinces);
    }
  },
  methods: {
    init() {
      if (this.myMap && this.myMap.map) {
        let map = this.myMap.map;
        // 根据中心点，计算当前所在的行政区划，并监听中心点的变化
        this.getNameByCoordinate();
        map.getView().on("change", this.getNameByCoordinate);
      }
    },
    dispose() {
      if (this.myMap && this.myMap.map) {
        let map = this.myMap.map;
        map.getView().un("change", this.getNameByCoordinate);
      }
    },
    triggerOpen() {
      this.isOpen = !this.isOpen;
      this.$refs.popupbox.trigger();
    },
    // 变更类别
    changeLetterTypeIndex(index) {
      this.selectLetterTypeIndex = index;
      let el = document.getElementsByClassName("city-list-content")[0];
      el.scrollTo(0, 0);
    },
    // 根据字母跳转
    gotoCityContent(name) {
      let el = document.getElementById(`index-${name}`);
      el.scrollIntoView();
    },
    // 根据城市编码定位
    gotoCity(item) {
      let info = getCityInfoByAdCode(this.cities, item.adcode);
      if (info) {
        this.positionCity(info);
      }
    },
    // 根据城市详细信息定位，包含x,y坐标
    positionCity(item) {
      this.currentCity = item.name;
      // 地图定位
      let adcode = item.adcode;
      let zoom = getZoomByAdCode(adcode);
      this.myMap.map.home({
        zoom,
        center: [parseFloat(item.x), parseFloat(item.y)]
      });
      this.triggerOpen();
    },
    async getNameByCoordinate() {
      let map = this.myMap.map;
      let coordinate = map.getView().getCenter();
      let projection = map.getView().getProjection();
      let result = await getCityByCoordinate(coordinate,projection);
      if (result) {
        let { adcode, name } = result;
        let zoom = this.myMap.map.getView().getZoom();
        let adjustCode = adjustAdCodeByZoom(adcode, zoom);
        if (adjustCode === adcode) {
          this.currentCity = name;
        } else {
          this.currentCity = this.cities[adjustCode]
            ? this.cities[adjustCode].name
            : cities_top_name;
        }
      }
    },
    inputChange(value, callback) {
      let result = [];
      if (value) {
        let cities = this.cityList.filter(x => {
          let reg = new RegExp(value, "i");
          return x.name.search(reg) > -1 || x.spell.search(reg) > -1;
        });
        result = cities.slice(0, 10);
      }
      callback(result);
    },
    handleSelect(item) {
      this.positionCity(item);
    }
  },
  mounted() {
    this.myMap.mapReady(this.init);
  },
  beforeDestroy() {
    this.dispose();
  }
};
</script>

<style lang="less">
@import "../../style/city.less";
</style>
