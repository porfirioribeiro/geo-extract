<script lang="ts">
  import { createEventDispatcher, getContext, onDestroy, setContext } from 'svelte';
  import L, { GeoJSONOptions } from 'leaflet';
  import type { Feature } from 'geojson';
  export let feature: Feature;

  const { getMap } = getContext(L);

  let geojson: L.GeoJSON;
  const options: GeoJSONOptions = {
    style(f) {
      return {
        fillColor: 'red'
      };
    }
  };

  $: geojson = L.geoJSON(null, options).addTo(getMap());

  $: {
    geojson.clearLayers();
    geojson.addData(feature);
  }

  onDestroy(() => {
    geojson.removeFrom(getMap());
  });
</script>
