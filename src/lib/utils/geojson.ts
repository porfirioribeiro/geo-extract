import type { Feature, GeoJSON } from 'geojson';

export function geoJsonToFeatures(geoJson: GeoJSON): Feature[] {
  if (geoJson.type === 'FeatureCollection') return geoJson.features;
  if (geoJson.type === 'Feature') return [geoJson];
  if (geoJson.type === 'GeometryCollection') return []; // todo
  return [{ type: 'Feature', geometry: geoJson, properties: {} }];
}
