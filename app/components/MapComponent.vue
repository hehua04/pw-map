<template>
  <div class="map-container">
    <LMap ref="map" :zoom="zoom" :center="center" :use-global-leaflet="false">
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LMarker
        v-for="marker in convertedMarkers"
        :key="marker.id"
        :lat-lng="[marker.lat, marker.lon]"
      >
        <LPopup>{{ marker.name }}</LPopup>
      </LMarker>
    </LMap>
  </div>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import { convertCoordinatesByCountry } from "~/utils/coordinateConverter";

interface Marker {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country?: string;
}

const props = defineProps<{
  markers?: Marker[];
}>();

const zoom = ref(13);
const center = ref([51.505, -0.09]); // Default center (London)

// Convert coordinates if in China
const convertedMarkers = computed(() => {
  if (!props.markers) return [];
  return props.markers.map((marker) => {
    const [lat, lon] = convertCoordinatesByCountry(
      marker.lat,
      marker.lon,
      marker.country,
    );
    return { ...marker, lat, lon };
  });
});

// Update center when markers are provided
watchEffect(() => {
  if (convertedMarkers.value.length > 0) {
    const firstMarker = convertedMarkers.value[0];
    center.value = [firstMarker.lat, firstMarker.lon];
  }
});
</script>

<style scoped>
.map-container {
  height: 100vh;
  width: 100%;
}
</style>
