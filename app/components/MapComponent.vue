<template>
  <div class="map-container">
    <LMap
      ref="map"
      :zoom="zoom"
      :center="center"
      :use-global-leaflet="false"
      @click="handleMapClick"
      class="h-full w-full"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LMarker
        v-for="marker in convertedMarkers"
        :key="marker.id"
        :lat-lng="[marker.lat, marker.lon]"
        @click="handleMarkerClick(marker)"
      >
        <LPopup>{{ marker.name }}</LPopup>
      </LMarker>
      <LMarker
        v-if="selectionMarker"
        :lat-lng="[selectionMarker.lat, selectionMarker.lon]"
      />
    </LMap>
  </div>
</template>

<script setup lang="ts">
import type { LeafletMouseEvent } from "leaflet";
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
  enableSelection?: boolean;
  selected?: { lat: number; lon: number } | null;
}>();

const emit = defineEmits<{
  select: [{ lat: number; lon: number }];
  markerSelect: [Marker];
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

const selectionMarker = computed(() => {
  if (!props.selected) return null;
  if (!Number.isFinite(props.selected.lat)) return null;
  if (!Number.isFinite(props.selected.lon)) return null;
  return props.selected;
});

const handleMapClick = (event: LeafletMouseEvent) => {
  if (!props.enableSelection) return;
  emit("select", { lat: event.latlng.lat, lon: event.latlng.lng });
};

const handleMarkerClick = (marker: Marker) => {
  emit("markerSelect", marker);
};

// Update center when markers are provided
watchEffect(() => {
  if (selectionMarker.value) {
    center.value = [selectionMarker.value.lat, selectionMarker.value.lon];
    return;
  }

  if (convertedMarkers.value.length === 0) return;
  const firstMarker = convertedMarkers.value[0];
  center.value = [firstMarker.lat, firstMarker.lon];
});
</script>

<style scoped>
.map-container {
  height: 100%;
  width: 100%;
}

.map-container :global(.leaflet-container) {
  height: 100%;
  width: 100%;
}
</style>
