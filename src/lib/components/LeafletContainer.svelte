<script lang="ts">
  import type { Feature } from 'geojson';

  import { LeafletMap, TileLayer } from 'svelte-leafletjs';
  import type { Map, MapOptions } from 'leaflet';
  import GeoFeature from './GeoFeature.svelte';
  import bbox from '@turf/bbox';

  export let features: Feature[];
  export let focusFeature: Feature;

  let lm: { getMap(): Map };

  const mapOptions: MapOptions = {
    center: [39.543831, -6.0016343],
    zoom: 7.33
  };

  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileLayerOptions = {
    minZoom: 0,
    maxZoom: 20,
    maxNativeZoom: 19,
    attribution: '© OpenStreetMap contributors'
  };

  $: if (focusFeature && lm) focusOn(focusFeature);

  function focusOn(f: Feature) {
    if (f.geometry.type === 'Point') {
      const [lng, lat] = f.geometry.coordinates;
      lm.getMap().flyTo([lat, lng], 16);
    } else {
      const bb = bbox(f);
      lm.getMap().flyToBounds([
        [bb[1], bb[0]],
        [bb[3], bb[2]]
      ]);
    }
  }

  function onClick(f: Feature) {
    //todo
  }
</script>

<LeafletMap options={mapOptions} bind:this={lm}>
  <TileLayer url={tileUrl} options={tileLayerOptions} />
  {#each features as feature (feature.id)}
    <GeoFeature {feature} {onClick} />
  {/each}
</LeafletMap>
