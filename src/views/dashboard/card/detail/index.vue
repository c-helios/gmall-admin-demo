<template>
  <div>
    <div class="card-header">
      <span>{{ title }}</span>
      <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16">
        <path d="M480 437.344h64v309.312h-64v-245.312h-64v-64h64zM512 288a53.344 53.344 0 1 1 0 106.656A53.344 53.344 0 0 1 512 288z m0-224c246.4 0 448 201.6 448 448s-201.6 448-448 448S64 758.4 64 512 265.6 64 512 64z m0 69.824C304.16 133.824 133.824 304.16 133.824 512c0 207.84 170.336 378.176 378.176 378.176 207.84 0 378.176-170.336 378.176-378.176 0-207.84-170.336-378.176-378.176-378.176z" p-id="2678" />
      </svg>
    </div>
    <span class="count-text">{{ countText }}</span>
    <div class="card-content">
      <slot name="charts" />
    </div>
    <div class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  props: ['title', 'countText']
}
</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  color: #bfbfbf;
}
.count-text {
  font-size: 26px;
  color: black;
  line-height: 50px;
}
.card-content {
  font-size: 16px;
  line-height: 20px;
  /* border-bottom-width: 1px; */
  border-bottom-style: solid;
  border-bottom-color: #e6e6e6;
  height: 50px;
  width: 300px;
  display: table-cell;
  vertical-align: bottom;
}
.card-footer {
  font-size: 16px;
  padding-top: 10px;
}

</style>
