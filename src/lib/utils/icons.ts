import type { GeoJsonGeometryTypes } from 'geojson';

export const icons: Partial<Record<GeoJsonGeometryTypes, string>> = {
  Polygon: 'label',
  MultiPolygon: 'label',
  Point: 'place'
};
