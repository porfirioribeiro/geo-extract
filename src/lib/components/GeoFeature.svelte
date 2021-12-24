<script lang="ts">
  import { createEventDispatcher, getContext, onDestroy, setContext } from 'svelte';
  import L, { GeoJSONOptions, LeafletMouseEvent } from 'leaflet';
  import type { Feature } from 'geojson';
  import { Popup } from 'svelte-leafletjs';
  import Button, { Icon } from '@smui/button';
  import { downloadFeature } from '$lib/utils/geojson';
  import { icons } from '$lib/utils/icons';
  export let feature: Feature;
  export let onClick: (f: Feature, e: LeafletMouseEvent) => void;

  const { getMap } = getContext(L);
  let geojson: L.GeoJSON;

  setContext(L.Layer, { getLayer: () => geojson });

  const options: GeoJSONOptions = {
    style(f) {
      return {
        fillColor: 'red'
        // fillColor: f.properties.fill ?? 'red',
        // fillOpacity: f.properties['fill-opacity'] ?? 0.5,
        // strokeColor: f.properties.stroke ?? 'red',
        // strokeOpacity: f.properties['stroke-opacity'] ?? 1,
        // weight: f.properties['stroke-width'] ?? 1
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

{#if geojson}
  <slot />
  <Popup>
    <div>{feature.geometry.type}</div>
    <dl>
      {#each Object.entries(feature.properties) as [key, value]}
        <dt>{key}</dt>
        <dd>{value}</dd>
      {/each}
    </dl>
    <Button color="secondary" variant="raised" on:click={() => downloadFeature(feature)}>
      <Icon class="material-icons">{icons[feature.geometry.type]}</Icon>
      Download GeoJSON
    </Button>
  </Popup>
{/if}

<style>
  dl {
    display: grid;
    grid-template-columns: min-content auto;
    gap: 8px;
    overflow: hidden;
  }
  dt {
    font-weight: 700;
  }
  dd {
    margin: 0;
  }
  /* dt + dd {
    display: inline;
  } */
</style>
