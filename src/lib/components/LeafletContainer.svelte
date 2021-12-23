<script lang="ts">
  import type { Feature } from 'geojson';

  import 'leaflet/dist/leaflet.css';
  import { LeafletMap, TileLayer } from 'svelte-leafletjs';
  import type { Map } from 'leaflet';
  import GeoFeature from './GeoFeature.svelte';
  import bbox from '@turf/bbox';

  export let features: Feature[];

  let lm: { getMap(): Map };

  const mapOptions = {
    center: [1.250111, 103.830933],
    zoom: 13
  };

  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileLayerOptions = {
    minZoom: 0,
    maxZoom: 20,
    maxNativeZoom: 19,
    attribution: '© OpenStreetMap contributors'
  };

  $: {
    if (features.length && lm) {
      const f = features[0];
      focusOn(f);
    }
  }

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
    console.log('click!');
  }
</script>

<LeafletMap options={mapOptions} bind:this={lm}>
  <TileLayer url={tileUrl} options={tileLayerOptions} />
  {#each features as feature}
    <GeoFeature {feature} {onClick} />
  {/each}
</LeafletMap>
