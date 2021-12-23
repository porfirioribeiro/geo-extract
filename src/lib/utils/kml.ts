import { kml } from '@tmcw/togeojson';
import type { GeoJSON } from 'geojson';

export function kmlStringToGeoJson(xml: string) {
  return kml(new DOMParser().parseFromString(xml, 'text/xml'));
}

export async function kmlToGeoJson(file: File) {
  return kmlStringToGeoJson(await file.text());
}

export async function kmzToGeoJson(file: File) {
  const jszip = await import('jszip');
  const zip = await jszip.loadAsync(file);
  const kmlString = await zip.file('doc.kml').async('text');

  return kmlStringToGeoJson(kmlString);
}

export async function fileToGeoJson(file: File): Promise<GeoJSON | null> {
  if (/application\/(geo\+)?json/.test(file.type)) {
    return file.text().then(JSON.parse);
  }
  if (file.type === 'application/vnd.google-earth.kml+xml') {
    return kmlToGeoJson(file);
  }
  if (file.type === 'application/vnd.google-earth.kmz') {
    return kmzToGeoJson(file);
  }

  console.error('Unknow type', file.type);
  return null;
}
