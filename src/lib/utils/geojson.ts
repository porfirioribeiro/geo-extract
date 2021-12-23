import type { Feature, GeoJSON } from 'geojson';
import { download } from './download';

export function geoJsonToFeatures(geoJson: GeoJSON): Feature[] {
  if (geoJson.type === 'FeatureCollection') return geoJson.features;
  if (geoJson.type === 'Feature') return [geoJson];
  if (geoJson.type === 'GeometryCollection') return []; // todo
  return [{ type: 'Feature', geometry: geoJson, properties: {} }];
}

export function getFeatureName(feature: Feature) {
  return feature.properties?.name ?? feature.id ?? 'feature';
}

export function downloadFeature(feature: Feature) {
  console.log('download', feature);
  const name = getFeatureName(feature);
  download(JSON.stringify(feature, null, 2), 'application/geojson', `${name}.geojson`);
}
