import type { Feature, GeoJSON, Geometry } from 'geojson';
import { download } from './download';

export function geoJsonToFeatures(geoJson: GeoJSON): Feature[] {
  if (geoJson.type === 'FeatureCollection') return geoJson.features;
  if (geoJson.type === 'Feature') return [geoJson];
  if (geoJson.type === 'GeometryCollection') return []; // todo
  return [{ type: 'Feature', geometry: geoJson, properties: {} }];
}

export function ensureFeatureIdAndName(features: Feature[]): Feature[] {
  return features.map((f, i) => {
    const id = f.id ?? `feat-${i}`;
    return { ...f, id, properties: { ...f.properties, name: f.properties?.name ?? id } };
  });
}

export function getFeatureName(feature: Feature) {
  return feature.properties?.name ?? feature.id ?? 'feature';
}

export function downloadFeature(feature: Feature) {
  const name = getFeatureName(feature);
  download(JSON.stringify(feature, null, 2), 'application/geojson', `${name}.geojson`);
}
