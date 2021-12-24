import type { GeoJsonGeometryTypes } from 'geojson';

export const icons: Record<GeoJsonGeometryTypes, string> = {
  Polygon: 'label',
  MultiPolygon: 'label',
  Point: 'place',
  GeometryCollection: 'help',
  LineString: 'help',
  MultiLineString: 'help',
  MultiPoint: 'help'
};
