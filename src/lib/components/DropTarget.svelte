<script lang="ts">
  export let onSelect: (files: File[]) => void;

  let dragging = false;

  function onDrop({ dataTransfer }: DragEvent) {
    dragging = false;
    if (dataTransfer)
      onSelect(
        dataTransfer.files.length
          ? Array.from(dataTransfer.files)
          : Array.prototype.filter
              .call(dataTransfer.items, ({ kind }) => kind === 'file')
              .map(({ getAsFile }) => getAsFile())
      );
  }

  function onInput({ currentTarget }: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    onSelect(currentTarget.files ? Array.from(currentTarget.files) : []);
    currentTarget.value = '';
  }
</script>

<label
  class:dragging
  on:drop|preventDefault={onDrop}
  on:dragover|preventDefault={() => (dragging = true)}
  on:dragleave|preventDefault={() => (dragging = false)}
>
  <span class="material-icons icon">archive</span>
  <div>
    <strong>Choose a file</strong>
    or drag it here.
  </div>
  <input type="file" multiple on:input={onInput} />
</label>

<style>
  input {
    position: absolute;
    visibility: hidden;
  }
  label {
    position: relative;
    font-size: 1.25rem;
    background-color: #c8dadf;
    padding: 16px;
    outline: 2px dashed #92b0b3;
    outline-offset: -10px;
    transition: outline-offset 0.15s ease-in-out, background-color 0.15s linear;
    text-align: center;
  }
  .dragging {
    outline-offset: -20px;
    outline-color: #c8dadf;
    background-color: #fff;
  }
  .icon {
    color: #92b0b3;
    margin-bottom: 16px;
    font-size: 48px;
  }
</style>
