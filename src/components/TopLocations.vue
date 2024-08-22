<template>
    <div class="q-ma-md bg-orange">
        <q-table :title="$t('topLocations')" :rows-per-page-options="[0]" hide-bottom :loading="loadingInfos"
            :rows="locationStore.topLocations" :columns="columns" row-key="name" />
    </div>
</template>

<script setup>
import { ref, watch, reactive, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useWeather } from 'src/composables/useWeather';
import { useLocationStore } from 'src/stores/useLocationStore';
import { useConfigStore } from 'src/stores/useConfigStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const locationStore = useLocationStore();

const weatherApi = useWeather();
const weatherData = reactive({});

const loadingInfos = ref(weatherApi.loading);

const configStore = useConfigStore();
const { temperatureUnit } = storeToRefs(configStore)


const convertTemperature = (temp, unit) => {
    return unit === 'fahrenheit' ? (temp * (9 / 5)) + 32 : (5 / 9) * (temp - 32);
}

const getWeatherInfos = async (location) => {
    if (!weatherData[location.name]) {
        loadingInfos.value = true;
        const latitude = location.latLong.split(",")[0]
        const longitude = location.latLong.split(",")[1]
        const data = await weatherApi.searchCurrentMinAndMaxTemperature(latitude, longitude);
        weatherData[location.name] = {
            min: data.minTemperature,
            max: data.maxTemperature,
        };
        loadingInfos.value = false;
    } else {
        weatherData[location.name].min = convertTemperature(weatherData[location.name].min, temperatureUnit.value);
        weatherData[location.name].max = convertTemperature(weatherData[location.name].max, temperatureUnit.value);
    }
}

const columns = computed(() => [
    {
        name: 'name',
        required: true,
        label: t('location'),
        align: 'center',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true
    },
    {
        name: 'Min',
        required: true,
        label: t('min'),
        align: 'center',
        field: row => weatherData[row.name]?.min || t('loading'),
        format: val => Math.round(val) + " " + (temperatureUnit.value == "celsius" ? "ºC" : "ºF"),
        sortable: true
    },
    {
        name: 'Max',
        required: true,
        label: t('max'),
        align: 'center',
        field: row => weatherData[row.name]?.max || t('loading'),
        format: val => Math.round(val) + " " + (temperatureUnit.value == "celsius" ? "ºC" : "ºF"),
        sortable: true
    }
]);

watch(temperatureUnit, () => {
    loadingInfos.value = true;
    locationStore.topLocations.forEach(location => {
        getWeatherInfos(location);
    });
    loadingInfos.value = false;
});

onMounted(() => {
    locationStore.topLocations.forEach(location => {
        getWeatherInfos(location);
    });
})
</script>