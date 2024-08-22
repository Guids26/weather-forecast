import { ref } from "vue";
import geolocation from "src/api/geolocation/geolocation";

export function useLocation() {
  const locations = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchLocations = async (locationName) => {
    loading.value = true;
    try {
      const response = await geolocation.search(locationName);
      locations.value = response.data.results;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    locations,
    loading,
    error,
    fetchLocations,
  };
}
