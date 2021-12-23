<script lang="ts">
  import { onMount } from 'svelte';
  import type { Feature, GeoJsonGeometryTypes } from 'geojson';
  import Select, { Option } from '@smui/select';
  import FormField from '@smui/form-field';
  import Icon from '@smui/select/icon';
  import { browser } from '$app/env';

  let LeafletContainer;

  onMount(async () => {
    if (browser) {
      LeafletContainer = (await import('$lib/components/LeafletContainer.svelte')).default;
    }
  });

  import DropTarget from '$lib/components/DropTarget.svelte';
  import { fileToGeoJson } from '$lib/utils/kml';
  import { ensureFeatureIdAndName, geoJsonToFeatures } from '$lib/utils/geojson';
  import FeatureTable from '$lib/components/FeatureTable.svelte';

  let allFeatures: Feature[] = [];
  let features: Feature[] = [];
  let focusFeature: Feature;
  let filters: GeoJsonGeometryTypes[] = [];
  let filter: GeoJsonGeometryTypes;

  async function onSelectFiles(files: File[]) {
    if (files.length != 1) {
      return;
    }

    const file = files[0];
    const geoJson = await fileToGeoJson(file);

    allFeatures = ensureFeatureIdAndName(geoJsonToFeatures(geoJson));
    filters = [...new Set(allFeatures.map((f) => f.geometry.type))];
  }

  $: features = filter ? allFeatures.filter((f) => f.geometry.type === filter) : allFeatures;
</script>

<div class="app">
  <div class="toolbar" style="grid-area: tb">
    <DropTarget onSelect={onSelectFiles} />
    <div>
      <Select bind:value={filter} label="Filter:" disabled={features.length == 0}>
        <Option value={undefined} />
        {#each filters as f}
          <Option value={f}>{f}</Option>
        {/each}
      </Select>
    </div>
  </div>

  <FeatureTable style="grid-area: sd;" {features} bind:focusFeature />
  <div style="grid-area: map; z-index: 0">
    <svelte:component this={LeafletContainer} {features} {focusFeature} />
  </div>
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
