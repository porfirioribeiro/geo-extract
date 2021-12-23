<script lang="ts">
  import { createEventDispatcher, getContext, onDestroy, setContext } from 'svelte';
  import L, { GeoJSONOptions, LeafletMouseEvent } from 'leaflet';
  import type { Feature } from 'geojson';
  export let feature: Feature;
  export let onClick: (f: Feature, e: LeafletMouseEvent) => void;

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
    geojson.on('click', (e: LeafletMouseEvent) => onClick(feature, e));
    geojson.clearLayers();
    geojson.addData(feature);
  }

  onDestroy(() => {
    geojson.removeFrom(getMap());
  });
</script>
