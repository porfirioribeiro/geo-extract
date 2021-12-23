<script lang="ts">
  import { onMount } from 'svelte';
  import type { Feature, GeoJsonGeometryTypes } from 'geojson';
  import Button, { Icon, Label } from '@smui/button';
  import Card from '@smui/card';
  import { browser } from '$app/env';

  let LeafletContainer;

  onMount(async () => {
    if (browser) {
      LeafletContainer = (await import('$lib/components/LeafletContainer.svelte')).default;
    }
  });

  $: console.log(LeafletContainer);

  import DropTarget from '$lib/components/DropTarget.svelte';
  import { fileToGeoJson } from '$lib/utils/kml';
  import { geoJsonToFeatures, getFeatureName } from '$lib/utils/geojson';
  import { download } from '$lib/utils/download';
  import { icons } from '$lib/utils/icons';
  import FeatureTable from '$lib/components/FeatureTable.svelte';

  let allFeatures: Feature[] = [];
  let features: Feature[] = [];
  let filters: GeoJsonGeometryTypes[] = [];
  let filter: GeoJsonGeometryTypes;

  async function onSelectFiles(files: File[]) {
    if (files.length != 1) {
      return;
    }

    const file = files[0];
    const geoJson = await fileToGeoJson(file);

    allFeatures = geoJsonToFeatures(geoJson);
    filters = [...new Set(allFeatures.map((f) => f.geometry.type))];
  }

  $: features = filter ? allFeatures.filter((f) => f.geometry.type === filter) : allFeatures;
</script>

<div class="app">
  <div class="toolbar" style="grid-area: tb">
    <DropTarget onSelect={onSelectFiles} />
    <label>
      Filter:
      <select bind:value={filter}>
        <option value={undefined}>All</option>
        {#each filters as f}
          <option value={f}>{f}</option>
        {/each}
      </select>
    </label>
  </div>

  <FeatureTable style="grid-area: sd;" {features} />
  <svelte:component this={LeafletContainer} {features} style="grid-area: map" />
</div>

<style>
  .app {
    height: 100vh;
    display: grid;
    grid-template-areas:
      'tb tb'
      'sd map';
    grid-template-columns: 400px auto;
    grid-template-rows: 150px auto;
    overflow: hidden;
  }
  .toolbar {
    display: flex;
    gap: 16px;
  }
</style>
