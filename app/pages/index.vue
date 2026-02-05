<script setup lang="ts">
const data = [
  {
    id: "123",
    name: "sample post 1",
    lat: 34.25890330555836,
    lon: 117.17311248272972,
    country: "cn",
  },
  {
    id: "321",
    name: "sample post 2",
    lat: 35.680522334883754,
    lon: 139.7385641171419,
    country: "jp",
  },
];
</script>

<template>
  <MapComponent :markers="data" />
</template>
