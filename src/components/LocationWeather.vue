<template>
    <q-card class="my-card q-pa-xs text-grey-9 q-mr-sm q-mb-sm">
        <q-card-actions class="row q-pa-xs">
            <div class="col-10 active-scroll justify-start">
                <div class="text-h6 text-weight-bold">{{ location.name }}</div>
            </div>
            <div class="col-2">
                <q-btn flat icon="close" color="red" @click="handleClose" />
                <q-btn flat icon="favorite" :color="favorited == true ? 'red' : 'white'" @click="handleFavorite" />
            </div>
        </q-card-actions>

        <q-card-section class="q-pa-xs">
            <q-inner-loading :showing="weatherApi.loading" />
            <div class="text-h4 text-weight-bold">{{ Math.round(weatherInfos.temperature) }} º{{
                temperatureUnitChar
            }}
                <q-icon :name="weatherIcon" />
                {{ weatherDescription }}
            </div>
            <div class="row">
                <div class="col">
                    <div class="text-subtitle1 text-weight-bold"><q-icon color="orange" name="south" /> {{
                        Math.round(weatherInfos.minTemperature) }}
                        º{{ temperatureUnitChar }} <q-icon color="orange" name="north" /> {{
                            Math.round(weatherInfos.maxTemperature) }} º{{
                            temperatureUnitChar }}
                    </div>
                </div>

                <div class="col">
                    <div class="text-subtitle1">
                        {{ $t('apparentTemperature') }}: <span class="text-weight-bold">{{
                            Math.round(weatherInfos.aparentTemperature) }} º{{
                                temperatureUnitChar }}</span>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div class="text-subtitle1">
                        {{ $t('wind') }}: <span class="text-weight-bold">{{ weatherInfos.wind }}{{ weatherInfos.windUnit
                            }}</span>
                    </div>
                </div>

                <div class="col">
                    <div class="text-subtitle1">
                        {{ $t('humidity') }}: <span class="text-bold">{{ weatherInfos.humidity }}{{
                            weatherInfos.humidityUnit }}</span>
                    </div>
                </div>
            </div>
        </q-card-section>

        <q-separator color="orange" />

        <q-card-section class="q-pa-xs forecast">
            <div class="row active-scroll no-wrap">
                <div v-for="forecastInNextDays in weatherInfos.forecastInNextDays" :key="forecastInNextDays.time"
                    class=" col-xs-4 col-md-4 col-lg-2">
                    <div class="text-subtitle1">
                        {{ getDayOfWeek(forecastInNextDays.date) }}
                    </div>
                    <div class="text-subtitle1 text-orange">
                        <span class="text-weight-bold">{{ Math.round(forecastInNextDays.minTemperature) }} º
                            {{ Math.round(forecastInNextDays.maxTemperature) }} º</span>
                    </div>
                </div>
            </div>

        </q-card-section>
    </q-card>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { useLocationStore } from 'src/stores/useLocationStore';
import { useWeather } from 'src/composables/useWeather';
import { useConfigStore } from 'src/stores/useConfigStore';
import { storeToRefs } from 'pinia';
import { Cookies } from 'quasar';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const props = defineProps(['location'])
const weatherInfos = ref({});

const location = props.location

const locationStore = useLocationStore();
const weatherApi = useWeather();

const configStore = useConfigStore();
const { temperatureUnit } = storeToRefs(configStore)

const latitude = location.latLong.split(",")[0];
const longitude = location.latLong.split(",")[1];

// Função a ser chamada quando o botão for clicado
const handleClose = () => {
    locationStore.removeLocationFromList(location.name, location.latLong)
};

const handleFavorite = () => {
    if (locationStore.locationsFavoriteList.some(x => x.name == location.name && x.latLong == location.latLong)) {
        locationStore.removeFavoriteLocationFromList(location.name, location.latLong);
        Cookies.set('favoriteLocations', JSON.stringify(locationStore.locationsFavoriteList));
    } else {
        locationStore.selectFavoriteLocation(location);
        Cookies.set('favoriteLocations', JSON.stringify(locationStore.locationsFavoriteList));
    }
};

watch(temperatureUnit, () => {
    weatherApi.loading.value = true;
    weatherInfos.value.minTemperature = convertTemperature(weatherInfos.value.minTemperature, temperatureUnit.value);
    weatherInfos.value.maxTemperature = convertTemperature(weatherInfos.value.maxTemperature, temperatureUnit.value);
    weatherInfos.value.temperature = convertTemperature(weatherInfos.value.temperature, temperatureUnit.value);
    weatherInfos.value.aparentTemperature = convertTemperature(weatherInfos.value.aparentTemperature, temperatureUnit.value);
    weatherInfos.value.forecastInNextDays.forEach((forecast) => {
        forecast.maxTemperature = convertTemperature(forecast.maxTemperature, temperatureUnit.value);
        forecast.minTemperature = convertTemperature(forecast.minTemperature, temperatureUnit.value);
    })
    weatherApi.loading.value = false;
});

const temperatureUnitChar = computed(() => {
    return temperatureUnit.value === 'celsius' ? 'C' : 'F'
})

const weatherIcon = computed(() => {
    return weatherApi.getWeatherIcon(weatherInfos.value.weatherCode)
})

const weatherDescription = computed(() => {
    return weatherApi.getWeatherDescription(weatherInfos.value.weatherCode)
})

const favorited = computed(() => {
    return locationStore.locationsFavoriteList.some(x => x.name == location.name && x.latLong == location.latLong)
})

const convertTemperature = (temp, unit) => {
    return unit === 'fahrenheit' ? (temp * (9 / 5)) + 32 : (5 / 9) * (temp - 32);
}

onMounted(async () => {
    weatherApi.loading.value = true;
    weatherInfos.value = await weatherApi.searchWeatherForecast(latitude, longitude);
    weatherApi.loading.value = true;
});

const getDayOfWeek = (dateString) => {
    console.log(dateString)
    const date = new Date(dateString);

    date.setDate(date.getDate() + 1);//para resolver o problema de mostrar o nome do dia -1
    const options = { weekday: 'short' };
    return new Intl.DateTimeFormat(locale.value, options).format(date);
}

</script>

<style scoped>
.my-card {
    text-align: center;
    padding: 20px;
    background-color: #f5f5f5;
    height: 100%;
}

.active-scroll {
    overflow-y: auto;
    max-height: 100%;
    scrollbar-width: auto;
}

.active-scroll::-webkit-scrollbar {
    width: 0;
}

.active-scroll:hover::-webkit-scrollbar {
    width: 6px;
}

.active-scroll:hover::-webkit-scrollbar-thumb {
    background-color: #aaa;
    border-radius: 10px;
}

.active-scroll::-webkit-scrollbar-thumb {
    background-color: transparent;
    transition: background-color 0.3s ease;
}

.active-scroll:hover::-webkit-scrollbar-thumb {
    background-color: #aaa;
}

.active-scroll::-webkit-scrollbar-track {
    background-color: transparent;
}
</style>