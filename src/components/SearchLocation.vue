<template>
  <div class="q-ma-md">
    <q-select filled v-model="locationStore.locationSelected" use-input hide-selected fill-input input-debounce="1000"
      :label="$t('search')" :error="error == true" :error-message="error" color="orange" :options="options"
      option-label="name" option-value="latLong" @update:model-value="val => selectValueFn(val)" @filter="filterFn"
      @filter-abort="abortFilterFn" :hint="$t('searchCity')">
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            {{ $t('noResults') }}
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLocation } from 'src/composables/useLocations';
import { useLocationStore } from 'src/stores/useLocationStore'

const { locations, fetchLocations, error } = useLocation();

const locationStore = useLocationStore();

const options = ref([]);

const filterFn = (val, update, abort) => {
  // call abort() at any time if you can't retrieve data somehow
  update(() => {
    if (val === '') {
      options.value = []
    }
    else {
      fetchLocations(val).then(() => {
        if (locations.value) {
          options.value = locations.value.map(x => {
            return {
              name: x.name + (x.admin2 && x.admin2 != x.name ? ", " + x.admin2 : "") + (x.admin1 ? ", " + x.admin1 : "") + " - " + x.country,
              latLong: x.latitude + "," + x.longitude
            }
          });
        } else {
          options.value = [];
        }
      })
    }
  })
}

const abortFilterFn = () => {
  options.value = []
}

const selectValueFn = (val) => {
  locationStore.selectLocation(val);
}
</script>
