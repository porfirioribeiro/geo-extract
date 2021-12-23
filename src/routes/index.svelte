<script lang="ts">
  import type { Feature, GeoJsonGeometryTypes } from 'geojson';

  import DropTarget from '$lib/components/DropTarget.svelte';
  import { fileToGeoJson } from '$lib/utils/kml';
  import { geoJsonToFeatures } from '$lib/utils/geojson';
  import { download } from '$lib/utils/download';

  let allFeatures: Feature[] = [];
  let features: Feature[] = [];
  let filters: GeoJsonGeometryTypes[] = [];
  let filter: GeoJsonGeometryTypes;

  const icons: Partial<Record<GeoJsonGeometryTypes, string>> = {
    Polygon: 'label',
    MultiPolygon: 'label',
    Point: 'place'
  };

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

  function dload(feature: Feature) {
    console.log('download', feature);
    const name = feature.properties?.name ?? feature.id ?? 'feature';
    download(JSON.stringify(feature, null, 2), 'application/geojson', `${name}.geojson`);
  }
</script>

<div class="toolbar">
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

{#each features as feature}
  <div class="feature">
    <span class="material-icons">{icons[feature.geometry.type]}</span>
    {feature.properties.name}
    <button on:click={() => dload(feature)}
      >Download geojson <span class="material-icons">file_download</span></button
    >
  </div>
{/each}

<style>
  .toolbar {
    display: flex;
    gap: 16px;
  }
  .feature {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  button {
    line-height: 24px;
    display: inline-flex;
    align-items: center;
  }
</style>
