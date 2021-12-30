import GeoJSONSource from "./geojson";
import WktSource from "./wkt";

class VectorSourceFactory {
  constructor(option) {
    this.option = option;
  }

  create(type) {
    switch (type) {
      case "json":
        return new GeoJSONSource(this.option);
      case "wkt":
        return new WktSource(this.option);
      default:
        return;
    }
  }
}

export default VectorSourceFactory;
