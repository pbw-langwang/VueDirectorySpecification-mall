import EsriJSON from "ol/format/EsriJSON";

export function featureFormEsriJSON(
  feature,
  inputProjection,
  outputProjection
) {
  return new EsriJSON().readFeature(feature, {
    dataProjection: inputProjection,
    featureProjection: outputProjection
  });
}
