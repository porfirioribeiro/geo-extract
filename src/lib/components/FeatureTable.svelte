<script lang="ts">
  import type { Feature } from 'geojson';
  import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
  import IconButton, { Icon } from '@smui/icon-button';
  import Card from '@smui/card';
  import { icons } from '$lib/utils/icons';
  import { downloadFeature, getFeatureName } from '$lib/utils/geojson';

  export let features: Feature[];
</script>

<Card style={'overflow:auto;' + $$restProps.style}>
  <DataTable table$aria-label="Feature list" stickyHeader style="max-width: 100%; overflow-y:auto;">
    <Head>
      <Row>
        <Cell checkbox />
        <Cell>Name / Id</Cell>
        <Cell checkbox />
      </Row>
    </Head>
    <Body>
      {#each features as feature}
        <Row>
          <Cell checkbox>
            <Icon class="material-icons">{icons[feature.geometry.type]}</Icon>
          </Cell>
          <Cell>{getFeatureName(feature)}</Cell>
          <Cell checkbox>
            <IconButton on:click={() => downloadFeature(feature)} class="material-icons">
              file_download</IconButton
            >
          </Cell>
        </Row>
      {/each}
    </Body>
  </DataTable>
</Card>
